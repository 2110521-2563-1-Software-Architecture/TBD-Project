export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { User: user.token };
    } else {
        return {};
    }
}