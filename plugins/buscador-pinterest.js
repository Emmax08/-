import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`⚠️ El JID debe ser un texto válido.`);
  if (medias.length < 2) throw new RangeError("⚠️ Se requieren al menos dos imágenes para crear un álbum.");

  for (const media of medias) {
    if (!['image', 'video'].includes(media.type))
      throw new TypeError(`❌ Tipo inválido: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
      throw new TypeError(`⚠️ Los datos de la imagen o video no son válidos.`);
  }

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message,
              },
            }
          : {}),
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
    await baileys.delay(delay);
  }

  return album;
}

const pins = async (query) => {
  try {
    const res = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=${encodeURIComponent(query)}`);
    if (Array.isArray(res.data.images)) {
      return res.data.images.map(url => ({
        image_large_url: url,
        image_medium_url: url,
        image_small_url: url
      }));
    }
    return [];
  } catch (err) {
    console.error('💥 Error al obtener resultados de Pinterest:', err);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  const dev = 'Emmax 🌸';
  const botname = 'MashaBot ✨';

  if (!text) {
    return conn.reply(
      m.chat,
      `📌 *Uso correcto:*\nEscribe el término que deseas buscar.\n\n✨ *Ejemplo:* .pinterest anime girl`,
      m
    );
  }

  try {
    await m.react('🔍');
    const results = await pins(text);
    if (!results.length)
      return conn.reply(m.chat, `❌ No se encontraron resultados para *${text}*. Intenta con otro término.`, m);

    const max = Math.min(results.length, 15);
    const medias = [];

    for (let i = 0; i < max; i++) {
      medias.push({
        type: 'image',
        data: {
          url: results[i].image_large_url || results[i].image_medium_url || results[i].image_small_url
        }
      });
    }

    await sendAlbumMessage(m.chat, medias, {
      caption: `🌸 *Masha Kujou* te trae los resultados:\n\n📌 *Búsqueda:* ${text}\n🖼️ *Resultados:* ${max}\n👤 *Creador:* ${dev}`,
      quoted: m
    });

    await conn.sendMessage(m.chat, { react: { text: '🌺', key: m.key } });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '⚠️ Ocurrió un error al procesar la búsqueda en Pinterest.', m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['buscador'];
handler.register = true;

export default handler;
