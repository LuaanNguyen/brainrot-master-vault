export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnails: string;
  channelTitle: string;
  publishedAt: string;
  categoryId: string;
  tags?: string[];
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface GraphNode {
  id: string;
  name: string;
  color: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface VideoMetadata {
  title: string;
  id: string;
  description: string;
  publishedAt: string;
  thumbnails: string;
  channelTitle: string;
  tags?: string[];
}
