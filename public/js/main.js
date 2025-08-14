// Elementos do DOM
const select = document.getElementById('category');
const orderSelect = document.getElementById('orderBy');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productsContainer = document.querySelector('.free-products');
let produtosGlobais = [];

// Função para ajustar caminho da imagem
function resolveImgPath(img) {
  if (!img) return './assets/img/image-svgrepo-com.svg';
  if (img.startsWith('http') || img.startsWith('/') || img.startsWith('./') || img.startsWith('../')) return img;
  return `./assets/img/${img}`;
}

// Função utilitária para montar link de compra/detalhes
function getCompraHref(produtoId) { return `./compra.html?id=${produtoId}`; }
function getDetalhesHref(produtoId) { return `./detalhes.html?id=${produtoId}`; }

// Extrair preço do texto
function extractPrice(priceText) {
  const match = priceText.match(/R\$\s*([\d,]+\.?\d*)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

// Nome e preço do produto no DOM
function getProductName(product) { return product.querySelector('h2')?.textContent.trim() || ''; }
function getProductPrice(product) {
  for (let el of product.querySelectorAll('h2')) {
    if (el.textContent.includes('R$')) return extractPrice(el.textContent.trim());
  }
  return 0;
}

// Filtrar e ordenar produtos no DOM
function filtrarEOrdenarProdutos() {
  const selectedCategory = select?.value || 'todas';
  const searchTerm = searchInput?.value.toLowerCase() || '';
  const orderBy = orderSelect?.value || 'name-asc';
  
  const allProducts = document.querySelectorAll('.product-1');
  let visibleProducts = [];

  allProducts.forEach(prod => {
    const category = prod.getAttribute('data-category');
    const name = getProductName(prod);
    const matchesCategory = selectedCategory === 'todas' || category === selectedCategory;
    const matchesSearch = name.toLowerCase().includes(searchTerm);
    
    if (matchesCategory && matchesSearch) {
      visibleProducts.push(prod);
      prod.style.display = '';
    } else prod.style.display = 'none';
  });

  visibleProducts.sort((a, b) => {
    const nameA = getProductName(a), nameB = getProductName(b);
    const priceA = getProductPrice(a), priceB = getProductPrice(b);
    switch (orderBy) {
      case 'name-asc': return nameA.localeCompare(nameB, 'pt-BR');
      case 'name-desc': return nameB.localeCompare(nameA, 'pt-BR');
      case 'price-asc': return priceA - priceB;
      case 'price-desc': return priceB - priceA;
      default: return 0;
    }
  });

  visibleProducts.forEach(prod => productsContainer?.appendChild(prod));
}

// Renderizar produtos filtrados a partir do fetch
function renderizarProdutosFiltrados() {
  const container = document.getElementById('produtos');
  if (!container) return container.innerHTML = '';
  
  const categoriaSelecionada = select?.value || 'todas';
  const termoBusca = searchInput?.value.toLowerCase() || '';
  const orderBy = orderSelect?.value || 'name-asc';

  let filtrados = produtosGlobais.filter(p => {
    const nome = p.nome?.toLowerCase() || '';
    const categoria = p.categoria || '';
    return (categoriaSelecionada === 'todas' || categoria === categoriaSelecionada) && nome.includes(termoBusca);
  });

  filtrados.sort((a,b) => {
    switch(orderBy) {
      case 'name-asc': return (a.nome || '').localeCompare(b.nome || '', 'pt-BR');
      case 'name-desc': return (b.nome || '').localeCompare(a.nome || '', 'pt-BR');
      case 'price-asc': return (a.preco||0)-(b.preco||0);
      case 'price-desc': return (b.preco||0)-(a.preco||0);
      default: return 0;
    }
  });

  container.innerHTML = '';
  filtrados.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-1';
    div.setAttribute('data-category', p.categoria || '');
    div.innerHTML = `
      <img class="product-img" src="${resolveImgPath(p.imagem)}" alt="">
      <h2>${p.nome}</h2>
      <h2>R$ ${(p.preco||0).toFixed(2).replace('.',',')}</h2>
      <div class="product-actions">
        <button><a class="download-preview" href="${getCompraHref(p.id)}">Comprar</a></button>
        <button><a class="details" href="${getDetalhesHref(p.id)}">Ver detalhes</a></button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Inicialização da página
window.addEventListener('DOMContentLoaded', () => {
  // Categorias da URL
  const urlParams = new URLSearchParams(window.location.search);
  if (select) {
    const categoria = urlParams.get('categoria');
    select.value = (categoria==='wallpaper'||categoria==='paleta') ? categoria : 'todas';
  }

  // Listeners
  select?.addEventListener('change', renderizarProdutosFiltrados);
  orderSelect?.addEventListener('change', renderizarProdutosFiltrados);
  searchInput?.addEventListener('input', renderizarProdutosFiltrados);
  searchBtn?.addEventListener('click', renderizarProdutosFiltrados);
  searchInput?.addEventListener('keypress', e=>{if(e.key==='Enter') renderizarProdutosFiltrados();});

  // Fetch produtos
  fetch('/api/produtos')
    .then(res => res.json())
    .then(produtos => { produtosGlobais = produtos; renderizarProdutosFiltrados(); })
    .catch(err => console.error('Erro fetch produtos:', err));

  // Fetch downloads
  fetch('/api/downloads')
    .then(res=>res.json())
    .then(downloads=>{
      const container = document.getElementById('downloads');
      if(!container) return;
      container.innerHTML = '';
      downloads.forEach(d=>{
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(d.arquivo);
        const imgSrc = isImage ? `/downloads/${d.arquivo}` : './assets/img/icone-download.png';
        const downloadLink = `/api/downloads/file/${d.arquivo}`;
        const detalhesLink = `./detalhes.html?id=${d.id}`;
        const div = document.createElement('div');
        div.className='product-1';
        div.setAttribute('data-category','wallpaper');
        div.innerHTML=`
          <img class="product-img" src="${imgSrc}" alt="">
          <h2>${d.nome}</h2>
          <div class="product-actions">
            <button><a class="download-preview" href="${downloadLink}" download>Download</a></button>
            <button><a class="details" href="${detalhesLink}">Ver detalhes</a></button>
          </div>
        `;
        container.appendChild(div);
      });
    })
    .catch(err=>console.error('Erro fetch downloads:', err));
});

// Função global para atualizar contadores (wishlist/carrinho)
window.atualizarContadores = function() {
  if(typeof window.atualizarWishlist==='function') window.atualizarWishlist();
  if(typeof window.atualizarCarrinho==='function') window.atualizarCarrinho();
};
