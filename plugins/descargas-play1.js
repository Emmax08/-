import fetch from "node-fetch";
import yts from "yt-search";
import axios from 'axios';
import fs from 'fs';

const SIZE_LIMIT_MB = 100;
const API_KEY = "causa-ee5ee31dcfc79da4";
const newsletterJid = '120363401893800327@newsletter';
const newsletterName = '⸙ְ̻࠭ꪆ👑 mᥲríᥲ k᥆ȷᥙ᥆ 𖥔 Sᥱrvice';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const name = conn.getName(m.sender);
  args = args.filter(v => v?.trim());

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: { newsletterJid, newsletterName, serverMessageId: -1 },
    externalAdReply: {
      title: '🖤 ⏤͟͟͞͞mᥲríᥲ k᥆ȷᥙ᥆ ᨶ႒ᩚ',
      body: `✦ 𝙀𝙨𝙥𝙚𝙧𝙖𝙣𝙙𝙤 𝙩𝙪 𝙨𝙤𝙡𝙞𝙘𝙞𝙩𝙪𝙙, ${name}. ♡~٩( ˃▽˂ )۶~♡`,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(m.chat, `🪽 *¿᥎іᥒіs𝗍ᥱ ᥲ ⍴ᥱძіrmᥱ ᥲᥣg᥆ sіᥒ sᥲᑲᥱr 𝗊ᥙᥱ́?*\n🎧 ᥱȷᥱm⍴ᥣ᥆:\n${usedPrefix}${command} moonlight - kali uchis`, m, { contextInfo });
  }

  const isMode = ["audio", "video"].includes(args[0].toLowerCase());
  const queryOrUrl = isMode ? args.slice(1).join(" ") : args.join(" ");
  const isInputUrl = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/i.test(queryOrUrl);

  let videoUrl = isInputUrl ? queryOrUrl : null;

  // Si no es URL, buscamos el video primero para obtener el enlace
  if (!isInputUrl) {
    const search = await yts(queryOrUrl);
    if (!search.videos.length) return m.reply("❌ No encontré resultados.");
    videoUrl = search.videos[0].url;
    
    // Si el usuario no especificó "audio" o "video", mostramos el menú de selección
    if (!isMode) {
      const video = search.videos[0];
      const buttons = [
        { buttonId: `${usedPrefix}${command} audio ${video.url}`, buttonText: { displayText: '🎧 𝘼𝙐𝘿𝙄𝙊' }, type: 1 },
        { buttonId: `${usedPrefix}${command} video ${video.url}`, buttonText: { displayText: '🎬 𝙑𝙄𝘿𝙀𝙊' }, type: 1 }
      ];
      
      const caption = `> ૢ⃘꒰🎧⃝ *Título:* ${video.title}\n> ૢ⃘꒰⏱️⃝ *Duración:* ${video.timestamp}\n> ૢ⃘꒰👤⃝ *Canal:* ${video.author.name}\n> ૢ⃘꒰🔗⃝ *URL:* ${video.url}`;
      
      return await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption,
        footer: 'Selecciona el formato deseado.',
        buttons,
        contextInfo
      }, { quoted: m });
    }
  }

  const mode = args[0].toLowerCase() === "video" ? "video" : "audio";
  await m.react("⏳");

  try {
    // Petición única a tu API
    const apiUrl = `https://rest.apicausas.xyz/api/v1/descargas/youtube?apikey=${API_KEY}&url=${encodeURIComponent(videoUrl)}&type=${mode}`;
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (!json.status || !json.data?.download?.url) {
      throw new Error("API Error");
    }

    const { title, download } = json.data;
    const dlUrl = download.url;

    // Verificar tamaño del archivo
    const head = await axios.head(dlUrl);
    const sizeMb = (head.headers['content-length'] || 0) / (1024 * 1024);

    if (sizeMb > SIZE_LIMIT_MB) {
      await conn.sendMessage(m.chat, {
        document: { url: dlUrl },
        fileName: `${title}.${mode === 'audio' ? 'mp3' : 'mp4'}`,
        mimetype: mode === 'audio' ? 'audio/mpeg' : 'video/mp4',
        caption: `⚠️ *Archivo pesado (${sizeMb.toFixed(2)} MB).* Enviado como documento.\n🖤 *Título:* ${title}`
      }, { quoted: m });
      await m.react("📄");
    } else {
      const message = mode === 'audio' 
        ? { audio: { url: dlUrl }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }
        : { video: { url: dlUrl }, caption: `🎬 *Título:* ${title}`, mimetype: "video/mp4" };
      
      await conn.sendMessage(m.chat, message, { quoted: m });
      await m.react(mode === 'audio' ? "🎧" : "📽️");
    }

  } catch (error) {
    console.error(error);
    await m.react("❌");
    conn.reply(m.chat, `💔 *Error al procesar con apicausas.xyz*`, m);
  }
};

handler.command = ['play'];
handler.register = true;
export default handler;
