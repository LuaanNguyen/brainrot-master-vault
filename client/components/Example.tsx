import { useEffect, useState } from "react";
import { Video } from "./GraphView/data";
import { loadAllVideos } from "../utils/fetchData";

const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allVideos = await loadAllVideos();
      setVideos(allVideos);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div>
      <h1>All Videos</h1>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <img src={video.thumbnails} alt={video.title} />
            <h3>{video.title}</h3>
            <p>{video.channelTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
