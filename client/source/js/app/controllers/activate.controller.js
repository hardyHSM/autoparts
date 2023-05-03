class ActivateController {
    constructor(config) {
        this.router = config.router
        this.preloader = config.preloader
        this.apiService = config.apiService
    }

    async init() {
        try {
            const data = await this.apiService.useRequest(this.router.activateLink)
            this.renderResult(data.message)
            this.preloader.hide()
        } catch (e) {
            console.log(e)
        }
    }

    renderResult(text) {
        document.querySelector('.page-section__title').innerHTML = text
    }
}


export default ActivateController