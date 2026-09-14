import {
  createRodizioRound,
  findEstablishmentBySlug,
  findTableByQr,
  getOrOpenCommand,
  getStore,
} from "@/lib/store";
import type { OrderItem } from "@/lib/types";

export async function POST(req: Request) {
  const { slug, tableToken, rodizioId, items } = await req.json() as {
    slug: string;
    tableToken: string;
    rodizioId: string;
    items: OrderItem[];
  };

  const est = findEstablishmentBySlug(slug);
  if (!est?.rodizioEnabled) return Response.json({ error: "Rodízio indisponível." }, { status: 400 });
  const table = findTableByQr(est.id, tableToken);
  if (!table) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  const store = getStore();
  const rodizio = store.rodizios[rodizioId];
  if (!rodizio) return Response.json({ error: "Rodízio não encontrado." }, { status: 404 });
  if (items.length > rodizio.maxItemsPerRound) {
    return Response.json({ error: `Máximo ${rodizio.maxItemsPerRound} itens por rodada.` }, { status: 400 });
  }

  const command = getOrOpenCommand(table);
  const round = createRodizioRound({
    establishmentId: est.id,
    table,
    commandId: command.id,
    rodizioId,
    items,
  });

  return Response.json({ round, message: "Rodada enviada para a cozinha." });
}
