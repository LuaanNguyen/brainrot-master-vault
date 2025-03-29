from fastapi import FastAPI
import re as regex
import csv
import os
import pyktok as pyk
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

@app.get("/tiktok")
async def get_tiktok(tiktok_url: str):
    # pyk.specify_browser('chrome')
    pyk.save_tiktok(f'{tiktok_url}?is_copy_url=1&is_from_webapp=v1',
	        True,
            'video_data.csv')
    # Read the CSV file
    data = []
    with open('video_data.csv', mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        data = [row for row in csv_reader]  # Convert rows to a list of dictionaries

    # Remove the CSV file after processing
    if os.path.exists('video_data.csv'):
        os.remove('video_data.csv')
        print("Temporary file 'video_data.csv' removed successfully.")
    else:
        print("File 'video_data.csv' does not exist.")

    print("Tiktok video downloaded successfully.")
    return data[0] if data else {"error": "No data found"}

@app.get("/home")
async def get_home():
    # Get all cached videos from the database and return them
    all_videos = get_all()
    if all_videos:
        return all_videos
    else:
        return {"error": "No cached videos found"}
     