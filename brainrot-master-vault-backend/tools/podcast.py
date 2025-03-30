import requests
import json
import sys
import os

# Add the parent directory to sys.path so we can import db_commands
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
from youtube_tools.db_commands import get_all

# Load the Phi-3 model
model_url = "https://ngavu2004--podcast-generator-phi3-generate-text-endpoint-dev.modal.run"

def create_podcast_script_from_text(texts):
    # Combine the texts into a single string
    content = ""
    for i, text in enumerate(texts):
        content += f"Text {i+1}: {text}\n"

    prompt = f"""
        {content}
        """
    # Define the payload
    payload = {
        "prompt": "What is the meaning of life?"
    }

    # Make the POST request
    response = requests.post(model_url, json=payload)

    # Print the response
    print("Status Code:", response.status_code)
    return response.text

def get_first_five_videos():
    """Retrieves and prints the first 5 videos from the cache."""
    # Get all videos from the cache
    all_videos = get_all()
    
    # Take only the first 5 videos
    first_five = all_videos[:5]
    
    print(f"Found {len(all_videos)} total videos in cache. Displaying first 5:")
    print("-" * 80)
    
    # Print details for each video
    for i, video in enumerate(first_five):
        video_id = video.get("video_id", "Unknown ID")
        source = video.get("source", "Unknown source")
        
        # Extract title based on the source format
        title = "Unknown title"
        response_data = video.get("response_data", {})
        
        if source == "youtube" and response_data and "items" in response_data:
            if response_data["items"] and "snippet" in response_data["items"][0]:
                title = response_data["items"][0]["snippet"].get("title", "No title")
        elif source == "tiktok" and response_data:
            title = response_data.get("title", "No title")
        
        # Get the classification tags
        classifications = video.get("classification", [])
        classification_str = ", ".join(classifications) if classifications else "None"
        
        # Print the information
        print(f"Video {i+1}:")
        print(f"  ID: {video_id}")
        print(f"  Source: {source}")
        print(f"  Title: {title}")
        print(f"  Classifications: {classification_str}")
        print(f"  Has transcript: {'Yes' if video.get('transcript') else 'No'}")
        print("-" * 80)
    
    return first_five

def get_first_five_from_api():
    """Retrieves and prints the first 5 items from the brainrotapi API."""
    api_url = "https://brainrotapi.codestacx.com/home"
    
    try:
        # Make the GET request to the API
        response = requests.get(api_url)
        
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            
            # The API returns a dict with a 'videos' key containing the list of videos
            videos = data.get('videos', [])
            
            # Take only the first 5 videos if available
            first_five = videos[:5] if isinstance(videos, list) else []
         
            print(f"Retrieved {len(first_five)} videos from the API:")
            print("-" * 80)
            
            # Print details for each video
            for i, video in enumerate(first_five):
                video_id = video.get("video_id", "Unknown ID")
                source = video.get("source", "Unknown source")
                transcript = video.get("transcript", "")
                transcript_preview = transcript[:100] + "..." if transcript and len(transcript) > 100 else transcript
                
                # Extract title based on the source format
                title = "Unknown title"
                response_data = video.get("response_data", {})
                
                if source == "youtube" and response_data and "items" in response_data:
                    if response_data["items"] and "snippet" in response_data["items"][0]:
                        title = response_data["items"][0]["snippet"].get("title", "No title")
                elif source == "tiktok" and response_data:
                    title = response_data.get("title", "No title")
                
                # Get the classification tags
                classifications = video.get("classification", [])
                classification_str = ", ".join(classifications) if classifications else "None"
                
                # Print the information
                # print(f"Video {i+1}:")
                # print(f"  ID: {video_id}")
                # print(f"  Source: {source}")
                # print(f"  Title: {title}")
                # print(f"  Classifications: {classification_str}")
                # print(f"  Transcript preview: {transcript_preview}")
                # print("-" * 80)
            
            return first_five
        else:
            print(f"Error: API request failed with status code {response.status_code}")
            print(f"Response: {response.text}")
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to connect to the API: {e}")
        return []
    except json.JSONDecodeError:
        print(f"Error: Failed to parse API response as JSON")
        print(f"Response: {response.text}")
        return []

