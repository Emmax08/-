// Manejador central de errores
const errorHandler = (error, commandName) => {
    // Extraer la línea y el archivo del stack trace
    const stackLines = error.stack.split('\n');
    const detailLine = stackLines[1].trim(); 
    
    // Intentar identificar la causa probable
    let cause = "Error de lógica o sintaxis";
    if (error.message.includes("API")) cause = "Falta de API Key o Error de Conexión";
    if (error.message.includes("is not defined")) cause = "Variable no definida o falta de coma/importación";
    if (error.message.includes("unexpected token")) cause = "Error de sintaxis (posible falta de coma o cierre)";

    const report = {
        comando: commandName,
        mensaje: error.message,
        ubicacion: detailLine,
        causaProbable: cause,
        fecha: new Date().toLocaleString()
    };

    // Mostrar en consola y puedes enviarlo a un log o chat
    console.error("--- REPORTE DE ERROR ---");
    console.table(report);
    
    return report;
};

// Ejemplo de ejecución de comandos (.play o #play)
const executeCommand = async (cmd, args) => {
    try {
        if (cmd === 'play') {
            // Simulación de error: falta de una API o variable
            if (!process.env.MUSIC_API) {
                throw new Error("Falta de API de música en el archivo .env");
            }
        }
        // ... resto de tu lógica
    } catch (err) {
        const errorDetail = errorHandler(err, cmd);
        
        // Opcional: Enviar la lista de errores al usuario o admin
        console.log(`Error en [${errorDetail.comando}]: ${errorDetail.mensaje} en ${errorDetail.ubicacion}`);
    }
};

// Ejemplo de detección global para errores no capturados
process.on('uncaughtException', (err) => {
    errorHandler(err, 'Sistema Crítico');
});
