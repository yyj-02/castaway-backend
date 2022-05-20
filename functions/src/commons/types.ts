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
  id?: string;
  username: string;
  name: string;
  password: string;
  favorite: string[];
}

export type Users = User[];

export interface Upload {
  uploadId?: string;
  filepath: string;
  durationInMinutes: number;
}
