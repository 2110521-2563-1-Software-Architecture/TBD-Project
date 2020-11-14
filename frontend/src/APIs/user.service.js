import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class UserService {

    getAllUsers() {
        return axios.get(API_URL + 'all_users', { headers: authHeader() });
    }

    getFriends() {
        return axios.get(API_URL + 'friend', { headers: authHeader() });
    }

    addFriend(user_id) {
        return axios.post(API_URL + 'friend', { target: user_id }, { headers: authHeader() });
    }

}

export default new UserService();