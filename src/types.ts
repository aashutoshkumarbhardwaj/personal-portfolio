export interface Post {
  platform: 'Reddit' | 'Telegram' | 'Threads';
  content: string;
  author: string;
  avatar: string;
  created_at: string;
  post_url: string;
}

export interface Certification {
  title: string;
  issuer: string;
  link: string;
  iconName?: string; // e.g. 'udemy' | 'coursera' | 'ieee' | 'university'
  issuedDate?: string;
}

export interface ContactMe {
  profilePicture: { url: string };
  name: string;
  title?: string;
  summary?: string;
  companyUniversity?: string;
  linkedinLink?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Project {
  title: string;
  description?: string;
  techUsed: string; // comma separated list expected by Projects.tsx
  image: { url: string };
}

export interface Reel {
  id: string;
  title?: string;
  caption?: string;
  reel?: { playbackId: string };
  coverTimestamp?: number;
  tags?: string[];
}

export interface Skill {
  name: string;
  category: string;
  description?: string;
  // Some queries return an icon object with a url, other UI code expects a string key.
  icon?: string | { url: string };
}

export interface TimelineItem {
  name?: string;
  timelineType?: string;
  title?: string;
  techStack?: string;
  summaryPoints?: string;
  dateRange?: string;
}

export interface WorkPermit {
  visaStatus?: string;
  expiryDate?: string;
  summary?: string;
  additionalInfo?: string;
}

export interface ProfileBanner {
  headline?: string;
  backgroundImage?: { url: string };
  resumeLink?: string;
  linkedinLink?: string;
  profileSummary?: string;
}