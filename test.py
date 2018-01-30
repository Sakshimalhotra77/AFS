import speech_recognition as sr
r = sr.Recognizer()
with sr.Microphone() as source:
    r.adjust_for_ambient_noise(source)  # here
    print("Say something!")
    audio = r.listen(source)
try:
	print('Transcript:\n' + r.recognize_google(audio))
except :
	pass















'''import speech_recognition as sr

r = sr.Recognizer()

with sr.Microphone() as source:
    print('Say')
    audio = r.listen(source)
try :
    print('Transcript:\n' + r.recognize_google(audio))
    
except:
    pass'''
