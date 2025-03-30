from fastapi import FastAPI
import re as regex
import csv
import os
import re
import pyktok as pyk
import requests
import json # Import json for parsing cached data
from moviepy import VideoFileClip # Corrected import
from contextlib import asynccontextmanager # For lifespan management
from youtube_tools.ytshorts_pull import get_youtube_video_details, get_youtube_video_id, parse_video_details, download_audio
from youtube_tools.db_commands import init_db, get_all, get_cached_transcript, cache_transcript, get_cached_response, cache_response, get_cached_summary, cache_summary 
from tools.summarize import summarize_text

# Lifespan context manager to run init_db on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("Database initialization complete.")
    yield
    # Add cleanup logic here if needed in the future
    print("Application shutting down.")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Test youtube short = https://www.youtube.com/shorts/o4XRpgyz2O8
@app.get("/youtube")
async def get_youtube(video_url: str):
    # Implement url verification using regex
    pattern = r"^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtube\.com/shorts/|youtu\.be/)([a-zA-Z0-9_-]{11})$"
    if not regex.match(pattern, video_url):
        return {"error": "Invalid YouTube URL"}

    # Extract video ID from the URL
    video_id = get_youtube_video_id(video_url)
    if not video_id:
        return {"error": "Invalid YouTube URL"}
    video_details = get_youtube_video_details(video_id)
    if not video_details:
        return {"error": "Video not found"}
    parsed_details = parse_video_details(video_details)
    if not parsed_details:
        return {"error": "Failed to parse video details"}

    # Download audio from the video
    download_audio(video_url, video_id)

    # Determine audio file path (mirroring logic in download_audio)
    if os.path.exists('/db/cache/'):
        audio_dir = "/db/cache/youtube_audio/"
    else:
        audio_dir = "youtube_audio"
    mp3_file_path = os.path.join(audio_dir, f"{video_id}.mp3")

    # Check cache for transcript first
    cached_transcript = get_cached_transcript(video_id)
    if cached_transcript:
        print(f"Cache hit for transcript: {video_id}")
        parsed_details['transcription'] = cached_transcript
    # If not cached, check if audio file exists, transcribe, and cache
    elif os.path.exists(mp3_file_path):
        print(f"Cache miss for transcript: {video_id}. Transcribing audio file: {mp3_file_path}")
        transcribed_text = await transcribe(mp3_file_path)
        print("Transcription completed.")
        if transcribed_text: # Only cache if transcription was successful
            cache_transcript(video_id, transcribed_text)
            print(f"Cached transcript for video ID: {video_id}")
            parsed_details['transcription'] = transcribed_text
        else:
            print(f"Transcription failed for {video_id}, not caching.")
            parsed_details['transcription'] = None
    else:
        print(f"Audio file not found at {mp3_file_path}, skipping transcription.")
        parsed_details['transcription'] = None # Or handle as appropriate
    # Summarize the video using the Title, Description, and Transcript
    if parsed_details['transcription']:
        # Check cache for summary first
        cached_summary = get_cached_summary(video_id)
        if cached_summary:
            print(f"Cache hit for summary: {video_id}")
            parsed_details['summary'] = cached_summary
        else:
            print(f"Cache miss for summary: {video_id}. Generating new summary.")
            # Generate summary using the summarize_text function
            summary = summarize_text('Title:' + parsed_details['title'] + 
                                     'Transcript:' + parsed_details['transcription'] +
                                     'Description:' + parsed_details['description'])
            # Cache the summary
            cache_summary(video_id, summary)
            print(f"Cached summary for video ID: {video_id}")
            parsed_details['summary'] = summary

    return parsed_details

def get_tiktok_username_id(tiktok_url: str) -> str:
    """
    Extracts the TikTok username or ID from the provided URL.
    """
    # Regular expression to extract username and video_id
    pattern = r"https://www\.tiktok\.com/(?P<username>[^/]+)/video/(?P<video_id>\d+)"

    # Match the pattern
    match = re.match(pattern, tiktok_url)
    username = None
    video_id = None

    if match:
        username = match.group("username")
        video_id = match.group("video_id")
        return username, video_id
    else:
        None, None

