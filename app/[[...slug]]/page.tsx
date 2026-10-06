import Experience from "@/components/experience";
import { notFound } from "next/navigation";

const knownRoutes = new Set([
  "",
  "presentation",
  "learn",
  "hermes",
  "playground",
  "missions",
  "final-mission",
  "cheatsheet",
  "instructor",
  "completion",
  ...[
    "01-code-detective",
    "02-bug-hunter",
    "03-safe-refactor",
    "04-agent-workflow",
  ].map((id) => `missions/${id}`),
]);

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  if (!knownRoutes.has(slug.join("/"))) notFound();
  return <Experience />;
}
