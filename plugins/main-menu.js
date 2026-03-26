import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import axios from 'axios';

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const newsletterJid  = '120363401893800327@newsletter';
const newsletterName = '「🌸」𝑴𝒂𝒓𝒊𝒂 𝑲𝒖𝒋𝒐𝒖 ⟡ 𝑺𝒆𝒓𝒗𝒊𝒄𝒆 ✦';
const packname       = '「🌸」𝑴𝒂𝒓𝒊𝒂 𝑲𝒖𝒋𝒐𝒖-𝒃𝒐𝒕 ✦';

const GITHUB_REPO_OWNER = 'Emmax08';
const GITHUB_REPO_NAME  = '-';
const GITHUB_BRANCH     = 'main';

const redes = 'https://whatsapp.com/channel/0029VbBw362A2pL9BOnpbP0H';

const CATEGORIES = {
    'Sub-Bot':                    { emoji: '🤖', tags: ['serbot'] },
    'Ajustes & Config':           { emoji: '⚙️', tags: ['nable', 'owner', 'mods', 'setting'] },
    'Herramientas & Stickers':    { emoji: '🛠️', tags: ['tools', 'transformador', 'herramientas', 'sticker'] },
    'Grupos & Admin':             { emoji: '👥', tags: ['grupo', 'group', 'admin'] },
    'Inteligencia Artificial':    { emoji: '🧠', tags: ['ai', 'image', 'ia', 'openai'] },
    'Diversión & Juegos':         { emoji: '🕹️', tags: ['games', 'game', 'fun'] },
    'Anime & Emociones':          { emoji: '✨', tags: ['anime', 'emox', 'waifus', 'gacha'] },
    'Información':                { emoji: 'ℹ️', tags: ['info'] },
    'Principal':                  { emoji: '🏠', tags: ['main'] },
    'Economía & RPG':             { emoji: '💰', tags: ['rpg', 'economia', 'economy'] },
    'Descargas & Buscadores':     { emoji: '⬇️', tags: ['descargas', 'buscador', 'dl', 'internet', 'search'] },
    '+18 / NSFW':                 { emoji: '🔞', tags: ['+18', 'nsfw'] },
};

function getCommandsByTags(plugins, tags, usedPrefix) {
    let commands = [];
    for (const plugin of Object.values(plugins)) {
        if (plugin.tags && plugin.help) {
            const hasMatchingTag = plugin.tags.some(tag => tags.includes(tag));
            if (hasMatchingTag) {
                for (const help of plugin.help) {
                    if (!/^\$|^=>|^>/.test(help)) {
                        commands.push(`${usedPrefix}${help}`);
                    }
                }
            }
        }
    }
    return [...new Set(commands)].sort((a, b) => a.localeCompare(b));
}

