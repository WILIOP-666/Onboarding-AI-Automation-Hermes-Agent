export type Submission = { id: number; operationKey: string; payload: string };
const records: Submission[] = [];
let nextId = 1;

export function resetSubmissions(): void {
  records.splice(0, records.length);
  nextId = 1;
}
export function allSubmissions(): readonly Submission[] {
  return records;
}
export function submit(operationKey: string, payload: string): Submission {
  if (!operationKey.trim()) throw new Error("An operation key is required");
  // Seeded defect: the key is validated but never used to deduplicate retries.
  const record = { id: nextId++, operationKey, payload };
  records.push(record);
  return record;
}
