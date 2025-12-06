// Este código incluye la lógica de manejo de argumentos corregida
// para el formato: #<comando> <cifra> <link> | <emoji>

const strings = [
    'reply', 'chat', '\u2555 Este comando es solo para propietarios del bot.', 
    'm', '\u2555 *', ' *', 'Formato incorrecto', '\n\nUso: *', 
    '<link> | <emoji>', '\u2555 ', '.', 'split', '|', 'map', 'trim', 
    'length', '\u2555 Formato incorrecto', 'whatsapp.com/channel/', 'wa.me/channel/', 
    'includes', '\u2555 El enlace debe ser de un canal de WhatsApp.', 
    'filter', '\u2555 Debes proporcionar entre 1 y 3 emojis como m\xe1ximo.', 
    '\u2564 *Enviando 1k reacciones al canal...*', 'join', 'Arlette-Xz', // 25: API_KEY placeholder
    'encodeURIComponent', 'https://api-adonix.ultraplus.click/tools/react?', 
    'apikey=', '&post_link=', '&reacts=', 'post_link=', '&apikey=', 'fetch', 
    'GET', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
    'headers', 'User-Agent', 'Accept', 'application/json', 'Origin', 
    'https://api-adonix.ultraplus.click', 'Referer', 'ok', 'json', 
    'status', 'message', 'toLowerCase', 'exitosamente', 'success', 
    'success===!0', 'sendMessage', 'text', '\u2564 *\u00a1Reacciones de ', 
    ' enviadas exitosamente!\u002a', 'edit', 'key', 
    '\u2555 *\u00a1No se pudo enviar las reacciones*', 
    '\n\nPosibles causas:\n\u2022 API Key expirada\n\u2022 Enlace no v\u00e1lido\n\u2022 API fuera de servicio\n\u2022 L\u00edmite de uso alcanzado', 
    'console', 'error', 'Error:', '\u2555 *Error al procesar la solicitud*', 
    '\n\n'
];

const decode = (index) => strings[index];

