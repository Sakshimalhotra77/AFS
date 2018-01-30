from paralleldots import keywords, set_api_key, emotion, sentiment
from pprint import pprint

key = "LDt60ocGFM2vLDjFmQ9DyAIQiR62kxUBwh9kfxGKh8I"
set_api_key(key)

def get_vects(text):
    keywords_vect = [ k['keyword'] for k in keywords(text)['keywords'] ]
    emotion_vect = [ (key, value) for key, value in emotion(text)['probabilities'].items() ]
    sentiment_vect = sentiment(text)
    del sentiment_vect['usage']
    return keywords_vect, emotion_vect, sentiment_vect

if __name__ == "__main__" :
    text = "My feedback is bad"
    a=get_vects(text)
    print(a)