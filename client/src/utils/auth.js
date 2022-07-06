import decode from 'jwt-decode';

class AuthService {
  // retrieve data saved in token
  getProfile() {
		const token = this.getToken();
    return token ? decode(token) : token;
  }
	
	decodeToken(token) {
		return token ? decode(token) : token;
	}

  // check if the user is still logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    // use type coersion to check if token is NOT undefined and the token is NOT expired
    return !!token && !this.isTokenExpired(token);
  }

  // check if the token has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }
	
  login(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  logout() {
    localStorage.removeItem('id_token');
  }
}

export default new AuthService();
