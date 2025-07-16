// auth.js - Sistema de autenticação com vendedor e cliente

// Usuários pré-cadastrados
const PREDEFINED_USERS = [
  {
    name: 'Mateus De Nadai',
    email: 'produtos.loucosonhador@gmail.com',
    password: 'pacoquita123',
    type: 'vendedor'
  },
  {
    name: 'Mateus Bordinassi',
    email: 'mateusbnadai@gmail.com',
    password: 'pacoquita123',
    type: 'cliente'
  }
];

function getUsers() {
  let users = JSON.parse(localStorage.getItem('ls_users') || '[]');
  
  // Se não há usuários no localStorage, inicializa com os pré-definidos
  if (users.length === 0) {
    users = PREDEFINED_USERS;
    saveUsers(users);
  }
  
  return users;
}

function saveUsers(users) {
  localStorage.setItem('ls_users', JSON.stringify(users));
}

function setLoggedUser(user) {
  localStorage.setItem('ls_logged_user', JSON.stringify(user));
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem('ls_logged_user') || 'null');
}

function logoutUser() {
  localStorage.removeItem('ls_logged_user');
  window.location.reload();
}

// Registro (apenas para clientes)
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const error = document.getElementById('registerError');
    const success = document.getElementById('registerSuccess');
    error.textContent = '';
    success.textContent = '';
    
    if (!name || !email || !password) {
      error.textContent = 'Preencha todos os campos.';
      return;
    }
    
    let users = getUsers();
    if (users.find(u => u.email === email)) {
      error.textContent = 'E-mail já cadastrado.';
      return;
    }
    
    // Registra apenas como cliente
    users.push({ 
      name, 
      email, 
      password, 
      type: 'cliente' 
    });
    saveUsers(users);
    success.textContent = 'Cadastro realizado! Faça login.';
    registerForm.reset();
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const error = document.getElementById('loginError');
    error.textContent = '';
    
    let users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      error.textContent = 'E-mail ou senha inválidos.';
      return;
    }
    
    setLoggedUser(user);
    window.location.href = '../index.html';
  });
}

