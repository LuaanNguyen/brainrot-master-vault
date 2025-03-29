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

def cache_response(video_id: str, response_data: dict):
    """Stores an API response in the cache."""
    conn = None
    try:
        # Convert the dictionary response to a JSON string for storage
        response_json = json.dumps(response_data)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Use INSERT OR REPLACE to handle potential existing entries (or update timestamp)
        cursor.execute('''
            INSERT OR REPLACE INTO cache (video_id, response_data)
            VALUES (?, ?)
        ''', (video_id, response_json))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error caching response for {video_id}: {e}")
    finally:
        if conn:
            conn.close()

def get_all(user: str = None):
    """Fetches all cached videos from the database."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT video_id, response_data FROM cache")
        results = cursor.fetchall()
        # Convert results to a list of dictionaries
        return [{"video_id": row[0], "response_data": json.loads(row[1])} for row in results]
    except sqlite3.Error as e:
        print(f"Database error fetching all cached videos: {e}")
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
