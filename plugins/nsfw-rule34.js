import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        return m.reply(`🔞 El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con el comando » *${usedPrefix}nsfw on*`)
    }
    if (!args[0]) {
        return m.reply(`❌ Por favor, ingresa un tag para realizar la búsqueda.\nEjemplo: *${usedPrefix}r34 naruto*`)
    }

    const tag = args[0]
    const url = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tag)}`

    try {
        const response = await fetch(url)
        const text = await response.text()

        const $ = cheerio.load(text, { xmlMode: true })
        const posts = $("post")

        if (posts.length === 0) {
            return m.reply(`😿 No encontré resultados para *${tag}*`)
        }

        const randomIndex = Math.floor(Math.random() * posts.length)
        const randomPost = posts.eq(randomIndex)

        const imageUrl = randomPost.attr("file_url")

        if (!imageUrl) {
            return m.reply(`⚠️ No pude obtener la imagen, puede que el post esté dañado.`)
        }

        await conn.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: `🔎 Resultados para » *${tag}*`,
            mentions: [m.sender]
        })
    } catch (error) {
        console.error("Error en r34:", error)
        await m.reply(`🚨 Ocurrió un error en la búsqueda:\n> *${error.message}*`)
    }
}

handler.help = ['r34 <tag>', 'rule34 <tag>']
handler.command = ['r34', 'rule34']
handler.tags = ['nsfw']

export default handler
