
export enum PostStatus {
  Posted = 'Posted',
  Ongoing = 'Ongoing',
  Done = 'Done',
  NotStarted = 'Not Started'
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface ContentItem {
  id: string;
  project: string;
  title: string;
  caption: string;
  staticUrl?: string;
  postDate: string;
  time: string;
  status: PostStatus;
  priority: Priority;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Statistics {
  total: number;
  posted: number;
  ongoing: number;
  notStarted: number;
}
