import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class PostService {

    createPost(sendToBackend) {
        return axios.post(API_URL + 'feed', sendToBackend, { headers: authHeader() });
    }

}

export default new PostService();