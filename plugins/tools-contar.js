let contador = new Map();

export async function before(m, { isGroup }) {
  if (!isGroup) return false;

  const chatId = m.chat;

  // Si el contador está activo para este chat, incrementa el total.
  if (contador.has(chatId)) {
    let currentCount = contador.get(chatId).count;
    contador.set(chatId, { count: currentCount + 1 });
  }

  return true;
}

let handler = async (m, { conn, args }) => {
  if (!args || args.length === 0) {
    return m.reply('❌ Debes especificar si quieres activar (on) o desactivar (off) el conteo. Ejemplo: !contar on');
  }

  let estado = args[0].toLowerCase();
  let chatId = m.chat;

  if (estado === 'on') {
    if (contador.has(chatId)) {
      return m.reply('✅ El conteo ya está activado en este chat.');
    }
    contador.set(chatId, { count: 0 });
    m.reply('✅ Conteo de mensajes activado. ¡Empezaré a registrar los mensajes!');
  } else if (estado === 'off') {
    if (!contador.has(chatId)) {
      return m.reply('❌ El conteo no está activado en este chat.');
    }
    let totalMensajes = contador.get(chatId).count;
    contador.delete(chatId);
    m.reply(`✅ Conteo de mensajes desactivado. Se enviaron ${totalMensajes} mensajes en este chat.`);
  } else {
    m.reply('❌ Opción inválida. Usa "on" para activar o "off" para desactivar.');
  }
};

handler.help = ['contar'];
handler.tags = ['owner'];
handler.command = ['contar'];
handler.rowner = true;

export default handler;
