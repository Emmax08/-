## SCRIPT GENERADOR DE ENLACES CON EMOJIS (Versión 2.0)

import re # Importamos el módulo 're' para usar expresiones regulares

def generar_enlace_con_emojis(entrada):
    """
    Procesa la entrada en formato '<cifra> <enlace> | <emoji>'.
    La cifra puede incluir prefijos como '#' o '.' (ej: #1k, .5k).
    """
    
    # 1. Separar la entrada por el delimitador '|'
    try:
        parte_principal, emoji_str = [item.strip() for item in entrada.split('|', 1)]
    except ValueError:
        return "⚠️ Error: Formato incorrecto. Debe incluir '|' separando el enlace y el emoji."

    # 2. Separar la cifra y el enlace
    partes_principales = parte_principal.split()
    if len(partes_principales) < 2:
        return "⚠️ Error: Faltan la cifra o el enlace. Formato: <cifra> <enlace> | <emoji>"
        
    cifra_raw = partes_principales[0] # La cifra original (ej: #1k, .5k)
    enlace = " ".join(partes_principales[1:])
    
    # --- PROCESAMIENTO DE LA CIFRA ---
    
    # 3. Limpiar y normalizar la cadena de la cifra
    cifra_str = cifra_raw.lower()
    
    # Quitar cualquier prefijo común no numérico ('#', '.', '$', etc.) del inicio para aislar el número.
    # Usamos una expresión regular para limpiar el inicio de la cadena.
    cifra_str = re.sub(r'^[#.$]', '', cifra_str) 

    cantidad = 0
    try:
        if cifra_str.endswith('k'):
            # Si termina en 'k' (ej: '1k', '0.5k')
            base = float(cifra_str[:-1]) # Corta la 'k'
            cantidad = int(base * 1000)
            
        else:
            # Si es un número entero normal, ejemplo: '100'
            cantidad = int(cifra_str)
            
    except ValueError:
        return f"⚠️ Error: La cifra '{cifra_raw}' no es un número válido (ej: 100, 1k, .5k)."

    # 4. Generar el resultado final
    
    if cantidad > 5000:
        return "🚫 Advertencia: El límite de emojis recomendado es 5000. Por favor, reduce la cifra."
        
    if cantidad <= 0:
        return "⚠️ Error: La cantidad de emojis debe ser mayor que cero."
        
    emojis_generados = emoji_str * cantidad
    
    resultado_final = f"{emojis_generados} {enlace}"
    
    return resultado_final

# --- EJEMPLOS CON LOS PREFIJOS SOLICITADOS ---

# Entrada 1: Uso de prefijo '#' (1k = 1000 emojis)
entrada_1 = "#1k https://www.youtube.com/mi_canal_twitch | 🎮"
resultado_1 = generar_enlace_con_emojis(entrada_1)
print(f"Entrada #1k:\n{entrada_1}\nSalida (1000 emojis):\n{resultado_1[:20]}...{resultado_1[-30:]}\n") 

# Entrada 2: Uso de prefijo '.' (0.5k = 500 emojis)
entrada_2 = ".5k https://twitter.com/TuPerfil | 🔗"
resultado_2 = generar_enlace_con_emojis(entrada_2)
print(f"Entrada .5k:\n{entrada_2}\nSalida (500 emojis):\n{resultado_2[:20]}...{resultado_2[-30:]}\n")

# Entrada 3: Prefijo '#' con número simple (25 emojis)
entrada_3 = "#25 https://facebook.com/pagina | 👍"
resultado_3 = generar_enlace_con_emojis(entrada_3)
print(f"Entrada #25:\n{entrada_3}\nSalida (25 emojis):\n{resultado_3}\n")
