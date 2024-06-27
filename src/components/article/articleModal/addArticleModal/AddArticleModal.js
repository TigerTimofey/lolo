import React, { useState, useEffect } from 'react';
import './AddArticleModal.css';

const AddArticleModal = ({ closeModal, handleAddArticle, handleEditArticle, articleToEdit,fetchExistingArticles }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [categories, setCategories] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title || '');
            setDescription(articleToEdit.description || '');
            setAuthor(articleToEdit.author || '');
            setCategories(articleToEdit.categories ? articleToEdit.categories.join(', ') : '');
            setImageUrl(articleToEdit.enclosure?.link || articleToEdit.imageUrl || '');
        } else {
            setTitle('');
            setDescription('');
            setAuthor('');
            setCategories('');
            setImageUrl('');
        }
    }, [articleToEdit]);



    const submitArticle = async (article) => {
        try {
            const url = articleToEdit ? `http://localhost:4000/articles/${articleToEdit._id}` : 'http://localhost:4000/articles';
            const method = articleToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(article)
            });
            if (!response.ok) {
                throw new Error('Failed to add/update article');
            }
            const data = await response.json();
            console.log('Article added/updated:', data);
            if (articleToEdit) {
                handleEditArticle(data);
            } else {
                handleAddArticle(data);
            }
        } catch (error) {
            console.error('Error adding/updating article:', error);
        }
        fetchExistingArticles()
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const article = {
            ...articleToEdit,
            title,
            description,
            author,
            categories: categories.split(',').map(category => category.trim()),
            imageUrl,
            pubDate: articleToEdit ? articleToEdit.pubDate : new Date().toISOString()
        };
        submitArticle(article);
        closeModal();
    };

    return (
        <div className="modal-background" onClick={closeModal}>
            <div className="modal-active" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={closeModal}>&times;</div>
                <div className="modal-window">
                    <h2>{articleToEdit ? 'Edit Article' : 'Add New Article'}</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <input
                                className="form-input"
                                placeholder='Article Title*'
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <textarea
                                placeholder='Description*'
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <input
                                placeholder='Author*'
                                className="form-input"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <input
                                placeholder='Categories (separate with commas)'
                                className="form-input"
                                type="text"
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                            />
                        </label>
                        <label>
                            <input
                                placeholder='Image URL*'
                                className="form-input"
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                            />
                        </label>
                        <div className="modal-footer">
                            <button type="submit" className="form-button">{articleToEdit ? 'Save Changes' : 'Add Article'}</button>
                            <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default AddArticleModal;
