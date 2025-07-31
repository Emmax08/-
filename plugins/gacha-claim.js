import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const cooldowns = {};

async function loadCharacters() {
    const data = await fs.readFile(charactersFilePath, 'utf-8');
    return JSON.parse(data);
}

async function saveCharacters(characters) {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const now = Date.now();

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return conn.reply(m.chat, `《✧》Debes esperar *${minutes} minutos y ${seconds} segundos* para usar *#c* de nuevo.`, m);
    }

    if (m.quoted && m.quoted.sender === conn.user.jid) {
        try {
            let characters = await loadCharacters();
            const characterIdMatch = m.quoted.text.match(/✦ ID: \*(.+?)\*/);

            if (!characterIdMatch) {
                return conn.reply(m.chat, '《✧》No se pudo encontrar el ID del personaje en el mensaje citado.', m);
            }

            const characterId = characterIdMatch[1];
            const character = characters.find(c => c.id === characterId);

            if (!character) {
                return conn.reply(m.chat, '《✧》El mensaje citado no es un personaje válido.', m);
            }

            if (character.user && character.user !== userId) {
                return conn.reply(m.chat, `《✧》El personaje ya ha sido reclamado por @${character.user.split('@')[0]}, inténtalo a la próxima :v.`, m, { mentions: [character.user] });
            }

            character.user = userId;
            character.status = "Reclamado";

            await saveCharacters(characters);

            await conn.reply(m.chat, `✦ Has reclamado a *${character.name}* con éxito.`, m);
            cooldowns[userId] = now + 30 * 60 * 1000;

        } catch (error) {
            return conn.reply(m.chat, `✘ Error al reclamar el personaje: ${error.message}`, m);
        }
    } else {
        return conn.reply(m.chat, '《✧》Debes citar un personaje válido para reclamar.', m);
    }
};

handler.help = ['claim'];
handler.tags = ['gacha'];
handler.command = ['c', 'claim', 'reclamar'];
handler.group = true;

export default handler;
