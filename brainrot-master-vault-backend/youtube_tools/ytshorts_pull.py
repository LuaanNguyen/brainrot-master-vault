import os
import json # Added for parsing cached JSON
from dotenv import load_dotenv
import yt_dlp
from .db_commands import get_cached_response, cache_response # Import cache functions


load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")
cookies = os.getenv("COOKIES")

        

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
    Fetches video details using the YouTube Data API, checking the cache first.
    """
    # 1. Check cache first
    cached_data_json = get_cached_response(video_id)
    if cached_data_json:
        print(f"Cache hit for video ID: {video_id}")
        try:
            # Parse the JSON string from the cache
            return json.loads(cached_data_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding cached JSON for {video_id}: {e}")
            # Proceed to fetch from API if cache is corrupted

    # 2. If not in cache or cache error, fetch from API
    print(f"Cache miss for video ID: {video_id}. Fetching from API.")
    import requests # Keep import local to function if only used here

    url = f"https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={google_api_key}&part=snippet,contentDetails"
    
    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        
        video_data = response.json()
        
        # 3. Cache the new response
        cache_response(video_id, video_data)
        print(f"Cached API response for video ID: {video_id}")
        
        return video_data

    except requests.exceptions.RequestException as e:
        print(f"API request failed for {video_id}: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding API response JSON for {video_id}: {e}")
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
    
    # check if audio file already exists
    if os.path.exists(os.path.join(output_dir, f"{video_id}.mp3")):
        print("Audio file already exists.")
        return
    
    # Base options for yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(output_dir, '%(id)s.%(ext)s'),
        'quiet': False,  # Set to True to reduce output
        'no_warnings': False,  # Set to True to ignore warnings
        'ignoreerrors': True,  # Continue on download errors
        'verbose': True,  # For troubleshooting
    }
    
    # If cookies are provided, add them to the options
    if cookies:
        print("Using cookies from environment variable")
        
        # Option 1: If cookies is a path to a Netscape cookies file
        if os.path.isfile(cookies):
            ydl_opts['cookiefile'] = cookies
        # Option 2: If cookies is a string containing cookie data
        else:
            # Create a temporary cookie file
            import tempfile
            cookie_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
            try:
                with open(cookie_file.name, 'w') as f:
                    f.write(cookies)
                ydl_opts['cookiefile'] = cookie_file.name
                
                # Attempt the download
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])
            finally:
                # Clean up the temporary file
                os.unlink(cookie_file.name)
                return
    
    # If we didn't use the temporary file approach above, use the standard download
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        print(f"Error downloading audio: {e}")
        print("Try using a cookies file from a browser export. See https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp")
