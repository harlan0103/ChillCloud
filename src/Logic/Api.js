const Api = {
    BASE_API: 'http://127.0.0.1:5000',

    /**
     * login function post email and password params to backend url/login to ask for login request
     * @param {*} email user login email
     * @param {*} password user login password
     */
    login(email, password) {
        return fetch(this.BASE_API + "/login", {
            method: 'POST',
            body: JSON.stringify({email: email, password: password}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    },

    /**
     * auth function get request from url/auth to check if current token is verified
     * We use Header authorization here since cross-region
     * @param {*} token 
     */
    auth(token) {
        return fetch(this.BASE_API + "/auth", {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    },

    getFolders() {
        return fetch(this.BASE_API + "/folders", {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    },

    addFolders(name) {
        return fetch(this.BASE_API + "/folders", {
            method: 'POST',
            body: JSON.stringify({name : name}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    },

    getFolder(name) {
        return fetch(this.BASE_API + "/folders/" + name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    },

    deleteFolder(name) {
        return fetch(this.BASE_API + "/folders/" + name, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            },
        });
    }
}

export default Api;