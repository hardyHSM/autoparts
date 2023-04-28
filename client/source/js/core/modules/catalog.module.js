import renderProducts from '../views/render.products.js'
import SelectComponent from '../components/select.component.js'
import ScrollToTop from '../utils/smooth.scroll.js'
import changeProductsViewHandler from '../utils/view.catalog.js'
import { lazyLoadImages } from '../utils/utils.js'
import PaginationComponent from '../components/pagination.component.js'
import SidebarComponent from '../components/sidebar.component.js'
import ModuleCore from './module.core.js'
import Filter from './filter.module.js'
import { router } from '../common.modules.js'
import BreadcrumbsComponent from '../components/breadcrumbs.component.js'


export default class CatalogModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.breadcrumbs = new BreadcrumbsComponent('#breadcrumbs')
        this.filter = new Filter('#page-filter', '#filter-list', router)
        this.$productsList = document.querySelector('#products_list')
        this.prevFilterStatement = {}
        this.data = null
    }

    async init() {
        super.init()
        try {
            changeProductsViewHandler()
            new SidebarComponent({
                root: '[data-sidebar]',
                overlay: '.page-overlay',
                buttonOpen: '[data-sidebar-open]',
                buttonClose: '[data-sidebar-close]'
            }).init()
            this.renderSortSelect()
            this.pagination = new PaginationComponent({
                query: '#pagination',
                onChange: (pageNumber) => {
                    this.addParamState('page', pageNumber, () => {
                        this.changeState()
                        ScrollToTop('#top-element')
                    })
                }
            })
            this.renderFilterSidebar()
            this.data = await this.changeState()
            this.preloader.hide()
            this.renderCatalogHeader(this.data)
        } catch(e) {
            this.router.redirectNotFound()
        }
    }
    async renderFilterSidebar() {
        this.filter.showPreloader()
        const data = await this.apiService.useRequest(this.router.catalogFilter, {
            method: "OPTIONS"
        })
        this.filter.init({
            data: data.filtersData,
            changeState: (data) => {
                this.changeFilterState(data)
            },
            onRenderFilter: () => {
                this.parseFiltersOnLoad()
            }
        })
        this.filter.removePreloader()
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
                this.addParamState('sort', data.value, () => {
                    this.changeState()
                    ScrollToTop('#top-element')
                })
            }
        })
        this.sortSelect.render()
    }

    async changeState() {
        this.router.redirectUrlState()
        this.filter.showPreloader()
        this.showPreloader()
        this.pagination.clear()

        const data = await this.apiService.useRequest(this.router.apiLink)

        this.renderProducts(data)
        this.filter.removePreloader()
        return data
    }


    parseFiltersOnLoad() {
        const params = this.router.params
        const parsedData = {}
        for ( const [key, value] of params.entries() ) {
            if (!value.trim().length) continue

            if (key === 'sort') {
                this.sortSelect.changeState(value)
            } else if (key === 'name') {
                parsedData[key] = value
                this.filter.addFilterItem({
                    type: key,
                    label: 'Поиск по названию',
                    value
                })
            } else if (this.filter.allowedKeys.includes(key)) {
                if (!parsedData[key]) parsedData[key] = []
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
        this.filter.initialState()
    }

    changeFilterState(data) {
        this.router.removeParam('page')
        const parsedData = {}
        data.forEach((data) => {
            if (!parsedData[data.type]) parsedData[data.type] = []
            parsedData[data.type].push(data.value)
        })
        for ( const item of Object.keys(this.prevFilterStatement) ) {
            if (!parsedData.hasOwnProperty(item)) {
                this.router.removeParam(item)
            }
        }
        for ( const item of Object.keys(parsedData) ) {
            this.router.addParams(item, parsedData[item].join(','))
        }
        this.prevFilterStatement = parsedData
        this.changeState()
    }

    renderProducts({ products, count, currentPage }) {
        if (!products.length) {
            this.$productsList.innerHTML = 'Ничего не найдено'
        } else {
            this.$productsList.innerHTML = renderProducts(products, 'products__item')
            lazyLoadImages(this.$productsList)
            this.pagination.render({
                count,
                currentPage
            })
        }
    }

    renderCatalogHeader({ path }) {
        this.setTitle(path.at(-1).name)
        this.breadcrumbs.renderPath(path)
    }

    showPreloader() {
        this.$productsList.innerHTML = `<div class="preloader"></div>`
    }

    setTitle(text) {
        document.querySelector('.page-section__title').innerHTML = text
    }
}


