export interface Podcast {
  podcastId?: string;
  title: string;
  description: string;
  path: string;
  imgPath: string;
  durationInMinutes: number;
  artistId: string;
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
  creations: string[];
  favorites: string[];
}

export type Users = User[];

export interface Upload {
  uploadId?: string;
  filetype: FileType;
  filepath: string;
  durationInMinutes?: number;
}

export enum FileType {
  IMAGE = "image",
  PODCAST = "podcast",
}
