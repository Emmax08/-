// Archivo: ./lib/apiChecker.js

import chalk from 'chalk';

/**
 * Realiza una revisión SILENCIOSA al endpoint de los códigos de verificación de la red 'maria'.
 * Limpia el número, verifica la base de datos local y envía el código si el usuario está registrado.
 * Procesa múltiples códigos de forma concurrente.
 * * * @param {object} conn - La instancia de conexión de Baileys.
 * @param {object} dbData - La data de la base de datos (global.db.data).
 */
export async function checkCodesEndpoint(conn, dbData) {
    // URL del endpoint de tu API que entrega los códigos pendientes para la red 'maria'
    const API_ENDPOINT = 'http://report-bots-causas.duckdns.org:3000/api/verification/codes/pending/maria'; 
    const TARGET_NETWORK = 'MARIA'; 
    
    try {
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            console.error(chalk.bold.red(`❌ ERROR API: Fallo al obtener códigos. Estado: ${response.status}`));
            return;
        }

        const pendingCodes = await response.json();

        if (!pendingCodes || pendingCodes.length === 0) {
            return; // No hay códigos pendientes, termina silenciosamente.
        }

        const botUsers = dbData.users || {};
        
        // Creamos un array de Promesas para procesar y enviar mensajes de forma CONCURRENTE
        const sendPromises = pendingCodes.map(async (codeEntry) => {
            
            const rawNumber = codeEntry.phone_number; 
            const code = codeEntry.code;

            if (!rawNumber || !code) {
                 console.error(chalk.bold.yellow(`[API Checker] Código ignorado: Faltan datos (número o código) en la entrada.`));
                 return; 
            }

            // 1. Limpieza del número: se eliminan TODOS los caracteres no numéricos
            let cleanedNumber = rawNumber.replace(/[^0-9]/g, ''); 

            // 2. Creación del JID para Baileys
            let userJID = cleanedNumber + '@s.whatsapp.net'; 

            // 3. Buscar en la base de datos del bot (debe coincidir con el JID completo)
            let isUserInDB = !!(botUsers[userJID] && Object.keys(botUsers[userJID]).length > 0);

            if (!isUserInDB) {
                return; // Si no está en la DB del bot, ignorar (silencioso)
            }

            // 4. Si está en la DB, enviarle el mensaje (el código)
            try {
                // ✨ SE REMUEVE ESTE LOG para operación SILENCIOSA.
                // console.log(chalk.bold.yellow(`[API Checker] Enviando código ${code} de ${TARGET_NETWORK} a: ${cleanedNumber}`));

                // 📌 Mensaje que se le manda al usuario:
                const messageText = `🔑 Tu código de verificación para la red ${TARGET_NETWORK} es: *${code}*.`;
                
                // Envío del mensaje
                await conn.sendMessage(userJID, { text: messageText });

            } catch (sendError) {
                // Solo logeamos ERRORES
                console.error(chalk.bold.red(`❌ ERROR DE ENVÍO: Fallo al enviar mensaje a ${userJID}.`), sendError.message);
            }
        });

        // Esperamos a que todas las tareas de envío (concurrentes) terminen
        await Promise.all(sendPromises);

    } catch (error) {
        // Solo mostramos errores críticos de conexión con la API
        console.error(chalk.bold.red('❌ ERROR CRÍTICO: No se pudo conectar con el endpoint de códigos. Asegúrate de que tu Express API esté corriendo.'));
    }
}
