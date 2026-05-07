export type Language = 'en' | 'local'; // 'local' acts as the wildcard

export type Localized<T = string> = {
  [key in Language]: T;
};

export interface PostContent {
  title: string;
  description: string;
}

export interface Post {
  id: string;
  date: string;

  location: {
    lat: number;
    lng: number;
    name: Localized;
  };

  content: Localized<PostContent>;

  images: {
    src: string;
    alt: Localized;
  }[];
}
