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

    /**
     * This will call URL/folders using GET method
     * Will return all folders stored in the database
     */
    getFolders() {
        return fetch(this.BASE_API + "/folders", {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    },

    /**
     * This function calls URL/folders with a parameter name
     * Will add a new table attribute to the database
     * @param {*} name new folder name
     */
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

    /**
     * This function will ask for returning a content of folder with specific name
     * @param {*} name 
     */
    getFolder(name) {
        return fetch(this.BASE_API + "/folders/" + name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    },

    /**
     * This function will delete a folder with parameter name
     * @param {*} name 
     */
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