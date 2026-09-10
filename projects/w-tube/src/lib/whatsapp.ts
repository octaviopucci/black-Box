import { storeConfig } from "@/config/store";
import { formatCurrency } from "@/lib/formatCurrency";
import type { CartItem, CheckoutForm } from "@/types";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(
  productName: string,
  price: number,
  productUrl: string
): string {
  return `Olá! Vi este produto no site da ${storeConfig.name} e gostaria de saber mais:

${productName}
${formatCurrency(price)}
${productUrl}`;
}

export function buildOrderWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  savings: number,
  customer: CheckoutForm
): string {
  const lines = items.map((item, i) => {
    const parts = [
      `${i + 1}x ${item.name}`,
      item.color ? `Cor: ${item.color}` : null,
      item.storage ? `Armazenamento: ${item.storage}` : null,
      `Valor: ${formatCurrency(item.price * item.quantity)}`,
    ].filter(Boolean);
    return parts.join("\n");
  });

  const savingsLine =
    savings > 0 ? `\nEconomia: ${formatCurrency(savings)}` : "";

  return `Olá! 👋 Quero fazer um pedido na ${storeConfig.name}.

🛒 MEU PEDIDO

${lines.join("\n\n")}

--------------------
Subtotal: ${formatCurrency(subtotal)}${savingsLine}

👤 CLIENTE
Nome: ${customer.name}
Telefone: ${customer.phone}
Cidade: ${customer.city} - ${customer.state}

🚚 Entrega: ${customer.delivery}

${customer.notes ? `📝 Observações: ${customer.notes}\n\n` : ""}Gostaria de confirmar disponibilidade e condições de pagamento.`;
}