const handler = async (message, {
    conn,
    text,
    isOwner,
    usedPrefix,
    command
}) => {
    // 1. Verificación de Propietario
    if (!isOwner) {
        return conn[decode(0)](message[decode(1)], decode(2), message);
    }

    // 2. Verificación de Formato General (Separador '|')
    // Verifica si el texto existe y si tiene el separador '|'
    if (!text || !text[decode(19)](decode(12))) { 
        return conn[decode(0)](
            message[decode(1)], 
            decode(4) + decode(5) + conn.user.name + decode(6) + decode(7) + usedPrefix + command + ' ' + decode(8), 
            message
        );
    }
    
    // Split principal por '|'
    const args = text[decode(11)](decode(12)) // split('|')
        [decode(13)](item => item[decode(14)]()); // map(item => item.trim())

    // Debe tener exactamente 2 partes: [0] = cifra/link, [1] = rawEmojis
    if (2 !== args[decode(15)]) { // 15: length
        return conn[decode(0)](
            message[decode(1)], 
            decode(16) + decode(7) + usedPrefix + command + ' ' + decode(8), 
            message
        );
    }
    
    const [linkArg, rawEmojis] = args;
    
    // 2.1. Separación de Cifra y Link por espacios
    // Usamos regex para manejar múltiples espacios
    const linkParts = linkArg[decode(11)](/\s+/)[decode(21)](p => p.length > 0); // 21: filter
    
    if (linkParts[decode(15)] < 2) {
         return conn[decode(0)](message[decode(1)], decode(16) + '\n\u2555 Faltan la cifra y/o el enlace.', message);
    }
    
    const cifraRaw = linkParts[0]; // Ej: '1k', '2000'
    const link = linkParts.slice(1)[decode(24)](' '); // El enlace real
    
    // 2.2. Validación y Limpieza de Emojis
    const emojis = rawEmojis[decode(11)](',')
        [decode(13)](item => item[decode(14)]())
        [decode(21)](emoji => emoji); // Filtra strings vacías

    // 3. Validación de Enlace (WhatsApp Channel)
    if (!link[decode(19)](decode(17)) && !link[decode(19)](decode(18))) { // 17: whatsapp.com/c, 18: wa.me/c
        return conn[decode(0)](message[decode(1)], decode(20), message);
    }

    // 4. Validación de Emojis: entre 1 y 3
    if (0 === emojis[decode(15)] || emojis[decode(15)] > 3) {
        return conn[decode(0)](message[decode(1)], decode(22), message); 
    }
    
    // 5. Lógica de Conversión de Cifra (Ej: '1k' a 1000)
    let cantidad = 0;
    try {
        let cifra_str = cifraRaw[decode(47)](); // 47: toLowerCase
        
        // Limpiamos los prefijos comunes (si existen)
        cifra_str = cifra_str.replace(/^[#.$]/, ''); 
        
        if (cifra_str.endsWith('k')) {
            const base = parseFloat(cifra_str.slice(0, -1));
            cantidad = parseInt(base * 1000);
        } else {
            cantidad = parseInt(cifra_str);
        }
        
        if (isNaN(cantidad) || cantidad <= 0 || cantidad > 5000) {
            return conn[decode(0)](message[decode(1)], `⚠️ Error: La cantidad de reacciones es inválida o supera el límite de 5000.`, message);
        }

    } catch (e) {
        return conn[decode(0)](message[decode(1)], `⚠️ Error: La cifra '${cifraRaw}' no es un número válido.`, message);
    }
    
    // --- ENVÍO A LA API ---

    // 6. Envío de Mensaje de Espera y obtención del 'key'
    const m = await conn[decode(0)](message[decode(1)], decode(23).replace('1k', cantidad), message); // 23: Enviando 1k reacciones...
    
    // 7. Preparación de la Solicitud
    const API_KEY = 'TU_API_KEY_AQUI'; // <--- ¡REEMPLAZA ESTO!
    const reactsEncoded = encodeURIComponent(emojis[decode(24)](',')); // 24: join
    const postLinkEncoded = encodeURIComponent(link);

    const URL = decode(27) + decode(28) + API_KEY + decode(29) + postLinkEncoded + decode(30) + reactsEncoded;
    // 27: Base URL, 28: apikey=, 29: &post_link=, 30: &reacts=

    try {
        const response = await fetch(URL, {
            method: decode(34), // 34: GET
            headers: {
                [decode(37)]: decode(35), // 37: User-Agent, 35: Mozilla...
                [decode(38)]: decode(39), // 38: Accept, 39: application/json
                [decode(40)]: decode(41), // 40: Origin, 41: API URL
                [decode(42)]: decode(41) // 42: Referer
            }
        });

        // 8. Manejo de la Respuesta de la API
        if (response[decode(43)]) { // 43: ok
            const data = await response[decode(44)](); // 44: json()
            
            // Verificación de éxito (adaptada de tu lógica ofuscada)
            if (data[decode(45)] === 200 || data[decode(45)] === decode(48) || data.success === true) { 
                
                // 56: edit, 57: key
                await conn[decode(56)](m[decode(3)][decode(57)], decode(53) + cantidad + decode(54) + decode(55));
                
            } else {
                // Falla reportada por la API
                await conn[decode(56)](
                    m[decode(3)][decode(57)], 
                    decode(58) + '\n\nRespuesta API: ' + (data[decode(46)] || 'Mensaje no disponible')
                ); // 58: No se pudo enviar las reacciones
            }
        } else {
            // Falla de código de estado HTTP (no es 200)
             await conn[decode(56)](m[decode(3)][decode(57)], decode(58));
        }
        
    } catch (e) {
        // Error de red o fetch
        console[decode(61)](decode(62), e); // 61: error, 62: Error:
        await conn[decode(56)](
            m[decode(3)][decode(57)], 
            decode(63) + decode(64) + e.message
        ); // 63: Error al procesar la solicitud
    }
};

// Configuración del módulo para la ejecución de comandos
handler.help = ['1k <link> | <emoji>'];
handler.tags = ['owner'];
handler.command = ['1k', 'reacciones', 'r']; // Comandos que disparan el handler
handler.owner = true;

export default handler;
