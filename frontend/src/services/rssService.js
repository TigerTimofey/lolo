import axios from 'axios';

export const fetchRSSFeed = async (url) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/webparser`, { url });
        return response.data;

    } catch (error) {
        console.error("Error fetching the RSS feed", error);
        throw error;
    }
};
