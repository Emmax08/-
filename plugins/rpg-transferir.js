import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';


// --- CONFIGURACIÓN Y CONSTANTES (Actualizado para MARIA) ---
const HASH_FILE_PATH = './src/hash.json';
const API_URL = 'https://cyphertrans.duckdns.org';
const BOT_API_KEY = 'maria'; // <--- CONFIGURACIÓN PARA MARIA
const BOT_KEY_PREFIX = 'MAR'; // <--- CONFIGURACIÓN PARA MARIA
const ALL_PREFIXES = ['MAR', 'LUF', 'ELL', 'RUB'];
const moneda = global.moneda || 'Coin';
const emoji = '✅';
const emoji2 = '❌';
const emojiWait = '⏳'; // Usado para transferencias pendientes

// --- FUNCIONES DE SOPORTE BÁSICAS ---

async function getBotHashFromFile() {
    try {
        const fullPath = path.join(process.cwd(), HASH_FILE_PATH);
        const data = await fs.readFile(fullPath, 'utf-8');
        const hashData = JSON.parse(data);
        return hashData?.bot_hash || null;
    } catch (error) {
        return null;
    }
}

function isNumber(x) {
    return !isNaN(x);
}

async function callCypherTransAPI(botHash, sender, recipient, amount, type) {
    try {
        const response = await fetch(`${API_URL}/api/v1/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bot_hash: botHash,
                sender_account: sender,
                recipient_account: recipient,
                amount: amount,
                transfer_type: type
            })
        });
        const data = await response.json();
        return { status: response.status, data: data };
    } catch (error) {
        console.error("Error en llamada a API CypherTrans:", error);
        return { status: 500, data: { error: 'Error de conexión con el servidor CypherTrans.' } };
    }
}


// --- FUNCIONES DE ENVÍO DE MENSAJES CON ESTÉTICA MEJORADA ---

/** Envía el mensaje de ayuda (mejor estética). */
function sendHelpMessage(conn, m, usedPrefix, command) {
    const helpMessage = `
${emoji} *— Billetera y Transferencias —*

*Uso:* ${usedPrefix}${command} <cantidad> <destinatario> [tipo_opcional]

${usedPrefix}${command} *<cantidad> @mencion*
> Realiza una transferencia *Local* (banco -> cartera del receptor).

${usedPrefix}${command} *<cantidad> <CuentaCT>*
> Inicia una transferencia *Multibot* (requiere seleccionar velocidad).

${usedPrefix}${command} *<cantidad> <CuentaCT> [1|2]*
> Transferencia *Multibot Rápida*. (1=Normal/Lenta, 2=Instantánea/Rápida)

*Nota:* Las transferencias se realizan desde tu *Banco*.
`.trim();
    return conn.sendMessage(m.chat, { text: helpMessage, mentions: [m.sender] }, { quoted: m });
}

/** Envía el mensaje de confirmación de transferencia LOCAL. */
function sendLocalTransferConfirmation(conn, m, amount, totalInBank, who) {
    const mentionText = `@${who.split('@')[0]}`;
    const message = `
${emoji} *¡Transferencia Local Exitosa!*
 
*Monto Transferido:* *${amount} ${moneda}*
*Destinatario:* ${mentionText} (Recibido en Cartera)
 
${emoji2} *Balance de tu Banco:* ${totalInBank} ${moneda}
`.trim();
    return conn.sendMessage(m.chat, { text: message, mentions: [who] }, { quoted: m });
}


/** FUNCIÓN UNIFICADA: Envía la confirmación de transferencia Multibot (Texto o Imagen). */
function sendFinalTransferConfirmation(conn, chatId, txData, amount, newBankBalance, m) {
    const isApproved = txData.status === 'APROBADA';
    const isPending = txData.status.startsWith('PENDIENTE');
    // Verificamos si el Base64 existe y tiene una longitud razonable para ser una imagen
    const hasReceipt = txData.receipt_base64 && Buffer.from(txData.receipt_base64, 'base64').length > 100;
    
    // Status y Emoji
    let statusText;
    let emojiStatus;
    if (isApproved) {
        // Texto ajustado si es interna o externa aprobada
        statusText = (BOT_KEY_PREFIX === txData.recipient_account.slice(-7, -4)) ? 'INTERNA APROBADA' : 'APROBADA (Instantánea)';
        emojiStatus = emoji;
    } else if (isPending) {
        statusText = txData.status === 'PENDIENTE_MANUAL' ? 'PENDIENTE (Revisión Manual)' : 'REGISTRADA (Pendiente)';
        emojiStatus = emojiWait;
    } else {
         statusText = 'ESTADO DESCONOCIDO';
         emojiStatus = '❓';
    }

    // Desglose del mensaje (usando campos opcionales del API para ser robustos)
    const sentCurrency = txData.sent_currency || moneda;
    const receivedCurrency = txData.received_currency || moneda;
    const receivedAmount = txData.received_amount || amount;
    
    let caption = `${emojiStatus} *— ¡Transferencia Multibot ${statusText}! —*`;
    
    // 1. Monto enviado y Comisión
    caption += `\n\n*Monto Enviado:* ${amount} ${sentCurrency}`;
    if (txData.fee_applied && txData.fee_applied > 0) {
        caption += `\n*Comisión Aplicada:* -${txData.fee_applied} ${sentCurrency}`;
    }
    
    // 2. Conversión (Solo si es cross-currency y la tasa existe)
    if (sentCurrency !== receivedCurrency && txData.exchange_rate) {
        caption += `\n*Tasa de Cambio:* 1 ${sentCurrency} = ${txData.exchange_rate} ${receivedCurrency}`;
    }
    
    // 3. Monto Recibido
    caption += `\n\n*Monto Recibido:* *${receivedAmount} ${receivedCurrency}*`;
    
    // 4. IDs y Balances
    caption += `\n*ID Transacción:* \`${txData.tx_id}\``;
    caption += `\n\n*Tu Nuevo Balance en Banco:* ${newBankBalance} ${moneda}`;
    
    // 5. Tracking URL (Si no es imagen)
    if (!hasReceipt) {
        caption += `\n\n🔗 *Seguimiento:* ${API_URL}${txData.tracking_url}`;
    } else {
        caption += `\n\n_Adjunto el recibo de la transacción._`;
    }

    const quotedOptions = m && m.chat ? { quoted: m } : {};
    
    // LÓGICA CLAVE: ENVIAR IMAGEN O TEXTO
    if (hasReceipt) {
        const media = Buffer.from(txData.receipt_base64, 'base64');
        return conn.sendMessage(chatId, { 
            image: media, 
            caption: caption,
            mimetype: 'image/jpeg', // Asumimos JPEG para recibos comunes
            ...quotedOptions 
        });
    } else {
        return conn.sendMessage(chatId, { text: caption, ...quotedOptions });
    }
}


// --- FUNCIÓN PRINCIPAL DEL HANDLER ---

async function handler(m, { conn, args, usedPrefix, command }) {
    // *** VERIFICACIÓN CRÍTICA DEL MENSAJE ***
    if (!m || !m.sender) {
        return; 
    }

    const user = global.db.data.users[m.sender];
    const bankType = 'bank';
    
    let amount, recipientArg, typeShortcut;
    let isButtonResponse = false;
    
    // 1. Lógica para determinar el tipo de argumento
    if (args.length === 3 && (args[0] === '1' || args[0] === '2') && isNumber(args[1]) && args[2].length > 7) {
        // Respuesta del botón o comando rápido/completo
        typeShortcut = args[0];
        amount = parseInt(args[1]);
        recipientArg = args[2].trim();
        isButtonResponse = true;
    } else if (args.length >= 2) {
        // Comando inicial
        amount = isNumber(args[0]) ? parseInt(args[0]) : 0;
        recipientArg = args[1].trim();
        typeShortcut = args[2] ? args[2].trim() : null;
    } else {
        // Uso incorrecto - Muestra ayuda mejorada
        return sendHelpMessage(conn, m, usedPrefix, command);
    }

    amount = Math.min(Number.MAX_SAFE_INTEGER, Math.max(100, amount)) * 1;
    const botHash = await getBotHashFromFile();
    
    // Verificación de balance
    if (user[bankType] * 1 < amount) {
        return conn.sendMessage(m.chat, {text: `${emoji2} Solo tienes *${user[bankType]} ${moneda}* en el banco para transferir.`, mentions: [m.sender]}, {quoted: m});
    }

    // --- LÓGICA DE TRANSFERENCIA ---

    // 1. TRANSFERENCIA LOCAL 
    if (!isButtonResponse && (recipientArg.includes('@s.whatsapp.net') || recipientArg.includes('@'))) {
        const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (recipientArg.replace(/[@ .+-]/g, '') + '@s.whatsapp.net');
        
        if (!who || !(who in global.db.data.users)) {
             const recipientDisplay = who ? who.split('@')[0] : 'mencionado';
             return conn.sendMessage(m.chat, {text: `${emoji2} El usuario *${recipientDisplay}* no está en la base de datos local.`, mentions: [m.sender]}, {quoted: m});
        }
        
        user[bankType] -= amount * 1;
        global.db.data.users[who]['coin'] = (global.db.data.users[who]['coin'] || 0) + amount * 1;
        
        const totalInBank = user[bankType];
        
        return sendLocalTransferConfirmation(conn, m, amount, totalInBank, who);
    } 

    // 2. TRANSFERENCIA MULTIBOT
    const isCypherTransAccount = recipientArg.length > 7 && ALL_PREFIXES.some(prefix => recipientArg.endsWith(prefix + recipientArg.slice(-4)));

    if (isCypherTransAccount) {
        const senderAccount = global.db.data.users[m.sender]?.cypherTransAccount;

        if (!botHash || !senderAccount) {
            return m.reply(`${emoji2} El sistema multibot no está activado o tu cuenta no está vinculada. Usa *${usedPrefix}crearcuenta* o *${usedPrefix}registerbot*.`);
        }

        const recipientPrefix = recipientArg.slice(-7, -4);
        const recipientAccount = recipientArg;
        let transferType = null;
        
        // C.1. Transferencia al mismo bot (MAR)
        if (BOT_KEY_PREFIX === recipientPrefix) {
            transferType = 'instant';
        } else if (typeShortcut === '1' || typeShortcut === '2') {
             transferType = (typeShortcut === '1' ? 'normal' : 'instant');
        }
        
        if (transferType) {
            user[bankType] -= amount * 1;
            
            const txResponse = await callCypherTransAPI(botHash, senderAccount, recipientAccount, amount, transferType);
            
            if (txResponse.status === 200) {
                // LLAMADA UNIFICADA: Maneja imagen o texto según la respuesta del API
                return sendFinalTransferConfirmation(conn, m.chat, txResponse.data, amount, user[bankType], m);
                
            } else {
                // Reembolsar el monto si la API falla
                user[bankType] += amount * 1; 
                return m.reply(`${emoji2} Falló la transferencia a ${recipientAccount}. ${txResponse.data.error || 'Error desconocido'}`);
            }
        }
        
        // E. Bots Diferentes (Menú de selección) - Estética mejorada
        const buttons = [
            {buttonId: `${usedPrefix + command} 1 ${amount} ${recipientAccount}`, buttonText: {displayText: '1: Lenta (Normal) 🐢'}, type: 1},
            {buttonId: `${usedPrefix + command} 2 ${amount} ${recipientAccount}`, buttonText: {displayText: '2: Rápida (Instantánea) ⚡'}, type: 1}
        ];
        
        const buttonMessage = {
            text: `🌐 *Selecciona la Velocidad de Transferencia*\n\n` + 
                      `*Destino:* ${recipientPrefix} | *Monto:* ${amount} ${moneda}\n\n` +
                      `*1. Lenta (Normal):* Tarda hasta 24h. Sin comisión base. (Recomendado)\n` +
                      `*2. Rápida (Instantánea):* Tarda ~8min. Aplica comisión.`,
            footer: 'CypherTrans | Selecciona una opción:',
            buttons: buttons,
            headerType: 1
        };

        return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }

    // 3. ERROR DE FORMATO
    return m.reply(`${emoji2} Formato de destinatario no reconocido. Debe ser @mencion o una cuenta CypherTrans (ej: XXXXXMARC1234).`);
}


handler.help = ['pay', 'transfer'];
handler.tags = ['rpg'];
handler.command = ['pay', 'transfer', 'transferir'];
handler.group = true;
handler.register = true;

export default handler;
