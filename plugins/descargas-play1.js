import fetch from "node-fetch";
import { ogmp3 } from '../lib/youtubedl.js';
import yts from "yt-search";
import axios from 'axios';

const SIZE_LIMIT_MB = 100;
const MIN_AUDIO_SIZE_BYTES = 50000;
const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '⸙ְ̻࠭ꪆ🦈 𝐄llen 𝐉ᴏᴇ 𖥔 Sᥱrvice';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const name = conn.getName(m.sender);
  args = args.filter(v => v?.trim());

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
      title: '🖤 ⏤͟͟͞͞𝙀𝙇𝙇𝙀𝙉 - 𝘽𝙊𝙏 ᨶ႒ᩚ',
      body: `✦ 𝙀𝙨𝙥𝙚𝙧𝙖𝙣𝙙𝙤 𝙩𝙪 𝙨𝙤𝙡𝙞𝙘𝙞𝙩𝙪𝙙, ${name}. ♡~٩( ˃▽˂ )۶~♡`,
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(m.chat, `🦈 *¿᥎іᥒіs𝗍ᥱ ᥲ ⍴ᥱძіrmᥱ ᥲᥣg᥆ sіᥒ sᥲᑲᥱr 𝗊ᥙᥱ́?*
ძі ᥣ᥆ 𝗊ᥙᥱ 𝗊ᥙіᥱrᥱs... ᥆ ᥎ᥱ𝗍ᥱ.

🎧 ᥱȷᥱm⍴ᥣ᥆:
${usedPrefix}play moonlight - kali uchis`, m, { contextInfo });
  }

  const isMode = ["audio", "video"].includes(args[0].toLowerCase());
  const queryOrUrl = isMode ? args.slice(1).join(" ") : args.join(" ");
  const isInputUrl = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/i.test(queryOrUrl);

  let search, video;
  try {
    search = await yts(queryOrUrl);
    video = search.videos?.[0];
  } catch (e) {
    return conn.reply(m.chat, `🖤 *𝗊ᥙᥱ́ ⍴ᥲ𝗍ᥱ́𝗍іᥴ᥆...*
ᥒ᥆ ᥣ᥆grᥱ́ ᥱᥒᥴ᥆ᥒ𝗍rᥲr ᥒᥲძᥲ ᥴ᥆ᥒ ᥣ᥆ 𝗊ᥙᥱ ⍴ᥱძіs𝗍ᥱ`, m, { contextInfo });
  }

  if (!video) {
    return conn.reply(m.chat, `🦈 *ᥱs𝗍ᥲ ᥴ᥆sᥲ mᥙrі᥆́ ᥲᥒ𝗍ᥱs ძᥱ ᥱm⍴ᥱzᥲr.*
ᥒᥲძᥲ ᥱᥒᥴ᥆ᥒ𝗍rᥲძ᥆ ᥴ᥆ᥒ "${queryOrUrl}"`, m, { contextInfo });
  }

  if (isMode) {
    const mode = args[0].toLowerCase();
    await m.react("📥");

    const sendMediaFile = async (downloadUrl, title, currentMode, protocolo) => {
      try {
        if (currentMode === "audio" && protocolo === "API_PRINCIPAL") {
          const headRes = await axios.head(downloadUrl);
          const fileSize = parseInt(headRes.headers['content-length'] || "0");

          if (fileSize < MIN_AUDIO_SIZE_BYTES) throw new Error('Silencio disfrazado de archivo.');

          await conn.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
          }, { quoted: m });
          await m.react("🎧");
        } else {
          const mediaOptions = currentMode === 'audio'
            ? { audio: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }
            : { video: { url: downloadUrl }, caption: `🎬 *Listo.*
🖤 *Título:* ${title}`, fileName: `${title}.mp4`, mimetype: "video/mp4" };

          await conn.sendMessage(m.chat, mediaOptions, { quoted: m });
          await m.react(currentMode === 'audio' ? "🎧" : "📽️");
        }
      } catch (error) {
        throw error;
      }
    };

    const urlToDownload = isInputUrl ? queryOrUrl : video.url;

    try {
      const endpoint = mode === "audio" ? "ytmp3" : "ytmp4";
      const dlApi = `https://api.vreden.my.id/api/${endpoint}?url=${encodeURIComponent(urlToDownload)}`;
      const res = await fetch(dlApi);
      const json = await res.json();

      if (json.status === 200 && json.result?.download?.url) {
        await sendMediaFile(json.result.download.url, json.result.metadata.title || video.title, mode, "API_PRINCIPAL");
        return;
      }
      throw new Error("API principal... derrumbada.");
    } catch (e) {
      try {
        const downloadResult = await ogmp3.download(urlToDownload, null, mode);

        if (downloadResult.status && downloadResult.result?.download) {
          await sendMediaFile(downloadResult.result.download, downloadResult.result.title, mode, "OGMP3");
          return;
        }
        throw new Error("ogmp3... silencioso.");
      } catch (e2) {
        await conn.reply(m.chat, `💔 *𝖿ᥲᥣᥣᥱ́. ⍴ᥱr᥆ 𝗍ᥙ́ mᥲ́s.*
ᥒ᥆ ⍴ᥙძᥱ 𝗍rᥲᥱr𝗍ᥱ ᥒᥲძᥲ.`, m);
        await m.react("❌");
      }
    }
    return;
  }

  const buttons = [
    { buttonId: `${usedPrefix}play audio ${video.url}`, buttonText: { displayText: '🎧 𝘼𝙐𝘿𝙄𝙊' }, type: 1 },
    { buttonId: `${usedPrefix}play video ${video.url}`, buttonText: { displayText: '🎬 𝙑𝙄𝘿𝙀𝙊' }, type: 1 }
  ];

  const caption = `
┈۪۪۪۪۪۪۪۪ٜ̈᷼─۪۪۪۪ٜ࣪᷼┈۪۪۪۪۪۪۪۪ٜ݊᷼⁔᮫ּׅ̫ׄ࣪︵᮫ּ๋ׅׅ۪۪۪۪ׅ࣪࣪͡⌒🌀𔗨⃪̤̤̤ٜ۫۫۫҈҈҈҈҉҉᷒ᰰ꤬۫۫۫𔗨̤̤̤𐇽─۪۪۪۪ٜ᷼┈۪۪۪۪۪۪۪۪ٜ̈᷼─۪۪۪۪ٜ࣪᷼┈۪۪۪۪۪۪۪۪ٜ݊᷼𔗨̤̤̤ٜ۫۫۫💜⃪҈҈҈҈҉҉᷒ᰰ꤬۫۫۫𔗨̤̤̤𐇽⁔᮫ּׅ̫ׄ࣪︵᮫ּ๋ׅׅ۪۪۪۪ׅ࣪࣪͡⌒─۪۪۪۪ٜ᷼┈۪۪۪۪۪۪۪۪ٜ̈᷼─۪۪۪۪࣪᷼
₊‧꒰ 🎧꒱ 𝙀𝙇𝙇𝙀𝙉 𝙅𝙊𝙀 𝘽𝙊𝙏 — 𝙋𝙇𝘼𝙔 𝙈𝙊𝘿𝙀 ✧˖°
︶֟፝ᰳ࡛۪۪۪۪۪⏝̣ ͜͝ ۫۫۫۫۫۫︶   ︶֟፝ᰳ࡛۪۪۪۪۪⏝̣ ͜͝ ۫۫۫۫۫۫︶   ︶֟፝ᰳ࡛۪۪۪۪۪⏝̣ ͜͝ ۫۫۫۫۫۫︶

> ૢ⃘꒰🎧⃝︩֟፝𐴲ⳋᩧ᪲ `*Título:* ${video.title}`
> ૢ⃘꒰⏱️⃝︩֟፝𐴲ⳋᩧ᪲ `*Duración:* ${video.timestamp}`
> ૢ⃘꒰👀⃝︩֟፝𐴲ⳋᩧ᪲ `*Vistas:* ${video.views.toLocaleString()}`
> ૢ⃘꒰⏱️⃝︩֟፝𐴲ⳋᩧ᪲ `*Duración:* ${video.timestamp}`
> ૢ⃘꒰👤⃝︩֟፝𐴲ⳋᩧ᪲ `*Subido por:* ${video.author.name}`
> ૢ⃘꒰📅⃝︩֟፝𐴲ⳋᩧ᪲ `*Hace:* ${video.ago}`
> ૢ⃘꒰🔗⃝︩֟፝𐴲ⳋᩧ᪲ `*URL:* ${video.url}`;`
⌣᮫ֶຸ࣪ᷭ⌣〫᪲꒡᳝۪︶᮫໋࣭〭〫𝆬࣪࣪𝆬࣪꒡ֶ〪࣪ ׅ۫ெ᮫〪〪⃨〫᪲࣪˚̥ׅ੭ֶ֟ৎ᮫໋ׅ̣𝆬  ּ֢̊࣪⡠᮫ ໋🦈᮫ຸ〪〪〪〫ᷭ ݄࣪⢄ꠋּ֢ ࣪ ֶׅ੭ֶ̣֟ৎ᮫˚̥࣪ெ᮫〪〪⃨〫᪲ ࣪꒡᮫໋〭࣪𝆬࣪︶〪᳝۪ꠋּ꒡ׅ⌣᮫ֶ࣪᪲⌣᮫ຸ᳝〫֩ᷭ
     ᷼͝ ᮫໋⏝᮫໋〪ׅ〫𝆬⌣ׄ𝆬᷼᷼᷼᷼᷼᷼᷼᷼᷼⌣᷑︶᮫᷼͡︶ׅ ໋𝆬⋰᩠〫 ᮫ׄ ׅ𝆬 ⠸᮫ׄ ׅ ⋱〫 ۪۪ׄ᷑𝆬︶᮫໋᷼͡︶ׅ 𝆬⌣᮫〫ׄ᷑᷼᷼᷼᷼᷼᷼᷼᷼᷼⌣᜔᮫ׄ⏝᜔᮫๋໋〪ׅ〫 ᷼͝`;

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    footer: 'Dime cómo lo quieres... o no digas nada ┐(￣ー￣)┌.',
    buttons,
    headerType: 4
  }, { quoted: m });
};

handler.help = ['play'].map(v => v + ' <búsqueda o URL>');
handler.tags = ['descargas'];
handler.command = ['play'];
handler.register = true;
handler.prefix = /^[./#]/;

export default handler;