import os
from dotenv import load_dotenv
import yt_dlp

load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")

        

def get_youtube_video_id(url):
    """
    Extracts the video ID from a YouTube URL.
    """
    if "youtube.com/watch?v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("/")[-1]
    elif "youtube.com/shorts/" in url:
        return url.split("/")[-1]
    else:
        return None

def get_youtube_video_details(video_id: str):
    """
    Fetches video details using the YouTube Data API.
    """
    import requests

    url = f"https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={google_api_key}&part=snippet,contentDetails"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None
    
def parse_video_details(video_details: dict):
    """
    Parses the video details and returns relevant information.
    """
    if not video_details or "items" not in video_details:
        return None

    items = video_details["items"]
    if not items:
        return None

    item = items[0]
    id = item.get("id")
    snippet = item.get("snippet", {})
    
    return {
        "title": snippet.get("title"),
        "id": id, 
        "description": snippet.get("description"),
        "publishedAt": snippet.get("publishedAt"),
        "thumbnails": snippet.get("thumbnails", {}).get("standard", {}).get("url"),
        "channelTitle": snippet.get("channelTitle"),
        "tags": snippet.get("tags"),
    }

# Download audio from url using yt-dlp   
def download_audio(url, video_id):
    """
    Downloads audio from a YouTube URL using yt-dlp.
    """
    # Ensure output directory exists
    output_dir = "extracted_audio"
    os.makedirs(output_dir, exist_ok=True)
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(output_dir, '%(id)s.%(ext)s'),
    }
    # check if audio file already exists
    if os.path.exists(os.path.join(output_dir, f"{video_id}.mp3")):
        print("Audio file already exists.")
        return
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# Test youtube short = https://www.youtube.com/shorts/o4XRpgyz2O8
# if __name__ == "__main__":
#     url = "https://www.youtube.com/shorts/o4XRpgyz2O8"
#     video_id = get_youtube_video_id(url)
#     print(f"Video ID: {video_id}")
    
#     video_details = get_youtube_video_details(video_id)
#     # print(f"Video Details: {video_details}")

#     parsed_details = parse_video_details(video_details)
#     print(f"Parsed Video Details: {parsed_details}")

#     download_audio(url, video_id)