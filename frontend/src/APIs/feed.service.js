import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://fookbace.herokuapp.com/';

class FeedService {
  getFeed(page) {
    const headers = authHeader();
    headers['page'] = '['+page.join(',')+']'
    return axios.get(API_URL + 'feed', { 
      headers: headers 
    });
  }
}

export default new FeedService();
