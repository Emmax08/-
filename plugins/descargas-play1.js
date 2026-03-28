import fetch from "node-fetch"
import yts from "yt-search"

const API_KEY = "causa-ee5ee31dcfc79da4"
const API_BASE = "https://rest.apicausas.xyz/api/v1/descargas/youtube"
const newsletterJid = '120363401893800327@newsletter'
const newsletterName = '⸙ְ̻࠭ꪆ👑 mᥲríᥲ k᥆ȷᥙ᥆ 𖥔 Sᥱrvice'
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/
const MAX_AUDIO = 16 * 1024 * 1024
const MAX_VIDEO = 64 * 1024 * 1024

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  const name = conn.getName(m.sender)

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: { newsletterJid, newsletterName, serverMessageId: -1 },
    externalAdReply: {
      title: '🖤 ⏤͟͟͞͞mᥲríᥲ k᥆ȷᥙ᥆ ᨶ႒ᩚ',
      body: `✦ 𝙀𝙨𝙥𝙚𝙧𝙖𝙣𝙙𝙤 𝙩𝙪 𝙨𝙤𝙡𝙞𝙘𝙞𝙩𝙪𝙙, ${name}. ♡~٩( ˃▽˂ )۶~♡`,
      thumbnail: null,
      sourceUrl: null,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }

  if (!text?.trim()) {
    return conn.reply(m.chat, `🪽 *¿᥎іᥒіs𝗍ᥱ ᥲ ⍴ᥱძіrmᥱ ᥲᥣg᥆ sіᥒ sᥲᑲᥱr 𝗊ᥙᥱ́?*\n🎧 ᥱȷᥱm⍴ᥣ᥆:\n${usedPrefix}${command} moonlight - kali uchis`, m, { contextInfo })
  }

  const mode = args[0]?.toLowerCase()
  const isMode = ["audio", "video"].includes(mode)
  const queryOrUrl = isMode ? args.slice(1).join(" ") : text
  const isUrl = youtubeRegexID.test(queryOrUrl)

  // --- MODO DESCARGA (viene del botón) ---
  if (isMode && isUrl) {
    await m.react("⏳")
    try {
      const videoId = queryOrUrl.match(youtubeRegexID)?.[1]
      const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`
      const apiUrl = `${API_BASE}?url=${encodeURIComponent(cleanUrl)}&type=${mode}&apikey=${API_KEY}`

      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json?.status || !json?.data?.download?.url) {
        throw new Error(json?.msg || "Sin URL de descarga")
      }

      const dlUrl = json.data.download.url
      const title = json.data.title || "descarga"

      let fileSize = 0
      try {
        const head = await fetch(dlUrl, { method: 'HEAD' })
        fileSize = parseInt(head.headers.get('content-length') || '0')
      } catch (_) {}

      if (mode === 'audio') {
        const supera = fileSize > MAX_AUDIO
        await conn.sendMessage(m.chat, supera
          ? { document: { url: dlUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg" }
          : { audio: { url: dlUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", ptt: false }
        , { quoted: m })
      } else {
        const supera = fileSize > MAX_VIDEO
        await conn.sendMessage(m.chat, supera
          ? { document: { url: dlUrl }, fileName: `${title}.mp4`, mimetype: "video/mp4" }
          : { video: { url: dlUrl }, fileName: `${title}.mp4`, mimetype: "video/mp4", caption: `🎬 *${title}*` }
        , { quoted: m })
      }

      await m.react("✅")
    } catch (e) {
      await m.react("❌")
      return conn.reply(m.chat, `💔 *Error al procesar:* ${e.message}`, m)
    }
    return
  }

  // --- BÚSQUEDA INICIAL ---
  await m.react("🔍")
  let video
  try {
    const match = text.match(youtubeRegexID)
    if (match) {
      const s = await yts({ videoId: match[1] })
      video = s.all?.[0] || s
    } else {
      const s = await yts(text)
      video = s.videos[0]
    }
  } catch (e) {
    await m.react("❌")
    return conn.reply(m.chat, `❌ No encontré nada con: "${text}"`, m, { contextInfo })
  }

  if (!video) return conn.reply(m.chat, `❌ No se encontraron resultados.`, m, { contextInfo })

  let thumbBuffer = null
  try {
    const thumbData = await conn.getFile(video.thumbnail)
    thumbBuffer = thumbData?.data
  } catch (_) {}

  contextInfo.externalAdReply.thumbnail = thumbBuffer
  contextInfo.externalAdReply.mediaUrl = video.url
  contextInfo.externalAdReply.sourceUrl = video.url

  const buttons = [
    { buttonId: `${usedPrefix}${command} audio ${video.url}`, buttonText: { displayText: '🎧 𝘼𝙐𝘿𝙄𝙊' }, type: 1 },
    { buttonId: `${usedPrefix}${command} video ${video.url}`, buttonText: { displayText: '🎬 𝙑𝙄𝘿𝙀𝙊' }, type: 1 }
  ]

  const caption = `> ૢ⃘꒰🎧⃝ *Título:* ${video.title}\n> ૢ⃘꒰⏱️⃝ *Duración:* ${video.timestamp}\n> ૢ⃘꒰👤⃝ *Canal:* ${video.author?.name || 'Desconocido'}\n> ૢ⃘꒰🔗⃝ *URL:* ${video.url}`

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    footer: 'Selecciona el formato deseado.',
    buttons,
    contextInfo
  }, { quoted: m })
  await m.react("🎵")
}

handler.command = ['play']
handler.register = true

export default handler