# 🔧 Solução para Sessão entre Dispositivos

## Problema
Não consegue acessar o mesmo carrinho/wishlist entre PC e celular, mesmo fazendo login em ambos.

## ✅ Correções Aplicadas

### 1. **Configuração de Cookies Melhorada**
- Adicionado `domain: undefined` para permitir cookies em subdomínios
- Adicionado `path: '/'` para disponibilidade em todo o site
- Mantido `sameSite: 'lax'` para compatibilidade

### 2. **CORS Expandido**
- Adicionadas mais origens para dispositivos móveis
- Incluídos métodos HTTP necessários
- Headers permitidos configurados

### 3. **Rota de Teste Adicionada**
- `/api/users/check-auth` para verificar autenticação
- Funções de debug no frontend

## 🧪 Como Testar

### **Passo 1: Reiniciar o Servidor**
```bash
# No terminal, pare o servidor (Ctrl+C) e reinicie
cd backend
node app.js
```

### **Passo 2: Limpar Cookies**
1. No PC: Abra DevTools (F12) → Application → Cookies → Delete todos
2. No celular: Configurações do navegador → Limpar dados

### **Passo 3: Testar Login**
1. **PC**: Acesse `http://192.168.0.89:5500` e faça login
2. **Celular**: Acesse o mesmo IP e faça login
3. **Verificar**: Abra console no PC e digite:
   ```javascript
   testarAutenticacao()
   verificarCookies()
   ```

### **Passo 4: Testar Carrinho**
1. Adicione produtos no PC
2. Verifique no celular se aparecem
3. Adicione produtos no celular
4. Verifique no PC se aparecem

## 🔍 Debug

### **No Console do Navegador:**
```javascript
// Testar autenticação
testarAutenticacao()

// Ver cookies
verificarCookies()

// Testar carrinho
fetch('http://192.168.0.89:3001/api/carrinho', {credentials: 'include'})
  .then(r => r.json())
  .then(console.log)
```

### **Possíveis Problemas:**

1. **IP Diferente**: Certifique-se de usar o mesmo IP em ambos os dispositivos
2. **Porta Bloqueada**: Verifique se a porta 3001 está acessível
3. **Firewall**: Desative temporariamente o firewall para teste
4. **Navegador**: Tente em modo incógnito/privado

## 🚀 Soluções Alternativas

### **Se ainda não funcionar:**

1. **Usar IP Local**: 
   - PC: `http://localhost:5500`
   - Celular: `http://192.168.0.89:5500`

2. **Configurar Hosts**:
   - Adicionar entrada no arquivo hosts do PC

3. **Usar HTTPS**:
   - Configurar certificado SSL local

## 📱 Dicas para Mobile

1. **Chrome Mobile**: Pode ter restrições de cookies
2. **Safari**: Configurações de privacidade podem bloquear
3. **Firefox Mobile**: Geralmente mais permissivo

## ✅ Checklist Final

- [ ] Servidor reiniciado
- [ ] Cookies limpos em ambos dispositivos
- [ ] Login feito em ambos dispositivos
- [ ] Teste de autenticação passou
- [ ] Carrinho sincronizado entre dispositivos

---

**Se ainda tiver problemas, verifique:**
1. Console do navegador para erros
2. Logs do servidor backend
3. Rede WiFi (mesma rede)
4. Configurações de privacidade do navegador 