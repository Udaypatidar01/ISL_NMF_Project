# ISL Word Mapping - Maps common hand gestures to words/phrases
ISL_WORD_MAPPING = {
    # Common single-hand gestures mapped to words
    "HELLO": ["hello", "hi", "hey"],
    "YES": ["yes", "yeah", "ok"],
    "NO": ["no", "nope", "nope"],
    "THANKYOU": ["thank you", "thanks", "appreciate it"],
    "PLEASE": ["please", "may i", "could you"],
    "SORRY": ["sorry", "apologize"],
    "HELP": ["help", "assist"],
    "WATER": ["water", "drink"],
    "FOOD": ["food", "eat"],
    "GOOD": ["good", "great", "excellent"],
    "BAD": ["bad", "not good"],
    "HOT": ["hot", "warm"],
    "COLD": ["cold", "cool"],
    "BATHROOM": ["bathroom", "restroom"],
    "FRIEND": ["friend", "pal"],
    "FAMILY": ["family", "relatives"],
    "HOME": ["home", "house"],
    "SCHOOL": ["school", "education"],
    "WORK": ["work", "job"],
    "TIRED": ["tired", "exhausted"],
}

# Reverse mapping: label -> words
LABEL_TO_WORDS = {}
for gesture, words in ISL_WORD_MAPPING.items():
    LABEL_TO_WORDS[gesture] = words

# Common sentence structures that can be formed
COMMON_SENTENCES = [
    "Hello, how are you?",
    "Thank you very much",
    "Please help me",
    "I need water",
    "Where is the bathroom?",
    "Good morning",
    "Good night",
    "See you later",
    "Have a good day",
    "I am sorry",
    "I am happy",
    "I am sad",
    "I am tired",
    "Do you understand?",
    "Can you help me?",
]

def get_word_suggestions(gesture_label):
    """Get word suggestions for a detected gesture."""
    if gesture_label in LABEL_TO_WORDS:
        return LABEL_TO_WORDS[gesture_label]
    return []

def get_sentence_suggestions(predicted_words):
    """Get sentence suggestions based on predicted words."""
    # Filter sentences that contain any of the predicted words
    suggestions = []
    for word in predicted_words:
        for sentence in COMMON_SENTENCES:
            if word.lower() in sentence.lower() and sentence not in suggestions:
                suggestions.append(sentence)
    return suggestions[:5]  # Return top 5 suggestions
