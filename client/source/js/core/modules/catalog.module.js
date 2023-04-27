import renderProducts from '../views/render.products.js'
import SelectComponent from '../components/select.component.js'
import ScrollToTop from '../utils/smooth.scroll.js'
import changeProductsViewHandler from '../utils/view.catalog.js'
import { lazyLoadImages } from '../utils/utils.js'
import PaginationComponent from '../components/pagination.component.js'
import SidebarComponent from '../components/sidebar.component.js'


export default class CatalogModule {
    constructor(config) {
        this.router = config.router
        this.preloader = config.preloader
        this.apiService = config.apiService
        this.breadcrumbs = config.breadcrumbs
        this.filter = config.filter
        this.productsList = document.querySelector('#products_list')
        this.prevFilterStatement = {}
        this.alreadyRendered = false
        this.data = null
        window.addEventListener('popstate', this.router.reload)
    }

    async init() {
        new SidebarComponent({
            root: '[data-sidebar]',
            overlay: '.page-overlay',
            buttonOpen: '[data-sidebar-open]',
            buttonClose: '[data-sidebar-close]'
        }).init()
        changeProductsViewHandler()

        try {
            this.data = await this.apiService.useRequest(this.router.apiLink)
            this.renderCatalogHeader(this.data)
            this.renderSortSelect()

            this.pagination = new PaginationComponent({
                query: '#pagination',
                onChange: (pageNumber) => {
                    this.router.addParams('page', pageNumber)
                    this.router.redirectUrlState()
                    this.changeState()
                }
            })
            this.filter.init({
                data: this.data.filtersData,
                changeState: (data) => {
                    this.changeFilterState(data)
                },
                onRenderFilter: () => {
                    this.parseFiltersOnLoad()
                }
            })
        } catch (e) {
            console.log(e.message)
        }
    }

    renderSortSelect() {
        this.sortSelect = new SelectComponent({
            query: '#sort-catalog',
            data: [
                {
                    value: 'По популярности',
                    dataset: 'popularity',
                    default: true
                },
                {
                    value: 'По наименованию',
                    dataset: 'name'
                },
                {
                    value: 'По бренду',
                    dataset: 'maker'
                }
            ],
            onselect: (data) => {
                this.router.addParams('sort', data.value)
                this.router.redirectUrlState()
                this.changeState()
            }
        })
        this.sortSelect.render()
    }

    async changeState() {
        this.setPreloaderState()
        this.pagination.clear()
        let data
        ScrollToTop('#top-element')
        if (!this.alreadyRendered) {
            data = this.data
            this.alreadyRendered = true
        } else {
            try {
                data = await this.apiService.useRequest(this.router.apiLink)
            } catch (e) {
                console.log(e.message)
            }
        }

        this.renderProducts(data)
        this.preloader.hide()
    }

    setPreloaderState() {
        this.productsList.innerHTML = `<div class="preloader"></div>`
    }

    parseFiltersOnLoad() {
        const params = this.router.params
        const parsedData = {}
        for ( const [key, value] of params.entries() ) {
            if (key === 'sort' && value.trim().length) {
                this.sortSelect.changeState(value)
            } else if (key === 'name' && value.trim().length) {
                if (!parsedData[key]) {
                    parsedData[key] = []
                }
                value.split(',').forEach(vl => {
                    parsedData[key].push(vl)
                    this.filter.addFilterItem({
                        type: key,
                        label: 'Поиск по названию',
                        value: vl
                    })
                })
            } else if (this.filter.allowedKeys.includes(key) && value.length) {
                if (!parsedData[key]) {
                    parsedData[key] = []
                }
                value.split(',').forEach(vl => {
                    parsedData[key].push(vl)
                    this.filter.addFilterItem({
                        type: key,
                        value: vl
                    })
                })
            }
        }
        this.prevFilterStatement = parsedData
        this.filter.loadData()
    }

    changeFilterState(data) {
        const parsedData = {}
        data.forEach((data) => {
            if (!parsedData[data.type]) {
                parsedData[data.type] = []
            }
            parsedData[data.type].push(data.value)
        })
        this.router.removeParam('page')
        for ( const item of Object.keys(this.prevFilterStatement) ) {
            if (!parsedData.hasOwnProperty(item)) {
                this.router.removeParam(item)
            }
        }

        for ( const item of Object.keys(parsedData) ) {
            this.router.addParams(
                item,
                parsedData[item].join(',')
            )
        }
        this.prevFilterStatement = parsedData
        this.router.redirectUrlState()
        this.changeState()
    }

    renderCatalogHeader({ path }) {
        this.setTitle(path.at(-1).name)
        this.breadcrumbs.renderPath(path)
    }

    renderProducts({ products, count, currentPage }) {
        if (!products.length) {
            this.productsList.innerHTML = 'Ничего не найдено'
        } else {
            this.productsList.innerHTML = renderProducts(products, 'products__item')
            lazyLoadImages(this.productsList)
            this.pagination.render({
                count,
                currentPage
            })
        }
    }

    setTitle(text) {
        document.querySelector('.page-section__title').innerHTML = text
    }
}


