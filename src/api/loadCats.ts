import type { Cat } from "@/modules/adoption/types.ts";

import { cats } from "../../mock/server/routes/cats.mock.ts";

export async function loadCats() {
  if (import.meta.env.DEV) {
    const response = await fetch("/api/cats");

    return (await response.json()) as Cat[];
  } else {
    // Airtable integration here
    return cats;
  }
}
