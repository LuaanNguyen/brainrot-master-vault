# Brainrot Master Vault Backend

This folder contains the backend code for the Brainrot Master Vault project. The backend is built using FastAPI and is responsible for handling requests related to YouTube Shorts.

## Files

- `main.py`: This file contains the main FastAPI application. It defines the API endpoints and their functionality.
  - `/`: This endpoint returns a simple "Hello World" message.
  - `/youtube`: This endpoint takes a YouTube video URL as input, validates it, extracts the video ID, retrieves video details, parses the details, downloads the audio from the video, and returns the parsed details.
- `ytshorts_pull.py`: This file contains functions for extracting video ID, retrieving video details, parsing video details, and downloading audio from YouTube Shorts.
  - `get_youtube_video_id(url)`: Extracts the video ID from a YouTube URL.
  - `get_youtube_video_details(video_id)`: Fetches video details using the YouTube Data API.
  - `parse_video_details(video_details)`: Parses the video details and returns relevant information such as title, description, thumbnails, channel title, and tags.
  - `download_audio(url, video_id)`: Downloads audio from a YouTube URL using yt-dlp.
- `.env`: This file contains environment variables, such as the Google API key.
- `requirements.txt`: This file lists the Python packages required to run the backend.

## Example

### Request

```
GET /youtube?video_url=https://www.youtube.com/shorts/o4XRpgyz2O8
```

### Output

```json
{
  "title": "Title of the YouTube Short",
  "id": "o4XRpgyz2O8",
  "description": "Description of the YouTube Short",
  "publishedAt": "2023-10-26T16:00:00Z",
  "thumbnails": "https://i.ytimg.com/vi/o4XRpgyz2O8/sddefault.jpg",
  "channelTitle": "Channel Title",
  "tags": ["tag1", "tag2"]
}
```
