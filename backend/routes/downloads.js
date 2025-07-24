const express = require('express');
const router = express.Router();
const pool = require('../database/connection');
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
    const [result] = await pool.query(
      'INSERT INTO downloads (nome, arquivo, descricao) VALUES (?, ?, ?)',
      [nome, arquivo, descricao]
    );
    res.status(201).json({ id: result.insertId, nome, arquivo, descricao });
  } catch (err) {
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
    const [result] = await pool.query(
      'UPDATE downloads SET nome = ?, arquivo = ?, descricao = ? WHERE id = ?',
      [nome, arquivo, descricao, id]
    );
    res.json({ message: 'Download atualizado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar download' });
  }
});

// Listar todos os downloads
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM downloads');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar downloads' });
  }
});

// Buscar download por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM downloads WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Download não encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar download' });
    }
  });

// Baixar um arquivo
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/downloads', req.params.filename);
  res.download(filePath);
});

// Forçar download de qualquer arquivo da pasta downloads
router.get('/force/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/downloads', req.params.filename);
  res.download(filePath);
});

// Excluir download
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Primeiro, pega o nome do arquivo para excluir do disco
    const [rows] = await pool.query('SELECT arquivo FROM downloads WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Download não encontrado' });

    const arquivo = rows[0].arquivo;
    const filePath = path.join(__dirname, '../public/downloads', arquivo);

    // Exclui do banco
    await pool.query('DELETE FROM downloads WHERE id = ?', [id]);

    // Exclui o arquivo do disco (se existir)
    fs.unlink(filePath, (err) => {
      // Se der erro ao excluir o arquivo, só loga, mas não impede a exclusão do banco
      if (err) console.log('Erro ao excluir arquivo:', err);
    });

    res.json({ message: 'Download excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir download' });
  }
});

module.exports = router;