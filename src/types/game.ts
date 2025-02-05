export type Category = {
  id: string;
  title: string;
  subCategories: SubCategory[];
};

export type SubCategory = {
  id: string;
  title: string;
  words: string[];
};

export type TimeOption = 30 | 60 | 120; 