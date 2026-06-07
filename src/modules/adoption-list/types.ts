export interface FilterGroup {
  label: string;
  options: string[];
}

export type FilterSelection = Record<string, string | null>;

export interface Cat {
  name: string;
  sex: string;
  age: string;
  color: string;
  image: string;
  isLiked?: boolean;
}
