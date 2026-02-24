import { describe, it, expect } from 'vitest';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@chased/shared';

const baseData = {
  pharmacy_name: 'Farmácia Central',
  responsible_name: 'João Silva',
  pharmacy_whatsapp: '5511999999999',
  address_line1: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  zip: '01234-567',
  items: [{ name: 'Paracetamol', presentation: '500mg, 20 comprimidos', qty: 2, unit_price_cents: 1990, line_total_cents: 3980 }],
  notes: 'Entregar terça-feira',
  subtotal_cents: 3980,
  discount_cents: 0,
  total_cents: 3980,
};

describe('buildWhatsAppMessage', () => {
  it('includes pharmacy name', () => { expect(buildWhatsAppMessage(baseData)).toContain('Farmácia Central'); });
  it('includes all required sections', () => {
    const msg = buildWhatsAppMessage(baseData);
    expect(msg).toContain('NEW ORDER - Chased');
    expect(msg).toContain('Pharmacy:');
    expect(msg).toContain('Responsible:');
    expect(msg).toContain('Items:');
    expect(msg).toContain('TOTAL:');
    expect(msg).toContain('Sent from Chased Web');
  });
  it('formats Brazilian currency correctly', () => {
    const msg = buildWhatsAppMessage(baseData);
    expect(msg).toContain('R$ 39,80');
    expect(msg).toContain('R$ 19,90');
  });
  it('shows dash for empty notes', () => { expect(buildWhatsAppMessage({ ...baseData, notes: null })).toContain('Notes: —'); });
  it('numbers items starting from 1', () => { expect(buildWhatsAppMessage(baseData)).toContain('1) Paracetamol'); });
  it('includes city and state in address', () => { expect(buildWhatsAppMessage(baseData)).toContain('São Paulo-SP'); });
});

describe('buildWhatsAppUrl', () => {
  it('builds correct URL', () => { expect(buildWhatsAppUrl('5511999999999', 'Hello World')).toBe('https://wa.me/5511999999999?text=Hello%20World'); });
  it('encodes special characters', () => { expect(buildWhatsAppUrl('5511999999999', 'Olá, tudo bem?')).toContain('Ol%C3%A1'); });
});
