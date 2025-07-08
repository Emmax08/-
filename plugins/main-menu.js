import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import moment from 'moment-timezone';
// --- NUEVO IMPORT ---
import PhoneNumber from 'awesome-phonenumber'; // Librería para analizar números y obtener zona horaria

const cooldowns = new Map();
const ultimoMenuEnviado = new Map();

const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '*Ellen-Joe-Bot-OFICIAL*';
const packname = '˚🄴🄻🄻🄴🄽-🄹🄾🄴-🄱🄾🅃';

let handler = async (m, { conn, usedPrefix }) => {
  // --- Manejo de errores de lectura de DB ---
  let enlacesMultimedia;
  try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    const dbRaw = fs.readFileSync(dbPath);
    enlacesMultimedia = JSON.parse(dbRaw).links;
  } catch (e) {
    console.error("Error al leer o parsear src/database/db.json:", e);
    return conn.reply(m.chat, 'Error al leer la base de datos de medios.', m);
  }

  if (m.quoted?.id && m.quoted?.fromMe) return;

  const idChat = m.chat;
  const ahora = Date.now();
  const tiempoEspera = 5 * 60 * 1000; // 5 minutos

  const ultimoUso = cooldowns.get(idChat) || 0;

  if (ahora - ultimoUso < tiempoEspera) {
    const tiempoRestanteMs = tiempoEspera - (ahora - ultimoUso);
    const minutos = Math.floor(tiempoRestanteMs / 60000);
    const segundos = Math.floor((tiempoRestanteMs % 60000) / 1000);

    const ultimo = ultimoMenuEnviado.get(idChat);
    return await conn.reply(
      idChat,
      `@${m.sender.split('@')[0]} cálmate tiburón! 🦈 Debes esperar para volver a usar el menú.\nTiempo restante: *${minutos}m ${segundos}s*`,
      ultimo?.message || m,
      { mentions: [m.sender] }
    );
  }

  cooldowns.set(idChat, ahora);

  let nombre;
  try {
    nombre = await conn.getName(m.sender);
  } catch {
    nombre = 'Usuario';
  }

  // --- LÓGICA DE HORA DE USUARIO CON AWESOME-PHONENUMBER ---
  let horaUsuario = 'No disponible';
  try {
    const numeroParseado = new PhoneNumber(`+${m.sender.split('@')[0]}`);
    if (numeroParseado.isValid()) {
      const zonasHorarias = numeroParseado.getTimezones(); // Obtiene las zonas horarias
      if (zonasHorarias && zonasHorarias.length > 0) {
        // Usa la primera zona horaria de la lista
        const zonaHorariaUsuario = zonasHorarias[0];
        horaUsuario = moment().tz(zonaHorariaUsuario).format('h:mm A');
      }
    }
  } catch (e) {
    console.error("No se pudo analizar el número con awesome-phonenumber:", e.message);
  }
  // --- FIN DE LA LÓGICA ---

  const esPrincipal = conn.user.jid === global.conn.user.jid;
  const numeroBot = conn.user.jid.split('@')[0];
  const numeroPrincipal = global.conn?.user?.jid?.split('@')[0] || "Desconocido";
  const totalComandos = Object.keys(global.plugins || {}).length;
  const tiempoActividad = clockString(process.uptime() * 1000);
  const totalRegistros = Object.keys(global.db?.data?.users || {}).length;
  
  const horaSantoDomingo = moment().tz("America/Santo_Domingo").format('h:mm A');

  const videoGif = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
  const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];

  const emojis = {
    'main': '🦈', 'tools': '🛠️', 'audio': '🎧', 'group': '👥',
    'owner': '👑', 'fun': '🎮', 'info': 'ℹ️', 'internet': '🌐',
    'downloads': '⬇️', 'admin': '🧰', 'anime': '✨', 'nsfw': '🔞',
    'search': '🔍', 'sticker': '🖼️', 'game': '🕹️', 'premium': '💎', 'bot': '🤖'
  };

  let grupos = {};
  for (let plugin of Object.values(global.plugins || {})) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!grupos[tag]) grupos[tag] = [];
      for (let help of plugin.help) {
        if (/^\$|^=>|^>/.test(help)) continue;
        grupos[tag].push(`${usedPrefix}${help}`);
      }
    }
  }

  for (let tag in grupos) {
    grupos[tag].sort((a, b) => a.localeCompare(b));
  }

  const secciones = Object.entries(grupos).map(([tag, cmds]) => {
    const emoji = emojis[tag] || '📁';
    return `[${emoji} ${tag.toUpperCase()}]\n` + cmds.map(cmd => `> ${cmd}`).join('\n');
  }).join('\n\n');

  const encabezado = `
🦈 |--- *Ellen-Joe-Bot | MODO TIBURÓN* ---| 🦈
| 👤 *Usuario:* ${nombre}
| 🌎 *Hora Santo Domingo:* ${horaSantoDomingo}
| 🕒 *Tu Hora (Estimada):* ${horaUsuario}
| 🤖 *Bot:* ${esPrincipal ? 'Principal' : `Sub-Bot | Principal: ${numeroPrincipal}`}
| 📦 *Comandos:* ${totalComandos}
| ⏱️ *Tiempo Activo:* ${tiempoActividad}
| 👥 *Usuarios Reg:* ${totalRegistros}
| 👑 *Dueño:* wa.me/${global.owner?.[0]?.[0] || "No definido"}
|-------------------------------------------|`.trim();

  const textoFinal = `${encabezado}\n\n${secciones}\n\n*${packname}*`;

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: '🦈 Menú de Comandos | Ellen-Joe-Bot 🦈',
      thumbnailUrl: miniaturaRandom,
      sourceUrl: 'https://github.com/nevi-dev/Ellen-Joe-Bot-MD',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  let msgEnviado;
  try {
    msgEnviado = await conn.sendMessage(idChat, {
      video: { url: videoGif },
      gifPlayback: true,
      caption: textoFinal,
      contextInfo
    }, { quoted: m });
  } catch (e) {
    console.error("Error al enviar el menú con video:", e);
    msgEnviado = await conn.reply(idChat, textoFinal, m, { contextInfo });
  }

  cooldowns.set(idChat, ahora);
  ultimoMenuEnviado.set(idChat, {
    timestamp: ahora,
    message: msgEnviado
  });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
