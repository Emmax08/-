import fetch from 'node-fetch'; 
import fs from 'fs/promises'; 
import path from 'path'; 
import { Buffer } from 'buffer';

// --- CONFIGURACIÓN DE CYPHERTRANS ---
const HASH_FILE_PATH = path.join(process.cwd(), 'src', 'hash.json'); 
const API_URL = 'https://cyphertrans.duckdns.org'; 

// Las variables globales 'global.db.data.users' y 'moneda' son necesarias para esta función.
// Usamos global.moneda como el código de moneda local (e.g., MARC)
const moneda = global.moneda || 'MARC'; 
const emojiAprobada = '✅';
const emojiRechazada = '❌';

/**
 * Formatea un número como moneda (ej. 1,000.00).
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number') return amount;
    return amount.toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

/**
 * Extrae el número de teléfono del número de cuenta CypherTrans.
 */
function extractUserNumber(recipientAccount) {
    // Asume que el número es todo menos los últimos 7 caracteres (XXX####)
    return recipientAccount.slice(0, -7); 
}

/**
 * Obtiene el hash del bot desde el archivo local.
 */
async function getBotHashFromFile() {
    try {
        const data = await fs.readFile(HASH_FILE_PATH, 'utf-8');
        const hashData = JSON.parse(data);
        if (hashData && hashData.bot_hash) {
            return hashData.bot_hash;
        }
        return null;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`[CypherTrans] Advertencia: Archivo de hash no encontrado en ${HASH_FILE_PATH}.`);
        } else {
            console.error(`[CypherTrans] Error leyendo hash.json:`, error.message);
        }
        return null;
    }
}

// --- FUNCIÓN PRINCIPAL DE CHEQUEO DE TRANSACCIONES (CORREGIDA) ---

