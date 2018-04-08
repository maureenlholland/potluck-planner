const setToken = token => {
	localStorage.setItem('token', token);
}

const getToken = () => {
	return localStorage.getItem('token');
}

const removeToken = () => {
	localStorage.removeItem('token');
}

module.exports = {
	setToken,
	getToken,
	removeToken
}