def create_podcast_script_from_api_responses():
    """
    Fetches the first 5 videos from the API, extracts their transcripts,
    and sends them to the modal URL to generate a podcast script.
    """
    # Get the first 5 videos from the API
    videos = get_first_five_from_api()
    
    if not videos:
        print("No videos retrieved from API. Cannot create podcast script.")
        return
    
    # Extract transcripts from the videos
    transcripts = []
    for i, video in enumerate(videos):
        transcript = video.get("transcript", "")
        if transcript:
            # Truncate very long transcripts to avoid overwhelming the model
            if len(transcript) > 1000:
                transcript = transcript[:1000] + "..."
            
            title = "Unknown title"
            source = video.get("source", "Unknown source")
            response_data = video.get("response_data", {})
            
            if source == "youtube" and response_data and "items" in response_data:
                if response_data["items"] and "snippet" in response_data["items"][0]:
                    title = response_data["items"][0]["snippet"].get("title", "No title")
            elif source == "tiktok" and response_data:
                title = response_data.get("title", "No title")
            
            # Add title and transcript to the list
            transcripts.append(f"Title: {title}\n{transcript}")
    
    if not transcripts:
        print("No transcripts found in the videos. Cannot create podcast script.")
        return
    
    print(f"Sending {len(transcripts)} transcripts to the modal URL to generate podcast script...")
    
    # Create the podcast script from the transcripts
    script = create_podcast_script_from_text(transcripts)
    
    print("\nGenerated Podcast Script:")
    print("=" * 80)
    print(script)
    print("=" * 80)
    
    return script

def display_videos_detailed_info():
    """
    Fetches the first 5 videos from the API and displays detailed information
    including title, description, transcript, and any available summary.
    """
    # Get the first 5 videos from the API
    videos = get_first_five_from_api()
    
    if not videos:
        print("No videos retrieved from API.")
        return
    
    print(f"\nDetailed Information for {len(videos)} Videos:")
    print("=" * 100)
    
    for i, video in enumerate(videos):
        # Extract video details
        video_id = video.get("video_id", "Unknown ID")
        source = video.get("source", "Unknown source")
        transcript = video.get("transcript", "No transcript available")
        
        # Extract title and description based on the source
        title = "Unknown title"
        description = "No description available"
        response_data = video.get("response_data", {})
        
        if source == "youtube" and response_data and "items" in response_data:
            if response_data["items"] and "snippet" in response_data["items"][0]:
                snippet = response_data["items"][0]["snippet"]
                title = snippet.get("title", "No title")
                description = snippet.get("description", "No description available")
        elif source == "tiktok" and response_data:
            title = response_data.get("title", "No title")
            description = response_data.get("desc", "No description available")
        
        # Get the classification tags (can serve as a summary)
        classifications = video.get("classification", [])
        classification_str = ", ".join(classifications) if classifications else "None"
        
        # Get any summary if available
        summary = video.get("summary", "No summary available")
        
        # Print the detailed information
        print(f"VIDEO {i+1}: {title} ({source} ID: {video_id})")
        print("-" * 100)
        print("DESCRIPTION:")
        print(description)
        print("\nCLASSIFICATIONS/TAGS:")
        print(classification_str)
        print("\nSUMMARY:")
        print(summary)
        print("\nTRANSCRIPT:")
        print(transcript[:500] + "..." if len(transcript) > 500 else transcript)
        print("=" * 100)
    
    return videos

# If the script is run directly, execute the function
if __name__ == "__main__":
    # get_first_five_videos()
    # get_first_five_from_api()
    # create_podcast_script_from_api_responses()
    display_videos_detailed_info()