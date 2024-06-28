import axios from 'axios';

export const fetchRSSFeed = async (url) => {
    try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching the RSS feed", error);
        throw error;
    }
};
