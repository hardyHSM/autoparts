import { apiService, auth, router } from '../../common.modules.js'
import usersModel, { usersConfig } from './users.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvide from '../../../core/providers/filter.provider.js'
import { pickLocationChange } from '../../service/pick.location.js'
import UsersForm from './users.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'
import { ordersConfig } from '../orders/orders.model.js'
import ModalComponent from '../../../core/components/modals/modal.component.js'
import LocationModule from '../../modules/location.module.js'

class UsersController {
    async middleware() {
        let page = router.getParam('page')
        if (!page) {
            page = 1
            router.addParams('page', page)
            router.redirectUrlState()
        }
        const users = await usersModel.find()
        return {
            users,
            page
        }
    }

    async middlewareEdit() {
        const locationModule = new LocationModule({
            root: '[data-location-admin]',
            router,
            apiService,
            onChoose: (value,id) => {
                document.querySelector('[data-address]').setAttribute('data-address', id)
            }
        })
        await locationModule.loadData()
        return {
            user: await usersModel.find(),
            locationModule: locationModule
        }
    }

    async functional(_, data, module) {
        const pagination = new PaginationComponent({
            query: '#pagination', onChange: async (pageNumber) => {
                router.addParams('page', pageNumber)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        })
        pagination.render({
            currentPage: data.page, count: data.users.count, limit: 20
        })
        new SortProvider({
            root: '[data-sort-header]',
            default: 'createdAt',
            router, changeStateHandler: async (key, type) => {
                router.addParams('sort_name', key)
                router.addParams('sort_type', type)
                router.redirectUrlState()
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
        new FilterProvide({
            root: '[data-filter-bar]', router, onChangeState: async () => {
                await module.renderMenuState()
                scrollToTop('#top-element')
            }
        }).init()
    }

    functionalEdit(_, data, module) {
        const { user, locationModule } = data

        locationModule.init()
        locationModule.setLocationDisplay(user.location.name, user.location.id)

        new UsersForm({
            method: 'PUT',
            title: 'Изменение аккаунта пользователя',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data: user
        }).init()

        DeleteHelper.delete({
            selector: '[data-user-delete]',
            title: 'Удаление пользователя',
            text: 'Вы действительно хотите удалить аккаунт этого пользователя?',
            routerLink: router.usersLink,
            id: user._id,
            closeOnSubmit: false,
            onSubmit: (res) => {
                if (res.status === 200) {
                    router.setPrevState()
                }
                new ModalComponent({
                    template: 'default',
                    title: 'Удаление аккаунта пользователя!',
                    text: res.data.message
                }).create()
            }
        })
    }
}


export default new UsersController()