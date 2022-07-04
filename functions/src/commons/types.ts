export interface Podcast {
  podcastId?: string;
  title: string;
  description: string;
  path: string;
  imgPath: string;
  durationInMinutes: number;
  artistId: string;
  artistName: string;
  genres: Genres;
  public: boolean;
}

export type Podcasts = Podcast[];

export enum Genre {
  COMEDY = "Comedy",
  SPORTS = "Sports",
  NEWS = "News",
  EDUCATIONAL = "Edu",
  HEALTH = "Health",
  TECHNOLOGY = "Tech",
  SELFHELP = "Self-Help",
  INTERVIEW = "Interview",
}

export type Genres = Genre[];

export interface User {
  userId?: string;
  email: string;
  displayName: string;
  messagingToken?: string;
  creations: string[];
  favorites: string[];
}

export type Users = User[];

export interface Upload {
  uploadId?: string;
  userId: string;
  filetype: FileType;
  filepath: string;
  durationInMinutes?: number;
}

export enum FileType {
  IMAGE = "image",
  PODCAST = "podcast",
}

export interface Livestream {
  livestreamId?: string;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  streamerConnected: boolean;
}

export type Livestreams = Livestream[];
