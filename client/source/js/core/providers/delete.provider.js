import ModalComponent from '../components/modals/modal.component.js'
import { apiService, router } from '../../app/common.modules.js'
import ButtonComponent from '../components/button.component.js'

class DeleteHelper {
    static delete({ selector, title, text, routerLink, id, onSubmit}) {
        document.querySelector(selector).addEventListener('click', () => {
            const modal = new ModalComponent({
                template: 'choose',
                title,
                text,
                submitHandler: async (button) => {
                    const submitButton = new ButtonComponent(button)
                    submitButton.setPreloaderState()
                    const res = await apiService.useRequestStatus(routerLink, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    })
                    return onSubmit(res, button)
                }
            }).create()
        })
    }
}

export default DeleteHelper