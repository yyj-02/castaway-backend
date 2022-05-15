export interface Podcast {
  id?: string;
  title: string;
  path: string;
  durationInMinutes: number;
  artistId: string;
  genre: Genre;
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
