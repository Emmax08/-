// La variable global para el contador. Debe estar en un lugar accesible, como el archivo principal del bot.
let contador = new Map();

// Este manejador se activa con cada mensaje en un grupo
export async function before(m, { conn, isGroup }) {
  if (!isGroup) return false;

  const chatId = m.chat;

  // Lógica de Conteo: Si el contador está activo para este chat, incrementa el total.
  if (contador.has(chatId)) {
    let currentCount = contador.get(chatId).count;
    contador.set(chatId, { count: currentCount + 1 });
  }

  return true;
}
