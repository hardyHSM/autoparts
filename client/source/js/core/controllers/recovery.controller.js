import RecoveryForm from '../../app/forms/recovery.form.js'

class RecoveryController {
    constructor(config) {
        this.router = config.router
        this.preloader = config.preloader
        this.apiService = config.apiService
    }

    async init() {
        try {
            const { status, data } = await this.apiService.useRequestStatus(this.router.recoveryLink)
            if(status === 400) {
                this.renderError(data.message)
            } else {
                new RecoveryForm({
                    router: this.router,
                    link: data.link,
                    submitSelector: "[data-recovery-submit]",
                    form: '.recovery-form',
                    apiService: this.apiService
                }).init()
            }
            this.preloader.hide()
        } catch(e) {
            console.log(e.message)
        }
    }

    renderError(text) {
        const title = document.querySelector('.page-section__title')
        title.classList.add('page-section__title_middle')
        title.innerHTML = text
        document.querySelector('.recovery-form').remove()
    }
}


export default RecoveryController