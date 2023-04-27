class ApiServiceComponent {
    constructor(auth) {
        this.auth = auth|| null
    }

    async useRequest(link, rest = {}) {
        try {
            if(!rest.headers) rest.headers = {}
            rest.headers['x-csrf-token'] = this.auth.csrf
            const response = await fetch(link, rest)
            return await response.json()
        } catch (e) {
            console.error(e)
        }
    }

    async useRequestStatus(link, rest = {}) {
        try {
            if(!rest.headers) rest.headers = {}
            rest.headers['x-csrf-token'] = this.auth.csrf

            const response = await fetch(link, rest)
            const data = await response.json()
            return {
                status: response.status,
                data
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default ApiServiceComponent