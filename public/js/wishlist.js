// wishlist.js

document.addEventListener('DOMContentLoaded', function() {
  const wishlistContainer = document.getElementById('wishlistItens');
  let produtosDetalhes = {};

  // Busca detalhes de um produto pelo id
  async function buscarProduto(id) {
    if (produtosDetalhes[id]) return produtosDetalhes[id];
    const res = await fetch(`http://192.168.0.89:3001/api/produtos/${id}`);
    if (!res.ok) return null;
    const prod = await res.json();
    produtosDetalhes[id] = prod;
    return prod;
  }

  async function listarWishlist() {
    // Busca os itens da wishlist do backend
    const res = await fetch('http://192.168.0.89:3001/api/wishlist', { credentials: 'include' });
    if (!res.ok) {
      wishlistContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:20px;">Faça login para ver sua wishlist.</p>';
      return;
    }
    const itens = await res.json();
    if (!itens.length) {
      wishlistContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:20px;">Sua wishlist está vazia.</p>';
      return;
    }
    // Busca detalhes dos produtos
    const detalhes = await Promise.all(itens.map(item => buscarProduto(item.product_id)));
    wishlistContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
        ${itens.map((item, idx) => {
          const prod = detalhes[idx] || {};
          const imgSrc = prod.imagem ? `../assets/img/${prod.imagem}` : './assets/img/image-svgrepo-com.svg';
          
          return `
          <div class="wishlist-bloco" style="display:flex;align-items:center;gap:36px;background:#efdac5;border-radius:18px;padding:32px 40px;margin-bottom:32px;box-shadow:0 4px 16px rgba(26,54,93,0.10);max-width:700px;width:100%;">
            <img src="${imgSrc}" alt="${prod.nome || ''}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;background:#fff;box-shadow:0 2px 8px #d9bfa3;">
            <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;">
              <h3 style="margin:0 0 18px 0;font-size:2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:700;">${prod.nome || item.product_id}</h3>
              <span style="margin-bottom:18px;font-size:1.2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:600;">R$ ${(prod.preco || '--').toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              <div style="display:flex;gap:24px;">
                <button class="btn-add-cart" data-product-id="${item.product_id}" style="padding:12px 32px;background:none;border:2px solid #63b3ed;color:#1a365d;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Levar para o carrinho</button>
                <button class="btn-remove-wishlist" data-product-id="${item.product_id}" style="padding:12px 32px;background:none;border:2px solid #c53030;color:#c53030;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Remover</button>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
    // Eventos dos botões
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.onclick = async function() {
        const productId = btn.getAttribute('data-product-id');
        // Adiciona ao carrinho via backend
        const res = await fetch('http://192.168.0.89:3001/api/carrinho', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, quantidade: 1 })
        });
        if (res.ok) {
          alert('Produto adicionado ao carrinho!');
          // Atualizar contadores na navegação
          if (typeof window.atualizarContadores === 'function') {
            window.atualizarContadores();
          }
        } else {
          alert('Erro ao adicionar ao carrinho.');
        }
      };
    });
    document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
      btn.onclick = async function() {
        const productId = btn.getAttribute('data-product-id');
        await fetch(`http://192.168.0.89:3001/api/wishlist/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        listarWishlist();
        // Atualizar contadores na navegação
        if (typeof window.atualizarContadores === 'function') {
          window.atualizarContadores();
        }
      };
    });
  }

  listarWishlist();
}); 