// Archivo: ./lib/apiChecker.js

import chalk from 'chalk'; // Mantenido para compatibilidad general del proyecto

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
    // URL base para notificar al API que los códigos han sido mandados
    const NOTIFICATION_BASE_URL = 'http://report-bots-causas.duckdns.org:3000/api/verification/codes/mandado/maria'; 
    const TARGET_NETWORK = 'MARIA'; 
    
    try {
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
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
            const id = codeEntry.id;

            if (!rawNumber || !code) {
                return { id: id, sent: false, reason: 'Missing Data' }; 
            }

            // 1. Limpieza del número: se eliminan TODOS los caracteres no numéricos
            let cleanedNumber = rawNumber.replace(/[^0-9]/g, ''); 

            // 2. Creación del JID para Baileys
            let userJID = cleanedNumber + '@s.whatsapp.net'; 

            // 3. Buscar en la base de datos del bot (debe coincidir con el JID completo)
            let isUserInDB = !!(botUsers[userJID] && Object.keys(botUsers[userJID]).length > 0);

            if (!isUserInDB) {
                return { id: id, sent: false, reason: 'Not in bot DB' }; 
            }

            // 4. Si está en la DB, enviarle el mensaje (el código)
            try {
                // 📌 Mensaje que se le manda al usuario:
                const messageText = `🔑 Tu código de verificación para la red ${TARGET_NETWORK} es: *${code}*.`;
                
                // Envío del mensaje
                await conn.sendMessage(userJID, { text: messageText });
                
                // Éxito: Retorna el ID y el estado de envío
                return { id: id, sent: true }; 

            } catch (sendError) {
                return { id: id, sent: false, reason: sendError.message };
            }
        });

        // Esperamos a que todas las tareas de envío (concurrentes) terminen
        const results = await Promise.all(sendPromises);

        // ----------------------------------------------------
        // LÓGICA DE NOTIFICACIÓN AL API CENTRAL
        // ----------------------------------------------------
        const sentCodeIds = results
            .filter(result => result.sent)
            .map(result => result.id);

        if (sentCodeIds.length > 0) {
            const idsString = sentCodeIds.join(',');
            const NOTIFICATION_ENDPOINT = `${NOTIFICATION_BASE_URL}?id=${idsString}`;

            try {
                // Notificar al servidor que estos IDs han sido enviados
                const notificationResponse = await fetch(NOTIFICATION_ENDPOINT);

                if (notificationResponse.ok) {
                    // Operación silenciosa
                } else {
                    // Operación silenciosa
                }
            } catch (notificationError) {
                // Operación silenciosa
            }
        }

    } catch (error) {
        // Operación silenciosa
    }
}
