export const journalCategories = [
  { handle: "sleep-tips", title: "Sleep Tips" },
  { handle: "sleep-science", title: "Sleep Science" },
  { handle: "product-guides", title: "Product Guides" },
  { handle: "city-lifestyle-guides", title: "City & Lifestyle Guides" },
  { handle: "problem-solution", title: "Problem-Solution" },
  { handle: "behind-the-scenes", title: "Behind the Scenes" },
  { handle: "pet-sleep", title: "Pet Sleep" },
  { handle: "baby-sleep", title: "Baby Sleep" },
  { handle: "childrens-sleep", title: "Children's Sleep" },
] as const;

export type JournalCategoryHandle = (typeof journalCategories)[number]["handle"];

export function getJournalCategory(handle: string) {
  return journalCategories.find((category) => category.handle === handle);
}

export function isJournalCategory(value: string): value is JournalCategoryHandle {
  return journalCategories.some((category) => category.handle === value);
}