@app.get("/tiktok")
async def get_tiktok(tiktok_url: str):
    
    # Get username and video ID from the TikTok URL
    username, video_id = get_tiktok_username_id(tiktok_url)
    if not username or not video_id:
        return {"error": "Invalid TikTok URL"}

    print(f"Username: {username}, Video ID: {video_id}")

    # 1. Check cache first for response data
    cached_response_json = get_cached_response(video_id)
    if cached_response_json:
        print(f"Cache hit for TikTok response: {video_id}")
        try:
            cached_response = json.loads(cached_response_json)
            # Check cache for transcript separately
            cached_transcript = get_cached_transcript(video_id)
            if cached_transcript:
                print(f"Cache hit for TikTok transcript: {video_id}")
                cached_response['transcription'] = cached_transcript
                return cached_response # Return cached response + transcript
            else:
                # If response is cached but transcript isn't, try to get/transcribe audio
                print(f"Cache miss for TikTok transcript: {video_id}. Attempting transcription.")
                # Need to determine the mp3 path without downloading video again
                if os.path.exists('/db/cache/'):
                    output_dir = "/db/cache/tiktok_audio/"
                else:
                    output_dir = "tiktok_audio"
                mp3_file = os.path.join(output_dir, f"{username}_video_{video_id}.mp3")

                if os.path.exists(mp3_file):
                    transcribed_text = await transcribe(mp3_file)
                    if transcribed_text:
                        cache_transcript(video_id, transcribed_text)
                        cached_response['transcription'] = transcribed_text
                    else:
                        cached_response['transcription'] = None
                else:
                    # If audio file doesn't exist (maybe deleted?), we can't transcribe
                    print(f"Audio file {mp3_file} not found for cached TikTok {video_id}. Cannot transcribe.")
                    cached_response['transcription'] = None
                return cached_response

        except json.JSONDecodeError as e:
            print(f"Error decoding cached JSON for TikTok {video_id}: {e}")
            # Proceed to fetch from API if cache is corrupted

    # 2. If not in cache or cache error, fetch from TikTok
    print(f"Cache miss for TikTok response: {video_id}. Fetching from TikTok.")
    # Save TikTok video data to a CSV file (downloads video)
    pyk.save_tiktok(f'https://www.tiktok.com/{username}/video/{video_id}?is_copy_url=1&is_from_webapp=v1',
	        True,
            'video_data.csv')
    
    # Check if the CSV file was created successfully
    # Read the CSV file
    data = []
    with open('video_data.csv', mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        data = [data for data in csv_reader]
    print(data)
    data = data[0] if data else None
    if not data:
        return {"error": "Failed to extract video data"}

    # Remove the CSV file after processing
    if os.path.exists('video_data.csv'):
        os.remove('video_data.csv')
        print("Temporary file 'video_data.csv' removed successfully.")
    else:
        print("File 'video_data.csv' does not exist.")

    print("Tiktok video downloaded successfully.")
    
    transcribed_text = await extract_audio(username, video_id)
    print("Audio extraction and transcription attempt completed.")

    result = {}
    result['title'] = data.get('video_description', 'N/A') # Use .get for safety
    result['id'] = data.get('video_id', video_id) # Use extracted video_id if not in data
    result['description'] = data.get('video_description', 'N/A')
    result['publishedAt'] = data.get('video_timestamp', None)
    result['thumbnail'] = None # TikTok API via pyktok doesn't easily provide this
    result['channelTitle'] = data.get('author_name', username) # Use extracted username if not in data
    result['transcription'] = transcribed_text # Add transcript

    # 3. Cache the combined result (metadata + transcript placeholder)
    # The transcript itself is cached separately by cache_transcript if successful
    cache_response(video_id, result, source='tiktok')
    print(f"Cached TikTok response for video ID: {video_id} (source: tiktok)")

    return result if result else {"error": "Failed to extract video data"}

async def extract_audio(username: str, video_id: str):
    mp4_file_url = f"{username}_video_{video_id}.mp4"
    video_clip = VideoFileClip(mp4_file_url) if mp4_file_url else None

    mp3_file = mp4_file_url.replace('.mp4', '.mp3') if mp4_file_url else None

    # Ensure output directory exists
    if os.path.exists('/db/cache/'):
        output_dir = os.path.dirname("/db/cache/tiktok_audio/")
    else:
        # Fallback to the current directory if the path doesn't exist
        output_dir = "tiktok_audio" 
    os.makedirs(output_dir, exist_ok=True)

    mp3_file_path = os.path.join(output_dir, mp3_file)

    # Check if audio file already exists
    if os.path.exists(mp3_file_path):
        print(f"Audio file already exists at {mp3_file_path}. Skipping extraction.")
        # Check cache for transcript
        cached_transcript = get_cached_transcript(video_id)
        if cached_transcript:
            print(f"Cache hit for transcript: {video_id}")
            # Clean up downloaded MP4 if it exists
            if os.path.exists(mp4_file_url):
                 os.remove(mp4_file_url)
                 print(f"Removed temporary video file: {mp4_file_url}")
            return cached_transcript
        else:
            print(f"Audio exists but transcript not cached for {video_id}. Transcribing.")
            # Proceed to transcribe the existing audio file
            transcribed_text = await transcribe(mp3_file_path)
            if transcribed_text:
                cache_transcript(video_id, transcribed_text)
            # Clean up downloaded MP4 if it exists
            if os.path.exists(mp4_file_url):
                 os.remove(mp4_file_url)
                 print(f"Removed temporary video file: {mp4_file_url}")
            return transcribed_text

    # If audio doesn't exist, extract it
    print(f"Extracting audio to {mp3_file_path}")
    # Check if the mp4 file exists before attempting to extract audio
    if video_clip and mp3_file_path:
        try:
            video_clip.audio.write_audiofile(mp3_file_path)
            print("Audio extracted successfully.")
        except Exception as e:
            print(f"Error writing audio file: {e}")
            return None # Indicate failure
        finally:
            video_clip.close() # Ensure clip is closed
            # Remove the downloaded video file after audio extraction (or attempt)
            if os.path.exists(mp4_file_url):
                os.remove(mp4_file_url)
                print(f"Removed temporary video file: {mp4_file_url}")
    else:
        print("MP4 video clip not available for audio extraction.")
        if os.path.exists(mp4_file_url): # Clean up if mp4 exists but clip failed
             os.remove(mp4_file_url)
             print(f"Removed temporary video file: {mp4_file_url}")
        return None # Indicate failure

    # Check cache again before transcribing (maybe another request finished?)
    cached_transcript = get_cached_transcript(video_id)
    if cached_transcript:
        print(f"Cache hit for transcript after audio extraction: {video_id}")
        return cached_transcript

    # Call the transcribe function with the mp3 file path
    print("Transcribing audio...")
    transcribed_text = await transcribe(mp3_file_path)
    print("Transcription completed.")

    # Cache the transcript if successful
    if transcribed_text:
        cache_transcript(video_id, transcribed_text)
        print(f"Cached transcript for video ID: {video_id}")

    return transcribed_text

async def transcribe(mp3_file: str):
    """
    Placeholder function for transcribing audio files.
    """
    # Implement transcription logic here
    transcribe_api_url = "https://ngavu2004--brainrot-mastervault-whisper-large-v3-handle--85d537.modal.run/"

    # Make a POST request to the transcription API with the audio file
    with open(mp3_file, "rb") as file:
        response = requests.post(transcribe_api_url, files={"file": file})
    
    transcribed_text = response.json()
    return transcribed_text
        
@app.get("/metadata")
async def get_metadata(url: str):
    """
    Abstract function to get metadata for TikTok or YouTube based on the URL.
    """
    if "tiktok.com" in url:
        # Call the TikTok handler
        return await get_tiktok(url)
    elif "youtube.com" in url or "youtu.be" in url:
        # Call the YouTube handler
        return await get_youtube(url)
    else:
        return {"error": "Unsupported URL. Please provide a valid TikTok or YouTube URL."}
    
@app.get("/home")
async def get_home():
    # Get all cached videos (which now include source) from the database
    all_videos = get_all()
    if all_videos:
        # No need to re-fetch or re-parse, just return the cached data
        # The 'response_data' field already contains the parsed details
        # The 'transcript' field contains the cached transcript
        # The 'source' field indicates 'youtube' or 'tiktok'
        return {"videos": all_videos}
    else:
        return {"videos": []}
