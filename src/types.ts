export type Language = 'en' | 'local'; // 'local' acts as the wildcard

export interface Post {
  id: string;
  location: Record<Language, string>;
  date: string;
  image: string;
  alt: Record<Language, string>;
  content: Record<Language, string>;
}
