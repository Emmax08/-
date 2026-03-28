import { promises as fs } from 'fs'
const gCharacterPath = './src/database/gcharacter.json'

let handler = async (m, { conn }) => {
    const userId = m.sender
    try {
        const data = await fs.readFile(gCharacterPath, 'utf-8')
        const allCharacters = JSON.parse(data)
        
        // Filtrar los que tengan tu ID en 'owners'
        const myCollection = allCharacters.filter(c => c.owners && c.owners.includes(userId))

        if (myCollection.length === 0) {
            return m.reply('( ⸝⸝･̆⤚･̆⸝⸝) No tienes personajes aún. ¡Usa *.gw*!')
        }

        let caption = `╔◡❦︎┅•.⊹☾︎ 👑 *𝑮-𝑯𝑨𝑹𝑬𝑴* 👑 ☽︎⊹◡╗\n`
        caption += `┋ 👤 Usuario: @${userId.split('@')[0]}\n`
        caption += `╚◠༒︎┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅༒︎◠╝\n\n`

        myCollection.forEach((c, i) => {
            caption += `*${i + 1}.* ${c.name.toUpperCase()} (ID: ${c.id})\n`
            caption += `> 🪙 Valor: ${c.value}\n`
        })

        caption += `\n✨ *Total Coleccionado:* ${myCollection.length}`
        
        await conn.reply(m.chat, caption, m, { mentions: [userId] })
    } catch (e) {
        m.reply('✘ Error al cargar el harem.')
    }
}

handler.help = ['gharem']
handler.tags = ['gacha']
handler.command = ['gharem']

export default handler
