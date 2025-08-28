// auth.js - Sistema de autenticação com vendedor e cliente

// Usuários pré-cadastrados
const PREDEFINED_USERS = [
  { name: 'Mateus De Nadai', email: 'produtos.loucosonhador@gmail.com', password: 'pacoquita123', type: 'vendedor' },
  { name: 'Mateus Bordinassi', email: 'mateusbnadai@gmail.com', password: 'pacoquita123', type: 'cliente' }
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
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
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
    const response = await fetch('/api/users/perfil', { credentials: 'include' });
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
  if (!header) return;

  const existingUserDiv = document.getElementById('userMenuDiv');
  const existingLoginDiv = document.getElementById('loginMenuDiv');
  if (existingUserDiv) existingUserDiv.remove();
  if (existingLoginDiv) existingLoginDiv.remove();

  if (user) {
    const userDiv = document.createElement('div');
    userDiv.id = 'userMenuDiv';
    userDiv.style.cssText = 'position:absolute; right:30px; top:50%; transform:translateY(-50%); z-index:1000;';

    const userName = (user.nome || user.name || 'Usuário').split(' ')[0];
    const userType = user.type === 'vendedor' ? 'Vendedor' : 'Cliente';

    const menuHtml = user.type === 'cliente'
      ? `
        <li><a href="/cliente.html#dashboard-cliente">Resumo</a></li>
        <li><a href="/cliente.html#produtos">Produtos Comprados</a></li>
        <li><a href="/cliente.html#conta">Informações da Conta</a></li>
      `
      : `<li><a href="/cliente.html#conta">Informações da Conta</a></li>`;

    userDiv.innerHTML = `
      <div class="user-dropdown" style="display:flex; align-items:center; gap:8px; position:relative;">
        <button id="userDropdownToggle" style="all:unset; display:flex; align-items:center; gap:8px; cursor:pointer;">
          <img src="/assets/img/person-circle-svgrepo-com.png" alt="Perfil" 
               style="width:36px; height:36px; border-radius:50%; object-fit:cover; flex-shrink:0; filter: brightness(0) saturate(100%) invert(69%) sepia(36%) saturate(1336%) hue-rotate(184deg) brightness(98%) contrast(93%);">
          <span style="font-family:'Source Sans 3', sans-serif; font-weight:600; white-space:nowrap;">
            Olá, ${userName} <span style="font-weight:500; color:#63b3ed; margin-left:6px; font-size:0.9em;">(${userType})</span> ▼
          </span>
        </button>
        <ul id="userDropdownMenu" style="display:none; position:absolute; right:0; top:calc(100% + 8px); background:#fff; list-style:none; padding:8px; margin:0; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.12); z-index:1001;">
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
      toggle.addEventListener('click', e => { e.stopPropagation(); menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; });
      document.addEventListener('click', e => { if (!toggle.contains(e.target) && !menu.contains(e.target)) menu.style.display = 'none'; });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = e => { e.preventDefault(); logoutUser(); };

  } else {
    const loginDiv = document.createElement('div');
    loginDiv.id = 'loginMenuDiv';
    loginDiv.style.cssText = 'position:absolute; right:30px; top:50%; transform:translateY(-50%);';
    loginDiv.innerHTML = `<a href="/login.html">Login</a>`;
    header.style.position = 'relative';
    header.appendChild(loginDiv);
  }
}

function addSellerNavLinks() {
  const user = getLoggedUser();
  const nav = document.querySelector('nav .menu');
  if (!nav || document.getElementById('sellerMenuLinks')) return;
  if (user && user.type === 'vendedor') {
    const li = document.createElement('li');
    li.id = 'sellerMenuLinks';
    li.innerHTML = `
      <a href="/vendas/dashboard.html" class="seller">Área do Vendedor</a>
      <ul class="seller-submenu">
        <li><a href="/vendas/dashboard.html">Dashboard</a></li>
        <li><a href="/vendas/produtos.html">Produtos</a></li>
        <li><a href="/vendas/relatorios.html">Relatórios</a></li>
        <li><a href="/vendas/ferramentas.html">Ferramentas</a></li>
        <li><a href="/vendas/financeiro.html">Financeiro</a></li>
      </ul>
    `;
    li.onmouseenter = () => li.querySelector('ul').style.display = 'block';
    li.onmouseleave = () => li.querySelector('ul').style.display = 'none';
    nav.appendChild(li);
  }
}

async function testarAutenticacao() {
  try {
    const response = await fetch('/api/users/check-auth', { credentials: 'include' });
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
