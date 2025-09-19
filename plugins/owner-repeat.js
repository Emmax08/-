
var handler = async (m, { conn, text, command }) => {
    // Si no hay un mensaje al que responder, detiene la ejecución.
    if (!m.quoted) {
        return conn.reply(m.chat, '❌ *Por favor, responde a un mensaje para reenviarlo.*', m);
    }
    
    // Si el mensaje al que se respondió no tiene un ID válido, detiene la ejecución.
    // Esto evita el error "TypeError".
    if (!m.quoted.id) {
        return conn.reply(m.chat, '❌ *El mensaje al que respondiste no es válido. Puede que haya sido eliminado.*', m);
    }
    
    // Si no se especifica un número, se reenvía 5 veces por defecto.
    const numberOfTimes = text ? parseInt(text.trim()) : 5;

    // Si el número no es válido, notifica al usuario.
    if (isNaN(numberOfTimes) || numberOfTimes <= 0) {
        return conn.reply(m.chat, '⚠️ *El número de veces debe ser un número válido y mayor que cero.*', m);
    }

    // Reenvía el mensaje el número de veces especificado.
    for (let i = 0; i < numberOfTimes; i++) {
        await conn.copyNForward(m.chat, m.quoted, false);
    }

    // Envía una confirmación al usuario.
    conn.reply(m.chat, `✅ *¡Mensaje reenviado ${numberOfTimes} veces!*`, m);
};

handler.help = ['repeat <número>'];
handler.tags = ['owner'];
handler.command = ['repeat', 'spam'];
handler.rowner = true; // Solo el owner del bot puede usar este comando.

export default handler;
