import ModalComponent from '../components/modals/modal.component.js'
import { apiService, router } from '../../app/common.modules.js'

class DeleteHelper {
    static delete({ selector, title, text, routerLink, id, onsuccess }) {
        document.querySelector(selector).addEventListener('click', () => {
            let res
            new ModalComponent({
                template: 'choise',
                title,
                text,
                okayHandler: async () => {
                    res = await apiService.useRequest(routerLink, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    })
                    return res
                },
                closeHandler: async () => {
                    onsuccess()
                    new ModalComponent({
                        template: 'default',
                        title,
                        text: res.success || res.message
                    }).create()
                }
            }).create()
        })
    }
}

export default DeleteHelper