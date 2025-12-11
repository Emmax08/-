Let handler = async (m, { conn, usedPrefix, command }) => {

    try {
        m.reply('「❀」 Reiniciando El Bot....')
        setTimeout(() => {
            process.exit(0)
        }, 3000) 
    } catch (error) {
        console.log(error)
        conn.reply(m.chat, `${error}`, m)
    }
}

// Manteniendo las propiedades esenciales para que el bot lo cargue y ejecute
handler.command = ['restart', 'reiniciar', 'res', 'resat'] 
handler.rowner = true // Se mantiene la restricción de dueño

export default handler
