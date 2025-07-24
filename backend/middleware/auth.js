const jwt = require('jsonwebtoken');
const SECRET = 'euodeiogostarde1pacoquita'; // Troque por uma chave forte e segura

function autenticarToken(req, res, next) {
  console.log('🔐 Middleware de autenticação executado');
  console.log('🍪 Cookies recebidos:', req.cookies);
  
  const token = req.cookies.token;
  console.log('🎫 Token encontrado:', token ? 'SIM' : 'NÃO');
  
  if (!token) {
    console.log('❌ Token não encontrado - retornando 401');
    return res.sendStatus(401); // Não autorizado
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token inválido ou expirado:', err.message);
      return res.sendStatus(403); // Token inválido ou expirado
    }
    
    console.log('✅ Token válido - usuário:', user);
    req.user = user; // Dados do usuário disponíveis na rota
    next();
  });
}

module.exports = autenticarToken; 