// Exibir usuário logado no menu
function updateMenuUser() {
  const user = getLoggedUser();
  const header = document.querySelector('header');
  
  if (header) {
    // Remove elementos existentes
    let existingUserDiv = document.getElementById('userMenuDiv');
    let existingLoginDiv = document.getElementById('loginMenuDiv');
    if (existingUserDiv) existingUserDiv.remove();
    if (existingLoginDiv) existingLoginDiv.remove();
    
    if (user) {
      // Cria div para usuário logado
      const userDiv = document.createElement('div');
      userDiv.id = 'userMenuDiv';
      userDiv.style.cssText = `
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        color: #63b3ed;
        font-family: 'Source Sans 3', sans-serif;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: nowrap;
        white-space: nowrap;
        text-align: right;
        z-index: 1000;
      `;
      
      const userName = user.name.split(' ')[0];
      const userType = user.type === 'vendedor' ? 'Vendedor' : 'Cliente';
      
      let menuHtml = '';
      if (user.type === 'cliente') {
        menuHtml = `
          <li><a href="./public/cliente.html#dashboard-cliente" class="user-menu-link" style="display:block;padding:0.75rem 1.5rem;color:#1a365d;text-decoration:none;font-weight:500;">Resumo</a></li>
          <li><a href="./public/cliente.html#produtos" class="user-menu-link" style="display:block;padding:0.75rem 1.5rem;color:#1a365d;text-decoration:none;font-weight:500;">Produtos Comprados</a></li>
          <li><a href="./public/cliente.html#conta" class="user-menu-link" style="display:block;padding:0.75rem 1.5rem;color:#1a365d;text-decoration:none;font-weight:500;">Informações da Conta</a></li>
        `;
      } else {
        menuHtml = `
          <li><a href="./public/cliente.html#conta" class="user-menu-link" style="display:block;padding:0.75rem 1.5rem;color:#1a365d;text-decoration:none;font-weight:500;">Informações da Conta</a></li>
        `;
      }
      
      function resolveImgPath(img) {
        const isPublicPage = window.location.pathname.includes('/public/');
        if (!img) return isPublicPage ? '../assets/img/image-svgrepo-com.png' : './assets/img/image-svgrepo-com.png';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return img;
        if (img.startsWith('./') || img.startsWith('../')) return img;
        return isPublicPage ? `../assets/img/${img}` : `./assets/img/${img}`;
      }

      userDiv.innerHTML = `
        <div class="user-dropdown" style="position: relative; display: inline-block;">
          <span id="userDropdownToggle" style="cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
            <img src="../assets/img/person-circle-svgrepo-com.png" alt="Perfil" style="width:28px;height:28px;vertical-align:middle;border-radius:50%;background:#fff;">
            Olá, ${userName} <span style="font-size:14px;opacity:0.7;">(${userType})</span> <span style="font-size:14px;">▼</span>
          </span>
          <ul id="userDropdownMenu" style="display:none;position:absolute;right:0;top:120%;background:#efdac5;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(26,54,93,0.08);min-width:200px;z-index:1001;padding:0.5rem 0;list-style:none;margin:0;">
            ${menuHtml}
            <li><a href="#" id="logoutBtn" style="display:block;padding:0.75rem 1.5rem;color:#c53030;text-decoration:none;font-weight:500;">Sair</a></li>
          </ul>
        </div>
      `;
      
      header.style.position = 'relative';
      header.appendChild(userDiv);
      
      // Dropdown toggle
      const toggle = document.getElementById('userDropdownToggle');
      const menu = document.getElementById('userDropdownMenu');
      if (toggle && menu) {
        toggle.addEventListener('click', function(e) {
          e.stopPropagation();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', function(e) {
          if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
          }
        });
      }
      // Logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.onclick = function(e) { 
          e.preventDefault(); 
          logoutUser(); 
        };
      }
    } else {
      // Cria div para login
      const loginDiv = document.createElement('div');
      loginDiv.id = 'loginMenuDiv';
      loginDiv.style.cssText = `
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-family: 'Source Sans 3', sans-serif;
        font-size: 18px;
        text-align: right;
      `;
      
      loginDiv.innerHTML = '<a href="./public/login.html" style="color: #63b3ed; text-decoration: none;">Login</a>';
      
      header.style.position = 'relative';
      header.appendChild(loginDiv);
    }
  }
}

// Adiciona menu de vendedor se logado e for vendedor
function addSellerNavLinks() {
  const user = getLoggedUser();
  const nav = document.querySelector('nav .menu');
  if (!nav) return;

  // Evita duplicidade
  if (document.getElementById('sellerMenuLinks')) return;

  if (user && user.type === 'vendedor') {
    const li = document.createElement('li');
    li.id = 'sellerMenuLinks';
    li.style.position = 'relative';
    li.innerHTML = `
      <a href="./public/vendas/dashboard.html" class="seller">Área do Vendedor</a>
      <ul class="seller-submenu">
        <li><a href="./public/vendas/dashboard.html">Dashboard</a></li>
        <li><a href="./public/vendas/produtos.html">Produtos</a></li>
        <li><a href="./public/vendas/relatorios.html">Relatórios</a></li>
        <li><a href="./public/vendas/ferramentas.html">Ferramentas</a></li>
        <li><a href="./public/vendas/financeiro.html">Financeiro</a></li>
      </ul>
    `;
    // Dropdown simples ao passar o mouse
    li.onmouseenter = () => li.querySelector('ul').style.display = 'block';
    li.onmouseleave = () => li.querySelector('ul').style.display = 'none';
    nav.appendChild(li);
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Limpa localStorage para aplicar novos nomes (remover depois de testar)
  // localStorage.removeItem('ls_users');
  // localStorage.removeItem('ls_logged_user');
  
  // Garante que os usuários pré-definidos estejam disponíveis
  getUsers();
  updateMenuUser();
  addSellerNavLinks();
}); 