export async function checkCypherTransInbound(sock) {
    if (!sock) return console.error('[CypherTrans] Error: Objeto de conexión (sock) no proporcionado.');
    
    const BOT_HASH = await getBotHashFromFile();
    if (!BOT_HASH) return console.log('[CypherTrans] Solicitud omitida: Bot no registrado.');
    
    try {
        const response = await fetch(`${API_URL}/api/v1/inbound_history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bot_hash: BOT_HASH })
        });

        if (!response.ok) return console.error(`[CypherTrans] Error en la API: ${response.status} ${response.statusText}`);

        const newTransactions = await response.json();
        if (newTransactions.length === 0) return;

        console.log(`[CypherTrans] ${newTransactions.length} nuevas transacciones entrantes encontradas.`);

        for (const tx of newTransactions) {
            
            // La API del servidor solo devuelve transacciones APROBADAS en este endpoint.
            // tx.status será siempre 'APROBADA' aquí, pero lo mantenemos por seguridad.
            const txStatus = tx.status || 'APROBADA'; 

            // 1. Determinar el JID de destino
            const userNumber = extractUserNumber(tx.recipient);
            const standardJID = `${userNumber}@s.whatsapp.net`;
            const lidJID = `${userNumber}@lid`; 
            
            let targetJID = global.db.data.users[lidJID] ? lidJID : 
                            global.db.data.users[standardJID] ? standardJID : null;
            
            // 2. Procesar si se encontró un usuario en la DB
            if (targetJID) {
                // El monto a depositar es el 'converted_amount' de la transferencia
                // Usamos tx.amount si no hay converted_amount (interna)
                const depositAmount = tx.converted_amount || tx.amount; 
                const receiptUrl = `${API_URL}/receipt/${tx.tx_id}`;
                
                let currentBankBalance = global.db.data.users[targetJID].bank || 0;
                let newBankBalance = currentBankBalance;
                let baseCaption = '';
                let txEmoji = txStatus === 'APROBADA' ? emojiAprobada : emojiRechazada;

                // --- LÓGICA DE DEPÓSITO AL BANCO (SOLO SI APROBADA) ---
                if (txStatus === 'APROBADA') {
                    if (typeof global.db.data.users[targetJID].bank !== 'number') {
                        global.db.data.users[targetJID].bank = 0;
                    }
                    global.db.data.users[targetJID].bank += depositAmount * 1; 
                    newBankBalance = global.db.data.users[targetJID].bank;
                    console.log(`[CypherTrans] ${depositAmount} depositado en el banco de ${targetJID}.`);

                    baseCaption = `${txEmoji} *— ¡DEPÓSITO MULTIBOT APROBADO! —*`;
                } else {
                    // Aunque la API no los envía, esta es la lógica correcta si lo hiciera
                    console.log(`[CypherTrans] TX ${tx.tx_id} fue ${txStatus}. No se modificó el saldo.`);
                    baseCaption = `${txEmoji} *— ¡TRANSFERENCIA RECHAZADA! —*` +
                        `\n\n_La transferencia no pudo ser completada. Se ha notificado al emisor para que se inicie el proceso de devolución de fondos._`;
                }

                // 3. Preparar el mensaje (con o sin imagen)
                const isCrossCurrency = tx.sender_currency !== tx.recipient_currency;
                
                // Base del mensaje (Estética mejorada)
                baseCaption += `\n\n*Desde:* ${tx.sender}` +
                    `\n*ID Transacción:* \`${tx.tx_id}\``;
                
                // Detalles del envío (Origen)
                baseCaption += `\n\n*Monto Enviado:* ${formatCurrency(tx.amount)} ${tx.sender_currency}`;
                if (tx.fee > 0) {
                    baseCaption += `\n*Comisión Aplicada:* -${formatCurrency(tx.fee)} ${tx.sender_currency}`;
                }

                // Detalles de la Conversión (si aplica)
                if (isCrossCurrency) {
                     baseCaption += `\n*Tasa de Cambio:* 1 ${tx.sender_currency} = ${formatCurrency(tx.exchange_rate)} ${tx.recipient_currency}`;
                }
                
                // Monto Final Recibido (Destino)
                baseCaption += `\n\n*Monto Depositado:* *${formatCurrency(depositAmount)} ${tx.recipient_currency}*`;
                
                // Balance Final
                const finalBalanceDisplay = txStatus === 'APROBADA' ? formatCurrency(newBankBalance) : formatCurrency(currentBankBalance);
                baseCaption += `\n\n*Tu Saldo Final en el Banco:* ${finalBalanceDisplay} ${moneda}`;
                
                // Footer
                baseCaption += `\n\n_El dinero ha sido depositado directamente en tu cuenta de banco._`;


                let messageOptions;
                
                // 4. Enviar el mensaje (Imagen o Texto)
                try {
                    // VERIFICACIÓN CLAVE: Si hay base64 y no es vacío, intentamos enviar la imagen
                    if (tx.receipt_base64 && tx.receipt_base64.length > 100) { 
                        const media = Buffer.from(tx.receipt_base64, 'base64');
                        messageOptions = {
                            image: media, 
                            caption: baseCaption,
                            mimetype: 'image/png', // La API genera PNG, no JPEG (corregido)
                            mentions: [standardJID]
                        };
                        await sock.sendMessage(targetJID, messageOptions);
                        console.log(`[CypherTrans] Notificación de depósito (con recibo PNG) enviada a ${targetJID}.`);
                    } else {
                        // Si NO hay recibo Base64, enviamos solo texto, incluyendo el enlace HTML
                        const textMessage = baseCaption +
                            `\n\nComprobante (HTML): ${receiptUrl}`;
                        
                        messageOptions = {
                            text: textMessage,
                            mentions: [standardJID]
                        };
                        await sock.sendMessage(targetJID, messageOptions);
                        console.log(`[CypherTrans] Notificación de depósito (solo texto) enviada a ${targetJID}.`);
                    }
                } catch (e) {
                    console.error(`[CypherTrans] ERROR: Falló el envío del mensaje/recibo a ${targetJID}.`, e.message);
                    // Lógica de respaldo final: Enviar solo el texto de forma segura si la primera falla (ej. imagen corrupta)
                    try {
                        const fallbackText = `⚠️ *FALLA AL ENVIAR RECIBO DE IMAGEN*\n\n` + baseCaption + `\n\nComprobante (HTML): ${receiptUrl}`;
                        await sock.sendMessage(targetJID, { text: fallbackText, mentions: [standardJID] });
                    } catch (e2) {
                        console.error(`[CypherTrans] ERROR CRÍTICO: Falló el envío de mensaje de respaldo a ${targetJID}.`, e2.message);
                    }
                }
            } else {
                console.log(`[CypherTrans] ERROR: Usuario ${userNumber} (ni @lid ni @s.whatsapp.net) no encontrado en la DB local para TX ${tx.tx_id}.`);
            }
        }
    } catch (error) {
        console.error("Error al verificar CypherTrans:", error.message);
    }
}
