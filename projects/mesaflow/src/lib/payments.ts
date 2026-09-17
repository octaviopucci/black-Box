import type { Payment, PaymentMethod } from "@/lib/types";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  credit: "Crédito",
  debit: "Débito",
  pix: "PIX",
  other: "Outro",
};

export function formatPaymentMethod(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] ?? method;
}

export function sumRegisteredPayments(payments: Payment[]): number {
  return payments
    .filter((payment) => payment.status === "registered")
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function validatePaymentAmount(amount: number, maxAmount?: number): string | null {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Informe um valor maior que zero.";
  }
  if (maxAmount !== undefined && amount > maxAmount + 0.009) {
    return "Valor acima do saldo pendente.";
  }
  return null;
}
