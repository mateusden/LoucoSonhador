# Louco Sonhador 🎨

## ⚠️ AVISO IMPORTANTE

**Este site está em desenvolvimento e NÃO está pronto para uso público.**

Este é um projeto pessoal em fase de construção. Funcionalidades podem estar incompletas ou não funcionando corretamente.

---

## 📋 Sobre o Projeto

**Louco Sonhador** é uma loja virtual especializada em produtos digitais criativos, incluindo:

- 🖼️ **Wallpapers** - Papéis de parede para desktop e mobile
- 🎨 **Paletas de cores** - Para designers e artistas digitais
- 💡 **Recursos criativos** - Inspiração para projetos artísticos

## 🚧 Status do Desenvolvimento

### ✅ Funcionalidades Implementadas
- [x] Página inicial responsiva
- [x] Catálogo de produtos (coleções e downloads)
- [x] Sistema de autenticação básico
- [x] Páginas de detalhes dos produtos
- [x] Design responsivo para mobile
- [x] Banco de dados de usuários
- [x] Sistema de downloads automático

### 🔄 Em Desenvolvimento
- [ ] Sistema de backend completo
- [ ] Sistema de pagamentos seguro
- [ ] Validações de segurança
- [ ] Área do cliente

### ❌ Não Implementado
- [ ] Sistema de cupons
- [ ] Sistema de avaliações

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js
- **Banco de Dados:** PostgreSQL e Insomnia
- **Pagamentos:** Mercado Pago
- **Deploy:** Render e Supabase

## 📁 Estrutura do Projeto

```
louco-sonhador/
├── assets/                      # Imagens e ícones
│   └── img/                     # Imagens diversas do projeto
├── backend/                     # API e backend
│   ├── app.js                   # Arquivo principal do backend
│   ├── database/
│   │   └── connection.js        # Conexão com banco de dados
│   ├── middleware/              # Middlewares 
│   │   ├── auth.js
│   ├── models/                  # Modelos do banco de dados
│   │   ├── Payment.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   └── User.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── css/
│   │   ├── downloads/
│   │   └── js/
│   └── routes/                  # Rotas da API
│   │   ├── carrinho.js
│   │   ├── downloads.js
│   │   ├── product.js
│   │   ├── users.js
│   │   ├── wishlist.js
├── index.html                   # Página inicial
├── .gitignore
├── public/                      # Arquivos do frontend
│   ├── carrinho.html            # Carrinho de compras
│   ├── cliente/                 # Área do cliente
│   │   ├── css/
│   │   │   └── cliente.css
│   │   └── js/
│   │       └── cliente.js
│   ├── cliente.html             # Página do cliente
│   ├── colecoes.html            # Catálogo de produtos pagos
│   ├── compra.html              # Página de pagamento
│   ├── contato.html             # Página de contato
│   ├── css/
│   │   ├── section.css
│   │   └── style.css
│   ├── detalhes.html            # Detalhes dos produtos
│   ├── download.html            # Produtos gratuitos
│   ├── fonts/
│   │   └── crilo-demo.otf
│   ├── js/
│   │   ├── auth.js
│   │   ├── carrinho.js
│   │   ├── compra.js
│   │   ├── detalhes.js
│   │   ├── main.js
│   │   └── wishlist.js
│   ├── login.html               # Sistema de login
│   ├── registro.html            # Cadastro de usuário
│   ├── sobre.html               # Sobre o projeto
│   ├── tutorial-wallpaper.html  # Tutorial de uso
│   ├── vendas/                  # Área administrativa
│   │   ├── css/
│   │   │   └── vendas.css
│   │   ├── dashboard.html
│   │   ├── ferramentas.html
│   │   ├── financeiro.html
│   │   ├── js/
│   │   │   ├── dashboard.js
│   │   │   ├── ferramentas.js
│   │   │   ├── financeiro.js
│   │   │   ├── produtos.js
│   │   │   └── relatorios.js
│   │   ├── produtos.html
│   │   └── relatorios.html
│   └── privacidade.js 
│   └── termos.html
│   └── wishlist.html            # Lista de desejos
├── Readme.md                    # Este arquivo
```

## 🌐 Deploy

O site está hospedado no :
- **URL:https://loucosonhador.onrender.com/** 

## 🔒 Segurança

⚠️ **ATENÇÃO:** Este projeto não possui implementações de segurança adequadas para produção:

- Autenticação média (PostgreSQL)
- HTTPS
- Sem validações robustas
- Sistema de pagamentos automatizado

## 📞 Contato

- **Desenvolvedor:** Mateus De Nadai
- **GitHub:** [@1GuriBot](https://github.com/mateusden)
- **Instagram:** [@1nerdola38](https://instagram.com/1.nerdola)

## 📄 Licença

Pode ser usada em projetos pessoais e comerciais, mas não pode revender a arte original

---

**Última atualização:** 24 Julho 2025

**Versão:** 0.95 (Beta)
