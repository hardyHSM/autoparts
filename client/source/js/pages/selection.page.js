import {
    auth,
    preloader,
    router,
    apiService, sequentLoading
} from '../app/common.modules.js'
import SelectionForm from '../app/forms/selection.form.js'


await sequentLoading()
preloader.hide()
new SelectionForm({
    submitSelector: '[data-selection-submit]',
    form: '[data-selection-form]',
    router,
    auth,
    apiService
}).init()

