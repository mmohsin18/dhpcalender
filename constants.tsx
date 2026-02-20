
import { PostStatus, Priority, ContentItem } from './types';

export const INITIAL_DATA: ContentItem[] = [
  { id: '1', project: 'Professional Ethics', title: 'Coming Soon Teaser', caption: 'Something purposeful is on the horizon...', postDate: '2026-02-16', time: '16:00', status: PostStatus.Posted, priority: Priority.High },
  { id: '2', project: 'Professional Ethics', title: 'Course Announcement', caption: 'Join the new ethics module.', postDate: '2026-02-17', time: '13:00', status: PostStatus.Posted, priority: Priority.Medium },
  { id: '3', project: 'TA Recruitment', title: 'TA Announcement', caption: 'Application open for Fall.', postDate: '2026-02-19', time: '10:00', status: PostStatus.Ongoing, priority: Priority.High },
  { id: '4', project: 'Events', title: 'Orientation Photos', caption: 'Capturing memories.', postDate: '2026-02-20', time: '12:00', status: PostStatus.Ongoing, priority: Priority.Low },
  { id: '5', project: 'Special', title: 'Mother Language Day', caption: 'ভাষা কেবল প্রকাশের মাধ্যম নয়...', postDate: '2026-02-21', time: '09:00', status: PostStatus.Done, priority: Priority.High },
  { id: '6', project: 'Video', title: 'Orientation Reel', caption: 'Vibes from the orientation.', postDate: '2026-02-22', time: '18:00', status: PostStatus.NotStarted, priority: Priority.Medium },
];
