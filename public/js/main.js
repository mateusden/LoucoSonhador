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

// Função para aplicar categoria da URL
function aplicarCategoriaDaUrl() {
  if (select && products.length > 0) {
    const categoriaUrl = getUrlParameter('categoria');
    
    if (categoriaUrl && (categoriaUrl === 'wallpaper' || categoriaUrl === 'paleta')) {
      select.value = categoriaUrl;
    }
  }
}

// Dropdown Wishlist e Carrinho na nav
function setupNavDropdown(dropdownId, linkId, previewId, countId, storageKey, pageUrl, emptyMsg) {
  const link = document.getElementById(linkId);
  const dropdown = document.getElementById(dropdownId);
  const preview = document.getElementById(previewId);
  const count = document.getElementById(countId);

  function renderPreview() {
    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    count.textContent = items.length;
    if (items.length === 0) {
      preview.innerHTML = `<div style='padding:0.75rem 1.5rem;color:#1a365d;'>${emptyMsg}</div>`;
    } else {
      preview.innerHTML = items.slice(0,3).map((item, idx) => {
        let imgSrc = resolveImgPath(item.img);
        return `
          <div style='display:flex;align-items:center;gap:10px;padding:0.5rem 1.5rem;'>
            <img src="${imgSrc}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:8px;background:#fff;">
            <a href="#" style="flex:1;text-decoration:none;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-size:20px;gap:10px;">${item.nome || item.name || 'Produto'}</a>
            <button class="btn-remove-dropdown" data-idx="${idx}" title="Remover" style="background:none;border:none;color:#c53030;font-size:22px;cursor:pointer;padding:0 6px;">&times;</button>
          </div>
        `;
      }).join('');
      // Adiciona evento de remover
      setTimeout(() => {
        const btns = preview.querySelectorAll('.btn-remove-dropdown');
        btns.forEach(btn => {
          btn.onclick = function(e) {
            e.preventDefault();
            let idx = parseInt(btn.getAttribute('data-idx'));
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            items.splice(idx, 1);
            localStorage.setItem(storageKey, JSON.stringify(items));
            renderPreview();
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
  setupNavDropdown('wishlistDropdown', 'wishlistNavLink', 'wishlistPreview', 'wishlistCount', 'ls_wishlist', './public/wishlist.html', 'Sua wishlist está vazia.');
  setupNavDropdown('cartDropdown', 'cartNavLink', 'cartPreview', 'cartCount', 'ls_cart', './public/carrinho.html', 'Seu carrinho está vazio.');
});
