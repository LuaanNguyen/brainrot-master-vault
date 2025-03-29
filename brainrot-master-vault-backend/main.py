from fastapi import FastAPI
import re as regex
import csv
import os
import re
import pyktok as pyk
from moviepy import VideoFileClip
from contextlib import asynccontextmanager # For lifespan management
from youtube_tools.ytshorts_pull import get_youtube_video_details, get_youtube_video_id, parse_video_details, download_audio
from youtube_tools.db_commands import init_db
from youtube_tools.db_commands import get_all

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

    # Save TikTok video data to a CSV file
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
    
    await extract_audio(username, video_id)
    print("Audio extracted successfully.")

    result = {}

    result['title'] = data['video_description']
    result['id'] = data['video_id']
    result['description'] = data['video_description']
    result['publishedAt'] = data['video_timestamp']
    result['thumbnail'] = None
    result['channelTitle'] = data['author_name']


    return result if result else {"error": "Failed to extract video data"}

async def extract_audio(username: str, video_id: str):
    mp4_file_url = f"{username}_video_{video_id}.mp4"
    video_clip = VideoFileClip(mp4_file_url) if mp4_file_url else None

    mp3_file = mp4_file_url.replace('.mp4', '.mp3') if mp4_file_url else None
    mp3_file = ("./tiktok_audio/" + mp3_file) if mp3_file else None
    
    if video_clip and mp3_file:
        video_clip.audio.write_audiofile(mp3_file)
        video_clip.close()
        os.remove(mp4_file_url)
        print("Video file removed successfully.")

    print("Audio extracted successfully.")
        
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
    # Get all cached videos from the database and return them
    all_videos = get_all()
    # Run all the videos through the parse_video_details function
    # and return the parsed details
    if all_videos:
        videos = []
        for video in all_videos:
            video_id = video['video_id']
            video_details = get_youtube_video_details(video_id)
            if not video_details:
                return {"error": "Video not found"}
            parsed_details = parse_video_details(video_details)
            if not parsed_details:
                return {"error": "Failed to parse video details"}
            # Download audio from the video
            download_audio(video['video_id'], video_id)
            videos.append(parsed_details)
        return {"videos": videos}
    else:
        return {"error": "No cached videos found"}
