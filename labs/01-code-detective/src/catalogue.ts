export type CatalogueEntry = { id: string; title: string; category: string };

const entries: CatalogueEntry[] = [
  { id: "inspect", title: "Inspect the repository", category: "explore" },
  { id: "verify", title: "Verify the change", category: "quality" },
  { id: "scope", title: "Keep the task scoped", category: "workflow" },
];

export function searchCatalogue(query: string): CatalogueEntry[] {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (normalized.length === 0) return [...entries];
  return entries.filter((entry) =>
    `${entry.title} ${entry.category}`
      .toLocaleLowerCase("en")
      .includes(normalized),
  );
}
