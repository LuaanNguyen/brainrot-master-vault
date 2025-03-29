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
    
    # Handle cookies if provided
    if cookies:
        print("Using cookies from environment variable")
        
        # Option 1: If cookies is a path to a Netscape cookies file
        if os.path.isfile(cookies):
            ydl_opts['cookiefile'] = cookies
            print(f"Using cookie file at path: {cookies}")
        # Option 2: If cookies might be JSON format, try to convert to Netscape format
        else:
            import tempfile
            try:
                # Check if it looks like JSON
                if cookies.strip().startswith('{') or cookies.strip().startswith('['):
                    print("Detected JSON format cookies, converting to Netscape format")
                    import json
                    
                    # Create temporary file for Netscape format cookies
                    cookie_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
                    
                    try:
                        cookie_data = json.loads(cookies)
                        
                        # Convert JSON to Netscape format
                        # Format: domain\tHTTP_ONLY\tpath\tSECURE\texpiry\tname\tvalue
                        with open(cookie_file.name, 'w') as f:
                            f.write("# Netscape HTTP Cookie File\n")  # Important header
                            for cookie in cookie_data:
                                if isinstance(cookie, dict) and 'domain' in cookie and 'name' in cookie and 'value' in cookie:
                                    domain = cookie.get('domain', '')
                                    http_only = str(cookie.get('httpOnly', 'FALSE')).upper()
                                    path = cookie.get('path', '/')
                                    secure = str(cookie.get('secure', 'FALSE')).upper()
                                    expiry = str(int(cookie.get('expirationDate', 0)))
                                    name = cookie.get('name', '')
                                    value = cookie.get('value', '')
                                    
                                    f.write(f"{domain}\t{http_only}\t{path}\t{secure}\t{expiry}\t{name}\t{value}\n")
                        
                        ydl_opts['cookiefile'] = cookie_file.name
                        print(f"Created Netscape cookie file at: {cookie_file.name}")
                    except json.JSONDecodeError:
                        # Not valid JSON, try as direct Netscape format
                        cookie_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
                        with open(cookie_file.name, 'w') as f:
                            # Ensure file starts with proper header if not present
                            if not cookies.startswith("# Netscape HTTP Cookie File"):
                                f.write("# Netscape HTTP Cookie File\n")
                            f.write(cookies)
                        ydl_opts['cookiefile'] = cookie_file.name
                        print(f"Using direct cookie content in Netscape format: {cookie_file.name}")
                else:
                    # Likely direct Netscape format
                    cookie_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
                    with open(cookie_file.name, 'w') as f:
                        # Ensure file starts with proper header if not present
                        if not cookies.startswith("# Netscape HTTP Cookie File"):
                            f.write("# Netscape HTTP Cookie File\n")
                        f.write(cookies)
                    ydl_opts['cookiefile'] = cookie_file.name
                    print(f"Using direct cookie content in Netscape format: {cookie_file.name}")
                
                # Try to download with the processed cookies
                try:
                    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                        ydl.download([url])
                    print(f"Successfully downloaded audio for {video_id}")
                finally:
                    # Clean up temporary file
                    os.unlink(cookie_file.name)
                    return
                    
            except Exception as e:
                print(f"Error processing cookies: {e}")
                print("Please provide cookies in Netscape format. See https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp")
    
    # If no cookies or cookie processing failed, try without cookies
    print("Attempting download without cookies or with direct cookie file")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print(f"Successfully downloaded audio for {video_id}")
    except Exception as e:
        print(f"Error downloading audio: {e}")
        print("For YouTube bot detection errors, you need valid Netscape format cookies.")
        print("See https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp")
        print("Try using --cookies-from-browser chrome/firefox/etc to extract cookies in correct format")
