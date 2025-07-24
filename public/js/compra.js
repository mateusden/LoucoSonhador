// Verificação de login antes de permitir acesso à página de compra
async function verificarLogin() {
  try {
    const response = await fetch('http://192.168.0.89:3001/api/users/check-auth', {
      credentials: 'include'
    });
    
    if (response.ok) {
      return true; // Usuário autenticado
    } else {
      // Se não estiver logado, redireciona para login
      window.location.href = './login.html';
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar login:', error);
    // Em caso de erro de conexão, não redireciona automaticamente
    // Permite que o usuário veja a página mas com aviso
    return false;
  }
}

// Executa verificação quando a página carrega
document.addEventListener('DOMContentLoaded', async function() {
  const isLoggedIn = await verificarLogin();
  
  if (!isLoggedIn) {
    // Adiciona aviso visual em vez de redirecionar automaticamente
    const main = document.querySelector('main');
    if (main) {
      const aviso = document.createElement('div');
      aviso.style.cssText = 'background:#fef5e7;border:1px solid #f6ad55;padding:1rem;margin:1rem;border-radius:8px;text-align:center;';
      aviso.innerHTML = '<p style="margin:0;color:#c05621;">⚠️ Você precisa estar logado para finalizar a compra. <a href="./login.html" style="color:#1a365d;font-weight:600;">Fazer Login</a></p>';
      main.insertBefore(aviso, main.firstChild);
    }
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