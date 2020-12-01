import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class FeedService {
  getFeed(page) {
    const headers = authHeader();
    headers['page'] = page;
    return axios.get(API_URL + 'feed', { headers: headers });
  }
}

export default new FeedService();
