import speech_recognition as sr

def transcribir_audio(duracion=358):
    r = sr.Recognizer()

    with sr.Microphone() as source:
        print("🎙 Escuchando... Puedes empezar a hablar.")
        r.adjust_for_ambient_noise(source, duration=1.5)  # Ajuste al ruido
        audio = r.listen(source, phrase_time_limit=duracion)
        print("🧠 Procesando audio...")

    try:
        texto = r.recognize_google(audio, language="es-CO")  # Puedes cambiar a "es-ES" si lo deseas
        print("✅ Transcripción:", texto)
        return texto
    except sr.UnknownValueError:
        print("⚠️ No se entendió el audio.")
        return "No se pudo entender el mensaje. Por favor intenta nuevamente."
    except sr.RequestError as e:
        print("❌ Error al conectar con el servicio de reconocimiento:", str(e))
        return "Error al procesar la voz. Intenta más tarde."
