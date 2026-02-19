export async function before(m) {
  // 1. Si no hay texto o no empieza con el prefijo, salimos
  if (!m.text || !global.prefix || !global.prefix.test(m.text)) {
    return;
  }

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (!command || command === "bot") return;

  if (validCommand(command, global.plugins)) {
    // 2. Usar Optional Chaining (?.) para evitar que el bot muera si el chat o user no existen aún
    let chat = global.db.data?.chats?.[m.chat];
    let user = global.db.data?.users?.[m.sender];

    // Si el usuario no existe en la DB, lo inicializamos para evitar el error de 'reading commands'
    if (!user) {
        global.db.data.users[m.sender] = { commands: 0 };
        user = global.db.data.users[m.sender];
    }

    if (chat?.isBanned) {
      const avisoDesactivado = `《✦》El bot *${global.botname || 'Maria'}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`;
      await m.reply(avisoDesactivado);
      return;
    }

    // 3. Verificamos que commands sea un número antes de sumar
    user.commands = (user.commands || 0) + 1;

  } else {
    // Manejo de comando no encontrado
    const comando = m.text.trim().split(' ')[0];
    // Solo respondemos si no es un mensaje vacío con solo el prefijo
    if (comando.length > usedPrefix.length) {
      await m.reply(`《✦》El comando *${comando}* no existe.\nPara ver la lista de comandos usa:\n» *${usedPrefix}help*`);
    }
  }
}
