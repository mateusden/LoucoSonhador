// Função para adicionar ao carrinho via backend
function adicionarAoCarrinho(productId) {
  fetch('/api/carrinho', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantidade: 1 })
  })
  .then(res => {
    if (res.status === 401) throw new Error('Não autorizado - Faça login primeiro');
    if (res.status === 403) throw new Error('Sessão expirada - Faça login novamente');
    if (!res.ok) throw new Error('Erro no servidor');
    return res.json();
  })
  .then(data => {
    if (data.success) {
      alert('Produto adicionado ao carrinho!');
      if (typeof window.atualizarContadores === 'function') window.atualizarContadores();
    } else {
      alert('Erro ao adicionar ao carrinho.');
    }
  })
  .catch(error => {
    console.error('Erro ao adicionar ao carrinho:', error);
    if (error.message.includes('Faça login')) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho. Clique em "Login" no menu superior.');
    } else {
      alert('Erro ao adicionar ao carrinho: ' + error.message);
    }
  });
}

// Função para adicionar à wishlist via backend
function adicionarWishlist(productId) {
  fetch('/api/wishlist', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId })
  })
  .then(res => {
    if (res.status === 401) throw new Error('Não autorizado - Faça login primeiro');
    if (res.status === 403) throw new Error('Sessão expirada - Faça login novamente');
    if (!res.ok) throw new Error('Erro no servidor');
    return res.json();
  })
  .then(data => {
    if (data.success) {
      alert('Produto adicionado à wishlist!');
      if (typeof window.atualizarContadores === 'function') window.atualizarContadores();
    } else {
      alert('Erro ao adicionar à wishlist.');
    }
  })
  .catch(error => {
    console.error('Erro ao adicionar à wishlist:', error);
    if (error.message.includes('Faça login')) {
      alert('Você precisa estar logado para adicionar produtos à wishlist. Clique em "Login" no menu superior.');
    } else {
      alert('Erro ao adicionar à wishlist: ' + error.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const detalheContainer = document.getElementById('detalhe-produto');

  // Função para renderizar produto
  function renderizarProduto(produto) {
    detalheContainer.innerHTML = `
      <div class="detalhe-container">
        <nav class="detalhe-breadcrumb">Produtos &gt; ${produto.nome}</nav>
        <div class="detalhe-conteudo">
          <div class="detalhe-img" style="flex-direction:column;align-items:center;justify-content:center;">
            <img src="/assets/img/${produto.imagem}" alt="${produto.nome}">
          </div>
          <div class="detalhe-info">
            <h2>${produto.nome}</h2>
            <p>${produto.descricao}</p>
            <h3>💰 Valor: R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</h3>
            <h3>💡 Como usar:</h3>
            <p>Baixe a imagem e utilize em seu projeto!</p>
            <a href="compra.html?id=${produto.id}" class="compra-btn">Comprar agora</a>
          </div>
        </div>
        <div style="width:100%;max-width:340px;display:flex;flex-direction:column;align-items:center;margin:32px auto 0 auto;">
          <button id="btnAddWishlist" style="width:100%;margin-bottom:10px;padding:12px 0;background:#1a365d;color:#fff;font-size:1.1rem;border:none;border-radius:8px;cursor:pointer;">Adicionar à sua Lista de Desejos</button>
          <button id="btnAddCarrinho" style="width:100%;padding:12px 0;background:#63b3ed;color:#1a365d;font-size:1.1rem;border:none;border-radius:8px;cursor:pointer;">Adicionar ao seu carrinho</button>
        </div>
      </div>
    `;
    document.getElementById('btnAddCarrinho').onclick = () => adicionarAoCarrinho(produto.id);
    document.getElementById('btnAddWishlist').onclick = () => adicionarWishlist(produto.id);
  }

  // Função para renderizar download
  function renderizarDownload(download) {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(download.arquivo);
    const imgSrc = isImage ? `/downloads/${download.arquivo}` : '/assets/img/icone-download.png';

    detalheContainer.innerHTML = `
      <div class="detalhe-container">
        <nav class="detalhe-breadcrumb">Downloads &gt; ${download.nome}</nav>
        <div class="detalhe-conteudo">
          <div class="detalhe-img" style="flex-direction:column;align-items:center;justify-content:center;">
            <img src="${imgSrc}" alt="${download.nome}">
          </div>
          <div class="detalhe-info">
            <h2>${download.nome}</h2>
            <p>${download.descricao || ''}</p>
            <a href="/api/downloads/file/${download.arquivo}" class="download-btn" download>Baixar arquivo</a>
          </div>
        </div>
      </div>
    `;
  }

  // Primeiro tenta buscar como produto
  fetch(`/api/produtos/${id}`)
    .then(res => {
      if (res.ok) return res.json();
      // Se não achou produto, tenta como download
      return fetch(`/api/downloads/${id}`)
        .then(res2 => {
          if (res2.ok) return res2.json();
          throw new Error('Produto ou download não encontrado');
        })
        .then(download => ({ tipo: 'download', data: download }));
    })
    .then(data => {
      if (data.tipo === 'download') renderizarDownload(data.data);
      else renderizarProduto(data);
    })
    .catch(() => {
      detalheContainer.innerHTML = "<p class='detalhe-erro'>Produto ou download não encontrado.</p>";
    });
});