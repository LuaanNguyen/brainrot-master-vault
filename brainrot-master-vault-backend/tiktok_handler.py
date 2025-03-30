import os
import re
import csv
import json
import pyktok as pyk
from fastapi import APIRouter, HTTPException
from moviepy import VideoFileClip 
from youtube_tools.db_commands import (
    get_cached_response, cache_response,
    get_cached_transcript, cache_transcript,
    get_cached_summary, cache_summary
)
from tools.transcription import transcribe
from tools.summarize import summarize_text

router = APIRouter()

def get_tiktok_username_id(tiktok_url: str) -> tuple[str | None, str | None]:
    """
    Extracts the TikTok username and video ID from the provided URL.
    Returns (None, None) if the pattern doesn't match.
    """
    # Regular expression to extract username and video_id
    pattern = r"https://www\.tiktok\.com/@?(?P<username>[^/]+)/video/(?P<video_id>\d+)"
    match = re.match(pattern, tiktok_url)
    if match:
        return match.group("username"), match.group("video_id")
    else:
        # Handle short URLs like https://vm.tiktok.com/xxxxx/
        # This might require an extra step to resolve the short URL first
        # For now, return None if the standard format isn't matched
        print(f"URL format not recognized for direct extraction: {tiktok_url}")
        return None, None

async def extract_audio_and_transcribe(username: str, video_id: str, mp_file_url: str):
    """
    Extracts audio from the downloaded MP4, transcribes it, and handles caching.
    Cleans up the MP4 file afterwards.
    """
    mp3_file_base = f"{username}_video_{video_id}.mp3"

    # Determine output directory
    if os.path.exists('/db/cache/'):
        output_dir = "/db/cache/tiktok_audio/"
    else:
        output_dir = "tiktok_audio"
    os.makedirs(output_dir, exist_ok=True)
    mp3_file_path = os.path.join(output_dir, mp3_file_base)

    transcribed_text = None

    # Check cache for transcript first
    cached_transcript = get_cached_transcript(video_id)
    if cached_transcript:
        print(f"Cache hit for transcript: {video_id}")
        transcribed_text = cached_transcript
    # Check if audio file already exists (maybe from a previous failed run)
    elif os.path.exists(mp3_file_path):
        print(f"Audio file already exists at {mp3_file_path}. Transcribing.")
        transcribed_text = await transcribe(mp3_file_path)
        if transcribed_text:
            cache_transcript(video_id, transcribed_text)
    # If neither transcript nor audio exists, extract audio and transcribe
    elif os.path.exists(mp_file_url):
        print(f"Extracting audio from {mp_file_url} to {mp3_file_path}")
        try:
            with VideoFileClip(mp_file_url) as video_clip:
                video_clip.audio.write_audiofile(mp3_file_path, codec='mp3') # Specify codec
            print("Audio extracted successfully.")

            # Transcribe the newly extracted audio
            print("Transcribing audio...")
            transcribed_text = await transcribe(mp3_file_path)
            if transcribed_text:
                cache_transcript(video_id, transcribed_text)
                print(f"Cached transcript for video ID: {video_id}")
            else:
                print(f"Transcription failed for {video_id} after audio extraction.")

        except Exception as e:
            print(f"Error during audio extraction or transcription: {e}")
            # Don't delete mp4 yet if transcription failed, maybe retry later?
            # Or decide based on error type
    else:
        print(f"MP4 video file not found at {mp3_file_path}. Cannot extract audio.")

    # Clean up the downloaded MP4 file
    if os.path.exists(mp_file_url):
        try:
            os.remove(mp_file_url)
            print(f"Removed temporary video file: {mp_file_url}")
        except OSError as e:
            print(f"Error removing temporary video file {mp_file_url}: {e}")

    return transcribed_text


