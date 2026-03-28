import { promises as fs } from 'fs'
const gCharacterPath = './src/database/gcharacter.json'

// Variables en memoria para la rotación
let shopItems = []
let lastUpdate = 0

let handler = async (m, { conn, command, text }) => {
    const userId = m.sender
    const now = Date.now()
    const interval = 3 * 60 * 60 * 1000 // 3 horas exactas

    let allCharacters = JSON.parse(await fs.readFile(gCharacterPath, 'utf-8'))

    // Lógica de rotación: si pasaron 3 horas, elegimos 10 nuevos
    if (now - lastUpdate > interval || shopItems.length === 0) {
        // Mezclar y tomar 10
        shopItems = [...allCharacters].sort(() => 0.5 - Math.random()).slice(0, 10)
        lastUpdate = now
    }

    // --- SUB-COMANDO: COMPRAR ---
    if (command === 'buyg') {
        let index = parseInt(text) - 1
        if (isNaN(index) || index < 0 || index >= shopItems.length) {
            return m.reply('✘ Indica un número del 1 al 10. Ejemplo: *.buyg 5*')
        }

        let selected = shopItems[index]
        let user = global.db.data.users[userId]
        let price = parseInt(selected.value)

        if (!user) return m.reply('✘ No se encontró tu perfil de usuario.')
        if ((user.money || 0) < price) return m.reply(`✘ No tienes suficientes 🪙. Cuesta: ${price}`)

        // Buscar el personaje real en la base de datos completa
        let dbIndex = allCharacters.findIndex(c => c.id === selected.id)
        if (!allCharacters[dbIndex].owners) allCharacters[dbIndex].owners = []

        if (allCharacters[dbIndex].owners.includes(userId)) {
            return m.reply('✅ Ya tienes a este personaje en tu colección.')
        }

        // Procesar compra
        user.money -= price
        allCharacters[dbIndex].owners.push(userId)
        await fs.writeFile(gCharacterPath, JSON.stringify(allCharacters, null, 2))

        return conn.reply(m.chat, `✨ ¡Has comprado a *${selected.name.toUpperCase()}* por ${price} 🪙!`, m)
    }

    // --- MOSTRAR TIENDA ---
    const timeLeft = interval - (now - lastUpdate)
    const h = Math.floor(timeLeft / (1000 * 60 * 60))
    const m_time = Math.floor((timeLeft / (1000 * 60)) % 60)

    let caption = `╔◡❦︎┅•.⊹☾︎ 🌀 *𝑮-𝑺𝑯𝑶𝑷 𝑶𝑭𝑭𝑬𝑹𝑺* 🌀 ☽︎⊹◡╗\n`
    caption += `┋ ⏳ Próxima rotación en: *${h}h ${m_time}m*\n`
    caption += `╚◠༒︎┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅༒︎◠╝\n\n`

    shopItems.forEach((c, i) => {
        caption += `*${i + 1}.* ${c.name.toUpperCase()}\n`
        caption += `> 💰 Precio: ${c.value} 🪙 | ID: ${c.id}\n`
        caption += `> 📂 Fuente: ${c.source}\n\n`
    })

    caption += `🛒 Usa *.buyg [número]* para comprar.`
    
    await conn.reply(m.chat, caption, m)
}

handler.help = ['gshop', 'buyg']
handler.tags = ['gacha']
handler.command = ['gshop', 'buyg']
handler.group = true

export default handler
