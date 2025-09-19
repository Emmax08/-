/* © nevi-dev */

import fs from 'fs';
import path from 'path';

var handler = async (m, { conn, text, command }) => {
    // 1. Validar que se ha respondido a un mensaje.
    if (!m.quoted) {
        return conn.reply(m.chat, '❌ *Por favor, responde a un mensaje para reenviarlo.*', m);
    }
    
    // 2. Determinar el número de reenvíos. Si no se da un número, el valor predeterminado es 5.
    const numberOfTimes = text ? parseInt(text.trim()) : 5;

    // 3. Validar que el número es un entero positivo.
    if (isNaN(numberOfTimes) || numberOfTimes <= 0) {
        return conn.reply(m.chat, '⚠️ *El número de veces debe ser un número válido y mayor que cero.*', m);
    }

    // 4. Bucle para reenviar el mensaje.
    for (let i = 0; i < numberOfTimes; i++) {
        try {
            // Intenta reenviar el mensaje directamente.
            await conn.copyNForward(m.chat, m.quoted, false);
        } catch (e) {
            console.error('Error al reenviar con copyNForward, intentando con download:', e);
            
            // Si copyNForward falla, intenta descargar y reenviar el contenido.
            let media;
            try {
                // Descargar el contenido del mensaje (imagen, video, etc.).
                media = await m.quoted.download();
                if (media) {
                    // Enviar el contenido del archivo.
                    await conn.sendFile(m.chat, media, '', '', m);
                } else {
                    await conn.reply(m.chat, '❌ *No se pudo reenviar el mensaje. El archivo no es válido.*', m);
                }
            } catch (downloadError) {
                console.error('Error al descargar el archivo:', downloadError);
                await conn.reply(m.chat, '❌ *Ocurrió un error al intentar procesar y reenviar el mensaje.*', m);
            }
        }
    }

    // 5. Enviar un mensaje de confirmación.
    conn.reply(m.chat, `✅ *¡Mensaje reenviado ${numberOfTimes} veces!*`, m);
};

handler.help = ['repeat <número>'];
handler.tags = ['owner'];
handler.command = ['repeat', 'spam'];
handler.rowner = true;

export default handler;
