// wishlist.js

document.addEventListener('DOMContentLoaded', function() {
  const wishlistContainer = document.getElementById('wishlistItens');
  let wishlist = JSON.parse(localStorage.getItem('ls_wishlist') || '[]');

  function resolveImgPath(img) {
    const isPublicPage = window.location.pathname.includes('/public/');
    if (!img) return isPublicPage ? '../assets/img/image-svgrepo-com.svg' : './assets/img/image-svgrepo-com.svg';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return img;
    if (img.startsWith('./') || img.startsWith('../')) return img;
    return isPublicPage ? `../assets/img/${img}` : `./assets/img/${img}`;
  }

  function renderWishlist() {
    if (!wishlist.length) {
      wishlistContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:20px;">Sua wishlist está vazia.</p>';
      return;
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
    wishlistContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
        ${wishlist.map((item, idx) => `
          <div class="wishlist-bloco" style="display:flex;align-items:center;gap:36px;background:#efdac5;border-radius:18px;padding:32px 40px;margin-bottom:32px;box-shadow:0 4px 16px rgba(26,54,93,0.10);max-width:700px;width:100%;">
            <img src="${resolveImgPath(item.img)}" alt="${item.nome}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;background:#fff;box-shadow:0 2px 8px #d9bfa3;">
            <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;">
              <h3 style="margin:0 0 18px 0;font-size:2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:700;">${item.nome}</h3>
              <span style="margin-bottom:18px;font-size:1.2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:600;">R$ ${(precos[item.id] || '--').toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              <div style="display:flex;gap:24px;">
                <button class="btn-add-cart" data-idx="${idx}" style="padding:12px 32px;background:none;border:2px solid #63b3ed;color:#1a365d;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Levar para o carrinho</button>
                <button class="btn-remove-wishlist" data-idx="${idx}" style="padding:12px 32px;background:none;border:2px solid #c53030;color:#c53030;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Remover</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Eventos dos botões
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const produto = wishlist[idx];
        let cart = JSON.parse(localStorage.getItem('ls_cart') || '[]');
        if (!cart.some(p => p.id === produto.id)) {
          cart.push(produto);
          localStorage.setItem('ls_cart', JSON.stringify(cart));
          alert('Produto adicionado ao carrinho!');
        } else {
          alert('Produto já está no carrinho!');
        }
      };
    });
    document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        wishlist.splice(idx, 1);
        localStorage.setItem('ls_wishlist', JSON.stringify(wishlist));
        renderWishlist();
      };
    });
  }

  renderWishlist();
}); 