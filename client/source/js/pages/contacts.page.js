import { auth, locationModule, preloader, userNav, router, apiService } from '../app/common.modules.js'
import renderMap from '../app/service/map.js'
import FeedbackForm from '../app/forms/feedback.form.js'


document.addEventListener('DOMContentLoaded', async () => {
    renderMap()
    await auth.init()
    userNav.render()
    locationModule.init()
    new FeedbackForm({
        form: '#feedback-form',
        submitSelector: '[data-feedback-submit]',
        router,
        auth,
        apiService
    }).init()
    preloader.hide()
})

