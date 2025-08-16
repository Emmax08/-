import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo harem.json.')
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(
            m.chat, 
            `⏳ Debes esperar *${minutes}m ${seconds}s* antes de volver a usar *#rw* ✦`, 
            m
        )
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)

        const statusMessage = randomCharacter.user 
            ? `👤 Reclamado por @${randomCharacter.user.split('@')[0]}`
            : '💫 Libre'

        const message = 
`╭─❖ ✦ 𝐑𝐨𝐥𝐥 𝐆𝐚𝐜𝐡𝐚 ✦ ❖─╮
┃ ✿ 𝑵𝒐𝒎𝒃𝒓𝒆: *${randomCharacter.name}*
┃ ⚤ 𝑮é𝒏𝒆𝒓𝒐: *${randomCharacter.gender}*
┃ ✰ 𝑽𝒂𝒍𝒐𝒓: *${randomCharacter.value}*
┃ ♡ 𝑬𝒔𝒕𝒂𝒅𝒐: ${statusMessage}
┃ ❖ 𝑭𝒖𝒆𝒏𝒕𝒆: *${randomCharacter.source}*
┃ ✦ 𝑰𝑫: *${randomCharacter.id}*
╰─❖ ✦ ✦ ✦ ❖─╯`

        const mentions = userEntry ? [userEntry.userId] : []
        await conn.sendFile(
            m.chat, 
            randomImage, 
            `${randomCharacter.name}.jpg`, 
            message, 
            m, 
            { mentions }
        )

        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        cooldowns[userId] = now + 15 * 60 * 1000 // 15 minutos cooldown

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar el personaje: ${error.message}`, m)
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler