export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Suporte</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-3">
        <div className="text-4xl">🤝</div>
        <h2 className="font-semibold text-lg">Fale com seu representante</h2>
        <p className="text-gray-500 text-sm">Para dúvidas sobre produtos, pedidos ou condições comerciais, entre em contato diretamente com seu representante via WhatsApp.</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
        <h3 className="font-semibold">FAQ</h3>
        <details className="text-sm"><summary className="cursor-pointer py-2 text-gray-700 font-medium">Como faço um pedido?</summary><p className="text-gray-500 pl-3 pb-2">Selecione os produtos, adicione ao carrinho, vá ao checkout e envie via WhatsApp.</p></details>
        <details className="text-sm"><summary className="cursor-pointer py-2 text-gray-700 font-medium">Como altero meu pedido?</summary><p className="text-gray-500 pl-3 pb-2">Entre em contato com o representante via WhatsApp informando o número do pedido.</p></details>
        <details className="text-sm"><summary className="cursor-pointer py-2 text-gray-700 font-medium">Qual o prazo de entrega?</summary><p className="text-gray-500 pl-3 pb-2">O prazo varia conforme a região. Consulte seu representante.</p></details>
      </div>
    </div>
  );
}
