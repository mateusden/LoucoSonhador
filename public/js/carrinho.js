// carrinho.js

document.addEventListener('DOMContentLoaded', function() {
  const carrinhoContainer = document.getElementById('carrinhoItens');
  const totalContainer = document.getElementById('carrinhoTotal');
  let selecionados = [];
  let produtosDetalhes = {};
  let produtosOrdenados = []; // Lista ordenada dos produtos

  // Função de debug para verificar autenticação
  async function debugAuth() {
    console.log('🔍 Debugando autenticação...');
    
    try {
      // Teste 1: Verificar se está logado
      const authResponse = await fetch('http://192.168.0.89:3001/api/users/check-auth', {
        credentials: 'include'
      });
      console.log('✅ Status da autenticação:', authResponse.status);
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log('✅ Usuário autenticado:', authData);
      } else {
        console.log('❌ Usuário não autenticado');
      }
      
      // Teste 2: Verificar carrinho
      const cartResponse = await fetch('http://192.168.0.89:3001/api/carrinho', {
        credentials: 'include'
      });
      console.log('🛒 Status do carrinho:', cartResponse.status);
      
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        console.log('🛒 Dados do carrinho:', cartData);
      } else {
        console.log('❌ Erro ao acessar carrinho');
      }
      
    } catch (error) {
      console.error('❌ Erro no debug:', error);
    }
  }

  // Expor função de debug globalmente
  window.debugCarrinho = debugAuth;

  // Busca detalhes de um produto pelo id
  async function buscarProduto(id) {
    if (produtosDetalhes[id]) return produtosDetalhes[id];
    const res = await fetch(`http://192.168.0.89:3001/api/produtos/${id}`);
    if (!res.ok) return null;
    const prod = await res.json();
    produtosDetalhes[id] = prod;
    return prod;
  }

  async function listarCarrinho() {
    console.log('🛒 Tentando listar carrinho...');
    console.log('🍪 Cookies atuais:', document.cookie);
    
    try {
      // Busca os itens do carrinho do backend
      const res = await fetch('http://192.168.0.89:3001/api/carrinho', { 
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('🛒 Status da resposta:', res.status);
      console.log('🛒 Headers da resposta:', res.headers);
      
      if (!res.ok) {
        console.log('❌ Erro na resposta:', res.status, res.statusText);
        
        if (res.status === 401) {
          carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#c53030;font-size:1.5rem;">❌ Você precisa estar logado para ver seu carrinho.<br><button onclick="window.location.href=\'./login.html\'" style="margin-top:1rem;padding:0.5rem 1rem;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer;">Fazer Login</button></p>';
        } else if (res.status === 403) {
          carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#c53030;font-size:1.5rem;">❌ Sessão expirada. Faça login novamente.<br><button onclick="window.location.href=\'./login.html\'" style="margin-top:1rem;padding:0.5rem 1rem;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer;">Fazer Login</button></p>';
        } else {
          carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:1.5rem;">❌ Erro ao carregar carrinho. Tente novamente.</p>';
        }
        totalContainer.innerHTML = '';
        return;
      }
      
      const itens = await res.json();
      console.log('🛒 Itens no carrinho:', itens);
      
      if (!itens.length) {
        carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;font-size:1.5rem;">Seu carrinho está vazio.</p>';
        totalContainer.innerHTML = '';
        return;
      }
      
      // Busca detalhes dos produtos
      const detalhes = await Promise.all(itens.map(item => buscarProduto(item.product_id)));
      
      // Atualiza a lista ordenada de produtos
      produtosOrdenados = detalhes.filter(prod => prod !== null);
      
      // Inicializa selecionados se necessário
      if (selecionados.length !== produtosOrdenados.length) {
        selecionados = Array(produtosOrdenados.length).fill(false);
      }
      
      // Renderiza os cards
      carrinhoContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
          ${produtosOrdenados.map((prod, idx) => {
            const isSelected = selecionados[idx];
            const imgSrc = prod.imagem ? `../assets/img/${prod.imagem}` : './assets/img/image-svgrepo-com.svg';
            
            return `
            <div class="carrinho-bloco" style="display:flex;align-items:center;gap:36px;background:#efdac5;border-radius:18px;padding:32px 40px;margin-bottom:32px;box-shadow:0 4px 16px rgba(26,54,93,0.10);max-width:700px;width:100%;">
              <button class="btn-selecionar" data-idx="${idx}" aria-label="Selecionar produto" style="width:38px;height:38px;min-width:38px;min-height:38px;border-radius:50%;border:2.5px solid #1a365d;background:${isSelected ? '#1a365d' : 'none'};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s;margin-right:18px;">
                ${isSelected ? '<span style=\'display:block;width:18px;height:18px;border-radius:50%;background:#63b3ed;\'></span>' : ''}
              </button>
              <img src="${imgSrc}" alt="${prod.nome || ''}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;background:#fff;box-shadow:0 2px 8px #d9bfa3;">
              <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;">
                <h3 style="margin:0 0 18px 0;font-size:2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:700;">${prod.nome || 'Produto'}</h3>
                <span style="margin-bottom:18px;font-size:1.2rem;color:#1a365d;font-family:'Source Sans 3',sans-serif;font-weight:600;">R$ ${(prod.preco || '--').toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <div style="display:flex;gap:24px;">
                  <button class="btn-remove-carrinho" data-idx="${idx}" data-product-id="${prod.id}" style="padding:12px 32px;background:none;border:2px solid #c53030;color:#c53030;font-size:1.2rem;border-radius:10px;cursor:pointer;font-weight:600;transition:background 0.2s;">Remover</button>
                </div>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      `;
      
      // Eventos dos botões de selecionar
      document.querySelectorAll('.btn-selecionar').forEach(btn => {
        btn.onclick = function() {
          const idx = parseInt(btn.getAttribute('data-idx'));
          selecionados[idx] = !selecionados[idx];
          atualizarTotal();
          // Atualizar apenas o botão clicado
          const isSelected = selecionados[idx];
          btn.style.background = isSelected ? '#1a365d' : 'none';
          btn.innerHTML = isSelected ? '<span style=\'display:block;width:18px;height:18px;border-radius:50%;background:#63b3ed;\'></span>' : '';
        };
      });
      
      // Eventos dos botões de remover
      document.querySelectorAll('.btn-remove-carrinho').forEach(btn => {
        btn.onclick = async function() {
          const productId = btn.getAttribute('data-product-id');
          const idx = parseInt(btn.getAttribute('data-idx'));
          
          await fetch(`http://192.168.0.89:3001/api/carrinho/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          
          // Remove o item da lista de selecionados
          selecionados.splice(idx, 1);
          
          listarCarrinho();
          // Atualizar contadores na navegação
          if (typeof window.atualizarContadores === 'function') {
            window.atualizarContadores();
          }
        };
      });
      
      atualizarTotal();
      
    } catch (error) {
      console.error('❌ Erro ao listar carrinho:', error);
      carrinhoContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#c53030;font-size:1.5rem;">❌ Erro de conexão. Verifique sua internet e tente novamente.</p>';
      totalContainer.innerHTML = '';
    }
  }

  // Função para atualizar o total
  function atualizarTotal() {
    let total = 0;
    
    selecionados.forEach((isSelected, idx) => {
      if (isSelected && produtosOrdenados[idx] && produtosOrdenados[idx].preco) {
        total += Number(produtosOrdenados[idx].preco);
      }
    });
    
    totalContainer.innerHTML = `<h2 style="text-align:center;margin-top:24px;font-family:'Source Sans 3',sans-serif;font-size:2rem;color:#1a365d;font-weight:700;">Total selecionado: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits:2})}</h2>`;
  }

  // Executar debug automaticamente
  debugAuth();
  listarCarrinho();

  // Evento do botão de finalizar compra
  const finalizarBtn = document.getElementById('finalizarCompraBtn');
  if (finalizarBtn) {
    finalizarBtn.onclick = async function() {
      const selecionadosProdutos = produtosOrdenados.filter((prod, idx) => selecionados[idx]);
      
      if (selecionadosProdutos.length === 0) {
        alert('Selecione pelo menos um produto para finalizar a compra!');
        return;
      }
      
      if (selecionadosProdutos.length === 1) {
        window.location.href = `compra.html?id=${encodeURIComponent(selecionadosProdutos[0].id)}`;
      } else {
        let total = 0;
        let nomes = [];
        selecionadosProdutos.forEach(prod => {
          total += Number(prod.preco || 0);
          nomes.push(prod.nome || 'Produto');
        });
        window.location.href = `compra.html?nomes=${encodeURIComponent(nomes.join(' / '))}&total=${encodeURIComponent(total.toFixed(2))}`;
      }
    };
  }
}); 