@router.get("/tiktok", tags=["tiktok"])
async def get_tiktok(tiktok_url: str):
    """
    Handles fetching details, audio, transcription, and summary for a TikTok video.
    """
    username, video_id = get_tiktok_username_id(tiktok_url)
    if not username or not video_id:
        # Consider attempting to resolve short URLs here if needed
        raise HTTPException(status_code=400, detail="Invalid or unsupported TikTok URL format")

    print(f"Processing TikTok - Username: {username}, Video ID: {video_id}")

    # 1. Check cache for the full response data
    cached_response_json = get_cached_response(video_id)
    if cached_response_json:
        print(f"Cache hit for TikTok response: {video_id}")
        try:
            cached_response = json.loads(cached_response_json)
            # Even if response is cached, ensure transcript and summary are present
            if 'transcription' not in cached_response or cached_response['transcription'] is None:
                 cached_transcript = get_cached_transcript(video_id)
                 if cached_transcript:
                     cached_response['transcription'] = cached_transcript
                 else:
                     # Attempt to transcribe if audio exists
                     if os.path.exists('/db/cache/'):
                         output_dir = "/db/cache/tiktok_audio/"
                     else:
                         output_dir = "tiktok_audio"
                     mp3_file = os.path.join(output_dir, f"{username}_video_{video_id}.mp3")
                     if os.path.exists(mp3_file):
                         print(f"Response cached, but transcript missing/stale for {video_id}. Transcribing existing audio.")
                         transcribed_text = await transcribe(mp3_file)
                         if transcribed_text:
                             cache_transcript(video_id, transcribed_text)
                             cached_response['transcription'] = transcribed_text

            if 'summary' not in cached_response or cached_response['summary'] is None:
                cached_summary = get_cached_summary(video_id)
                if cached_summary:
                    cached_response['summary'] = cached_summary
                elif cached_response.get('transcription'): # Generate summary if transcript now exists
                    print(f"Response cached, but summary missing/stale for {video_id}. Generating summary.")
                    summary = summarize_text(f"Title: {cached_response.get('title', '')}\nTranscript: {cached_response['transcription']}\nDescription: {cached_response.get('description', '')}")
                    if summary:
                        cache_summary(video_id, summary)
                        cached_response['summary'] = summary

            return cached_response
        except json.JSONDecodeError as e:
            print(f"Error decoding cached JSON for TikTok {video_id}: {e}. Fetching fresh data.")
        except Exception as e:
             print(f"Unexpected error processing cached TikTok {video_id}: {e}. Fetching fresh data.")


    # 2. If not in cache or cache error, fetch from TikTok
    print(f"Cache miss for TikTok response: {video_id}. Fetching from TikTok.")
    temp_csv_file = f'video_data_{video_id}.csv' # Unique temp file name

    if os.path.exists('/db/cache/'):
        output_dir = "/db/cache/tiktok_audio/"
    else:
        output_dir = "tiktok_audio"
    os.makedirs(output_dir, exist_ok=True)
    mp4_file_path = os.path.join(output_dir, f"{username}_video_{video_id}.mp4")

    try:
        # Download video data and video file
        pyk.save_tiktok(tiktok_url, True, temp_csv_file)
        print(f"TikTok video and data downloaded for {video_id}.")
        
        # Determine target output directory
        if os.path.exists('/db/cache/'):
            output_dir = "/db/cache/tiktok_audio/"
        else:
            output_dir = "tiktok_audio"
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Look for any MP4 files in the current directory that might match the pattern
        current_dir_files = os.listdir(".")
        mp4_files = [f for f in current_dir_files if f.endswith(".mp4")]
        
        # First check for the expected filename pattern
        expected_filename = f"{username}_video_{video_id}.mp4"
        if expected_filename in mp4_files:
            os.rename(expected_filename, mp4_file_path)
            print(f"Moved {expected_filename} to {mp4_file_path}")
        # If not found, check for any other MP4 that might be from this download
        elif mp4_files:
            # Use the first MP4 file found (assuming it's the one we want)
            first_mp4 = mp4_files[0]
            os.rename(first_mp4, mp4_file_path)
            print(f"Moved {first_mp4} to {mp4_file_path}")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to download TikTok video for {video_id}")
            
        # Check if the CSV file was created
        if not os.path.exists(temp_csv_file):
             raise HTTPException(status_code=500, detail=f"Failed to download TikTok data CSV for {video_id}")

        # Read the CSV data
        video_metadata = {}
        with open(temp_csv_file, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            data_list = list(csv_reader)
            if data_list:
                video_metadata = data_list[0]
            else:
                 raise HTTPException(status_code=500, detail=f"Failed to read data from TikTok CSV for {video_id}")

        # Extract audio and transcribe (also handles MP4 cleanup)
        transcribed_text = await extract_audio_and_transcribe(username, video_id, mp4_file_path)

        # Prepare final result
        result = {
            'id': video_metadata.get('video_id', video_id),
            'title': video_metadata.get('video_description', 'N/A'), # Often description is used as title
            'description': video_metadata.get('video_description', 'N/A'),
            'publishedAt': video_metadata.get('video_timestamp', None),
            'thumbnail': None, # pyktok doesn't easily provide this
            'channelTitle': video_metadata.get('author_name', username),
            'transcription': transcribed_text,
            'summary': None # Initialize summary
        }

        # Generate summary if transcription was successful
        if transcribed_text:
            print(f"Generating summary for TikTok {video_id}")
            summary = summarize_text(f"Title: {result['title']}\nTranscript: {transcribed_text}\nDescription: {result['description']}")
            if summary:
                result['summary'] = summary
                cache_summary(video_id, summary) # Cache the summary
            else:
                print(f"Summarization failed for TikTok {video_id}")

        # Cache the full response
        cache_response(video_id, result, source='tiktok')
        print(f"Cached TikTok response for video ID: {video_id} (source: tiktok)")

        return result

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(f"An error occurred processing TikTok {video_id}: {e}")
        # Clean up potentially downloaded files in case of error
        if os.path.exists(mp4_file_path):
            try:
                os.remove(mp4_file_path)
                print(f"Cleaned up MP4 file {mp4_file_path} after error.")
            except OSError as rm_err:
                print(f"Error cleaning up MP4 file {mp4_file_path}: {rm_err}")
        raise HTTPException(status_code=500, detail=f"Failed to process TikTok video {video_id}: {str(e)}")
    finally:
        # Ensure temporary CSV is always removed
        if os.path.exists(temp_csv_file):
            try:
                os.remove(temp_csv_file)
                print(f"Removed temporary CSV file: {temp_csv_file}")
            except OSError as e:
                print(f"Error removing temporary CSV file {temp_csv_file}: {e}")
