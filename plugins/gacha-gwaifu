import { promises as fs } from 'fs'

const gCharacterPath = './src/database/gcharacter.json'
const cooldowns = {}

async function loadData() {
    try {
        const data = await fs.readFile(gCharacterPath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('❀ Error al leer gcharacter.json')
    }
}

async function saveData(data) {
    try {
        await fs.writeFile(gCharacterPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ Error al guardar cambios')
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    // Cooldown de 15 minutos
    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, `( ⸝⸝･̆⤚･̆⸝⸝) ¡𝗗𝗲𝗯𝗲𝘀 𝗲𝘀𝗽𝗲𝗿𝗮𝗿 *${minutes}m y ${seconds}s* 𝗽𝗮𝗿𝗮 𝘃𝗼𝗹𝘃𝗲𝗿 𝗮 𝗴𝗶𝗿𝗮𝗿 𝗹𝗮 𝗿𝘂𝗹𝗲𝘁𝗮!`, m)
    }

    try {
        let allCharacters = await loadData()
        
        // Selección aleatoria
        const randomIndex = Math.floor(Math.random() * allCharacters.length)
        const character = allCharacters[randomIndex]
        
        // Elegir imagen aleatoria del array 'img'
        const randomImage = character.img[Math.floor(Math.random() * character.img.length)]

        // Manejo de dueños múltiples (usando un nuevo campo 'owners' para no romper tu 'user')
        if (!character.owners) character.owners = []

        const alreadyHas = character.owners.includes(userId)
        let statusMessage = ''

        if (!alreadyHas) {
            character.owners.push(userId)
            // Opcional: Actualizamos el status visual
            character.status = 'Reclamado' 
            await saveData(allCharacters)
            statusMessage = '✨ ¡𝗡𝘂𝗲𝘃𝗼 𝗲𝗻 𝘁𝘂 𝗰𝗼𝗹𝗲𝗰𝗰𝗶𝗼́𝗻!'
        } else {
            statusMessage = '✅ 𝗬𝗮 𝗹𝗼 𝗽𝗼𝘀𝗲𝗲𝘀'
        }

        const message = `╔◡❦︎┅•.⊹☾︎︵ࣾ᷼ ׁ𖥓┅╲۪ ⦙᷼͝🌺⦙ ׅ╱ׅ╍𖥓 ︵ࣾ᷼︵ׄׄ᷼☽︎⊹◡╗
┋  ⣿̶ֻ〪ׅ⃕݊⃧🌈⃚̶̸͝ᤢ֠◌ִ̲  𝑮𝑨𝑪𝑯𝑨 𝑾𝑯𝑬𝑬𝑳 🎡  ┋
╚◠༒︎┅˙•⊹.⁀𖥓 ׅ╍╲۪ ⦙᷼͝🦋᷼͝⦙ ׅ╱ׅ╍𖥓 ◠˙⁀۪ׄ⊹𓆉︎˙◠╝
꥓໋╭࣭۬═ֽ̥࣪━᜔๋݈☾︎❦︎︵ິּ֙᷼⌒݈᳹᪾̯ ⋮꥓ּ࣭ׄ🪷〪ິ᜔໋࣭⋮⌒ໍּ֣ׄ═ᮣໍ࣭ׄ━𑂺᜔໋ت︎♥︎━᜔࣭֙━๋݈═̥࣭۬╮
> ఌ︎✿:  𝑁𝑂𝑀𝐵𝑅𝐸: *${character.name.toUpperCase()}*
> ఌ︎✿:  𝐺𝐸𝑁𝐸𝑅𝑂: *${character.gender}*
> ఌ︎✿:  𝑉𝐴𝐿𝑂𝑅: *${character.value}* 🪙
> ఌ︎✿:  𝙀𝘚𝘛𝘈𝘿𝙊: *${statusMessage}*
> ఌ︎✿:  𝐹𝑈𝐸𝑁𝑇𝐸: *${character.source}*
> ఌ︎✿:  𝙄𝘿: *${character.id}*
> ఌ︎✿:  👥 𝘿𝙐𝙀𝙉̃𝙊𝙎: ${character.owners.length}
꥓໋╰ׅ۬═ֽ̥࣪🝮︎︎︎︎︎︎︎𓁹═𑂺ׄ︵ິּ֙᷼⌒݈᳹᪾̯ ⋮꥓ּ࣭ׄ🌸⋮⌒ໍּ֣ׄ═ᮣໍ࣭ׄ━𑂺᜔꥓໋┉꥓᷼シ︎━๋݈═̥࣭۬╯`

        await conn.sendFile(m.chat, randomImage, `gacha.jpg`, message, m)

        cooldowns[userId] = now + 15 * 60 * 1000

    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, `✘ Error en la ruleta: ${error.message}`, m)
    }
}

handler.help = ['gw']
handler.tags = ['gacha']
handler.command = ['gw']
handler.group = true

export default handler
