import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class PostService {
  createPost(sendToBackend) {
    return axios.post(API_URL + 'feed', sendToBackend, {
      headers: authHeader(),
    });
  }

  updatePost(sendToBackend) {
    return axios.patch(API_URL + 'feed', sendToBackend, {
      headers: authHeader(),
    });
  }

  deletePost(feed_id) {
    return axios.delete(API_URL + 'feed', {
      headers: { User: authHeader()['User'], target: feed_id },
    });
  }

  interactPost(sendToBack) {
    return axios.post(API_URL + 'interact', sendToBack, {
      headers: authHeader(),
    });
  }
}

export default new PostService();
