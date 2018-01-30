import speech_recognition as sr
from vectors import get_vects
from pprint import pprint

r = sr.Recognizer()
with sr.Microphone() as source:
    while True:
        r.adjust_for_ambient_noise(source)  # here
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio)
            pprint(get_vects(text))
        except :
            pass
