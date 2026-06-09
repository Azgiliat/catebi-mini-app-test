export interface FilterGroup {
  key: keyof Pick<Cat, "sex" | "age" | "color">;
  labelKey: string;
  optionLabelPrefix?: string;
  options: string[];
}

export type FilterSelection = Record<string, string | null>;

export type CatSex = "m" | "f";

export interface Cat {
  name: string;
  sex: CatSex;
  age: string;
  color: string;
  image: string;
  about: string;
  isLiked?: boolean;
}
