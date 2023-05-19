import { apiService, auth, router } from '../../common.modules.js'
import SalesModel from './sales.model.js'
import SelectComponent from '../../../core/components/selectsinputs/select.component.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import SalesForm from './sales.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import SortProvider from '../../../core/providers/sort.provider.js'

class SalesController {
    async middleware() {
        const res = await SalesModel.find()
        return {
            page: router.getParam('page') || 1,
            status: router.getParam('status'),
            orders: res
        }
    }

    functional(_, data, module) {
        this.select = new SelectComponent({
            query: '[data-order-type]',
            data: [
                {
                    value: 'Все',
                    dataset: 'all',
                    default: true
                },
                {
                    value: 'Отменён',
                    dataset: 'Отменён'
                },
                {
                    value: 'Сделка завершена',
                    dataset: 'Сделка завершена'
                },
                {
                    value: 'В процессе',
                    dataset: 'В процессе'
                },
                {
                    value: 'В обработке',
                    dataset: 'В обработке'
                }
            ],
            onselect: async (data) => {
                router.removeParam('page')
                router.addParams('status', data.value)
                router.redirectUrlState()
                await module.renderMenuState()
            }
        })
        this.select.render()
        if (data.status) {
            this.select.setTitle(this.select.data.find(item => item.dataset === data.status).value)
        }
        const pagination = new PaginationComponent({
            query: '#pagination', onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page, count: data.orders.count, limit: 30
        })
        new SortProvider({
            root: '[data-sort-header]',
            router,
            default: 'createdAt',
            changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }

    async middlewareEdit() {
        return await SalesModel.find()
    }

    functionalEdit(_, data, module) {
        new SalesForm({
            method: 'PUT',
            title: 'Изменение заказа',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data
        }).init()
        DeleteHelper.delete({
            selector: '[data-order-delete]',
            title: 'Удаление заказа',
            text: 'Вы действительно хотите удалить этот заказ?',
            routerLink: router.orderLink,
            id: data._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/sales')
                module.changeState()
            }
        })
    }
}

export default new SalesController()