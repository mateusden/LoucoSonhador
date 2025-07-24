// Alterna entre as seções da área do cliente com base no hash da URL
const sections = {
  'dashboard-cliente': document.getElementById('dashboard-cliente'),
  'produtos': document.getElementById('produtos'),
  'conta': document.getElementById('conta')
};

// Variável global para simular dados do usuário salvos
let usuarioSalvo = {
  foto: '../assets/img/person-circle-svgrepo-com.png',
  nome: 'João da Silva',
  email: 'joao@email.com',
  senha: 'minhasenha123',
  nascimento: '',
  genero: ''
};

function renderizarFormularioEdicao(usuario) {
  const dadosConta = document.getElementById('dados-conta');
  dadosConta.innerHTML = `
    <form id="form-editar-conta" class="form-editar-conta">
      <div class="form-row">
        <label>Foto de perfil:</label>
        <input type="file" id="fotoInput" accept="image/*">
        <img src="${usuario.foto}" alt="Foto atual" class="conta-foto" style="margin-top:10px;">
      </div>
      <div class="form-row">
        <label>Nome:</label>
        <input type="text" id="nomeInput" value="${usuario.nome}" required>
      </div>
      <div class="form-row">
        <label>Senha:</label>
        <input type="password" id="senhaEditInput" value="${usuario.senha}" required>
      </div>
      <div class="form-row">
        <label>Confirmar Senha:</label>
        <input type="password" id="confirmaSenhaInput" value="${usuario.senha}" required>
      </div>
      <div class="form-row">
        <label>Data de Nascimento:</label>
        <input type="date" id="nascimentoInput" value="${usuario.nascimento || ''}">
      </div>
      <div class="form-row">
        <label>Gênero:</label>
        <select id="generoInput">
          <option value="">Selecione</option>
          <option value="masculino" ${usuario.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
          <option value="feminino" ${usuario.genero === 'feminino' ? 'selected' : ''}>Feminino</option>
          <option value="outro" ${usuario.genero === 'outro' ? 'selected' : ''}>Outro</option>
        </select>
      </div>
      <div class="form-botoes">
        <button type="submit" class="btn-editar-conta">Salvar</button>
        <button type="button" id="cancelarEdicao" class="btn-editar-conta" style="background:#ccc;color:#1a365d;">Cancelar</button>
      </div>
    </form>
  `;
  document.getElementById('cancelarEdicao').onclick = () => renderizarConta();
  document.getElementById('form-editar-conta').onsubmit = (e) => {
    e.preventDefault();
    // Atualiza os dados na variável global
    const nome = document.getElementById('nomeInput').value;
    const senha = document.getElementById('senhaEditInput').value;
    const confirmaSenha = document.getElementById('confirmaSenhaInput').value;
    const nascimento = document.getElementById('nascimentoInput').value;
    const genero = document.getElementById('generoInput').value;
    let foto = usuarioSalvo.foto;
    const fotoInput = document.getElementById('fotoInput');
    if (fotoInput.files && fotoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        usuarioSalvo.foto = e.target.result;
        usuarioSalvo.nome = nome;
        usuarioSalvo.senha = senha;
        usuarioSalvo.nascimento = nascimento;
        usuarioSalvo.genero = genero;
        renderizarConta();
      };
      reader.readAsDataURL(fotoInput.files[0]);
      return;
    }
    usuarioSalvo.nome = nome;
    usuarioSalvo.senha = senha;
    usuarioSalvo.nascimento = nascimento;
    usuarioSalvo.genero = genero;
    renderizarConta();
  };
}

