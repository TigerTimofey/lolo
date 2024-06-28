import React from 'react';
import './Article.css';

const Article = ({ article, openModal,openEditModal,fetchExistingArticles }) => {

    const truncateTitle = (title, maxLength) => {
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + '...';
        }
        return title;
    };

    const removeArticle = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/articles/${article._id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete article');
            }

        } catch (error) {
            console.error('Error deleting article:', error);
        }
        fetchExistingArticles()
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getCategoryBadgeColor = (category) => {
        switch (category.toLowerCase()) {
            case 'technology':
                return 'green';
            case 'authentication':
                return 'black';
            default:
                return 'yellow';
        }
    };
    return (
        <div className="article-card">
            <div 
                className="article-image" 
                style={{ backgroundImage: `url(${article.imageUrl || article.enclosure?.link})` }}
                onClick={() => openModal(article)}
            >
            </div>
            <div className="article-content">
                <div className={`article-category article-badge ${getCategoryBadgeColor(article.categories[0] || 'Uncategorized')}`}>
                    {article.categories[0] || 'Uncategorized'}
                </div>
                <h3 className="article-title" onClick={() => openModal(article)}>
                    {truncateTitle(article.title, 70)}
                </h3>
                <p className="article-description">{article.description}</p>
                <div className="article-footer">
                    <div className="article-author">{article.author || 'No Author'}</div>
                    <div className="article-date">{formatDate(article.pubDate || new Date())}</div>
                </div>
                {!article.link ? (
                <>
                <div className='button-container-edit-remove'>
                   <button 
                    className="edit-article-button" 
                    onClick={() => openEditModal(article)}
                >
                    Edit
                </button> 
                <button 
                    className="remove-article-button" 
                    onClick={removeArticle}
                >
                    Remove
                </button>
            </div>
            </>
) : null}
            </div>
        </div>
    );
};

export default Article;
