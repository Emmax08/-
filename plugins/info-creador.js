async function handler(m, { conn }) {
  const contactos = [
    {
      numero: '5217225305296',
      nombre: '👑 インマヌエル',
      cargo: 'Creador Principal',
      emoji: '👑'
    },
    {
      numero: '18096758983',
      nombre: '⚙️ Nevi-Dev',
      cargo: 'Desarrollador',
      emoji: '⚙️'
    },
    {
      numero: '18294868853',
      nombre: '🎨 Dioneibi',
      cargo: 'Diseñador',
      emoji: '🎨'
    },
    {
      numero: '573235915041',
      nombre: '💻 Felix',
      cargo: 'Desarrollador',
      emoji: '💻'
    },
    {
      numero: '573114910796',
      nombre: '🦇 Arlette',
      cargo: 'Desarrolladora',
      emoji: '🦇'
    }
  ]

  const texto = `*🌟 EQUIPO DE DESARROLLO*

*Miembros del equipo:*

${contactos.map(contacto => 
  `${contacto.emoji} *${contacto.nombre}*
   ➤ *Rol:* ${contacto.cargo}`
).join('\n\n')}

*💬 ¿Necesitas ayuda?*
Presiona el botón del miembro con quien deseas comunicarte.`

  const botones = []
  for (let i = 0; i < contactos.length; i += 2) {
    const fila = []
    
    fila.push({
      name: 'cta',
      buttonParams: {
        displayText: `${contactos[i].emoji} ${contactos[i].nombre.split(' ')[1]}`,
        id: `contacto_${i}`,
        phoneNumber: contactos[i].numero
      }
    })
    
    if (contactos[i + 1]) {
      fila.push({
        name: 'cta',
        buttonParams: {
          displayText: `${contactos[i + 1].emoji} ${contactos[i + 1].nombre.split(' ')[1]}`,
          id: `contacto_${i + 1}`,
          phoneNumber: contactos[i + 1].numero
        }
      })
    }
    
    botones.push(fila)
  }

  botones.push([{
    name: 'cta',
    buttonParams: {
      displayText: '🚪 Cerrar Menú',
      id: 'cerrar'
    }
  }])

  await conn.sendMessage(m.chat, {
    text: texto,
    footer: '✨ Selecciona un miembro del equipo para contactar',
    templateButtons: botones,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['owner', 'creador', 'creator']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño', 'creadora', 'dueña']

export default handler