let handler = async (m, { conn, usedPrefix, args, __dirname }) => {
  try {
    if (m.quoted?.id && m.quoted?.fromMe) return;

    const idChat = m.chat;

    // ── Datos del bot ────────────────────────────────────────────────────────
    let _package = {};
    try {
        _package = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    } catch {}

    let nombre = 'Usuario';
    try { nombre = await conn.getName(m.sender); } catch {}

    const esPrincipal      = conn.user.jid === global.conn.user.jid;
    const totalComandos    = Object.keys(global.plugins || {}).length;
    const tiempoActividad  = clockString(process.uptime() * 1000);
    const totalRegistros   = Object.keys(global.db?.data?.users || {}).length;
    const rtotalreg        = Object.values(global.db?.data?.users || {}).filter(u => u.registered).length;
    const totalChatsBanned = Object.entries(global.db?.data?.chats || {}).filter(([, c]) => c.isBanned).length;
    const totalUsersBanned = Object.entries(global.db?.data?.users || {}).filter(([, u]) => u.banned).length;

    // ── Hora México ──────────────────────────────────────────────────────────
    const lugarFecha = moment().tz('America/Mexico_City');
    lugarFecha.locale('es');
    const horarioFecha = lugarFecha.format('dddd, DD [de] MMMM [del] YYYY || HH:mm A')
        .replace(/^\w/, c => c.toUpperCase());

    // ── Versión GitHub ───────────────────────────────────────────────────────
    let localVersion = _package.version || 'N/A';
    let serverVersion = 'N/A', updateStatus = 'Desconocido';
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
        const res = await axios.get(url);
        serverVersion = res.data.version || 'N/A';
        updateStatus = localVersion === serverVersion
            ? '✅ En última versión'
            : `⚠️ Actualiza con *${usedPrefix}update*`;
    } catch {
        serverVersion = 'Error';
        updateStatus = '❌ No se pudo verificar';
    }

    // ── contextInfo ──────────────────────────────────────────────────────────
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
            body: '🌸 Menú de Comandos | 𝑴𝒂𝒓𝒊𝒂 𝑲𝒖𝒋𝒐𝒖-𝒃𝒐𝒕 ⚡️',
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    // ── SUBMENÚ ──────────────────────────────────────────────────────────────
    const selectedCategory = args[0]?.toLowerCase();

    if (selectedCategory && !/^\d+$/.test(selectedCategory)) {
        let categoryData;

        for (const [name, data] of Object.entries(CATEGORIES)) {
            const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalized === selectedCategory || data.tags.includes(selectedCategory)) {
                categoryData = [name, data];
                break;
            }
        }

        if (!categoryData && selectedCategory === 'otros') {
            const tagsCategorizadas = new Set(Object.values(CATEGORIES).flatMap(c => c.tags));
            const otrosTags = Object.keys(global.plugins || {})
                .flatMap(key => global.plugins[key].tags || [])
                .filter(tag => !tagsCategorizadas.has(tag) && tag.length > 0);
            categoryData = ['Otros Comandos', { emoji: '📂', tags: otrosTags }];
        }

        if (categoryData) {
            const [name, data] = categoryData;
            const comandos = getCommandsByTags(global.plugins, data.tags, usedPrefix);

            const listaComandos = comandos.length > 0
                ? comandos.map(cmd => `  ╰➤ \`${cmd}\``).join('\n')
                : '  ╰➤ Sin comandos disponibles aún.';

            const textoFinal = [
                `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*`,
                `*│* ${data.emoji} *${name.toUpperCase()}*`,
                `*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`,
                ``,
                listaComandos,
                ``,
                `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*`,
                `*│* 💡 Usa \`${usedPrefix}menu\` para volver`,
                `*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`,
                `*${packname}*`
            ].join('\n');

            await conn.sendMessage(idChat, { text: textoFinal, contextInfo }, { quoted: m });
            return;
        }
    }

    // ── MENÚ PRINCIPAL ───────────────────────────────────────────────────────
    const encabezado = [
        `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*`,
        `*│ 🌸 |𝐌𝐀𝐑𝐈𝐀 𝐊𝐔𝐉𝐎𝐔 𝐁𝐎𝐓| 🖤*`,
        `*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`,
        `⎔ \`${horarioFecha}\``,
        `*├┈──────────────────────┈*`,
        `*│ 🚀 V E R S I Ó N*`,
        `*│* ➡️ *Local:* ${localVersion}`,
        `*│* ➡️ *Servidor:* ${serverVersion}`,
        `*│* 📊 ${updateStatus}`,
        `*├┈──────────────────────┈*`,
        `*│ 📊 I N F O R M A C I Ó N*`,
        `*│* 📦 *Comandos:* ${totalComandos}`,
        `*│* ⏱️ *Actividad:* ${tiempoActividad}`,
        `*│* 👥 *Regis. Almas:* ${rtotalreg}/${totalRegistros}`,
        `*│* 🚫 *Chats Ban:* ${totalChatsBanned}`,
        `*│* 🚫 *Usuarios Ban:* ${totalUsersBanned}`,
        `*│* 👑 *Dueño:* Emmax`,
        `*│* 👤 *Hola:* ${nombre}`,
        `*│* 🤖 *Modo:* ${esPrincipal ? 'Principal' : 'Sub-Bot'}`,
        `*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`,
    ].join('\n');

    const categoriasTexto = Object.entries(CATEGORIES)
        .map(([name, data], i) => {
            const tag = data.tags[0] || name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const num = String(i + 1).padStart(2, '0');
            return `*│* ${num}. ${data.emoji} *${name}*\n*│*    ╰➤ \`${usedPrefix}menu ${tag}\``;
        })
        .join('\n');

    const menuCuerpo = [
        ``,
        `*╭┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╮*`,
        `*│ 📂 C A T E G O R Í A S*`,
        `*├┈──────────────────────┈*`,
        categoriasTexto,
        `*╰┈┈┈┈┈┈┈┈┈୨୧┈┈┈┈┈┈┈┈┈╯*`,
        ``,
        `> 💡 Escribe el comando de la categoría que quieras ver`,
        ``,
        `*${packname}*`
    ].join('\n');

    const fullCaption = encabezado + menuCuerpo + readMore;

    await conn.sendMessage(idChat, { text: fullCaption, contextInfo }, { quoted: m });

  } catch (err) {
      console.error('[MENU ERROR]', err);
      try {
          await conn.sendMessage(m.chat, {
              text: `❌ *Error en menu:*\n\`\`\`${err.message || String(err)}\`\`\``
          }, { quoted: m });
      } catch (e2) {
          console.error('[MENU SEND ERROR]', e2);
      }
  }
};

handler.help = ['menu', 'menu <categoría>'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}