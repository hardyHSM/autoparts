import scrollToTop, { debounce, escapeRegex, lazyLoadImages, sanitalize } from '../utils/utils.js'
import { renderSearchComplete } from '../views/render.search.js'
import PaginationComponent from '../../core/components/pagination.component.js'
import changeProductsViewHandler from '../service/view.catalog.js'
import SelectComponent from '../../core/components/selectsinputs/select.component.js'
import SidebarComponent from '../../core/components/sidebar.component.js'
import SearchComponent from '../../core/components/search.component.js'


class SearchModule extends SearchComponent {
    paramsList = [
        'name',
        'text',
        'sort',
        'key',
        'value',
        'page'
    ]
    $elements = {}

    constructor(config) {
        super(config)
        this.alreadyHaveStatement = false
        this.cacheElements()
    }

    cacheElements() {
        this.$elements.productList = document.querySelector('#products_list')
        this.$elements.title =  document.querySelector('.page-section__title')
        this.$elements.searchList =  document.querySelector('[data-aside-searchlist]')
        this.$elements.searchPageInput =  document.querySelector('[data-name-search]')
    }

    bindMethods() {
        [
            'requestToSearch',
            'requestToSearchMaker',
            'requestToSearchAttributes',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    getSearchParams(params = []) {
        return params.reduce((acc, param) => {
            acc[param] = this.router.getParam(param) || ''
            return acc
        }, {})
    }

    async initPage() {
        this.bindMethods()
        this.params = this.getSearchParams(this.paramsList)
        changeProductsViewHandler()
        new SidebarComponent({
            root: '[data-sidebar]',
            overlay: '.page-overlay',
            buttonOpen: '[data-sidebar-open]',
            buttonClose: '[data-sidebar-close]'
        }).init()
        this.sortSelect = new SelectComponent({
            query: '#sort-search',
            data: [
                {
                    value: 'По популярности',
                    dataset: 'popularity',
                    isSelected: true
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
                this.setCurrentState()
            }
        })
        if(this.router.getParam('sort')) {
            this.sortSelect.changeState(this.params.sort)
        }
        this.sortSelect.render()
        this.$elements.searchPageInput.value = this.params.text
        this.setPreloaderSearchList()


        document.querySelector('[data-search-button]').addEventListener('click', () => {
            this.requestToSearchText(this.$elements.searchPageInput.value)
        })
        this.setCurrentState()
        window.addEventListener('popstate', () => {
            this.router.reload()
        })
    }

    async setState(stateFunc) {
        this.params = this.getSearchParams(this.paramsList)
        const res = await stateFunc(this.params)
        this.renderProducts(res)
        this.pagination.render({
            count: res.products.count,
            currentPage: this.pageParam || 1
        })
        return res
    }

    async setCurrentState() {
        this.pagination = new PaginationComponent({
            query: '#pagination',
            onChange: (pageNumber) => {
                this.router.addParams('page', pageNumber)
                this.router.redirectUrlState()
                this.pageParam = pageNumber
                this.setCurrentState()
                scrollToTop('#top-element')
            }
        })
        this.pagination.clear()
        this.setPreloaderProducts()
        if (this.router.url.pathname === '/search' && this.params.text) {
            const res = await this.setState(this.requestToSearch)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$elements.searchList.innerHTML = renderSearchComplete(res, false)
            }
        } else if (this.router.url.pathname === '/search/maker' && this.params.name) {
            const res = await this.setState(this.requestToSearchMaker)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$elements.title.innerHTML = `Поиск по производителю ${this.params.name}`
                this.$elements.searchList.innerHTML = this.renderSearchListTitle('Поиск по производителю', this.params.name, res.products.count)
            }
        } else if (this.router.url.pathname === '/search/attributes' && this.params.key && this.params.value) {
            const res = await this.setState(this.requestToSearchAttributes)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$elements.title.innerHTML = `Поиск по аттрибуту ${this.params.key}`
                this.$elements.searchList.innerHTML = this.renderSearchListTitle(`${this.params.key}`, this.params.value, res.products.count)
            }
        } else {
            this.router.redirectNotFound()
        }
    }

    setPreloaderProducts() {
        this.$elements.productList.innerHTML = `<div class="preloader"></div>`
    }

    toggleSearch() {
        if (this.searchIsActive) {
            this.closeSearch()
        } else {
            this.openSearch()
        }
    }

    // API

    async requestToSearchText(text) {
        this.router.removeParams(['sort', 'page'])
        this.router.addParams('text', text)
        this.router.redirectUrlState()
        this.router.reload()
    }

    async requestToSearchMaker(params) {
        return this.makeSearchRequest(this.router.searchMakerLink, params)
    }

    async requestToSearchAttributes(params) {
        return this.makeSearchRequest(this.router.searchAttributesLink, params)
    }

    async makeSearchRequest(url, { text, ...params }) {
        return this.apiService.useRequest(url, {
            method: 'OPTIONS',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: escapeRegex(text), ...params })
        })
    }


}

export default SearchModule
