// Script para exibir o QR code correto na página de compra
const produtos = {
  "wallpaper-ben10-pago": { preco: 2.5, qr: "2.5qr-code.jpg", nome: "Wallpaper Idem Ben 10" },
  "paleta-ben10-paga": { preco: 1, qr: "qr-code.jpg", nome: "Paleta Idem Ben 10" },
  "paleta-ben10-v2-paga": { preco: 1.5, qr: "1.5qr-code.jpg", nome: "Paleta Idem Ben 10 V2" },
  "paleta-ben10-v3-paga": { preco: 2, qr: "2qr-code.jpg", nome: "Paleta Idem Ben 10 V3" },
  "paleta-ben10-v4-paga": { preco: 2, qr: "2qr-code.jpg", nome: "Paleta Idem Ben 10 V4" },
  // Adicione outros produtos conforme necessário
};
// IDs repetidos para wallpapers, conforme HTML
produtos["wallpaper-ben10-v2-pago"] = { preco: 3, qr: "3qr-code.jpg", nome: "Wallpaper Idem Ben 10 V2" };
produtos["wallpaper-ben10-v3-pago"] = { preco: 2, qr: "2qr-code.jpg", nome: "Wallpaper Idem Ben 10 V3" };
produtos["wallpaper-ben10-v4-pago"] = { preco: 2, qr: "2qr-code.jpg", nome: "Wallpaper Idem Ben 10 V4" };

// Pega o id da URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const produto = produtos[id] || produtos["wallpaper-ben10-pago"];

// Atualiza as informações da página
if (produto) {
  // QR Code
  const qrCode = document.getElementById('qr-code');
  if (qrCode) {
    qrCode.src = `./assets/img/${produto.qr}`;
    qrCode.alt = `QR Code para pagamento de R$ ${produto.preco.toFixed(2)}`;
  }
  
  // Nome do produto
  const produtoNome = document.getElementById('produto-nome');
  if (produtoNome) {
    produtoNome.textContent = produto.nome;
  }
  
  // Valor do produto
  const produtoValor = document.getElementById('produto-valor');
  if (produtoValor) {
    produtoValor.textContent = `💰 Valor: R$ ${produto.preco.toFixed(2)}`;
  }
} 