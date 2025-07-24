// Elementos do DOM
const select = document.getElementById('category');
const orderSelect = document.getElementById('orderBy');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const products = document.querySelectorAll('.product-1');
const productsContainer = document.querySelector('.free-products');

// Detecta se está em uma página dentro de /public/
const isPublicPage = window.location.pathname.includes('/public/');

// Função para ajustar o caminho da imagem
function resolveImgPath(img) {
  const isPublicPage = window.location.pathname.includes('/public/');
  if (!img) return isPublicPage ? '../assets/img/image-svgrepo-com.svg' : './assets/img/image-svgrepo-com.svg';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return img;
  if (img.startsWith('./') || img.startsWith('../')) return img;
  // Se for só o nome do arquivo, monta o caminho certo
  return isPublicPage ? `../assets/img/${img}` : `./assets/img/${img}`;
}

// Função para obter parâmetros da URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Função para extrair preço do texto
function extractPrice(priceText) {
  const match = priceText.match(/R\$\s*([\d,]+\.?\d*)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return 0;
}

// Função para obter nome do produto
function getProductName(product) {
  const nameElement = product.querySelector('h2');
  return nameElement ? nameElement.textContent.trim() : '';
}

// Função para obter preço do produto
function getProductPrice(product) {
  const priceElements = product.querySelectorAll('h2');
  for (let element of priceElements) {
    const text = element.textContent.trim();
    if (text.includes('R$')) {
      return extractPrice(text);
    }
  }
  return 0;
}

// Função para filtrar e ordenar produtos
function filtrarEOrdenarProdutos() {
  const selectedCategory = select ? select.value : 'todas';
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const orderBy = orderSelect ? orderSelect.value : 'name-asc';
  
  let visibleProducts = [];
  
  products.forEach(prod => {
    const category = prod.getAttribute('data-category');
    const name = getProductName(prod);
    const matchesCategory = selectedCategory === 'todas' || category === selectedCategory;
    const matchesSearch = name.toLowerCase().includes(searchTerm);
    
    if (matchesCategory && matchesSearch) {
      visibleProducts.push(prod);
      prod.style.display = '';
    } else {
      prod.style.display = 'none';
    }
  });
  
  // Ordenar produtos
  visibleProducts.sort((a, b) => {
    const nameA = getProductName(a);
    const nameB = getProductName(b);
    const priceA = getProductPrice(a);
    const priceB = getProductPrice(b);
    
    switch (orderBy) {
      case 'name-asc':
        return nameA.localeCompare(nameB, 'pt-BR');
      case 'name-desc':
        return nameB.localeCompare(nameA, 'pt-BR');
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      default:
        return 0;
    }
  });
  
  // Reordenar no DOM
  if (productsContainer) {
    visibleProducts.forEach(prod => {
      productsContainer.appendChild(prod);
    });
  }
}

// Função para aplicar categoria da URL e filtrar produtos
function aplicarCategoriaDaUrl() {
  if (select) {
    const categoriaUrl = getUrlParameter('categoria');
    if (categoriaUrl && (categoriaUrl === 'wallpaper' || categoriaUrl === 'paleta')) {
      select.value = categoriaUrl;
    } else {
      select.value = 'todas';
    }
  }
}

let produtosGlobais = []; // Para armazenar todos os produtos carregados
// Função para renderizar produtos filtrando por categoria, busca e ordenação
function renderizarProdutosFiltrados() {
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = "";

  const categoriaSelecionada = select ? select.value : 'todas';
  const termoBusca = searchInput ? searchInput.value.toLowerCase() : '';
  const orderBy = orderSelect ? orderSelect.value : 'name-asc';

  // Filtra
  let filtrados = produtosGlobais.filter(produto => {
    const categoria = produto.categoria || "";
    const nome = produto.nome ? produto.nome.toLowerCase() : "";
    const matchesCategoria = categoriaSelecionada === 'todas' || categoria === categoriaSelecionada;
    const matchesBusca = nome.includes(termoBusca);
    return matchesCategoria && matchesBusca;
  });

  // Ordena
  filtrados.sort((a, b) => {
    const nameA = a.nome || "";
    const nameB = b.nome || "";
    const priceA = Number(a.preco) || 0;
    const priceB = Number(b.preco) || 0;
    switch (orderBy) {
      case 'name-asc': return nameA.localeCompare(nameB, 'pt-BR');
      case 'name-desc': return nameB.localeCompare(nameA, 'pt-BR');
      case 'price-asc': return priceA - priceB;
      case 'price-desc': return priceB - priceA;
      default: return 0;
    }
  });

  // Renderiza
  filtrados.forEach(produto => {
    const categoria = produto.categoria || "";
    const imagemSrc = "../assets/img/" + produto.imagem;
    const div = document.createElement('div');
    div.className = "product-1";
    div.setAttribute('data-category', categoria);
    div.innerHTML = `
      <img class="product-img" src="${imagemSrc}" alt="">
      <h2>${produto.nome}</h2>
      <h2>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</h2>
      <div class="product-actions">
        <button><a class="download-preview" href="${getCompraHref(produto.id)}">Comprar</a></button>
        <button><a class="details" href="${getDetalhesHref(produto.id)}">Ver detalhes</a></button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Dropdown Wishlist e Carrinho na nav
function setupNavDropdown(dropdownId, linkId, previewId, countId, storageKey, pageUrl, emptyMsg) {
  const link = document.getElementById(linkId);
  const dropdown = document.getElementById(dropdownId);
  const preview = document.getElementById(previewId);
  const count = document.getElementById(countId);

  // Função para buscar dados do backend
  async function buscarDadosBackend() {
    try {
      const endpoint = storageKey === 'ls_wishlist' ? '/api/wishlist' : '/api/carrinho';
      const response = await fetch(`http://192.168.0.89:3001${endpoint}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const items = await response.json();
        // Buscar detalhes dos produtos para mostrar no dropdown
        const itemsComDetalhes = await Promise.all(
          items.map(async (item) => {
            try {
              const prodResponse = await fetch(`http://192.168.0.89:3001/api/produtos/${item.product_id}`);
              if (prodResponse.ok) {
                const produto = await prodResponse.json();
                return {
                  id: item.product_id,
                  nome: produto.nome,
                  imagem: produto.imagem,
                  preco: produto.preco
                };
              }
              return { id: item.product_id, nome: 'Produto', imagem: null };
            } catch (error) {
              return { id: item.product_id, nome: 'Produto', imagem: null };
            }
          })
        );
        return itemsComDetalhes;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar dados do backend:', error);
      return [];
    }
  }

  async function renderPreview() {
    const items = await buscarDadosBackend();
    count.textContent = items.length;
    
    if (items.length === 0) {
      preview.innerHTML = `<div style='padding:0.75rem 1.5rem;color:#1a365d;'>${emptyMsg}</div>`;
    } else {
      preview.innerHTML = items.slice(0,3).map((item, idx) => {
        let imgSrc = resolveImgPath(item.imagem);
        return `
          <div style='display:flex;align-items:center;gap:10px;padding:0.5rem 1.5rem;'>
            <img src="${imgSrc}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:8px;background:#fff;">
            <a href="#" style="flex:1;text-decoration:none;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-size:20px;gap:10px;">${item.nome || 'Produto'}</a>
            <button class="btn-remove-dropdown" data-id="${item.id}" title="Remover" style="background:none;border:none;color:#c53030;font-size:22px;cursor:pointer;padding:0 6px;">&times;</button>
          </div>
        `;
      }).join('');
      
      // Adiciona evento de remover
      setTimeout(() => {
        const btns = preview.querySelectorAll('.btn-remove-dropdown');
        btns.forEach(btn => {
          btn.onclick = async function(e) {
            e.preventDefault();
            const productId = btn.getAttribute('data-id');
            const endpoint = storageKey === 'ls_wishlist' ? '/api/wishlist' : '/api/carrinho';
            
            try {
              const response = await fetch(`http://192.168.0.89:3001${endpoint}/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
              });
              
              if (response.ok) {
                renderPreview(); // Atualiza o dropdown
              } else {
                alert('Erro ao remover item');
              }
            } catch (error) {
              console.error('Erro ao remover item:', error);
              alert('Erro ao remover item');
            }
          };
        });
      }, 10);
      
      if (items.length > 3) {
        preview.innerHTML += `<div style='padding:0.5rem 1.5rem;color:#888;'>+${items.length-3} mais...</div>`;
      }
    }
  }

  if (link && dropdown) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      renderPreview();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !link.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
  
  // Atualiza contador ao carregar
  renderPreview();
  
  // Retorna função para atualizar externamente
  return renderPreview;
}

// Função utilitária para montar o link correto para compra
function getCompraHref(produtoId) {
  const isPublicPage = window.location.pathname.includes('/public/');
  return isPublicPage ? `./compra.html?id=${produtoId}` : `./public/compra.html?id=${produtoId}`;
}

// Função utilitária para montar o link correto para detalhes
function getDetalhesHref(produtoId) {
  const isPublicPage = window.location.pathname.includes('/public/');
  return isPublicPage ? `./detalhes.html?id=${produtoId}` : `./public/detalhes.html?id=${produtoId}`;
}

// Event listeners
if (select && products.length > 0) {
  select.addEventListener('change', filtrarEOrdenarProdutos);
}

if (orderSelect) {
  orderSelect.addEventListener('change', filtrarEOrdenarProdutos);
}

if (searchInput) {
  searchInput.addEventListener('input', filtrarEOrdenarProdutos);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      filtrarEOrdenarProdutos();
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', filtrarEOrdenarProdutos);
}

// Inicialização
window.addEventListener('DOMContentLoaded', function() {
  aplicarCategoriaDaUrl();
  filtrarEOrdenarProdutos();
  
  // Armazenar funções de atualização globalmente
  window.atualizarWishlist = setupNavDropdown('wishlistDropdown', 'wishlistNavLink', 'wishlistPreview', 'wishlistCount', 'ls_wishlist', './public/wishlist.html', 'Sua wishlist está vazia.');
  window.atualizarCarrinho = setupNavDropdown('cartDropdown', 'cartNavLink', 'cartPreview', 'cartCount', 'ls_cart', './public/carrinho.html', 'Seu carrinho está vazio.');

  // Substituir o fetch de produtos para usar o filtro de categoria, busca e ordenação
  fetch('http://192.168.0.89:3001/api/produtos')
    .then(res => res.json())
    .then(produtos => {
      produtosGlobais = produtos; // Salva todos os produtos
      renderizarProdutosFiltrados(); // Renderiza já filtrando
      if (select) select.addEventListener('change', renderizarProdutosFiltrados);
      if (orderSelect) orderSelect.addEventListener('change', renderizarProdutosFiltrados);
      if (searchInput) searchInput.addEventListener('input', renderizarProdutosFiltrados);
      if (searchBtn) searchBtn.addEventListener('click', renderizarProdutosFiltrados);
    });

  fetch('http://192.168.0.89:3001/api/downloads')
  .then(res => res.json())
  .then(downloads => {
    const container = document.getElementById('downloads'); // coloque o id no container pai no HTML
    if (!container) return;
    container.innerHTML = "";

    downloads.forEach(download => {
      // Ajuste o caminho da imagem se for imagem, ou use um ícone padrão se for outro tipo de arquivo
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(download.arquivo);
      const imgSrc = isImage
        ? `http://192.168.0.89:3001/downloads/${download.arquivo}`
        : "../assets/img/icone-download.png"; // ícone padrão para não-imagem

      // O link para download agora usa a rota que força download
      const downloadLink = `http://192.168.0.89:3001/api/downloads/file/${download.arquivo}`;

      // O id para detalhes agora é o id numérico do download
      const detalhesLink = `./detalhes.html?id=${download.id}`;

      const div = document.createElement('div');
      div.className = "product-1";
      div.setAttribute('data-category', "wallpaper"); // ou use download.categoria se tiver no banco

      div.innerHTML = `
        <img class="product-img" src="${imgSrc}" alt="${download.nome}">
        <h2>${download.nome}</h2>
        <div class="product-actions">
          <button><a class="download-preview" href="${downloadLink}" download>Download</a></button>
          <button>
            <a class="details" href="${detalhesLink}">Ver detalhes</a>
          </button>
        </div>
      `;
      container.appendChild(div);
    });
  });

  fetch('http://192.168.0.89:3001/api/produtos/destaque')
  .then(res => res.json())
  .then(produtos => {
    const container = document.getElementById('produtos-destaque');
    if (!container) return;
    container.innerHTML = "";

    produtos.forEach(produto => {
      const imagemSrc = "./assets/img/" + produto.imagem;
      const div = document.createElement('div');
      div.className = "product-1";
      div.innerHTML = `
        <img class="product-img" src="${imagemSrc}" alt="">
        <h2><a class="product-link" href="${getDetalhesHref(produto.id)}">${produto.nome}</a></h2>
        <h2>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</h2>
      `;
      container.appendChild(div);
    });
  });

  fetch('http://192.168.0.89:3001/api/produtos')
  .then(res => {
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    return res.json();
  })
  .then(produtos => {
    console.log('Produtos recebidos:', produtos);
    console.log('Número de produtos:', produtos.length);
    
    const container = document.getElementById('produtos');
    console.log('Container encontrado:', container);
    
    if (!container) {
      console.error('Container #produtos não encontrado!');
      return;
    }
    
    // resto do seu código...
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });

});

// Função global para atualizar contadores
window.atualizarContadores = function() {
  if (window.atualizarWishlist) window.atualizarWishlist();
  if (window.atualizarCarrinho) window.atualizarCarrinho();
};
