// carrinho.js

document.addEventListener('DOMContentLoaded', function() {
  const carrinhoContainer = document.getElementById('carrinhoItens');
  let carrinho = JSON.parse(localStorage.getItem('ls_cart') || '[]');
  let selecionados = Array(carrinho.length).fill(false);

  function resolveImgPath(img) {
    const isPublicPage = window.location.pathname.includes('/public/');
    if (!img) return isPublicPage ? '../assets/img/image-svgrepo-com.svg' : './assets/img/image-svgrepo-com.svg';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return img;
    if (img.startsWith('./') || img.startsWith('../')) return img;
    return isPublicPage ? `../assets/img/${img}` : `./assets/img/${img}`;
  }

  function renderCarrinho() {
    if (!carrinho.length) {
      carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:1.5rem;">Seu carrinho está vazio.</p>';
      return;
    }
    // Garante que o array de seleção tenha o mesmo tamanho do carrinho
    if (selecionados.length !== carrinho.length) {
      selecionados = Array(carrinho.length).fill(false);
    }
    // Mapeamento de preços
    const precos = {
      "wallpaper-ben10-pago": 2.5,
      "paleta-ben10-paga": 1,
      "paleta-ben10-v2-paga": 1.5,
      "paleta-ben10-v3-paga": 2,
      "paleta-ben10-v4-paga": 2,
      "wallpaper-ben10-v2-pago": 3,
      "wallpaper-ben10-v3-pago": 2,
      "wallpaper-ben10-v4-pago": 2
    };
    carrinhoContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
        ${carrinho.map((item, idx) => `
          <div class="carrinho-bloco" style="display:flex;align-items:center;gap:36px;background:#efdac5;border-radius:18px;padding:32px 40px;margin-bottom:32px;box-shadow:0 4px 16px rgba(26,54,93,0.10);max-width:700px;width:100%;">
            <button class="btn-selecionar" data-idx="${idx}" aria-label="Selecionar produto" style="width:38px;height:38px;min-width:38px;min-height:38px;border-radius:50%;border:2.5px solid #1a365d;background:${selecionados[idx] ? '#1a365d' : 'none'};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s;margin-right:18px;">
              ${selecionados[idx] ? '<span style=\'display:block;width:18px;height:18px;border-radius:50%;background:#63b3ed;\'></span>' : ''}
            </button>
            <img src="${resolveImgPath(item.img)}" alt="${item.nome}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;background:#fff;box-shadow:0 2px 8px #d9bfa3;">
            <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;">
              <h3 style="margin:0 0 18px 0;font-size:2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:700;">${item.nome}</h3>
              <span style="margin-bottom:18px;font-size:1.2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:600;">R$ ${(precos[item.id] || '--').toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              <div style="display:flex;gap:24px;">
                <button class="btn-remove-carrinho" data-idx="${idx}" style="padding:12px 32px;background:none;border:2px solid #c53030;color:#c53030;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Remover</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Eventos dos botões de selecionar
    document.querySelectorAll('.btn-selecionar').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        selecionados[idx] = !selecionados[idx];
        renderCarrinho();
      };
    });

    // Eventos dos botões de remover
    document.querySelectorAll('.btn-remove-carrinho').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        carrinho.splice(idx, 1);
        selecionados.splice(idx, 1);
        localStorage.setItem('ls_cart', JSON.stringify(carrinho));
        renderCarrinho();
      };
    });
  }

  renderCarrinho();

  // Evento do botão de finalizar compra
  const finalizarBtn = document.getElementById('finalizarCompraBtn');
  if (finalizarBtn) {
    finalizarBtn.onclick = function() {
      const selecionadosProdutos = carrinho
        .map((item, idx) => selecionados[idx] ? item : null)
        .filter(item => item);
      if (selecionadosProdutos.length === 0) {
        alert('Selecione pelo menos um produto para finalizar a compra!');
        return;
      }
      if (selecionadosProdutos.length === 1) {
        // Redireciona para a página de compra do único selecionado
        window.location.href = `compra.html?id=${encodeURIComponent(selecionadosProdutos[0].id)}`;
      } else {
        // Soma os valores e monta o nome
        let total = 0;
        let nomes = [];
        // Buscar os preços dos produtos
        const precos = {
          "wallpaper-ben10-pago": 2.5,
          "paleta-ben10-paga": 1,
          "paleta-ben10-v2-paga": 1.5,
          "paleta-ben10-v3-paga": 2,
          "paleta-ben10-v4-paga": 2,
          "wallpaper-ben10-v2-pago": 3,
          "wallpaper-ben10-v3-pago": 2,
          "wallpaper-ben10-v4-pago": 2
        };
        const nomesProdutos = {
          "wallpaper-ben10-pago": "Wallpaper Idem Ben 10",
          "paleta-ben10-paga": "Paleta Idem Ben 10",
          "paleta-ben10-v2-paga": "Paleta Idem Ben 10 V2",
          "paleta-ben10-v3-paga": "Paleta Idem Ben 10 V3",
          "paleta-ben10-v4-paga": "Paleta Idem Ben 10 V4",
          "wallpaper-ben10-v2-pago": "Wallpaper Idem Ben 10 V2",
          "wallpaper-ben10-v3-pago": "Wallpaper Idem Ben 10 V3",
          "wallpaper-ben10-v4-pago": "Wallpaper Idem Ben 10 V4"
        };
        selecionadosProdutos.forEach(prod => {
          total += precos[prod.id] || 0;
          nomes.push(nomesProdutos[prod.id] || prod.nome);
        });
        // Redireciona passando nomes e valor total na query string
        window.location.href = `compra.html?nomes=${encodeURIComponent(nomes.join(' / '))}&total=${encodeURIComponent(total.toFixed(2))}`;
      }
    };
  }
}); 