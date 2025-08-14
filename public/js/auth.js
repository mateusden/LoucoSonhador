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

async function logoutUser() {
  try {
    await fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {}
  window.location.reload();
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const nome = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const senha = document.getElementById('registerPassword').value;
    const error = document.getElementById('registerError');
    const success = document.getElementById('registerSuccess');
    error.textContent = '';
    success.textContent = '';
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const data = await response.json();
      if (response.ok) {
        success.textContent = 'Cadastro realizado! Faça login.';
        registerForm.reset();
      } else {
        error.textContent = data.error || 'Erro ao cadastrar';
      }
    } catch (err) {
      error.textContent = 'Erro de conexão com o servidor';
    }
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const senha = document.getElementById('loginPassword').value;
    const error = document.getElementById('loginError');
    error.textContent = '';
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        error.textContent = data.error || 'Erro ao fazer login';
      }
    } catch (err) {
      error.textContent = 'Erro de conexão com o servidor';
    }
  });
}

async function fetchLoggedUser() {
  try {
    const response = await fetch('/api/users/perfil', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (err) {}
  return null;
}

async function updateMenuUser() {
  const user = await fetchLoggedUser();
  const header = document.querySelector('header');
  if (header) {
    let existingUserDiv = document.getElementById('userMenuDiv');
    let existingLoginDiv = document.getElementById('loginMenuDiv');
    if (existingUserDiv) existingUserDiv.remove();
    if (existingLoginDiv) existingLoginDiv.remove();
    if (user) {
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
      const userName = (user.nome || user.name || 'Usuário').split(' ')[0];
      const userType = user.type === 'vendedor' ? 'Vendedor' : 'Cliente';
      function resolveImgPath(img) {
        const isPublicPage = window.location.pathname.includes('/public/');
        if (!img) return isPublicPage ? '/assets/img/image-svgrepo-com.png' : '/assets/img/image-svgrepo-com.png';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return img;
        if (img.startsWith('/') || img.startsWith('/')) return img;
        return isPublicPage ? `/assets/img/${img}` : `/assets/img/${img}`;
      }
      function resolvePublicLink(path) {
        const isPublicPage = window.location.pathname.includes('/public/');
        return isPublicPage ? `/${path}` : `/public/${path}`;
      }
      let menuHtml = '';
      if (user.type === 'cliente') {
        menuHtml = `
          <li><a href="${resolvePublicLink('cliente.html#dashboard-cliente')}">Resumo</a></li>
          <li><a href="${resolvePublicLink('cliente.html#produtos')}">Produtos Comprados</a></li>
          <li><a href="${resolvePublicLink('cliente.html#conta')}">Informações da Conta</a></li>
        `;
      } else {
        menuHtml = `
          <li><a href="${resolvePublicLink('cliente.html#conta')}">Informações da Conta</a></li>
        `;
      }
      userDiv.innerHTML = `
        <div class="user-dropdown">
          <span id="userDropdownToggle">
            <img src="${resolveImgPath('person-circle-svgrepo-com.png')}" alt="Perfil">
            Olá, ${userName} <span>(${userType})</span> ▼
          </span>
          <ul id="userDropdownMenu" style="display:none;">
            ${menuHtml}
            <li><a href="#" id="logoutBtn">Sair</a></li>
          </ul>
        </div>
      `;
      header.style.position = 'relative';
      header.appendChild(userDiv);
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
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.onclick = function(e) { 
          e.preventDefault(); 
          logoutUser(); 
        };
      }
    } else {
      const loginDiv = document.createElement('div');
      loginDiv.id = 'loginMenuDiv';
      loginDiv.style.cssText = `
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
      `;
      const isPublicPage = window.location.pathname.includes('/public/');
      const loginHref = isPublicPage ? '/login.html' : '/login.html';
      loginDiv.innerHTML = `<a href="${loginHref}">Login</a>`;
      header.style.position = 'relative';
      header.appendChild(loginDiv);
    }
  }
}

function addSellerNavLinks() {
  const user = getLoggedUser();
  const nav = document.querySelector('nav .menu');
  if (!nav) return;
  if (document.getElementById('sellerMenuLinks')) return;
  if (user && user.type === 'vendedor') {
    const li = document.createElement('li');
    li.id = 'sellerMenuLinks';
    li.innerHTML = `
      <a href="/public/vendas/dashboard.html" class="seller">Área do Vendedor</a>
      <ul class="seller-submenu">
        <li><a href="/public/vendas/dashboard.html">Dashboard</a></li>
        <li><a href="/public/vendas/produtos.html">Produtos</a></li>
        <li><a href="/public/vendas/relatorios.html">Relatórios</a></li>
        <li><a href="/public/vendas/ferramentas.html">Ferramentas</a></li>
        <li><a href="/public/vendas/financeiro.html">Financeiro</a></li>
      </ul>
    `;
    li.onmouseenter = () => li.querySelector('ul').style.display = 'block';
    li.onmouseleave = () => li.querySelector('ul').style.display = 'none';
    nav.appendChild(li);
  }
}

async function testarAutenticacao() {
  try {
    const response = await fetch('/api/users/check-auth', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Usuário autenticado:', data);
      return true;
    } else {
      console.log('❌ Usuário não autenticado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar autenticação:', error);
    return false;
  }
}

function verificarCookies() {
  console.log('🍪 Cookies atuais:', document.cookie);
}

window.testarAutenticacao = testarAutenticacao;
window.verificarCookies = verificarCookies;

document.addEventListener('DOMContentLoaded', function() {
  getUsers();
  updateMenuUser();
  addSellerNavLinks();
});