// Busca usuário logado do backend
async function fetchLoggedUser() {
  try {
    const response = await fetch('http://192.168.0.89:3001/api/users/perfil', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (err) { }
  return null;
}

// Função para formatar data ISO para DD/MM/AAAA
function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

// Renderiza informações reais do usuário logado
async function renderizarConta() {
  const dadosConta = document.getElementById('dados-conta');
  const usuario = await fetchLoggedUser();
  if (!usuario) {
    dadosConta.innerHTML = '<p style="color:#c53030">Você precisa estar logado para ver as informações da conta.</p>';
    return;
  }
  dadosConta.innerHTML = `
    <div class="conta-info-container">
      <img src="../assets/img/person-circle-svgrepo-com.png" alt="Foto do usuário" class="conta-foto">
      <div class="conta-dados">
        <div class="conta-nome-email">
          <span class="conta-nome">${usuario.nome || usuario.name || ''}</span><br>
          <span class="conta-email">${usuario.email || ''}</span>
        </div>
        <div class="conta-extra-info${(usuario.nascimento || usuario.genero) ? ' mostrar' : ''}">
          ${usuario.nascimento ? `<span><b>Data de Nascimento:</b> ${formatarDataBR(usuario.nascimento)}</span><br>` : ''}
          ${usuario.genero ? `<span><b>Gênero:</b> ${usuario.genero.charAt(0).toUpperCase() + usuario.genero.slice(1)}</span>` : ''}
        </div>
        <div class="conta-senha-container" style="margin-top:16px;">
          <button id="btnAlterarSenha" type="button" class="btn-editar-conta">Alterar senha</button>
          <button id="btnEditarConta" type="button" class="btn-editar-conta" style="margin-left:10px;">Editar</button>
        </div>
      </div>
    </div>
    <div id="formAlterarSenha" style="display:none;margin-top:20px;">
      <form id="alterarSenhaForm">
        <div class="form-row">
          <label for="senhaAtual">Senha atual:</label>
          <input type="password" id="senhaAtual" required>
        </div>
        <div class="form-row">
          <label for="novaSenha">Nova senha:</label>
          <input type="password" id="novaSenha" required>
        </div>
        <div class="form-row">
          <label for="confirmaNovaSenha">Confirmar nova senha:</label>
          <input type="password" id="confirmaNovaSenha" required>
        </div>
        <button type="submit" class="btn-editar-conta">Salvar nova senha</button>
        <button type="button" id="cancelarAlterarSenha" class="btn-editar-conta" style="background:#ccc;color:#1a365d;">Cancelar</button>
        <div id="msgAlterarSenha" style="margin-top:10px;"></div>
      </form>
    </div>
    <div id="formEditarConta" style="display:none;margin-top:20px;"></div>
  `;
  document.getElementById('btnAlterarSenha').onclick = function() {
    document.getElementById('formAlterarSenha').style.display = 'block';
  };
  document.getElementById('cancelarAlterarSenha').onclick = function() {
    document.getElementById('formAlterarSenha').style.display = 'none';
  };
  document.getElementById('alterarSenhaForm').onsubmit = async function(e) {
    e.preventDefault();
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaNovaSenha = document.getElementById('confirmaNovaSenha').value;
    const msg = document.getElementById('msgAlterarSenha');
    msg.textContent = '';
    if (novaSenha !== confirmaNovaSenha) {
      msg.textContent = 'As senhas não coincidem.';
      msg.style.color = '#c53030';
      return;
    }
    try {
      const res = await fetch('http://192.168.0.89:3001/api/users/senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ senhaAtual, novaSenha })
      });
      const data = await res.json();
      if (res.ok) {
        msg.textContent = data.message || 'Senha alterada com sucesso!';
        msg.style.color = '#1a365d';
        document.getElementById('alterarSenhaForm').reset();
        setTimeout(() => {
          document.getElementById('formAlterarSenha').style.display = 'none';
        }, 1500);
    } else {
        msg.textContent = data.error || 'Erro ao alterar senha.';
        msg.style.color = '#c53030';
      }
    } catch (err) {
      msg.textContent = 'Erro de conexão com o servidor.';
      msg.style.color = '#c53030';
    }
  };
  document.getElementById('btnEditarConta').onclick = function() {
    renderizarFormularioEdicao(usuario);
  };
}

// Formulário de edição de dados do usuário
function renderizarFormularioEdicao(usuario) {
  const formEditar = document.getElementById('formEditarConta');
  formEditar.style.display = 'block';
  formEditar.innerHTML = `
    <form id="editarContaForm">
      <div class="form-row">
        <label for="nomeEdit">Nome:</label>
        <input type="text" id="nomeEdit" value="${usuario.nome || ''}" required>
      </div>
      <div class="form-row">
        <label for="nascimentoEdit">Data de Nascimento:</label>
        <input type="date" id="nascimentoEdit" value="${usuario.nascimento || ''}">
      </div>
      <div class="form-row">
        <label for="generoEdit">Gênero:</label>
        <select id="generoEdit">
          <option value="">Selecione</option>
          <option value="masculino" ${usuario.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
          <option value="feminino" ${usuario.genero === 'feminino' ? 'selected' : ''}>Feminino</option>
          <option value="outro" ${usuario.genero === 'outro' ? 'selected' : ''}>Outro</option>
        </select>
      </div>
      <button type="submit" class="btn-editar-conta">Salvar</button>
      <button type="button" id="cancelarEditarConta" class="btn-editar-conta" style="background:#ccc;color:#1a365d;">Cancelar</button>
      <div id="msgEditarConta" style="margin-top:10px;"></div>
    </form>
  `;
  document.getElementById('cancelarEditarConta').onclick = function () {
    formEditar.style.display = 'none';
  };
  document.getElementById('editarContaForm').onsubmit = async function (e) {
    e.preventDefault();
    const nome = document.getElementById('nomeEdit').value;
    const nascimento = document.getElementById('nascimentoEdit').value || null;
    const genero = document.getElementById('generoEdit').value || null;
    const msg = document.getElementById('msgEditarConta');
    msg.textContent = '';
    try {
      const res = await fetch('http://192.168.0.89:3001/api/users/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nome, nascimento, genero })
      });
      const data = await res.json();
      if (res.ok) {
        msg.textContent = data.message || 'Dados atualizados com sucesso!';
        msg.style.color = '#1a365d';
        setTimeout(() => {
          formEditar.style.display = 'none';
          renderizarConta();
        }, 1200);
      } else {
        msg.textContent = data.error || 'Erro ao atualizar dados.';
        msg.style.color = '#c53030';
      }
    } catch (err) {
      msg.textContent = 'Erro de conexão com o servidor.';
      msg.style.color = '#c53030';
    }
  };
}

