// Alterna entre as seções da área do cliente com base no hash da URL
const sections = {
  'dashboard-cliente': document.getElementById('dashboard-cliente'),
  'produtos': document.getElementById('produtos'),
  'conta': document.getElementById('conta')
};

function mostrarSecao(secaoId) {
  Object.keys(sections).forEach(id => {
    sections[id].style.display = (id === secaoId ? 'block' : 'none');
  });
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