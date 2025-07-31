import pyttsx3

def hablar(texto):
    engine = pyttsx3.init()
    engine.save_to_file(texto, 'voz.mp3')
    engine.runAndWait()
