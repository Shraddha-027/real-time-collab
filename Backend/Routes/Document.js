const express = require('express');
const router = express.Router();
const Document = require('/models/Document'); //idhar vohi location vala kaam

const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const document = new Document({
      title: req.body.title,
      content: '',
      owner: req.user.userId,
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authenticateToken, async (req, res) => { //Location iss file tak ki
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).send('Document not found');
    res.json(document);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/:id', authenticateToken, async (req, res) => { //same idhar bhi
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    if (!document) return res.status(404).send('Document not found');
    res.json(document);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;