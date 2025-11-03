async function handler(m, { conn }) {
  const contactos = [
    {
      id: '1',
      numero: '5217225305296',
      nombre: '👑 インマヌエル',
      cargo: 'Creador Principal',
      descripcion: 'Fundador y desarrollador principal del bot'
    },
    {
      id: '2', 
      numero: '18096758983',
      nombre: '⚙️ Nevi-Dev',
      cargo: 'Desarrollador',
      descripcion: 'Especialista en soporte técnico y desarrollo'
    },
    {
      id: '3',
      numero: '18294868853',
      nombre: '🎨 Dioneibi',
      cargo: 'Diseñador',
      descripcion: 'Encargado del diseño y experiencia de usuario'
    },
    {
      id: '4',
      numero: '573235915041',
      nombre: '💻 Felix',
      cargo: 'Desarrollador',
      descripcion: 'Programador y mantenedor del bot'
    },
    {
      id: '5',
      numero: '573114910796',
      nombre: '🦇 Arlette',
      cargo: 'Desarrolladora',
      descripcion: 'Desarrolladora y colaboradora del proyecto'
    }
  ]

  const sections = [
    {
      title: '👥 EQUIPO DE DESARROLLO',
      rows: contactos.map(contacto => ({
        title: contacto.nombre,
        description: `${contacto.cargo} - ${contacto.descripcion}`,
        rowId: `${handler.command[0]} ${contacto.id}`
      }))
    }
  ]

  const listMessage = {
    text: `*🌟 PROPIETARIOS DEL BOT*\n\nSelecciona un miembro del equipo para ver su información de contacto:`,
    footer: '🔹 Elige una opción de la lista',
    title: 'EQUIPO DE DESARROLLO',
    buttonText: '📞 Ver Contactos',
    sections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

async function secondaryHandler(m, { conn, usedPrefix, command }) {
  const args = m.text.trim().split(/ +/).slice(1)
  
  if (!args[0]) return await handler(m, { conn })
  
  const contactos = {
    '1': {
      numero: '5217225305296',
      nombre: '👑 Emma-kun',
      cargo: 'Creador Principal',
      descripcion: 'Fundador y desarrollador principal del bot',
      region: '🇲🇽 México'
    },
    '2': {
      numero: '18096758983',
      nombre: '⚙️ Nevi-Dev',
      cargo: 'Desarrollador',
      descripcion: 'Especialista en soporte técnico y desarrollo',
      region: '🇩🇴 República Dominicana'
    },
    '3': {
      numero: '18294868853',
      nombre: '🎨 Dioneibi',
      cargo: 'Diseñador',
      descripcion: 'Encargado del diseño y experiencia de usuario',
      region: '🇩🇴 República Dominicana'
    },
    '4': {
      numero: '573235915041',
      nombre: '💻 Felix',
      cargo: 'Desarrollador',
      descripcion: 'Programador y mantenedor del bot',
      region: '🇩🇴 República Dominicana'
    },
    '5': {
      numero: '573114910796',
      nombre: '🦇 Arlette',
      cargo: 'Desarrolladora',
      descripcion: 'Desarrolladora y colaboradora del proyecto',
      region: '🇨🇴 Colombia'
    }
  }

  const contacto = contactos[args[0]]
  
  if (!contacto) {
    return await conn.sendMessage(m.chat, {
      text: '❌ Opción no válida. Usa el comando nuevamente sin argumentos para ver la lista.'
    }, { quoted: m })
  }

  const texto = `*${contacto.nombre}*\n
📋 *Cargo:* ${contacto.cargo}
📝 *Descripción:* ${contacto.descripcion}
🌎 *Región:* ${contacto.region}
📞 *Número:* ${contacto.numero}

_Guarda este número para contactar directamente_`

  const botones = [
    {
      quickReplyButton: {
        displayText: '📞 Llamar',
        id: `${usedPrefix}ptt ${contacto.numero}`
      }
    },
    {
      quickReplyButton: {
        displayText: '💬 Chatear',
        id: `${usedPrefix}chat ${contacto.numero}`
      }
    },
    {
      quickReplyButton: {
        displayText: '📋 Volver a la lista',
        id: `${usedPrefix}${command}`
      }
    }
  ]

  await conn.sendMessage(m.chat, {
    text: texto,
    footer: 'Selecciona una acción:',
    templateButtons: botones
  }, { quoted: m })
}

// Manejar tanto el comando principal como los subcomandos
const mainHandler = async (m, { conn, usedPrefix, command }) => {
  const args = m.text.trim().split(/ +/).slice(1)
  if (args[0]) {
    await secondaryHandler(m, { conn, usedPrefix, command })
  } else {
    await handler(m, { conn })
  }
}

mainHandler.help = ['owner', 'creador', 'creator']
mainHandler.tags = ['info']
mainHandler.command = ['owner', 'creator', 'creador', 'dueño', 'creadora', 'dueña']

export default mainHandler