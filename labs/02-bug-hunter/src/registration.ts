type User = { email: string };
const users: User[] = [];

export function resetUsers(): void {
  users.splice(0, users.length);
}
export function allUsers(): readonly User[] {
  return users;
}
export function register(email: string): {
  accepted: boolean;
  reason?: string;
} {
  const uniquenessKey = email.trim().toLocaleLowerCase("en");
  if (users.some((user) => user.email === uniquenessKey))
    return { accepted: false, reason: "Email already registered" };
  // Seeded defect: comparison uses a canonical key while persistence keeps raw input.
  users.push({ email });
  return { accepted: true };
}
