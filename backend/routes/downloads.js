const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Certifique-se que está configurado para PostgreSQL
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para salvar arquivos em /public/downloads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/downloads'));
  },
  filename: function (req, file, cb) {
    // Salva com o nome original
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Adicionar novo download (com upload de arquivo)
router.post('/', upload.single('arquivo'), async (req, res) => {
  const { nome, descricao } = req.body;
  const arquivo = req.file ? req.file.filename : null;
  if (!arquivo) return res.status(400).json({ error: 'Arquivo é obrigatório!' });

  try {
    // PostgreSQL usa RETURNING para pegar o ID inserido
    const result = await pool.query(
      'INSERT INTO downloads (nome, arquivo, descricao) VALUES ($1, $2, $3) RETURNING id',
      [nome, arquivo, descricao]
    );
    res.status(201).json({ 
      id: result.rows[0].id, // PostgreSQL retorna rows[0].id
      nome, 
      arquivo, 
      descricao 
    });
  } catch (err) {
    console.error('Erro ao cadastrar download:', err);
    res.status(400).json({ error: 'Erro ao cadastrar download' });
  }
});

// Atualizar download existente (pode trocar o arquivo)
router.put('/:id', upload.single('arquivo'), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  let arquivo = req.body.arquivo; // caso não envie novo arquivo

  if (req.file) {
    arquivo = req.file.filename;
  }

  try {
    const result = await pool.query(
      'UPDATE downloads SET nome = $1, arquivo = $2, descricao = $3 WHERE id = $4',
      [nome, arquivo, descricao, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Download não encontrado' });
    }
    
    res.json({ message: 'Download atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar download:', err);
    res.status(400).json({ error: 'Erro ao atualizar download' });
  }
});

// Listar todos os downloads
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM downloads ORDER BY id DESC');
    res.json(result.rows); // PostgreSQL usa result.rows
  } catch (err) {
    console.error('Erro ao buscar downloads:', err);
    res.status(500).json({ error: 'Erro ao buscar downloads' });
  }
});

// Buscar download por id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM downloads WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Download não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar download:', err);
    res.status(500).json({ error: 'Erro ao buscar download' });
  }
});

// Baixar um arquivo
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/downloads', req.params.filename);
  
  // Verificar se o arquivo existe antes de tentar fazer download
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  res.download(filePath);
});

// Forçar download de qualquer arquivo da pasta downloads
router.get('/force/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/downloads', req.params.filename);
  
  // Verificar se o arquivo existe antes de tentar fazer download
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  res.download(filePath);
});

// Excluir download
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Primeiro, pega o nome do arquivo para excluir do disco
    const result = await pool.query('SELECT arquivo FROM downloads WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Download não encontrado' });
    }

    const arquivo = result.rows[0].arquivo;
    const filePath = path.join(__dirname, '../public/downloads', arquivo);

    // Exclui do banco
    await pool.query('DELETE FROM downloads WHERE id = $1', [id]);

    // Exclui o arquivo do disco (se existir)
    fs.unlink(filePath, (err) => {
      // Se der erro ao excluir o arquivo, só loga, mas não impede a exclusão do banco
      if (err) console.log('Erro ao excluir arquivo:', err);
    });

    res.json({ message: 'Download excluído com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir download:', err);
    res.status(500).json({ error: 'Erro ao excluir download' });
  }
});

module.exports = router;