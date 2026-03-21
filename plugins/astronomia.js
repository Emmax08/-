import { Body, Equator, Horizon, Observer } from 'astronomy-engine';

// Configuración para CDMX (puedes ajustarla)
const observer = new Observer(19.4326, -99.1332, 2240);

let handler = async (m, { conn, text, command }) => {
    if (!text) throw `*¿Qué astro buscamos?*\nEjemplo: .${command} Jupiter`;

    const bodies = {
        'sol': Body.Sun,
        'luna': Body.Moon,
        'mercurio': Body.Mercury,
        'venus': Body.Venus,
        'marte': Body.Mars,
        'jupiter': Body.Jupiter,
        'saturno': Body.Saturn,
        'urano': Body.Uranus,
        'neptuno': Body.Neptune,
        'pluton': Body.Pluto
    };

    // Limpiar el texto (quitar acentos y espacios)
    const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const targetBody = bodies[query];

    if (targetBody !== undefined) {
        const date = new Date();
        const equ_2000 = Equator(targetBody, date, observer);
        const hor = Horizon(date, observer, equ_2000.ra, equ_2000.dec, 'Refraction');

        const estado = hor.alt > 0 ? '✅ Visible en el cielo' : '❌ Bajo el horizonte';
        
        const txt = `✨ *EXPLORADOR ESTELAR* ✨\n\n` +
                    `🔎 *Cuerpo:* ${text.toUpperCase()}\n` +
                    `🛰️ *Azimut:* ${hor.az.toFixed(2)}°\n` +
                    `📐 *Altitud:* ${hor.alt.toFixed(2)}°\n\n` +
                    `📍 *Estado:* ${estado}\n` +
                    `⏰ *Hora:* ${date.toLocaleTimeString('es-MX')}`;

        await conn.reply(m.chat, txt, m);
    } else {
        throw `No encontré datos para "${text}". Prueba con: Sol, Luna, Marte, Jupiter, etc.`;
    }
};

handler.help = ['estrella <nombre>'];
handler.tags = ['tools'];
handler.command = /^(estrella|estrellas|astro)$/i;

export default handler;
