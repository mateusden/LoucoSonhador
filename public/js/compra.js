// Verificação de login antes de permitir acesso à página de compra
function verificarLogin() {
  const loggedUser = localStorage.getItem('ls_logged_user');
  
  if (!loggedUser) {
    // Se não estiver logado, redireciona para login
    window.location.href = './login.html';
    return false;
  }
  return true;
}

// Executa verificação quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  if (!verificarLogin()) {
    return; // Para a execução se não estiver logado
  }

  // Pega os parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const nomesParam = params.get('nomes');
  const totalParam = params.get('total');
  const id = params.get('id');

  // Se vierem nomes e total, mostra eles
  if (nomesParam && totalParam) {
    const produtoNome = document.getElementById('produto-nome');
    if (produtoNome) {
      produtoNome.textContent = nomesParam;
    }
    const produtoValor = document.getElementById('produto-valor');
    if (produtoValor) {
      produtoValor.textContent = `💰 Valor: R$ ${Number(totalParam).toFixed(2)}`;
    }
    // QR Code fixo (relativo)
    const qrCode = document.getElementById('qr-code');
    if (qrCode) {
      qrCode.src = '../assets/img/qrcode-semvalor.jpg';
      qrCode.alt = 'QR Code para pagamento via PIX';
      console.log('QR code src set to', qrCode.src);
    }
  } else {
    // Nome e valor do produto (mantém)
    const produtos = {
      "wallpaper-ben10-pago": { preco: 2.5, nome: "Wallpaper Idem Ben 10" },
      "paleta-ben10-paga": { preco: 1, nome: "Paleta Idem Ben 10" },
      "paleta-ben10-v2-paga": { preco: 1.5, nome: "Paleta Idem Ben 10 V2" },
      "paleta-ben10-v3-paga": { preco: 2, nome: "Paleta Idem Ben 10 V3" },
      "paleta-ben10-v4-paga": { preco: 2, nome: "Paleta Idem Ben 10 V4" },
      "wallpaper-ben10-v2-pago": { preco: 3, nome: "Wallpaper Idem Ben 10 V2" },
      "wallpaper-ben10-v3-pago": { preco: 2, nome: "Wallpaper Idem Ben 10 V3" },
      "wallpaper-ben10-v4-pago": { preco: 2, nome: "Wallpaper Idem Ben 10 V4" }
    };
    const produto = produtos[id] || produtos["wallpaper-ben10-pago"];

    // QR Code fixo (relativo)
    const qrCode = document.getElementById('qr-code');
    if (qrCode) {
      qrCode.src = '../assets/img/qrcode-semvalor.jpg';
      qrCode.alt = 'QR Code para pagamento via PIX';
      console.log('QR code src set to', qrCode.src);
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
}); 