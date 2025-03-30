import { useState } from "react";
import {
  X,
  Youtube,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchVideoContent,
  validateURL,
  extractVideoId,
} from "@/utils/contentUpload";

export default function AddContentModal({ isOpen, onClose, onContentAdded }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);

    try {
      // Use the fetchVideoContent utility
      const contentData = await fetchVideoContent(url);

      setContentPreview(contentData);
      setSuccess(`Successfully processed ${contentData.source} content`);

      // Notify parent component
      onContentAdded(contentData);

      // Reset form after delay
      setTimeout(() => {
        setUrl("");
        setContentPreview(null);
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error in modal:", err);
      setError(err.message || "An error occurred while fetching video content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
          <h2 className="text-lg font-medium">Add New Content</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="contentUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              YouTube or TikTok URL
            </label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="contentUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/shorts/..."
                className="pl-9"
                disabled={isLoading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter a valid YouTube shorts or TikTok URL to add to your
              knowledge vault.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-2 bg-green-50 text-green-700 text-sm rounded-md flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {contentPreview && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-3">
                {contentPreview.thumbnails && (
                  <img
                    src={contentPreview.thumbnails}
                    alt={contentPreview.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {contentPreview.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {contentPreview.channelTitle}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(contentPreview.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Add Content
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
