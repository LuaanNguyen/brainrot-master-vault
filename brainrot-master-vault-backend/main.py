from fastapi import FastAPI
import re as regex
from ytshorts_pull import get_youtube_video_details, get_youtube_video_id, parse_video_details


app = FastAPI()



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
    return parsed_details

     

