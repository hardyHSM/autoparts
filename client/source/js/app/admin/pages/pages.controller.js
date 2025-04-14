import Sortable from 'sortablejs'
import pagesModel, { pagesConfig } from './pages.model.js'
import { apiService, auth, router } from '../../common.modules.js'
import PagesForm from './pages.form.js'
import contentEditor from '../../../core/components/contentEditor.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'

class PagesController {
    async middleware() {
        return await pagesModel.find()
    }

    async middlewareEdit() {
        const data = await pagesModel.find()
        if(data.message) throw new Error()
        return data
    }

    async functional(_, data, module) {
        const list = document.querySelector('.pages-table tbody')
        new Sortable(list, {
            handle: '[data-drag]',
            animation: 150,
            wapThreshold: 0.5,
            onUpdate: () => {
                const items = list.querySelectorAll('.table__row')
                items.forEach((item, index) => {
                    item.querySelector('[data-order]').value = index
                })
            }
        })
        new PagesForm({
            method: 'PUT',
            title: 'Изменение страниц сайта',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            row: '[data-form-row]',
            router,
            auth,
            apiService,
            parseFields: function(form) {
                const body = []
                const tableRows = form.querySelectorAll(this.row)
                tableRows.forEach((row) => {
                    body.push({
                        id: row.querySelector('[name="id"]').value,
                        order: row.querySelector('[name="order"]').value,
                        name: row.querySelector('[name="name"]').value,
                        link: row.querySelector('[name="link"]').value,
                        inHeader: row.querySelector('[name="inHeader"]').checked,
                        inBottom: row.querySelector('[name="inBottom"]').checked,
                    })
                })
                return body
            }
        }).init()
    }

    functionalAdd(_, data, module) {
        new PagesForm({
            method: 'POST',
            title: 'Добавление страницы сайта',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            parseFields: function(form) {
                const body = {
                    name: form.querySelector('[name="name"]').value,
                    link: form.querySelector('[name="link"]').value,
                    inHeader: form.querySelector('[name="inHeader"]').checked,
                    inBottom: form.querySelector('[name="inBottom"]').checked,
                    content: {
                        body: tinymce.get('editor').getContent({format: 'raw'}),
                        classList: tinymce.get('editor').getBodyClassList()
                    }
                }
                return body
            },
            onSubmit: () => {
                router.redirectUrlState(pagesConfig.router.general)
                module.changeState()
            }
        }).init()
        contentEditor('#editor', '', 'page-section section-default editor-content')
    }
    functionalEdit(_, data) {
        new PagesForm({
            method: 'PUT',
            title: 'Редактирование страницы сайта',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            parseFields: function(form) {
                const body = {
                    id: form.querySelector('[name="id"]').value,
                    name: form.querySelector('[name="name"]').value,
                    link: form.querySelector('[name="link"]').value,
                    inHeader: form.querySelector('[name="inHeader"]').checked,
                    inBottom: form.querySelector('[name="inBottom"]').checked,
                    content: {
                        body: tinymce.get('editor').getContent({format: 'raw'}),
                        classList: tinymce.get('editor').getBodyClassList()
                    }
                }
                return body
            }
        }).init()
        DeleteHelper.delete({
            selector: '[data-page-delete]',
            title: 'Удаление страницы',
            text: 'Вы действительно хотите удалить эту страницу?',
            routerLink: router.pagesLink,
            closeOnSubmit: false,
            id: data._id,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление страницы',
                    text: res.data.message
                }).create()
            }
        })
        contentEditor('#editor', data.content, data.classList)
    }
}


export default new PagesController()