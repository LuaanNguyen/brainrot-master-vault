export interface Video {
  id: string;
  title: string;
  thumbnails: string;
  description: string;
  categoryId: string;
  channelTitle: string;
  publishedAt: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}
