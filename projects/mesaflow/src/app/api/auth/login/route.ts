import { getStore, hashPassword } from "@/lib/store";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const store = getStore();
  const user = Object.values(store.users).find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.active,
  );
  if (!user || user.passwordHash !== hashPassword(String(password))) {
    return Response.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
  }
  const establishment = store.establishments[user.establishmentId];
  return Response.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    establishment,
  });
}
