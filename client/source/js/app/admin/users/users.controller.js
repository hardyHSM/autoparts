import { apiService, auth, router } from '../../common.modules.js'
import usersModel from './users.model.js'
import PaginationComponent from '../../../core/components/pagination.component.js'
import scrollToTop from '../../utils/utils.js'
import SortProvider from '../../../core/providers/sort.provider.js'
import FilterProvide from '../../../core/providers/filter.provide.js'
import { pickLocationChange } from '../../service/pick.location.js'
import UsersForm from './users.form.js'
import DeleteHelper from '../../../core/providers/delete.provider.js'

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
        return await usersModel.find()
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
        pickLocationChange((name,id) => {
            document.querySelector('.pick-location__address').innerHTML = name
            document.querySelector('.pick-location__address').dataset.address = id
        })
        new UsersForm({
            method: 'PUT',
            title: 'Измение аккаунта пользователя',
            submitSelector: '[data-submit]',
            form: '[data-admin-form]',
            router,
            auth,
            apiService,
            data
        }).init()

        DeleteHelper.delete({
            selector: '[data-user-delete]',
            title: 'Удаление пользователя',
            text: 'Вы действительно хотите удалить аккаунт этого пользователя?',
            routerLink: router.usersLink,
            id: data._id,
            onsuccess: () => {
                router.redirectUrlState('/admin/users/users')
                module.changeState()
            }
        })
    }
}


export default new UsersController()