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

// 🌟 Mensaje Código Mejorado (Maria Koju) - MODIFICADO CON TU TEXTO
let rtx2 = `· · ─────── ·𖥸· ─────── · ·
✎ᥴ᥆ᥒᥱ᥊і᥆́ᥒ sᥙᑲ-ᑲ᥆𝗍 m᥆ძᥱ ᥴ᥆ძᥱ
· · ─────── ·𖥸· ─────── · ·
╔═══════ ೋღ 🌺 ღೋ ═══════╗
✦ᥙsᥲ ᥱs𝗍ᥱ́ ᥴ᥆ძіg᥆ ⍴ᥲrᥲ ᥴ᥆ᥒ᥎ᥱr𝗍іr𝗍ᥱ ᥱᥒ 
ᥙᥒ sᥙᑲ-ᑲ᥆𝗍 𝗍ᥱm⍴᥆rᥲᥣ. 

❏ 𝗍᥆𝗊ᥙᥱ "ძіs⍴᥆sі𝗍і᥎᥆s ᥎іᥒᥴᥙᥣᥲძ᥆s" 

❏ sᥱᥣᥱᥴᥴі᥆ᥒᥲ "᥎іᥒᥴᥙᥣᥲr ᥴ᥆ᥒ ᥱᥣ ᥒᥙ́mᥱr᥆ 
ძᥱ 𝗍ᥱᥣᥱ́𝖿᥆ᥒ᥆"

❏ ᥱsᥴrіᑲᥲ ᥱᥣ ᥴ᥆́ძіg᥆ ⍴ᥲrᥲ іᥒіᥴіᥲr sᥱsі᥆́ᥒ 
ᥴ᥆ᥒ ᥱᥣ ᑲ᥆𝗍
╚═══════ ೋღ 🌺 ღೋ ═══════╝

· · ─────── ·𖥸· ─────── · ·
⚠︎ ᥒ᥆ ᥱs rᥱᥴ᥆mᥱᥒძᥲᑲᥣᥱ ᥙsᥲr 𝗍ᥙ́ ᥴᥙᥱᥒ𝗍ᥲ ⍴rіᥒᥴі⍴ᥲᥣ.
· · ─────── ·𖥸· ─────── · ·

[mᥲríᥲ k᥆ȷᥙ᥆]
               [BY: Emmax-kun]` 

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
// ... (resto de la función msToTime)
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
// ... (resto del handler)
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
// ... (resto de MariaJadiBot)
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
        // ... (resto de creloadHandler
