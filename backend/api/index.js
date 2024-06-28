const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Article = require('../models/article'); 

dotenv.config();

const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(dbURI)
  .then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
  .catch(err => console.error('Database connection error:', err));


app.get("/", (req, res) => res.send("Express on Vercel"));


app.post('/articles', (req, res) => {
  const { title, imageUrl, description, categories, author } = req.body;

  const article = new Article({
    title,
    imageUrl,
    description,
    categories,
    author
  });

  article.save()
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/articles', (req, res) => {
  Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(500).json({ error: err.message }));
});


app.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, description, categories, author } = req.body;

  Article.findByIdAndUpdate(id, {
    title,
    imageUrl,
    description,
    categories,
    author
  }, { new: true })
    .then(updatedArticle => {
      if (!updatedArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(updatedArticle);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/articles/:id', (req, res) => {
  const { id } = req.params;

  Article.findByIdAndDelete(id)
    .then(deletedArticle => {
      if (!deletedArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json({ message: 'Article deleted successfully' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


// app.listen(4000, () => console.log("Server ready on port 3000."));

module.exports = app;



// module.exports = app;