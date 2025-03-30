import os
import re as regex
from fastapi import APIRouter, HTTPException
from youtube_tools.ytshorts_pull import get_youtube_video_details, get_youtube_video_id, parse_video_details, download_audio
from youtube_tools.db_commands import get_cached_transcript, cache_transcript, get_cached_summary, cache_summary
from tools.transcription import transcribe
from tools.summarize import summarize_text

router = APIRouter()

@router.get("/youtube", tags=["youtube"])
async def get_youtube(video_url: str):
    """
    Handles fetching details, audio, transcription, and summary for a YouTube video.
    """
    # Implement url verification using regex
    pattern = r"^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtube\.com/shorts/|youtu\.be/)([a-zA-Z0-9_-]{11})$"
    if not regex.match(pattern, video_url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Extract video ID from the URL
    video_id = get_youtube_video_id(video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL, could not extract video ID")

    # Check cache for full response first (optional, but good practice)
    # cached_response = get_cached_response(video_id, source='youtube') # Assuming db_commands is updated
    # if cached_response:
    #     print(f"Cache hit for full YouTube response: {video_id}")
    #     return json.loads(cached_response) # Assuming stored as JSON

    video_details = get_youtube_video_details(video_id)
    if not video_details:
        raise HTTPException(status_code=404, detail="Video not found")

    parsed_details = parse_video_details(video_details)
    if not parsed_details:
        raise HTTPException(status_code=500, detail="Failed to parse video details")

    # Download audio from the video
    audio_downloaded = download_audio(video_url, video_id)
    if not audio_downloaded:
        print(f"Warning: Audio download failed for {video_id}. Proceeding without transcription/summary.")
        # Decide if you want to return partial data or an error
        # return parsed_details # Return partial data

    # Determine audio file path (mirroring logic in download_audio)
    if os.path.exists('/db/cache/'):
        audio_dir = "/db/cache/youtube_audio/"
    else:
        audio_dir = "youtube_audio" # Relative path if cache dir doesn't exist
    os.makedirs(audio_dir, exist_ok=True) # Ensure directory exists
    mp3_file_path = os.path.join(audio_dir, f"{video_id}.mp3")

    # --- Transcription ---
    transcribed_text = None
    cached_transcript = get_cached_transcript(video_id)
    if cached_transcript:
        print(f"Cache hit for transcript: {video_id}")
        transcribed_text = cached_transcript
    elif os.path.exists(mp3_file_path):
        print(f"Cache miss for transcript: {video_id}. Transcribing audio file: {mp3_file_path}")
        transcribed_text = await transcribe(mp3_file_path)
        if transcribed_text:
            cache_transcript(video_id, transcribed_text)
            print(f"Cached transcript for video ID: {video_id}")
        else:
            print(f"Transcription failed for {video_id}, not caching.")
    else:
        print(f"Audio file not found at {mp3_file_path}, skipping transcription.")

    parsed_details['transcription'] = transcribed_text

    # --- Summarization ---
    summary = None
    if transcribed_text: # Only summarize if transcription is available
        cached_summary = get_cached_summary(video_id)
        if cached_summary:
            print(f"Cache hit for summary: {video_id}")
            summary = cached_summary
        else:
            print(f"Cache miss for summary: {video_id}. Generating new summary.")
            # Ensure description is not None before concatenating
            description = parsed_details.get('description', '') or ''
            title = parsed_details.get('title', '') or ''
            summary_input = f"Title: {title}\nTranscript: {transcribed_text}\nDescription: {description}"
            summary = summarize_text(summary_input)
            if summary:
                cache_summary(video_id, summary)
                print(f"Cached summary for video ID: {video_id}")
            else:
                print(f"Summarization failed for {video_id}")

    parsed_details['summary'] = summary

    # Cache the full response (optional, requires db_commands update)
    # cache_response(video_id, parsed_details, source='youtube')

    return parsed_details
