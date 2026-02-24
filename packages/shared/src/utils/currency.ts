export function formatBRL(cents: number): string {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatBRLMessage(cents: number): string {
  const value = cents / 100;
  const formatted = value.toFixed(2).replace('.', ',');
  return `R$ ${formatted}`;
}
