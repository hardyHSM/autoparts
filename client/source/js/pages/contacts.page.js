import { auth, preloader, router, apiService, sequentLoading } from '../app/common.modules.js'
import renderMap from '../app/service/map.js'
import FeedbackForm from '../app/forms/feedback.form.js'


await sequentLoading()
renderMap()
new FeedbackForm({
    form: '#feedback-form',
    submitSelector: '[data-feedback-submit]',
    router,
    auth,
    apiService
}).init()
preloader.hide()
