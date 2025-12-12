import axios from 'axios';
// Importamos 'fetch' ya que la API de Dorratz usa un método GET simple (como en el primer código).
// Si quieres usar axios para TODO, puedes hacerlo, pero por coherencia con el primer código, usaré 'fetch'.
import fetch from 'node-fetch'; 
import baileys from '@whiskeysockets/baileys';

// --- CONFIGURACIÓN DE LA API DE NEVI (Originalmente aquí, ahora solo se usa para pinsDorratz) ---
// La API de Dorratz no requiere clave.
// ------------------------------------------------------------------------------------------------

// La función 'generateWAMessage' se importa desde el paquete principal, 
const { generateWAMessageFromContent, generateWAMessage, delay } = baileys;

// --- FUNCIONES AUXILIARES (sendAlbumMessage se mantiene, recibe conn) ---

async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`⚠️ El JID debe ser un texto válido.`);
  if (medias.length < 2) throw new RangeError("⚠️ Se requieren al menos dos imágenes para crear un álbum.");

  for (const media of medias) {
    if (!['image', 'video'].includes(media.type))
      throw new TypeError(`❌ Tipo inválido: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
      throw new TypeError(`⚠️ Los datos de la imagen o video no son válidos.`);
  }

  const caption = options.text || options.caption || "";
  const albumDelay = !isNaN(options.delay) ? options.delay : 500; 
  
  // Capturamos la cita para el mensaje padre
  const quotedMessageOptions = options.quoted
    ? {
          contextInfo: {
            remoteJid: options.quoted.key.remoteJid,
            fromMe: options.quoted.key.fromMe,
            stanzaId: options.quoted.key.id,
            participant: options.quoted.key.participant || options.quoted.key.remoteJid,
            quotedMessage: options.quoted.message,
          },
        }
    : {};

  // Creación del mensaje padre del álbum (contenedor)
  const album = generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...quotedMessageOptions,
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  // Envío de los mensajes individuales asociados al álbum
  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias
