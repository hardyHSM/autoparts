import ModuleTabs from '../../core/modules/module.tabs.js'


class AdminModule extends ModuleTabs {
    constructor(config) {
        super(config)
        this.config = {
            root: 'admin',
            tabsParams: {
                'catalog': {
                    render: () => {},
                    default: 'personal'
                },
                'purchases': {
                    render: () => {},
                    default: 'cart'
                },
                'notifications': {
                    render: () => {},
                    default: 'messages'
                }
            }
        }
    }
}

export default AdminModule