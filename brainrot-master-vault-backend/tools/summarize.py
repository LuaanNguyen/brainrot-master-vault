from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

# response = client.models.generate_content(
#     model="gemini-2.0-flash",
#     contents="Summarize the following text:\n\n" + """
#     You've been back-talking your mother? Boy, come here, I'm gonna give you 20! Boy, you've been playing hooky from school? Come here, I'm gonna give you 10! Michael, you've been smoking Mary Jane? Don't make me give you one! You stole my Corvette and you took Mary Beth to make out point? You are grounded, mister. No homecoming. Did you forget to return the Blockbuster rentals again? Somebody's gonna pay for those, mister. And let me tell you something. It's not gonna be me. Yo, you got an F? That is not swag. That's an epic fail, young lady. Hi. Honey, we're limiting your iPad use to only 12 hours a day. Ew. You are so right. We're the problem. So scary. You were caught uranium dumping? Your father and I did not design you to be this environmentally unconscious. Now stop running simulations on your Neuralink before we end your free Thought Premium subscription. What did we say about speaking out against the overseers? If you do that, they're going to take away our water rights, and then we're going to die.""",
# )

def summarize_text(text):
    """
    Summarizes the given text using the Gemini API.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Provide a concise summary of the following text in 100 words or less. Focus on the key points and main ideas:\n\n" + text,
        )
        return response.text
    except Exception as e:
        print(f"Error generating summary: {e}")
        return None