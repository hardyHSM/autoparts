import ModuleTabs from '../../core/modules/module.tabs.js'
import {
    renderCart,
    renderChangePassword,
    renderNotifications,
    renderNotificationsList,
    renderOrderFull,
    renderOrders,
    renderPersonal,
    renderProfile,
    renderPurchases
} from '../views/render.profile.js'
import { apiService, auth, router, userNav } from '../common.modules.js'
import PersonalForm from '../forms/personal.form.js'
import ChangePasswordForm from '../forms/change.password.form.js'


class ProfileTabsModule extends ModuleTabs{
    constructor(config) {
        super(config)
        this.config = {
            root: 'user',
            tabsParams: {
                'profile': {
                    render: renderProfile,
                    default: 'personal'
                },
                'purchases': {
                    render: renderPurchases,
                    default: 'cart'
                },
                'notifications': {
                    render: renderNotifications,
                    default: 'messages'
                }
            },
            menuParams: {
                'personal': {
                    middleware: () => {
                        return auth.init()
                    },
                    render: renderPersonal,
                    functional: () => {
                        new PersonalForm({
                            router,
                            submitSelector: '[data-submit]',
                            form: '[data-personal-form]',
                            apiService
                        }).init()
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
                    middleware: () => {
                        return apiService.useRequest(router.cartLink)
                    },
                    render: renderCart
                },
                'orders': {
                    middleware: async () => {
                        return await apiService.useRequest(router.userOrdersLink)
                    },
                    render: renderOrders,
                    functional: async (node, data) => {
                        document.querySelectorAll('[data-param]').forEach(item => {
                            item.addEventListener('click', () => {
                                const order = data.find(d => d._id === item.dataset.id)
                                node.innerHTML = renderOrderFull(order)
                                node.addEventListener('click', ({ target }) => {
                                    const button = target.closest('[data-back]')
                                    if(button) {
                                        this.router.redirectUrlState(button.link)
                                        this.router.init()
                                        this.changeState()
                                    }
                                })
                            })
                        })
                    }
                },
                'messages': {
                    middleware: () => {
                        return apiService.useRequest(router.userNotificationsLink)
                    },
                    render: renderNotificationsList,
                    functional() {
                        userNav.changeState()
                    }
                }
            }
        }
    }

}


export default ProfileTabsModule