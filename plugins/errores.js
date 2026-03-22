// 1. Definimos la función que genera el reporte detallado
function reportarError(error, comandoUsado) {
    const stack = error.stack.split('\n');
    // La línea 1 del stack suele tener el archivo y número de línea
    const ubicacion = stack[1] ? stack[1].trim() : "Ubicación desconocida";

    return {
        Comando: comandoUsado,
        Error: error.message,
        Linea: ubicacion,
        Tipo: error.name,
        Sugerencia: identificarCausa(error.message)
    };
}

// 2. Función auxiliar para detectar "qué falta" (API, comas, etc.)
function identificarCausa(msg) {
    if (msg.includes("API")) return "Revisar Key de API o conexión.";
    if (msg.includes("is not defined")) return "Falta definir variable o hay un error de dedo.";
    if (msg.includes("unexpected token")) return "Error de sintaxis: falta una coma (,) o un paréntesis.";
    return "Error de lógica interna.";
}

// 3. El Escuchador de Mensajes (Donde ocurre la magia)
client.on('message', async (msg) => {
    // Detectamos si empieza con . o #
    if (!msg.content.startsWith('.') && !msg.content.startsWith('#')) return;

    const args = msg.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    try {
        // Aquí es donde intentas ejecutar el comando (ej: play)
        // logicadeTuComando(commandName, args); 
        
        if (commandName === 'play') {
            // Ejemplo de código que fallaría si no hay API
            if (!process.env.YOUTUBE_API) throw new Error("Falta de API de YouTube");
            // ... resto del código de play
        }

    } catch (error) {
        // 4. Si algo falla, generamos la lista detallada
        const detalle = reportarError(error, commandName);

        // Imprimimos la lista en la consola de forma organizada
        console.log("\n⚠️ LISTA DE ERROR DETECTADO:");
        console.table([detalle]);

        // Opcional: El bot responde con el error exacto (solo para admins)
        msg.reply(`❌ **Error en comando ${commandName}:**\n- **Mensaje:** ${detalle.Error}\n- **Línea:** ${detalle.Linea}\n- **Sugerencia:** ${detalle.Sugerencia}`);
    }
});
