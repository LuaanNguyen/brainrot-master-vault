import sqlite3
import json
import os

# Define the path for the database file relative to this script's location
if os.path.exists('/db/cache/'):
    DB_DIR = os.path.dirname("/db/cache/")
else:
    # Fallback to the current directory if the path doesn't exist
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, 'youtube_cache.db')

def init_db():
    """Initializes the SQLite database and creates the cache table if it doesn't exist."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cache (
                video_id TEXT PRIMARY KEY,
                response_data TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Add transcript column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE cache ADD COLUMN transcript TEXT")
            print("Added 'transcript' column to cache table.")
        except sqlite3.OperationalError as e:
            # Ignore error if column already exists
            if "duplicate column name" not in str(e):
                raise e
            # else:
            #     print("'transcript' column already exists.") # Optional: uncomment for verbose logging

        # Add source column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE cache ADD COLUMN source TEXT")
            print("Added 'source' column to cache table.")
        except sqlite3.OperationalError as e:
            # Ignore error if column already exists
            if "duplicate column name" not in str(e):
                raise e
            # else:
            #     print("'source' column already exists.") # Optional: uncomment for verbose logging
        # Add summary column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE cache ADD COLUMN summary TEXT")
            print("Added 'summary' column to cache table.")
        except sqlite3.OperationalError as e:
            # Ignore error if column already exists
            if "duplicate column name" not in str(e):
                raise e
            # else:
            #     print("'summary' column already exists.") # Optional: uncomment for verbose logging

        conn.commit()
        print(f"Database initialized successfully at {DB_PATH}")
    except sqlite3.Error as e:
        print(f"Database error during initialization: {e}")
    finally:
        if conn:
            conn.close()

def get_cached_response(video_id: str):
    """Fetches the cached API response for a given video_id."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT response_data FROM cache WHERE video_id = ?", (video_id,))
        result = cursor.fetchone()
        if result:
            # Return the stored JSON string, which will be parsed later
            return result[0]
        else:
            return None
    except sqlite3.Error as e:
        print(f"Database error fetching cache for {video_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

def cache_response(video_id: str, response_data: dict, source: str):
    """Stores an API response in the cache, including its source ('youtube' or 'tiktok')."""
    conn = None
    if source not in ['youtube', 'tiktok']:
        print(f"Error: Invalid source '{source}' provided for video_id {video_id}. Source must be 'youtube' or 'tiktok'.")
        return # Or raise an error

    try:
        # Convert the dictionary response to a JSON string for storage
        response_json = json.dumps(response_data)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Use INSERT OR REPLACE to handle potential existing entries
        # This will insert a new row or replace an existing one based on video_id.
        # If replacing, it updates response_data and source. Timestamp updates automatically.
        # If the row exists but only had a transcript before, this adds response_data and source.
        cursor.execute('''
            INSERT OR REPLACE INTO cache (video_id, response_data, source, timestamp, transcript)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, (SELECT transcript FROM cache WHERE video_id = ?))
        ''', (video_id, response_json, source, video_id))
        # Note: The subquery `(SELECT transcript FROM cache WHERE video_id = ?)` preserves the existing transcript if the row is replaced.
        # If it's a new insert, the subquery returns NULL, which is the desired default for transcript.
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error caching response for {video_id}: {e}")
    finally:
        if conn:
            conn.close()


def cache_transcript(video_id: str, transcript: str):
    """Stores or updates the transcript for a given video_id."""
    conn = None
    print(f"Caching transcript for video ID: {video_id}")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # First check if video_id exists
        cursor.execute("SELECT 1 FROM cache WHERE video_id = ?", (video_id,))
        exists = cursor.fetchone() is not None
        
        if exists:
            # Update transcript if row exists
            cursor.execute('''
                UPDATE cache SET transcript = ? WHERE video_id = ?
            ''', (transcript, video_id))
        else:
            # Insert new row with empty JSON for response_data if row doesn't exist
            cursor.execute('''
                INSERT INTO cache (video_id, response_data, transcript)
                VALUES (?, ?, ?)
            ''', (video_id, json.dumps({}), transcript))
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error caching transcript for {video_id}: {e}")
    finally:
        if conn:
            conn.close()

def cache_summary(video_id: str, summary: str):
    """Stores or updates the summary for a given video_id."""
    conn = None
    print(f"Caching summary for video ID: {video_id}")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # First check if video_id exists
        cursor.execute("SELECT 1 FROM cache WHERE video_id = ?", (video_id,))
        exists = cursor.fetchone() is not None
        
        if exists:
            # Update summary if row exists
            cursor.execute('''
                UPDATE cache SET summary = ? WHERE video_id = ?
            ''', (summary, video_id))
        else:
            # Insert new row with empty JSON for response_data if row doesn't exist
            cursor.execute('''
                INSERT INTO cache (video_id, response_data, summary)
                VALUES (?, ?, ?)
            ''', (video_id, json.dumps({}), summary))
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error caching summary for {video_id}: {e}")
    finally:
        if conn:
            conn.close()

def get_cached_summary(video_id: str):
    """Fetches the cached summary for a given video_id."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT summary FROM cache WHERE video_id = ?", (video_id,))
        result = cursor.fetchone()
        # Return the summary if it exists and is not None, otherwise return None
        return result[0] if result and result[0] is not None else None
    except sqlite3.Error as e:
        print(f"Database error fetching summary for {video_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_cached_transcript(video_id: str):
    """Fetches the cached transcript for a given video_id."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT transcript FROM cache WHERE video_id = ?", (video_id,))
        result = cursor.fetchone()
        # Return the transcript if it exists and is not None, otherwise return None
        return result[0] if result and result[0] is not None else None
    except sqlite3.Error as e:
        print(f"Database error fetching transcript for {video_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()


def get_all(user: str = None):
    """Fetches all cached videos (including transcripts and source) from the database."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Fetch video_id, response_data, transcript, and source
        cursor.execute("SELECT video_id, response_data, transcript, source FROM cache")
        results = cursor.fetchall()
        # Convert results to a list of dictionaries
        all_data = []
        for row in results:
            video_id, response_data_json, transcript, source = row
            response_data = json.loads(response_data_json) if response_data_json else None
            all_data.append({
                "video_id": video_id,
                "response_data": response_data,
                "transcript": transcript,
                "source": source # Include the source
            })
        return all_data
    except sqlite3.Error as e:
        print(f"Database error fetching all cached data: {e}")
        return []
    finally:
        if conn:
            conn.close()



if __name__ == '__main__':
    # Example usage: Initialize DB when script is run directly
    print("Initializing database from db_commands.py...")
    init_db()
    print("Database initialization check complete.")
    # Example test
    # test_data = {"kind": "youtube#videoListResponse", "etag": "test_etag", "items": [{"id": "test_id"}]}
    # cache_response("test_id", test_data)
    # cached = get_cached_response("test_id")
    # if cached:
    #     print("Successfully cached and retrieved test data:")
    #     print(json.loads(cached))
    # else:
    #     print("Failed to retrieve test data.")
