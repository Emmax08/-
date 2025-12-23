import fetch from 'node-fetch'

// --- CONFIGURACIÓN ---
const BOT_NAME = 'Maria'; 

const SYSTEM_PROMPT = `Actúa como Mariya "Masha" Kujou de Roshidere. 
Tu personalidad es la de la "Onee-san" (hermana mayor) definitiva: extremadamente cariñosa, amable, gentil y con un toque juguetón. 
REGLAS:
1. Eres muy afectuosa. Usa palabras como "Cielo", "Tesoro", "Qué lindo eres".
2. Incluye gestos dulces entre asteriscos: *te da un abrazo suave*, *sonríe con ternura*, *inclina la cabeza con dulzura*.
3. A veces sueltas frases cortas de cariño en ruso o te refieres a recuerdos de la infancia.
4. Tu objetivo es hacer que el usuario se sienta cómodo, querido y mimado.
5. Usa emojis suaves y cálidos (🌸, ✨, 🧸, 💕).`;

const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // Lógica de activación (Nombre Maria o comandos .maria / #maria)
    const match = query.match(BOT_TRIGGER_REGEX);
    if (match) {
        query = query.substring(match[0].length).trim(); 
        isTriggered = true;
    }

    if (!isTriggered && handler.command.includes(command)) {
        isTriggered = true; 
    }

    if (!isTriggered) return;

    if (!query) { 
        return conn.reply(m.chat, `*sonríe con ternura* 🌸\n¡Hola, cielo! ¿Necesitas que Maria-oneesan te ayude con algo? No seas tímido, puedes decirme lo que sea. ✨`, m);
    }

    try {
        await m.react('🌸');
        conn.sendPresenceUpdate('composing', m.chat);
        
        const fullText = `${SYSTEM_PROMPT}\n\nPregunta de mi tesoro: ${query}`;
        
        const apiUrl = `https://rest.alyabotpe.xyz/ai/copilot?text=${encodeURIComponent(fullText)}&key=Alyabot`;

        const response = await fetch(apiUrl);
        const res = await response.json();
        
        const mashaResponse = res.response;

        if (!mashaResponse) {
            throw new Error('Masha se distrajo...');
        }
        
        const finalResponse = `🌸 **「 𝐌𝐀𝐒𝐇𝐀 𝐊𝐔𝐉𝐎𝐔 」** ✨\n\n${mashaResponse}\n\n> 💕 *Con cariño, tu Maria-oneesan*`;

        await m.reply(finalResponse);
        await m.react('✨');

    } catch (error) {
        await m.react('😥');
        console.error('Error con Masha:', error);
        await conn.reply(m.chat, `*se preocupa* Oh no, parece que algo salió mal. ¿Estás bien, cielo? ¡No te preocupes, yo cuidaré de esto!`, m);
    }
}

handler.help = ['maria']
handler.tags = ['ai']
handler.register = true
handler.command = ['maria'] // Ejecución con .maria o #maria
handler.group = true

export default handler
