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
- [x] Sistema de pagamento via PIX
- [x] Integração com chat (Tawk.to)
- [x] Design responsivo para mobile

### 🔄 Em Desenvolvimento
- [ ] Sistema de backend completo
- [ ] Banco de dados de usuários
- [ ] Sistema de pagamentos seguro
- [ ] Área administrativa
- [ ] Sistema de downloads automático
- [ ] Validações de segurança

### ❌ Não Implementado
- [ ] Sistema de estoque
- [ ] Relatórios de vendas
- [ ] Sistema de cupons
- [ ] Área do cliente
- [ ] Sistema de avaliações

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js (em desenvolvimento)
- **Banco de Dados:** MongoDB (planejado)
- **Chat:** Tawk.to
- **Pagamentos:** PIX (manual)
- **Deploy:** GitHub Pages

## 📁 Estrutura do Projeto

```
louco-sonhador/
├── assets/                      # Imagens e ícones
│   └── img/                     # Imagens diversas do projeto
├── backend/                     # API e backend (em desenvolvimento)
│   ├── app.js                   # Arquivo principal do backend
│   ├── database/
│   │   └── connection.js        # Conexão com banco de dados
│   ├── middleware/              # Middlewares (vazio)
│   ├── models/                  # Modelos do banco de dados
│   │   ├── Payment.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   └── User.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── css/
│   │   └── js/
│   └── routes/                  # Rotas da API (vazio)
├── index.html                   # Página inicial
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
│   └── wishlist.html            # Lista de desejos
├── Readme.md                    # Este arquivo
```

## 🌐 Deploy

O site está hospedado no GitHub Pages:
- **URL:** https://1guribot.github.io/LoucoSonhador/
- **Branch:** main
- **Pasta:** public

## 🔒 Segurança

⚠️ **ATENÇÃO:** Este projeto não possui implementações de segurança adequadas para produção:

- Autenticação básica (localStorage)
- Sem HTTPS em desenvolvimento
- Sem validações robustas
- Sistema de pagamentos manual

## 📞 Contato

- **Desenvolvedor:** Mateus De Nadai
- **GitHub:** [@1GuriBot](https://github.com/1GuriBot)
- **Instagram:** [@1nerdola38](https://instagram.com/1nerdola38)

## 📄 Licença

Pode ser usada em projetos pessoais e comerciais, mas não pode revender a arte original

---

**Última atualização:** Julho 2025

**Versão:** 0.1.2 (Alpha)
