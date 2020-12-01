import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class UserService {
  getOwnerUser() {
    return axios.get(API_URL + 'user_data', { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_URL + 'all_users', { headers: authHeader() });
  }

  getFriends() {
    return axios.get(API_URL + 'friend', { headers: authHeader() });
  }

  addFriend(user_id) {
    return axios.post(
      API_URL + 'friend',
      { target: user_id },
      { headers: authHeader() }
    );
  }

  login(sendToBackend) {
    return axios.post('http://localhost:8080/login', sendToBackend);
  }

  logout() {
    return axios.get('http://localhost:8080/logout', { headers: authHeader() });
  }
}

export default new UserService();
