import fs from 'fs'
import path from 'path'

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🔍') 
        conn.sendPresenceUpdate('composing', m.chat)

        const pluginsDir = './plugins'

        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))

        let response = `✨ *Detección de Errores - María Kujou* ✨\n\n`
        response += `🎀 Revisando ${files.length} archivos...\n`
        response += `━━━━━━━━━━━━━━━━━━━\n\n`
        
        let hasErrors = false
        let errorCount = 0

        for (const file of files) {
            try {
                await import(path.resolve(pluginsDir, file))
            } catch (error) {
                hasErrors = true
                errorCount++
                const stackLines = error.stack.split('\n')

                const errorLineMatch = stackLines[0].match(/:(\d+):\d+/) 
                const errorLine = errorLineMatch ? errorLineMatch[1] : 'Desconocido'

                response += `💔 *Error encontrado* (◕︿◕✿)\n\n`
                response += `📁 *Archivo:* \`${file}\`\n`
                response += `📝 *Mensaje:* ${error.message}\n`
                response += `📍 *Línea:* ${errorLine}\n`
                response += `━━━━━━━━━━━━━━━━━━━\n\n`
            }
        }

        if (!hasErrors) {
            response += `🌸 *¡Todo perfecto, onii-chan!* (｡♥‿♥｡)\n\n`
            response += `✨ No se detectaron errores de sintaxis\n`
            response += `💖 Todos los ${files.length} archivos están funcionando correctamente\n`
            response += `🎀 ¡Arigatou gozaimasu! ヾ(≧▽≦*)o`
        } else {
            response += `😢 *Resumen de errores:*\n\n`
            response += `❌ Total de errores: ${errorCount}\n`
            response += `📂 Archivos revisados: ${files.length}\n`
            response += `💭 Por favor, revisa los archivos mencionados (つω`･)\n`
            response += `✨ ¡Ganbatte kudasai! ｡◕‿◕｡`
        }

        await conn.reply(m.chat, response, m)
        await m.react(hasErrors ? '💔' : '💖')
    } catch (err) {
        await m.react('😭') 
        await conn.reply(m.chat, `😢 *¡Oh no!* (´；ω；｀)\n\n❌ Ocurrió un error inesperado:\n\`\`\`${err.message}\`\`\`\n\n💭 *Gomen nasai, onii-chan...*`, m)
    }
}

handler.command = ['detectarsyntax', 'detectar', 'checksyntax']
handler.help = ['detectarsyntax']
handler.tags = ['tools']
handler.rowner = true

export default handler