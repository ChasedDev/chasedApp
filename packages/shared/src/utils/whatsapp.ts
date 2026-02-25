import { formatBRLMessage } from './currency';

export interface WhatsAppOrderData {
  pharmacy_name: string;
  responsible_name: string;
  pharmacy_whatsapp: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  cnpj?: string | null;
  items: Array<{
    name: string;
    presentation: string;
    qty: number;
    unit_price_cents: number;
    line_total_cents: number;
  }>;
  notes: string | null;
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
}

export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const itemLines = data.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} - ${item.presentation}\n` +
        `   Quantidade: ${item.qty}\n` +
        `   Unitário: ${formatBRLMessage(item.unit_price_cents)}\n` +
        `   Total: ${formatBRLMessage(item.line_total_cents)}`
    )
    .join('\n\n');

  return [
    '*NOVO PEDIDO*',
    '',
    '*Dados da Farmácia*',
    `Nome: ${data.pharmacy_name}`,
    data.cnpj ? `CNPJ: ${data.cnpj}` : null,
    `Responsável: ${data.responsible_name}`,
    `WhatsApp: ${data.pharmacy_whatsapp}`,
    `Endereço: ${data.address_line1}, ${data.city} - ${data.state}`,
    `CEP: ${data.zip}`,
    '',
    '*Itens do Pedido*',
    itemLines,
    '',
    '*Resumo Financeiro*',
    `Subtotal: ${formatBRLMessage(data.subtotal_cents)}`,
    data.discount_cents > 0
      ? `Desconto: ${formatBRLMessage(data.discount_cents)}`
      : null,
    `*TOTAL: ${formatBRLMessage(data.total_cents)}*`,
    '',
    '*Observações*',
    data.notes || 'Sem observações.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsAppUrl(digits: string, message: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
