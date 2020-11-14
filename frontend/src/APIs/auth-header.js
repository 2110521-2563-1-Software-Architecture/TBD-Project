export default function authHeader() {
    const token = localStorage.getItem('token');

    if (token) {
        return { User: token };
    } else {
        return {};
    }
}