import ModuleCore from '../../core/modules/module.core.js'

class NavigationModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.configHeaderMenu = config.headerMenu
        this.configFooterMenu = config.footerMenu
    }
    async init() {
        try {
            this.data = await this.apiService.useRequest(this.router.pagesLink)
            super.init(() => {
                this.parseData()
            })
        } catch (e) {
            console.error(e.message)
        }
    }

    parseData() {
        this.$headerMenu = document.querySelector(this.configHeaderMenu)
        this.$footerMenu = document.querySelector(this.configFooterMenu)
        this.render({
            data: this.data,
            currentPage: this.router.currentPage
        })
    }

    render({data, currentPage}) {
        const sortedData = data.sort((a, b) => a.order - b.order)
        this.$headerMenu.innerHTML = this.renderHeaderMenu({ sortedData, currentPage })
        this.$footerMenu.innerHTML = this.renderFooterMenu({ sortedData, currentPage})
    }

    renderHeaderMenu({ sortedData, currentPage }) {
        const headerItems = sortedData.filter(item => item.inHeader)

        return `
            <ul class="page-nav__list">
                ${headerItems.map((item,index) => {
                    return item.link === currentPage ? 
                        `
                        <li class="page-nav__item ${index === 0 ? "page-nav__item_hidden" : '' }">
                            <span class="page-nav__span">${item.name}</span>
                        </li>
                        `
                        : `
                        <li class="page-nav__item ${index === 0 && "page-nav__item_hidden"}">
                            <a href="/${item.link}" class="page-nav__link">${item.name}
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#arrow-small"></use>
                                </svg>
                            </a>
                        </li>
                    `
                }).join('')}
            </ul>
        `
    }

    renderFooterMenu({ sortedData, currentPage }) {
        const footerItems = sortedData.filter(item => item.inBottom)
        return `
            <ul class="page-nav__list">
                ${footerItems.map((item,index) => {
                    return `
                        <li class="page-nav__item ${index > 5 ? 'page-nav__item_conf' : ''}">
                            ${item.link === currentPage ?
                            `<span class="page">${item.name}</span>`
                            :
                            `<a href="/${item.link}" class="page-nav__link">${item.name}</a>`}
                        </li>
                    `
        }).join('')}
            </ul>
        `
    }
}

export default NavigationModule