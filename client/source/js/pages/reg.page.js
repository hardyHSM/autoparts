import {
    preloader,
    router,
    apiService,
    sequentLoading
} from '../app/common.modules.js'
import RegistrationForm from '../app/forms/registration.form.js'

await sequentLoading()

new RegistrationForm({
    form: '.reg-form',
    submitSelector: '[data-submit]',
    apiService,
    router
}).init()
preloader.hide()
