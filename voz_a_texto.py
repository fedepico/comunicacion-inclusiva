import os
import speech_recognition as sr
from pydub import AudioSegment

def transcribir_audio(file_path):
    # Convertir .webm a .wav
    wav_path = file_path.replace(".webm", ".wav")
    try:
        audio = AudioSegment.from_file(file_path)
        audio.export(wav_path, format="wav")
    except Exception as e:
        return f"❌ Error al convertir el audio: {str(e)}"

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.record(source)
        texto = recognizer.recognize_google(audio, language="es-CO")
        return texto
    except sr.UnknownValueError:
        return "❌ No se pudo entender el mensaje."
    except sr.RequestError as e:
        return f"❌ Error de conexión con el servicio de voz: {e}"
