
export interface Profession {
  id: string;
  nameVI: string;
  nameEN: string;
}

export type AspectRatio = '1:1' | '16:9' | '3:4' | '4:3' | '9:16';

export interface ImageStyle {
  id: string;
  nameVI: string;
  promptFragment: string;
}