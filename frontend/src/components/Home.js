import React from 'react';
import { FeedContext } from '../context/FeedContext';
import Article from './article/Article';
import ArticleModal from './article/articleModal/ArticleModal';
import AddArticleModal from './article/articleModal/addArticleModal/AddArticleModal';
import './Home.css';

const Home = () => {
    const { articles } = React.useContext(FeedContext);
    const [filter, setFilter] = React.useState('');
    const [selectedArticle, setSelectedArticle] = React.useState(null);
    const [showAddArticleModal, setShowAddArticleModal] = React.useState(false);
    const [error, setError] = React.useState('');
    const [existingArticles, setExistingArticles] = React.useState([]);

    const fetchExistingArticles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/articles`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setExistingArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };
    React.useEffect(() => {

        fetchExistingArticles();
    }, []);


    const handleAddArticle = async (newArticle) => {
        try {

            setShowAddArticleModal(false);
            setError('');
        } catch (error) {
            console.error('Error adding article:', error.message);
            setError('Failed to add article. Please try again later.');
        }
    };

    const handleEditArticle = async () => {
        try {
            setShowAddArticleModal(false);
            setError('');
        } catch (error) {
            console.error('Error editing article:', error.message);
            setError('Failed to edit article. Please try again later.');
        }
    };

    const handleOpenModal = (article) => {
        setSelectedArticle(article);
    };

    const handleCloseModal = () => {
        setSelectedArticle(null);
        setShowAddArticleModal(false);
        setError('');
    };

    const handleOpenAddArticleModal = () => {
        setSelectedArticle(null);
        setShowAddArticleModal(true);
        setError('');
    };

    const handleOpenEditArticleModal = (article) => {
        setSelectedArticle(article);
        setShowAddArticleModal(true);
        setError('');
    };

    const rssArticles = filter
    ? articles.filter(article =>
        article.categories.some(category => category.toLowerCase().includes(filter.toLowerCase()))
    )
    : articles;

const combinedArticles = [...existingArticles, ...rssArticles].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));


    return (
        <div>
            <header className="header">
                <div className="search-container">
                    <input
                        className='filter'
                        type="text"
                        placeholder="Filter by category..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div className='button-container'>
                        <button className='create-article-button' onClick={handleOpenAddArticleModal}>Add new article</button>
                    </div>
                </div>
            </header>
            <div className="articles-grid">
                {combinedArticles.map(article => (
                    <Article 
                        key={article.pubDate} 
                        article={article} 
                        openModal={handleOpenModal} 
                        openEditModal={handleOpenEditArticleModal}
                        fetchExistingArticles={fetchExistingArticles}
                    />
                ))}
            </div>

            {showAddArticleModal && (
                <AddArticleModal
                    closeModal={handleCloseModal}
                    handleAddArticle={handleAddArticle}
                    handleEditArticle={handleEditArticle}
                    articleToEdit={selectedArticle}
                    setError={setError}
                    fetchExistingArticles={fetchExistingArticles}
                    
                />
            )}

            {selectedArticle && !showAddArticleModal && (
                <ArticleModal article={selectedArticle} closeModal={handleCloseModal} />
            )}


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Home;
