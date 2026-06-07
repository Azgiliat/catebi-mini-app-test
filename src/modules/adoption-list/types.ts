export interface FilterGroup {
  key: keyof Pick<Cat, "sex" | "age" | "color">;
  labelKey: string;
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
