## SCRIPT GENERADOR DE ENLACES CON EMOJIS (Python)

def generar_enlace_con_emojis(entrada):
    """
    Procesa la entrada en formato '<cifra> <enlace> | <emoji>' 
    y genera una cadena de texto con el emoji repetido el número de veces especificado.
    
    Ejemplo de entrada: "1k https://youtube.com/midestino | ✨"
    """
    
    # 1. Separar la entrada por el delimitador '|'
    try:
        parte_principal, emoji_str = [item.strip() for item in entrada.split('|', 1)]
    except ValueError:
        return "⚠️ Error: Formato incorrecto. Debe incluir '|' separando el enlace y el emoji."

    # 2. Separar la cifra y el enlace
    # Buscamos la primera palabra como cifra y el resto como enlace (puede haber espacios en la URL)
    partes_principales = parte_principal.split()
    if len(partes_principales) < 2:
        return "⚠️ Error: Faltan la cifra o el enlace. Formato: <cifra> <enlace> | <emoji>"
        
    cifra_str = partes_principales[0]
    enlace = " ".join(partes_principales[1:])
    
    # 3. Calcular la cantidad numérica de repeticiones
    cantidad = 0
    try:
        # Manejo de abreviaturas 'k' (miles) y '.k' (cientos)
        cifra_str = cifra_str.lower()
        
        if cifra_str.endswith('k'):
            # Ejemplo: '1k' -> 1000
            base = float(cifra_str[:-1])
            cantidad = int(base * 1000)
            
        elif cifra_str.startswith('.'):
            # Ejemplo: '.1k' -> 100, '.5k' -> 500
            # Convertimos '.1k' a '0.1k' y luego multiplicamos por 1000
            if cifra_str.endswith('k'):
                base = float('0' + cifra_str[:-1])
                cantidad = int(base * 1000)
            else:
                # Si es un número decimal simple como '.1' (que no es lo que pediste, pero es una buena práctica)
                cantidad = int(float(cifra_str) * 1000)
                
        else:
            # Si es un número entero normal, ejemplo: '100'
            cantidad = int(cifra_str)
            
    except ValueError:
        return "⚠️ Error: La cifra de emojis debe ser un número válido (ej: 100, 1k, .5k)."

    # 4. Generar el resultado final
    
    # Aseguramos que la cantidad no sea excesiva para evitar errores de memoria o spam
    if cantidad > 5000:
        return "🚫 Advertencia: El límite de emojis es 5000. Por favor, reduce la cifra."
        
    if cantidad <= 0:
        return "⚠️ Error: La cantidad de emojis debe ser mayor que cero."
        
    emojis_generados = emoji_str * cantidad
    
    # Concatenar los emojis y el enlace
    resultado_final = f"{emojis_generados} {enlace}"
    
    return resultado_final

# --- EJEMPLOS DE USO ---

# Entrada 1: Uso de 'k' (1k = 1000 emojis)
entrada_1 = "1k https://www.youtube.com/@TuCanalDeEjemplo | 🚀"
resultado_1 = generar_enlace_con_emojis(entrada_1)
print(f"Entrada 1:\n{entrada_1}\nSalida:\n{resultado_1[:20]}...{resultado_1[-30:]}\n") 
# Nota: La salida se recorta para que no imprima 1000 emojis en la consola

# Entrada 2: Uso de '.1k' (0.1k = 100 emojis)
entrada_2 = ".1k https://twitter.com/TuPerfil | ⭐"
resultado_2 = generar_enlace_con_emojis(entrada_2)
print(f"Entrada 2:\n{entrada_2}\nSalida:\n{resultado_2}\n")

# Entrada 3: Uso de número simple (5 emojis)
entrada_3 = "5 https://twitch.tv/mistream | 💸"
resultado_3 = generar_enlace_con_emojis(entrada_3)
print(f"Entrada 3:\n{entrada_3}\nSalida:\n{resultado_3}\n")

# Entrada 4: Error de formato
entrada_4 = "100 https://ejemplo.com sin emoji"
resultado_4 = generar_enlace_con_emojis(entrada_4)
print(f"Entrada 4:\n{entrada_4}\nSalida:\n{resultado_4}")
