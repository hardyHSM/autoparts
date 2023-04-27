import { auth, locationModule, preloader, userNav, router, apiService } from '../core/common.modules.js'
import RegistrationForm from '../core/forms/registration.form.js'

document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    new RegistrationForm({
        form: '.reg-form',
        submitSelector: '[data-submit]',
        apiService,
        router
    }).init()
    preloader.hide()
})
