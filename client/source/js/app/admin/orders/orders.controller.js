import { apiService, auth, router } from '../../common.modules.js'
import OrdersModel, { ordersConfig } from './orders.model.js'
import SelectComponent from '../../../core/components/selectsinputs/select.component.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import OrdersForm from './orders.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import DatePickerComponent from '../../../core/components/date.picker.component.js'

class OrdersController {
    async middleware() {
        const res = await OrdersModel.find()
        return {
            page: router.getParam('page') || 1,
            status: router.getParam('status'),
            range: DatePickerComponent.getRangeParams(),
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
                    isSelected: true
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
                    value: 'Не обработан',
                    dataset: 'Не обработан'
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
        const range = DatePickerComponent.getRangeParams(data.orders.minDate)
        new DatePickerComponent({
            root: '[data-date-select]',
            singleDate: true,
            minDate: data.orders.minDate,
            initState: range,
            onChange: async (data, picker) => {
                const parsedData = data.map(item => item.getTime())
                DatePickerComponent.changeParams(parsedData)
                router.removeParam('page')
                router.redirectUrlState()
                picker.destroy()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }

    async middlewareEdit() {
        return await OrdersModel.find()
    }

    functionalEdit(_, data, module) {
        if (data.status !== 'Сделка завершена') {
            new OrdersForm({
                method: 'PUT',
                title: 'Изменение заказа',
                submitSelector: '[data-submit]',
                form: '[data-admin-form]',
                router,
                auth,
                apiService,
                data
            }).init()
        }

        DeleteHelper.delete({
            selector: '[data-order-delete]',
            title: 'Удаление заказа',
            text: 'Вы действительно хотите удалить этот заказ?',
            routerLink: router.orderLink,
            id: data._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление заказа',
                    text: res.data.message
                }).create()
            }
        })
    }
}

export default new OrdersController()