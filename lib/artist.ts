export interface Artists {
  [id: string]: Artist;
}

export interface Artist {
  id: string;
  stage: string;
  available: boolean;
  name: string;
  time: string;
  description?: string;
  image?: string;
  spotify?: string;
  apple?: string;
  order?: number;
}

export type ArtistParams = {
  artist: string;
  stage: string;
};
