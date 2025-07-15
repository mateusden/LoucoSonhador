// Função para retornar o valor do produto pelo id
function valorProduto(id) {
  // Defina os valores conforme os ids
  switch(id) {
    case 'wallpaper-ben10-pago': return '2.50';
    case 'wallpaper-ben10-v2-pago': return '3.00';
    case 'wallpaper-ben10-v3-pago': return '2.00';
    case 'wallpaper-ben10-v4-pago': return '2.00';
    case 'paleta-ben10-paga': return '1.00';
    case 'paleta-ben10-v2-paga': return '1.50';
    case 'paleta-ben10-v3-paga': return '2.00';
    case 'paleta-ben10-v4-paga': return '2.00';
    default: return '--';
  }
}

const produtos = [
  {
    id: "paleta-ben10-paga",
    nome: "Paleta Idem Ben 10 (Paga)",
    descricao: "Paleta de cores inspirada no universo Ben 10, perfeita para designers e fãs.",
    imagens: [
      "assets/img/palette.png"
    ],
    especificacoes: [
      "Formato: PNG",
      "Tamanho: 120KB",
      "Cores: 5",
      "Uso: Design, ilustração, inspiração"
    ],
    comoUsar: "Baixe a imagem e utilize a paleta em seu software de design favorito.",
    pago: true,
    compra: "https://drive.google.com/file/d/1VNwgIYGResg20pTQfdXmMW7fp7Kzd9Vm/view?usp=sharing",
    sugestoes: [
      { id: "wallpaper-ben10-pago", nome: "Wallpaper Idem Ben 10 (Pago)" },
      { id: "paleta-ben10-gratis", nome: "Paleta Idem Ben 10 (Grátis)" }
    ]
  },
  {
    id: "paleta-ben10-v2-paga",
    nome: "Paleta Idem Ben 10 V2 (Paga)",
    descricao: "Paleta de cores inspirada no universo Ben 10, versão 2, perfeita para designers e fãs.",
    imagens: [
      "assets/img/palette.png"
    ],
    especificacoes: [
      "Formato: PNG",
      "Tamanho: 120KB",
      "Cores: 5",
      "Uso: Design, ilustração, inspiração"
    ],
    comoUsar: "Baixe a imagem e utilize a paleta em seu software de design favorito.",
    pago: true,
    compra: "https://drive.google.com/file/d/1VNwgIYGResg20pTQfdXmMW7fp7Kzd9Vm/view?usp=sharing",
    sugestoes: [
      { id: "wallpaper-ben10-v2-pago", nome: "Wallpaper Idem Ben 10 V2 (Pago)" },
      { id: "paleta-ben10-paga", nome: "Paleta Idem Ben 10 (Paga)" }
    ]
  },
  {
    id: "paleta-ben10-v3-paga",
    nome: "Paleta Idem Ben 10 V3 (Paga)",
    descricao: "Paleta de cores inspirada no universo Ben 10, versão 3, perfeita para designers e fãs.",
    imagens: [
      "assets/img/palette.png"
    ],
    especificacoes: [
      "Formato: PNG",
      "Tamanho: 120KB",
      "Cores: 5",
      "Uso: Design, ilustração, inspiração"
    ],
    comoUsar: "Baixe a imagem e utilize a paleta em seu software de design favorito.",
    pago: true,
    compra: "https://drive.google.com/file/d/1VNwgIYGResg20pTQfdXmMW7fp7Kzd9Vm/view?usp=sharing",
    sugestoes: [
      { id: "wallpaper-ben10-v3-pago", nome: "Wallpaper Idem Ben 10 V3 (Pago)" },
      { id: "paleta-ben10-paga", nome: "Paleta Idem Ben 10 (Paga)" }
    ]
  },
  {
    id: "paleta-ben10-v4-paga",
    nome: "Paleta Idem Ben 10 V4 (Paga)",
    descricao: "Paleta de cores inspirada no universo Ben 10, versão 4, perfeita para designers e fãs.",
    imagens: [
      "assets/img/palette.png"
    ],
    especificacoes: [
      "Formato: PNG",
      "Tamanho: 120KB",
      "Cores: 5",
      "Uso: Design, ilustração, inspiração"
    ],
    comoUsar: "Baixe a imagem e utilize a paleta em seu software de design favorito.",
    pago: true,
    compra: "https://drive.google.com/file/d/1VNwgIYGResg20pTQfdXmMW7fp7Kzd9Vm/view?usp=sharing",
    sugestoes: [
      { id: "wallpaper-ben10-v4-pago", nome: "Wallpaper Idem Ben 10 V4 (Pago)" },
      { id: "paleta-ben10-paga", nome: "Paleta Idem Ben 10 (Paga)" }
    ]
  },
  {
    id: "wallpaper-ben10-pago",
    nome: "Wallpaper Idem Ben 10 (Pago)",
    descricao: "Wallpaper exclusivo inspirado no universo Ben 10, em alta resolução para desktop ou mobile.",
    imagens: [
      "assets/img/Idem final.jpg"
    ],
    especificacoes: [
      "Formato: JPG",
      "Resolução: 1920x1080",
      "Tamanho: 1.2MB",
      "Compatível: Desktop/Mobile"
    ],
    comoUsar: "Baixe a imagem e defina como papel de parede no seu dispositivo.",
    pago: true,
    compra: "https://drive.google.com/file/d/1Rt9L1KIgj-dkJbagPYQbsz6uQ7mKzhTp/view?usp=sharing",
    sugestoes: [
      { id: "paleta-ben10-paga", nome: "Paleta Idem Ben 10 (Paga)" },
      { id: "wallpaper-ben10-gratis", nome: "Wallpaper Idem Ben 10 (Grátis)" }
    ]
  },
  {
    id: "wallpaper-ben10-v2-pago",
    nome: "Wallpaper Idem Ben 10 V2 (Pago)",
    descricao: "Wallpaper exclusivo inspirado no universo Ben 10, versão 2, em alta resolução para desktop ou mobile.",
    imagens: [
      "assets/img/Idem final.jpg"
    ],
    especificacoes: [
      "Formato: JPG",
      "Resolução: 1920x1080",
      "Tamanho: 1.2MB",
      "Compatível: Desktop/Mobile"
    ],
    comoUsar: "Baixe a imagem e defina como papel de parede no seu dispositivo.",
    pago: true,
    compra: "https://drive.google.com/file/d/1Rt9L1KIgj-dkJbagPYQbsz6uQ7mKzhTp/view?usp=sharing",
    sugestoes: [
      { id: "paleta-ben10-v2-paga", nome: "Paleta Idem Ben 10 V2 (Paga)" },
      { id: "wallpaper-ben10-pago", nome: "Wallpaper Idem Ben 10 (Pago)" }
    ]
  },
  {
    id: "wallpaper-ben10-v3-pago",
    nome: "Wallpaper Idem Ben 10 V3 (Pago)",
    descricao: "Wallpaper exclusivo inspirado no universo Ben 10, versão 3, em alta resolução para desktop ou mobile.",
    imagens: [
      "assets/img/Idem final.jpg"
    ],
    especificacoes: [
      "Formato: JPG",
      "Resolução: 1920x1080",
      "Tamanho: 1.2MB",
      "Compatível: Desktop/Mobile"
    ],
    comoUsar: "Baixe a imagem e defina como papel de parede no seu dispositivo.",
    pago: true,
    compra: "https://drive.google.com/file/d/1Rt9L1KIgj-dkJbagPYQbsz6uQ7mKzhTp/view?usp=sharing",
    sugestoes: [
      { id: "paleta-ben10-v3-paga", nome: "Paleta Idem Ben 10 V3 (Paga)" },
      { id: "wallpaper-ben10-pago", nome: "Wallpaper Idem Ben 10 (Pago)" }
    ]
  },
  {
    id: "wallpaper-ben10-v4-pago",
    nome: "Wallpaper Idem Ben 10 V4 (Pago)",
    descricao: "Wallpaper exclusivo inspirado no universo Ben 10, versão 4, em alta resolução para desktop ou mobile.",
    imagens: [
      "assets/img/Idem final.jpg"
    ],
    especificacoes: [
      "Formato: JPG",
      "Resolução: 1920x1080",
      "Tamanho: 1.2MB",
      "Compatível: Desktop/Mobile"
    ],
    comoUsar: "Baixe a imagem e defina como papel de parede no seu dispositivo.",
    pago: true,
    compra: "https://drive.google.com/file/d/1Rt9L1KIgj-dkJbagPYQbsz6uQ7mKzhTp/view?usp=sharing",
    sugestoes: [
      { id: "paleta-ben10-v4-paga", nome: "Paleta Idem Ben 10 V4 (Paga)" },
      { id: "wallpaper-ben10-pago", nome: "Wallpaper Idem Ben 10 (Pago)" }
    ]
  },
  {
    id: "paleta-ben10-gratis",
    nome: "Paleta Idem Ben 10 (Grátis)",
    descricao: "Paleta de cores inspirada no universo Ben 10, perfeita para designers e fãs. Versão gratuita!",
    imagens: [
      "assets/img/palette.png"
    ],
    especificacoes: [
      "Formato: PNG",
      "Tamanho: 120KB",
      "Cores: 5",
      "Uso: Design, ilustração, inspiração"
    ],
    comoUsar: "Baixe a imagem e utilize a paleta em seu software de design favorito.",
    pago: false,
    download: "assets/img/palette.png",
    sugestoes: [
      { id: "wallpaper-ben10-gratis", nome: "Wallpaper Idem Ben 10 (Grátis)" },
      { id: "paleta-ben10-paga", nome: "Paleta Idem Ben 10 (Paga)" }
    ]
  },
  {
    id: "wallpaper-ben10-gratis",
    nome: "Wallpaper Idem Ben 10 (Grátis)",
    descricao: "Wallpaper exclusivo inspirado no universo Ben 10, em alta resolução para desktop ou mobile. Versão gratuita!",
    imagens: [
      "assets/img/Idem Final.jpg"
    ],
    especificacoes: [
      "Formato: JPG",
      "Resolução: 1920x1080",
      "Tamanho: 1.2MB",
      "Compatível: Desktop/Mobile"
    ],
    comoUsar: "Baixe a imagem e defina como papel de parede no seu dispositivo.",
    pago: false,
    download: "assets/img/Idem Final.jpg",
    sugestoes: [
      { id: "paleta-ben10-gratis", nome: "Paleta Idem Ben 10 (Grátis)" },
      { id: "wallpaper-ben10-pago", nome: "Wallpaper Idem Ben 10 (Pago)" }
    ]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  if (typeof getUrlParameter !== 'function') {
    window.getUrlParameter = function(name) {
      name = name.replace(/\[/, '\\[').replace(/\]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
  }
  const id = getUrlParameter('id');
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    document.getElementById('detalhe-produto').innerHTML = "<p class='detalhe-erro'>Produto não encontrado.</p>";
    return;
  }

  document.getElementById('detalhe-produto').innerHTML = `
    <div class="detalhe-container">
      <nav class="detalhe-breadcrumb">${produto.pago ? `Produtos &gt; ${produto.nome}` : `Downloads &gt; ${produto.nome}`}</nav>
      <div class="detalhe-conteudo">
        <div class="detalhe-img" style="padding-left: 48px;">
          <img id="img-grande" src="${produto.imagens[0]}" alt="${produto.nome}">
        </div>
        <div class="detalhe-info">
          <h2>${produto.nome}</h2>
          <p>${produto.descricao}</p>
          ${produto.pago ? `<h3>💰 Valor: R$ ${valorProduto(produto.id)}</h3>` : ''}
          <h3>📋 Especificações:</h3>
          <ul>
            ${produto.especificacoes.map(e => `<li>${e}</li>`).join('')}
          </ul>
          <h3>💡 Como usar:</h3>
          <p>${produto.comoUsar}</p>
          ${produto.pago ? `<a href="compra.html?id=${produto.id}" class="compra-btn">Comprar agora</a>` : `<a href="${produto.download}" download class="download-btn">Download agora</a>`}
          <h3>🎨 Você pode gostar também:</h3>
          <div>
            ${produto.sugestoes.map(s => `<a href="detalhes.html?id=${s.id}" class="sugestao-link">${s.nome}</a>`).join(' ')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona evento ao botão Comprar, se existir
  const btnComprar = document.querySelector('.btn-comprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', function() {
      // Supondo que o id do produto está na URL
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      window.location.href = `compra.html?id=${id}`;
    });
  }
}); 