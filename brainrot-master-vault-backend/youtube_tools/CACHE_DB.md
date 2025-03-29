# Cache DB Documentation

## Overview

The Cache DB is a SQLite database used to store YouTube API responses to improve performance and reduce API usage. It caches responses based on video ID, allowing for quick retrieval of previously fetched data.

## Files

- `content_cache.py`: This file may contain logic related to the cache, but currently only contains a comment.
- `db_commands.py`: This file contains the database initialization and interaction logic.

## Database Structure

The database file is `youtube_cache.db`, located in the same directory as `db_commands.py`.

The database contains a single table named `cache` with the following schema:

```sql
CREATE TABLE IF NOT EXISTS cache (
    video_id TEXT PRIMARY KEY,
    response_data TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

- `video_id`: The ID of the YouTube video (primary key).
- `response_data`: The JSON string containing the API response data.
- `timestamp`: The timestamp of when the response was cached.

## Functions

### `init_db()`

Initializes the SQLite database and creates the `cache` table if it doesn't exist.

### `get_cached_response(video_id: str)`

Fetches the cached API response for a given `video_id`. Returns the JSON string if found, otherwise returns `None`.

### `cache_response(video_id: str, response_data: dict)`

Stores an API response in the cache. The `response_data` dictionary is converted to a JSON string before being stored in the database. Uses `INSERT OR REPLACE` to handle potential existing entries and update the timestamp.

## Usage

1.  **Initialization:** Call `init_db()` to create the database and table.
2.  **Caching:** Use `cache_response(video_id, response_data)` to store an API response in the cache.
3.  **Retrieval:** Use `get_cached_response(video_id)` to retrieve a cached API response. The returned value will be a JSON string that needs to be parsed.
