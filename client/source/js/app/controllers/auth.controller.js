class AuthController {
    constructor(config) {
        this.router = config.router
        this.isAuth = false
        this.userData = null
        this.csrf = null
    }
    async init() {
        try {
            const res = await fetch(this.router.authInfoLink)
            const data = await res.json()
            if(!data.message) {
                this.isAuth = true
                this.userData = data.info
                this.csrf = data.csrf
                return data
            }
            return null
        } catch(e) {

        }
    }
}


export default AuthController