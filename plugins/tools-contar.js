let handler = async (m, { conn, args }) => {
    const chatId = m.chat;
    const chatData = global.db.data.chats[chatId];
    
    // Si no se encuentra el chat, es probable que no esté en la base de datos.
    if (!chatData) {
        return m.reply('❌ No se encontraron datos para este chat. Si es un grupo nuevo, envía un mensaje primero para que se registre.');
    }

    if (!args || args.length === 0) {
        return m.reply('❌ Debes especificar si quieres activar (on) o desactivar (off) el conteo. Ejemplo: !contar on');
    }

    let estado = args[0].toLowerCase();

    if (estado === 'on') {
        if (chatData.contar.estado) {
            return m.reply('✅ El conteo ya está activado en este chat.');
        }
        chatData.contar.estado = true;
        chatData.contar.mensajes = 0; // Reinicia el conteo al activar
        m.reply('✅ Conteo de mensajes activado. ¡Empezaré a registrar los mensajes!');
    } else if (estado === 'off') {
        if (!chatData.contar.estado) {
            return m.reply('❌ El conteo no está activado en este chat.');
        }
        chatData.contar.estado = false;
        let totalMensajes = chatData.contar.mensajes;
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
