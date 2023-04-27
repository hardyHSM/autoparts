import {
    renderCart,
    renderChangePassword,
    renderNotifications,
    renderOrderFull,
    renderOrders,
    renderPersonal,
    renderProfile,
    renderPurchases,
    renderNotificationsList
} from '../views/render.profile.js'
import { router, auth, apiService, userNav } from '../common.modules.js'
import ChangePasswordForm from '../forms/change.password.form.js'
import PersonalForm from '../forms/personal.form.js'

const config = {
    tabs: {
        'profile': {
            render: renderProfile
        },
        'purchases': {
            render: renderPurchases
        },
        'notifications': {
            render: renderNotifications
        },
    },
    menu: {
        'personal': {
            render: renderPersonal,
            functional: () => {
                new PersonalForm({
                    router,
                    submitSelector: '[data-submit]',
                    form: '[data-personal-form]',
                    apiService,
                }).init()
            },
            preporator: async () => {
                await auth.init()
            }
        },
        'password': {
            render: renderChangePassword,
            functional: () => {
                new ChangePasswordForm({
                    auth,
                    router,
                    submitSelector: '[data-submit]',
                    form: '[data-password-form]',
                    apiService
                }).init()
            }
        },
        'logout': {
            functional: async () => {
                await apiService.useRequest(router.logoutLink, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                router.redirectMain()
            }
        },
        'cart': {
            preporator: async () => {
                return await apiService.useRequest(router.cartLink)
            },
            render: renderCart,
            functional() {}
        },
        'orders': {
            preporator: async () => {
                return await apiService.useRequest(router.userOrdersLink)
            },
            queryLoad: (node, data) => {
                const id = router.getParam('id')
                const order = data.find(d => d._id === id)
                if(!order) router.redirectNotFound()
                node.innerHTML = renderOrderFull(order)
            },
            render: renderOrders,
            functional: async(node, data) => {
                document.querySelectorAll('[data-param]').forEach(item => item.addEventListener('click', () => {
                    router.redirectUrlState(item.dataset.param)
                    const order = data.find(d => d._id === item.dataset.id)
                    node.innerHTML = renderOrderFull(order)
                }))
            }
        },
        'messages': {
            preporator: async () => {
                return await apiService.useRequest(router.userNotificationsLink)
            },
            render: renderNotificationsList,
            functional() {
                userNav.changeState()
            }
        }
    },
    defaultTab: 'profile'
}

export default config