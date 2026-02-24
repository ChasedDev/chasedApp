import { formatBRLMessage } from './currency';

export interface WhatsAppOrderData {
  pharmacy_name: string;
  responsible_name: string;
  pharmacy_whatsapp: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
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
        `${idx + 1}) ${item.name} - ${item.presentation}\n   Qty: ${item.qty} | Unit: ${formatBRLMessage(item.unit_price_cents)} | Total: ${formatBRLMessage(item.line_total_cents)}`
    )
    .join('\n');

  return [
    'NEW ORDER - Chased',
    `Pharmacy: ${data.pharmacy_name}`,
    `Responsible: ${data.responsible_name}`,
    `WhatsApp: ${data.pharmacy_whatsapp}`,
    `Address: ${data.address_line1}, ${data.city}-${data.state}, ${data.zip}`,
    '',
    'Items:',
    itemLines,
    '',
    `Notes: ${data.notes || '—'}`,
    '',
    `Subtotal: ${formatBRLMessage(data.subtotal_cents)}`,
    `Discount: ${formatBRLMessage(data.discount_cents)}`,
    `TOTAL: ${formatBRLMessage(data.total_cents)}`,
    '',
    'Sent from Chased Web',
  ].join('\n');
}

export function buildWhatsAppUrl(digits: string, message: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
