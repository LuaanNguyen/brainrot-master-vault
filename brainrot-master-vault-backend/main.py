from fastapi import FastAPI, HTTPException
import os
from contextlib import asynccontextmanager # For lifespan management
from fastapi.middleware.cors import CORSMiddleware

# Import database functions and initialization
from youtube_tools.db_commands import init_db, get_all

# Import routers from handler files
from youtube_handler import router as youtube_router
from tiktok_handler import router as tiktok_router
# Import specific handler functions needed for the /metadata endpoint
from youtube_handler import get_youtube
from tiktok_handler import get_tiktok


# Lifespan context manager to run init_db on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("Database initialization complete.")
    yield
    # Add cleanup logic here if needed in the future
    print("Application shutting down.")

app = FastAPI(lifespan=lifespan, title="BrainRot API", description="API for BrainRot Master Vault")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include the routers from the handler files
app.include_router(youtube_router)
app.include_router(tiktok_router)

@app.get("/")
async def root():
    return {"message": "Welcome to BrainRot API. Use /youtube or /tiktok endpoints."}

@app.get("/metadata", tags=["metadata"])
async def get_metadata(url: str):
    """
    Abstract endpoint to get metadata for TikTok or YouTube based on the URL.
    Delegates to the appropriate handler.
    """
    if "tiktok.com" in url:
        # Call the TikTok handler function (imported)
        # Use try-except to catch potential HTTPExceptions from the handler
        try:
            return await get_tiktok(url)
        except HTTPException as e:
            raise e # Re-raise the exception to let FastAPI handle it
        except Exception as e:
            # Catch unexpected errors from the handler
            print(f"Unexpected error in TikTok handler via /metadata: {e}")
            raise HTTPException(status_code=500, detail="Internal server error processing TikTok URL.")
    elif "youtube.com" in url or "youtu.be" in url:
        # Call the YouTube handler function (imported)
        try:
            return await get_youtube(url)
        except HTTPException as e:
            raise e # Re-raise
        except Exception as e:
            print(f"Unexpected error in YouTube handler via /metadata: {e}")
            raise HTTPException(status_code=500, detail="Internal server error processing YouTube URL.")
    else:
        raise HTTPException(status_code=400, detail="Unsupported URL. Please provide a valid TikTok or YouTube URL.")

@app.get("/home", tags=["home"])
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
