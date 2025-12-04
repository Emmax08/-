let handler = async (m, { conn, args, usedPrefix, command }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono) 

// La lógica ahora mapea el comando usado (e.g., 'open', 'close') 
// en lugar de un argumento (e.g., args[0]).
let isClose = {
    'open': 'not_announcement',  // Abierto (todos pueden escribir)
    'abrir': 'not_announcement', 
    'close': 'announcement',     // Cerrado (solo admins pueden escribir)
    'cerrar': 'announcement',
}[command] 

// Como el comando define la acción, ya no es necesario el chequeo de 'isClose === undefined'
// ni el mensaje de uso incorrecto, ya que solo se ejecuta con los comandos definidos.

await conn.groupSettingUpdate(m.chat, isClose)

if (isClose === 'not_announcement'){
    // Mensaje para cuando se abre
    m.reply(`${emoji} *El grupo ha sido abierto. Ya pueden escribir todos los miembros.*`)
}

if (isClose === 'announcement'){
    // Mensaje para cuando se cierra
    m.reply(`${emoji2} *El grupo ha sido cerrado. Solos los admins pueden escribir.*`)
}}

// Se actualizan las propiedades del handler para usar los nuevos comandos
handler.help = ['open', 'close', 'abrir', 'cerrar']
handler.tags = ['grupo']
handler.command = ['open', 'close', 'abrir', 'cerrar'] // ¡Nuevos comandos!
handler.admin = true
handler.botAdmin = true

export default handler
