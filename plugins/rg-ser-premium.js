BY:ঔৣ⃟▒𝐄𝐌𝐌𝐀𝐗ღೋ 

// Asegúrate de que esta función (o similar) esté definida en tu entorno, 
// ya que es crucial para acceder a la base de datos de usuarios.
const ensureDB = () => {
  if (!global.db) global.db = { data: { users: {} } }
  if (!global.db.data) global.db.data = { users: {} }
  if (!global.db.data.users) global.db.data.users = {}
}

let handler = async (m, { conn }) => {
    // 1. Configuración de la compra
    ensureDB() // Asegura que la DB está inicializada
    const COSTO = 500000 // 500.000 monedas
    const CURRENCY = 'Monedas'
    const userJid = m.sender

    // 2. Obtener datos del usuario, asegurando que 'money' y 'premium' existen
    // Agregamos 'premium: false' como valor por defecto si el usuario es nuevo.
    const user = global.db.data.users[userJid] || { 
        money: 0, 
        exp: 0, 
        level: 1, 
        premium: false 
    }
    
    // Si el usuario es nuevo en la DB, inicializarlo con los valores por defecto
    if (!global.db.data.users[userJid]) {
         global.db.data.users[userJid] = user
    }

    // 3. Verificación: ¿Ya es Premium?
    if (user.premium) {
        await conn.sendMessage(m.chat, { 
            text: `*👑 ¡Ya eres un Usuario Premium!* No necesitas comprarlo de nuevo. Disfruta de tus privilegios.` 
        }, { quoted: m })
        return
    }

    // 4. Verificación: ¿Tiene fondos suficientes?
    if (user.money < COSTO) {
        const remaining = COSTO - user.money
        await conn.sendMessage(m.chat, {
            text: `*¡FONDOS INSUFICIENTES!* ❌\n\nNecesitas un total de *${COSTO.toLocaleString()} ${CURRENCY}* para comprar el estado Premium.\n\nTe faltan: *${remaining.toLocaleString()} ${CURRENCY}*.`
        }, { quoted: m })
        return
    }

    // 5. Procesar la compra
    
    // Restar el costo
    user.money -= COSTO
    
    // Asignar estado premium
    user.premium = true

    // 6. Mensaje de éxito
    const successMsg = `
*¡COMPRA EXITOSA!* 🎉

Has adquirido el estado *Usuario Premium* por *${COSTO.toLocaleString()} ${CURRENCY}*.

*Tu nuevo saldo:* ${user.money.toLocaleString()} ${CURRENCY}

¡Disfruta de tus nuevos beneficios exclusivos! 💎
    `.trim()

    await conn.sendMessage(m.chat, { text: successMsg }, { quoted: m })
}

handler.help = ['comprarpremuser']
handler.tags = ['rpg', 'main']
handler.command = ['comprarpremuser', 'buypremium'] // Alias por si acaso

export default handler
