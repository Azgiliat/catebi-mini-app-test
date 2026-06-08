import { Cat } from "@/modules/adoption-list/types.ts";

export async function loadCats() {
  if (import.meta.env.DEV) {
    const response = await fetch("/api/cats");

    return (await response.json()) as Cat[];
  } else {
    // Airtable integration here
    return [];
  }
}
