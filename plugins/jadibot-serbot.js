/*
* El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion
* El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
- Nevi-Dev (Nuevas mejoras de código y UX)
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// --- Variables y Configuración de Comandos ---
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// 🌟 Mensaje QR Mejorado (Maria Koju)
let rtx = "╭─━━━━━━━━━━━━━━━─╮\n*│ 👑 CONEXIÓN SUB-BOT 👑* \n*│* \n│ ➡️ *MODO:* Código QR \n│ ⏳ *EXPIRA:* 45 segundos \n*│* \n│ *PASOS DE VINCULACIÓN:* \n│ \n│ 1️⃣ Abre WhatsApp en tu teléfono principal. \n│ 2️⃣ Ve a *Ajustes/Configuración*.\n│ 3️⃣ Toca *Dispositivos vinculados*.\n│ 4️⃣ Escanea este código QR.\n│ \n╰─━━━━━━━━━━━━━━━─╯"

// 🌟 Mensaje Código Mejorado (Maria Koju)
let rtx2 = `╭─━━━━━━━━━━━━━━━─╮
*│ 👑 CONEXIÓN SUB-BOT 👑* *│* │ ➡️ *MODO:* Código \n
│ *PASOS DE VINCULACIÓN:* \n
│ 
│ 1️⃣ Abre WhatsApp en tu teléfono principal. \n
│ 2️⃣ Ve a *Ajustes/Configuración*.\n
│ 3️⃣ Toca *Dispositivos vinculados*.\n
│ 4️⃣ Selecciona *Vincular con el número de teléfono*.\n
│ 5️⃣ Ingresa el *Código de 8 dígitos* a continuación.
│ 
│ ⚠️ *IMPORTANTE:* No uses tu cuenta principal.
╰─━━━━━━━━━━━━━━━─╯
\`[BY: Nevi-Dev]\`` // Se agregó la autoría

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MariaJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

// ⚠️ Nuevo: Mapa para prevenir el mensaje de éxito duplicado
const connectionSuccessSent = new Map() // Map<JID_Usuario, Boolean>
const jadi = 'MariaJadiBots' // Carpeta base para las sesiones

// --- Funciones de Utilidad (Asumidas) ---
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
    if (!global.ch) return // Salir si global.ch no está definido
    for (const channelId of Object.values(global.ch)) {
        await conn.newsletterFollow(channelId).catch(() => {})
    }
}
// ------------------------------------------


// --- Handler (Punto de entrada del comando) ---
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    // Se asumen 'emoji' y 'global.db.data.users' definidos
    let time = (global.db.data.users[m.sender]?.Subs || 0) + 120000
    if (new Date - (global.db.data.users[m.sender]?.Subs || 0) < 120000) return conn.reply(m.chat, `${emoji} Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)

    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
    const subBotsCount = subBots.length
    // Se asume 'emoji2' definido
    if (subBotsCount === 90) {
        return m.reply(`${emoji2} No se han encontrado espacios para *Sub-Bots* disponibles.`)
    }
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathMariaJadiBot = path.join(`./${jadi}/`, id)

    if (!fs.existsSync(pathMariaJadiBot)){
        fs.mkdirSync(pathMariaJadiBot, { recursive: true })
    }
    
    MariaJBOptions.pathMariaJadiBot = pathMariaJadiBot
    MariaJBOptions.m = m
    MariaJBOptions.conn = conn
    MariaJBOptions.args = args
    MariaJBOptions.usedPrefix = usedPrefix
    MariaJBOptions.command = command
    MariaJBOptions.fromCommand = true
    
    MariaJadiBot(MariaJBOptions)
    
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
    global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

// --- Función Principal de Conexión ---
export async function MariaJadiBot(options) {
    let { pathMariaJadiBot, m, conn, args, usedPrefix, command } = options
    const jid = m.sender // JID del usuario que solicitó el comando
    // Determinar si se usa el código de emparejamiento
    let mcode = false
    if (command === 'code' || (args[0] && /(--code|code)/.test(args[0].trim())) || (args[1] && /(--code|code)/.test(args[1].trim()))) {
        mcode = true
        // Ajustar args para el caso del código
        if (command === 'code') {
            command = 'qr'; // Usa 'qr' internamente para no romper la lógica
        }
        // Limpiamos los argumentos, el primer elemento sin '--code' o 'code' es el código del usuario.
        args = args.filter(a => !/(--code|code)/.test(a.trim()))
        args[0] = args[0]?.trim() || undefined
    }


    let txtCode, codeBot, txtQR
    
    const pathCreds = path.join(pathMariaJadiBot, "creds.json")
    if (!fs.existsSync(pathMariaJadiBot)){
        fs.mkdirSync(pathMariaJadiBot, { recursive: true })
    }
    
    try {
        args[0] && args[0] != undefined && !mcode ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
    } catch {
        conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
        return
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`)

        let { version, isLatest } = await fetchLatestBaileysVersion()
        const msgRetry = (MessageRetryMap) => { }
        const msgRetryCache = new NodeCache()
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMariaJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetry,
            msgRetryCache,
            // 🌟 CORRECCIÓN 1: Usar un nombre no genérico para mcode
            browser: mcode ? ['MariaKoju', 'Chrome', '110.0.5585.95'] : ['mᥲríᥲ k᥆ȷᥙ᥆ (Sub Bot)', 'Chrome','2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true
        // Añadir el JID del solicitante al socket para uso interno
        sock.jidRequester = jid 
        sock.pathJadiBot = pathMariaJadiBot

        // Definición de la función de recarga para manejar la reconexión y los handlers
        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler.default || Handler 
            } catch (e) {
                console.error('⚠️ Nuevo error: ', e)
            }
            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, { chats: oldChats })
                isInit = true
                sock.jidRequester = jid
                sock.pathJadiBot = pathMariaJadiBot
            }
            
            // Re-asignar y re-activar listeners
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler)
                sock.ev.off("connection.update", sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }

            sock.handler = handler.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)
            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
            isInit = false
            return true
        }

        // Función para eliminar el socket de la lista global
        const removeSock = (currentSock) => {
            const i = global.conns.indexOf(currentSock);
            if (i >= 0) {
                delete global.conns[i];
                global.conns.splice(i, 1);
            }
            connectionSuccessSent.delete(currentSock.jidRequester);
        }

        // Función principal de manejo de eventos de conexión
        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            if (isNewLogin) sock.isInit = false

            // --- Manejo de QR ---
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx}, { quoted: m})
                } else {
                    return 
                }
                // Eliminar el mensaje de QR después de 30 segundos
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }).catch(e => console.error("Error al borrar QR:", e))}, 30000)
                }
                return
            } 

            // --- Manejo de Código de Emparejamiento ---
            if (qr && mcode) {
                // 1. Extraer solo el número (sin @s.whatsapp.net)
                const phoneNumber = m.sender.split`@`[0];
                
                // 2. Extraer el código de 4 letras de los argumentos (args[0] ya está limpio y es el código opcional)
                const customPairKey = args[0] || undefined; // 'ABCD' o undefined si no se pasó nada

                // 🌟 CÓDIGO PARCHADO: Llama a la función de Baileys con el código opcional (o undefined)
                // El Baileys parchado ahora manejará el caso por defecto ('NEVI') si se pasa undefined.
                let secret = await sock.requestPairingCode(phoneNumber, customPairKey)
                // ----------------------------------------
                
                txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
                // El código se envía como un mensaje separado para destacar
                codeBot = await m.reply(`\`\`\`${secret}\`\`\``) 
                console.log(chalk.yellow(`Código de Emparejamiento para +${phoneNumber}: ${secret}`))

                // Eliminar los mensajes después de 30 segundos
                if (txtCode && txtCode.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }).catch(e => console.error("Error al borrar código 1:", e))}, 30000)
                }
                if (codeBot && codeBot.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }).catch(e => console.error("Error al borrar código 2:", e))}, 30000)
                }
                return
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (connection === 'close') {
                // 428, 408, 515, 500 (Reconexión automática por pérdida, timeout o server error)
                if (reason === 428 || reason === 408 || reason === 515 || reason === 500 || reason === DisconnectReason.connectionClose || reason === DisconnectReason.connectionLost) {
                    console.log(chalk.bold.magentaBright(`\n[RECONECTANDO] Sesión (+${path.basename(sock.pathJadiBot)}) cerrada inesperadamente. Razón: ${reason}.`))
                    // No recreamos el socket, solo forzamos la reconexión de Baileys
                    await creloadHandler(false).catch(console.error) 
                } 
                // 440 (Reemplazada por otra sesión)
                else if (reason === 440 || reason === DisconnectReason.loggedOut) {
                    console.log(chalk.bold.magentaBright(`\n[REEMPLAZO] Sesión (+${path.basename(sock.pathJadiBot)}) fue reemplazada por otra.`))
                    try {
                        if (options.fromCommand) await conn.sendMessage(`${path.basename(sock.pathJadiBot)}@s.whatsapp.net`, {text : '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null }) 
                    } catch (error) {
                        console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(sock.pathJadiBot)}`))
                    }
                    fs.rmdirSync(sock.pathJadiBot, { recursive: true })
                    try { sock.ws.close() } catch { }
                    removeSock(sock)
                } 
                // 405, 401, 403 (Fallos de autenticación o cierre permanente/manual)
                else if (reason === 405 || reason === 401 || reason === 403 || reason === DisconnectReason.badSession || reason === DisconnectReason.restartRequired) {
                    console.log(chalk.bold.magentaBright(`\n[SESIÓN INVÁLIDA] Sesión (+${path.basename(sock.pathJadiBot)}) cerrada permanentemente. Razón: ${reason}.`))
                    try {
                        if (options.fromCommand) await conn.sendMessage(`${path.basename(sock.pathJadiBot)}@s.whatsapp.net`, {text : '*❌ SESIÓN INVÁLIDA/CERRADA PERMANENTEMENTE ❌*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) 
                    } catch (error) {
                        console.error(chalk.bold.yellow(`Error ${reason} no se pudo enviar mensaje a: +${path.basename(sock.pathJadiBot)}`))
                    }
                    fs.rmdirSync(sock.pathJadiBot, { recursive: true })
                    try { sock.ws.close() } catch { }
                    removeSock(sock) // Cerrar y remover de global.conns
                } 
                // Otras razones desconocidas
                else {
                    console.log(chalk.bold.magentaBright(`\n[DESCONEXIÓN DESCONOCIDA] Sesión (+${path.basename(sock.pathJadiBot)}) cerrada por razón ${reason}. Intentando reconectar...`))
                    await creloadHandler(false).catch(console.error)
                }
            }

            // --- Lógica de Conexión Abierta ---
            if (global.db.data == null) loadDatabase()
            if (connection == `open`) {
                if (!global.db.data?.users) loadDatabase()
                let userName = sock.authState.creds.me.name || 'Anónimo'
                let userJid = sock.authState.creds.me.jid || `${path.basename(sock.pathJadiBot)}@s.whatsapp.net`

                // ⚠️ CORRECCIÓN: Solo enviar el mensaje de éxito una vez
                if (!connectionSuccessSent.get(sock.jidRequester)) {
                    console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(sock.pathJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))

                    if (!global.conns.includes(sock)) {
                        global.conns.push(sock)
                    }
                    await joinChannels(sock)

                    // Mensaje de éxito al usuario que ejecutó el comando
                    m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `@${m.sender.split('@')[0]}, ¡genial! Ya eres parte de nuestra familia de Sub-Bots.`, mentions: [m.sender]}, { quoted: m }) : ''

                    connectionSuccessSent.set(sock.jidRequester, true) // Marcar como enviado
                }
            }
        } // Fin de connectionUpdate

        // Intervalo de chequeo de estado
        setInterval(async () => {
            // Si no tiene usuario y no está conectando (o está muy inactivo), lo eliminamos
            if (!sock.user && sock.ws.socket?.readyState !== CONNECTING) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners()
                removeSock(sock)
            }
        }, 60000)

        creloadHandler(false)
    })
}
