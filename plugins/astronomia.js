import { Body, Equator, Horizon, Observer } from 'astronomy-engine';

// Configuración para CDMX
const observer = new Observer(19.4326, -99.1332, 2240);

let handler = async (m, { conn, text, command }) => {
    if (!text) return conn.reply(m.chat, `*¿Qué astro buscamos?*\nEjemplo: .${command} Jupiter`, m);

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

    const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const targetBody = bodies[query];

    if (targetBody !== undefined) {
        try {
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
        } catch (e) {
            console.log(e);
            conn.reply(m.chat, '❌ Error al calcular la posición astronómica.', m);
        }
    } else {
        conn.reply(m.chat, `No encontré datos para "${text}". Prueba con: Sol, Luna, Marte, Jupiter, etc.`, m);
    }
};

handler.help = ['estrella <nombre>'];
handler.tags = ['tools'];
handler.command = /^(estrella|estrellas|astro)$/i;

// --- ESTO ES LO QUE ARREGLA EL ERROR DE UNDEFINED ---
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

export default handler;
