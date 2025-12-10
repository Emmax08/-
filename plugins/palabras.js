def procesar_comando(entrada):
    """
    Busca palabras clave en la entrada del usuario y devuelve la respuesta.
    """
    # --- Diccionario de mapeo (Palabra clave: Respuesta) ---
    # *Nuevas palabras añadidas:* "bot de mierda" y "pendejo"
    mapeo_respuestas = {
        "pene": "comes",
        "hola": "¡Hola! ¿En qué puedo ayudarte?",
        "gracias": "De nada, ¡un placer asistirte!",
        "bot": "Soy un asistente programado para responderte.",
        
        # --- Nuevas adiciones ---
        "bot de mierda": "mas mierda fue cuando naciste",
        "pendejo": "te dejo con mi chile parejo"
    }

    # Convertir la entrada a minúsculas para una búsqueda que no distinga entre mayúsculas y minúsculas
    # y buscar el texto exacto para "bot de mierda" primero.
    entrada_limpia = entrada.lower()

    # Buscar la palabra clave en la entrada (se busca en el orden definido en el diccionario)
    for palabra_clave, respuesta in mapeo_respuestas.items():
        if palabra_clave in entrada_limpia:
            return respuesta

    # Si no se encuentra ninguna palabra clave, devolver un mensaje por defecto
    return "No entendí ese comando. Intenta con 'pene', 'hola', 'gracias', 'bot', 'bot de mierda' o 'pendejo'."

# --- Ejemplo de Uso (Simulación de Interacción) ---
print("Asistente de Comandos Simple (Escribe 'salir' para terminar)")
print("---")

while True:
    comando_usuario = input("Tú: ")

    if comando_usuario.lower() == 'salir':
        print("Asistente: ¡Adiós!")
        break

    # Obtener y mostrar la respuesta
    respuesta_bot = procesar_comando(comando_usuario)
    print(f"Asistente: {respuesta_bot}")
