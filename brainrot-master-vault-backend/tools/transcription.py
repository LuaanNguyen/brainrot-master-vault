import requests
import os

async def transcribe(mp3_file: str):
    """
    Transcribes the given MP3 audio file using a remote API.

    Args:
        mp3_file: Path to the MP3 file.

    Returns:
        The transcribed text as a string, or None if transcription fails.
    """
    # Use environment variable for API URL if available, otherwise default
    transcribe_api_url = os.getenv("TRANSCRIPTION_API_URL", "https://ngavu2004--brainrot-mastervault-whisper-small-handle-b41132-dev.modal.run/")

    if not transcribe_api_url:
        print("Error: TRANSCRIPTION_API_URL environment variable not set and no default provided.")
        return None

    if not os.path.exists(mp3_file):
        print(f"Error: Audio file not found at {mp3_file}")
        return None

    print(f"Sending {mp3_file} to transcription API: {transcribe_api_url}")
    try:
        with open(mp3_file, "rb") as file:
            response = requests.post(transcribe_api_url, files={"file": file}, timeout=300) # Added timeout

        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        # Assuming the API returns JSON with the transcription text
        # Adjust parsing based on the actual API response format
        transcribed_text = response.json()
        print("Transcription successful.")
        return transcribed_text

    except requests.exceptions.RequestException as e:
        print(f"Error during transcription API request: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during transcription: {e}")
        return None