// Função para exibir o resumo do cliente
async function renderizarResumoCliente() {
  const resumoDiv = document.getElementById('resumo-cliente');
  resumoDiv.innerHTML = '<span>Carregando resumo...</span>';
  const usuario = await fetchLoggedUser();
  let resumo = { totalProdutosComprados: 0, totalGasto: 0 };
  try {
    const res = await fetch('http://192.168.0.89:3001/api/users/resumo-compras', { credentials: 'include' });
    if (res.ok) {
      resumo = await res.json();
    }
  } catch (err) {}
  resumoDiv.innerHTML = `
    <div class="resumo-bloco" style="max-width:420px;margin:32px auto 0 auto;padding:32px 36px;background:#efdac5;border-radius:18px;box-shadow:0 4px 16px rgba(26,54,93,0.10);text-align:center;font-family:'Source Sans 3',sans-serif;color:#1a365d;">
      <h2 style="margin-bottom:18px;font-size:2.2rem;font-weight:700;">Bem-vindo, ${usuario.nome || usuario.name || ''}!</h2>
      <p style="margin:8px 0;font-size:1.1rem;"><b>E-mail:</b> ${usuario.email || ''}</p>
      ${usuario.nascimento ? `<p style='margin:8px 0;font-size:1.1rem;'><b>Data de Nascimento:</b> ${formatarDataBR(usuario.nascimento)}</p>` : ''}
      ${usuario.genero ? `<p style='margin:8px 0;font-size:1.1rem;'><b>Gênero:</b> ${usuario.genero.charAt(0).toUpperCase() + usuario.genero.slice(1)}</p>` : ''}
      <hr style="margin:18px 0;border:0;border-top:1.5px solid #1a365d;">
      
    </div>
  `;
}

// Função para exibir produtos comprados
async function renderizarProdutosComprados() {
  const listaDiv = document.getElementById('lista-produtos-comprados');
  listaDiv.innerHTML = '<span>Carregando produtos comprados...</span>';
  try {
    const res = await fetch('http://192.168.0.89:3001/api/users/produtos-comprados', { credentials: 'include' });
    if (!res.ok) {
      listaDiv.innerHTML = '<span style="color:#c53030">Erro ao buscar produtos comprados.</span>';
      return;
    }
    const data = await res.json();
    if (!data.produtos || data.produtos.length === 0) {
      listaDiv.innerHTML = '<span style="color:#1a365d">Você ainda não comprou nenhum produto.</span>';
      // Atualiza o resumo também
      renderizarResumoCliente();
      return;
    }
    listaDiv.innerHTML = data.produtos.map(produto => `
      <div class="produto-comprado-bloco" style="display:flex;align-items:center;gap:24px;background:#efdac5;border-radius:14px;padding:18px 24px;margin-bottom:24px;box-shadow:0 2px 8px rgba(26,54,93,0.08);max-width:600px;margin-left:auto;margin-right:auto;">
        <img src="../assets/img/${produto.imagem || 'image-svgrepo-com.svg'}" alt="${produto.nome}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;background:#fff;box-shadow:0 1px 4px #d9bfa3;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;">
          <span style="font-size:1.3rem;font-weight:700;color:#1a365d;">${produto.nome}</span>
          <span style="font-size:1.1rem;color:#1a365d;">Comprado em: ${formatarDataBR(produto.dataCompra)}</span>
          <span style="font-size:1.1rem;color:#1a365d;">Valor: R$ ${Number(produto.preco).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
        </div>
        <a href="${produto.arquivo ? 'http://192.168.0.89:3001/api/downloads/force/' + produto.arquivo : '#'}" download style="padding:10px 22px;background:#1a365d;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;text-decoration:none;${produto.arquivo ? '' : 'pointer-events:none;opacity:0.5;'}">Redownload</a>
      </div>
    `).join('');
    // Atualiza o resumo também
    renderizarResumoCliente();
  } catch (err) {
    listaDiv.innerHTML = '<span style="color:#c53030">Erro ao buscar produtos comprados.</span>';
    renderizarResumoCliente();
  }
}

// Chama renderizarResumoCliente ou renderizarProdutosComprados ao mostrar a seção
function mostrarSecao(secaoId) {
  Object.keys(sections).forEach(id => {
    sections[id].style.display = (id === secaoId ? 'block' : 'none');
  });
  if (secaoId === 'conta') {
    renderizarConta();
  } else if (secaoId === 'dashboard-cliente') {
    renderizarResumoCliente();
  } else if (secaoId === 'produtos') {
    renderizarProdutosComprados();
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  if (sections[hash]) {
    mostrarSecao(hash);
  } else {
    mostrarSecao('dashboard-cliente');
  }
}

window.addEventListener('hashchange', handleHashChange);
document.addEventListener('DOMContentLoaded', handleHashChange); 