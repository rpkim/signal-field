import { listSavedMixes } from "@/lib/savedMixes";
import { SavedMixesClient } from "./SavedMixesClient";

export async function SavedMixes() {
  const items = await listSavedMixes();
  return <SavedMixesClient items={items} />;
}
