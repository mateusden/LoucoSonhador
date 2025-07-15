// Elementos do DOM
const select = document.getElementById('category');
const orderSelect = document.getElementById('orderBy');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const products = document.querySelectorAll('.product-1');
const productsContainer = document.querySelector('.free-products');

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
});
