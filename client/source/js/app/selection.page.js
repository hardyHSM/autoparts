import { auth, locationModule, preloader, userNav, router, apiService } from '../core/common.modules.js'
import SelectionForm from '../core/forms/selection.form.js'


document.addEventListener('DOMContentLoaded', async () => {
    await auth.init()
    userNav.render()
    locationModule.init()
    preloader.hide()
    new SelectionForm({
        submitSelector: '[data-selection-submit]',
        form: '[data-selection-form]',
        router,
        auth,
        apiService
    }).init()
})
