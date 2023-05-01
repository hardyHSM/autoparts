import { debounce, lazyLoadImages, sanitalize } from '../utils/utils.js'
import { renderSearchComplete } from '../views/render.search.js'
import renderProducts from '../views/render.products.js'
import PaginationComponent from '../../core/components/pagination.component.js'
import changeProductsViewHandler from '../utils/view.catalog.js'
import SelectComponent from '../../core/components/select.component.js'
import ScrollToTop from '../utils/smooth.scroll.js'
import SidebarComponent from '../../core/components/sidebar.component.js'
import ModuleCore from '../../core/modules/module.core.js'


class SearchModule extends ModuleCore{
    constructor(config) {
        super(config)
        this.registerHandlers()
        this.searchIsActive = false
        this.alreadyHaveStatement = false
        this.requestToSearch = this.requestToSearch.bind(this)
        this.requestToSearchMaker = this.requestToSearchMaker.bind(this)
        this.requestToSearchAttributes = this.requestToSearchAttributes.bind(this)
    }

    registerHandlers() {
        window.addEventListener('load', () => {
            this.$searchField = document.querySelector('.page-search__field')
            this.$searchIcon = document.querySelector('#page-search .page-search__icon')
            this.$pageTel = document.querySelector('.page-header__tel')
            this.$overlay = document.querySelector('.page-overlay')
            this.$searchWrapper = document.querySelector('#page-search')
            this.$searchButton = document.querySelector('.page-search__button')
            this.$searchComplete = document.querySelector('.page-search__complete')
            this.$searchListHeader = document.querySelector('[data-header-searchlist]')
            this.$searchLoader = document.querySelector('.page-search__loader')
            this.$searchIcon.addEventListener('click', () => {
                if (this.searchIsActive) {
                    this.closeSearch()
                } else {
                    this.openSearch()
                }
            })
            this.$searchField.addEventListener('focus', this.openSearch.bind(this))
            this.$overlay.addEventListener('click', this.closeSearch.bind(this))
            const searchWithDebounce = debounce(this.searchAction.bind(this), 800)
            this.$searchField.addEventListener('input', (e) => {
                searchWithDebounce()
            })
            this.$searchButton.addEventListener('click', () => {
                const value = sanitalize(this.$searchField.value)
                this.router.redirect(`/search?text=${sanitalize(encodeURIComponent(value || ''))}`)
            })

        })
    }

    async searchAction() {
        if(!this.$searchField.value.length) return
        this.enableLoader()
        const res = await this.requestToSearch({
            text: sanitalize(this.$searchField.value),
            count: 5
        })
        this.disableLoader()
        this.$searchWrapper.classList.add('page-search_complete')
        this.$searchComplete.classList.add('page-search__complete_active')
        this.$searchListHeader.innerHTML = renderSearchComplete(res)
    }

    openSearch() {
        this.searchIsActive = true
        this.$searchField.focus()
        this.$searchIcon.classList.add('page-search__icon_active')
        this.$overlay.classList.add('page-overlay_active')
        this.$searchWrapper.classList.add('page-search_active')
        this.$searchButton.classList.add('page-search__button_active')
        if (window.innerWidth < 960 && window.innerWidth > 640) {
            this.$pageTel.classList.add('page-header__tel_active')
        }
        if (this.$searchField.value.length) {
            this.$searchComplete.classList.add('page-search__complete_active')
            this.$searchWrapper.classList.add('page-search_complete')
        }
    }

    closeSearch() {
        this.searchIsActive = false
        this.$searchComplete.classList.remove('page-search__complete_active')
        this.$overlay.classList.remove('page-overlay_active')
        this.$searchWrapper.classList.remove('page-search_active')
        this.$searchWrapper.classList.remove('page-search_complete')
        this.$searchButton.classList.remove('page-search__button_active')
        this.$pageTel.classList.remove('page-header__tel_active')
    }

    enableLoader() {
        this.$searchLoader.classList.add('page-search__loader_active')
    }

    disableLoader() {
        this.$searchLoader.classList.remove('page-search__loader_active')
    }

    async requestToSearchText(text) {
        this.router.removeParams(['sort', 'page'])
        this.router.addParams('text', text)
        this.router.redirectUrlState()
        this.router.reload()
    }

    async requestToSearchMaker({ text, page, name, sort }) {
        return await this.apiService.useRequest(this.router.searchMakerLink, {
            method: 'OPTIONS',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                name,
                page,
                sort
            })
        })
    }

    async requestToSearchAttributes({ text, page, key, value, sort }) {
        return await this.apiService.useRequest(this.router.searchAttributesLink, {
            method: 'OPTIONS',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key,
                value,
                text,
                page,
                sort
            })
        })
    }

    async requestToSearch({ text, count, page, sort }) {
        return await this.apiService.useRequest(this.router.searchLink, {
            method: 'OPTIONS',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                count,
                page,
                sort
            })
        })
    }

    async initPage() {
        new SidebarComponent({
            root: '[data-sidebar]',
            overlay: '.page-overlay',
            buttonOpen: '[data-sidebar-open]',
            buttonClose: '[data-sidebar-close]'
        }).init()
        changeProductsViewHandler()
        this.sortSelect = new SelectComponent({
            query: '#sort-search',
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
                this.setCurrentState()
            }
        })
        this.sortSelect.render()

        this.nameParam = sanitalize(this.router.getParam('name'))
        this.textParam = sanitalize(this.router.getParam('text'))
        this.sortParam = sanitalize(this.router.getParam('sort'))
        this.keyParam = sanitalize(this.router.getParam('key'))
        this.valueParam = sanitalize(this.router.getParam('value'))
        this.pageParam = sanitalize(this.router.getParam('page'))

        this.$productList = document.querySelector('#products_list')
        this.$title = document.querySelector('.page-section__title')
        this.$searchList = document.querySelector('[data-aside-searchlist]')
        this.$searchPageInput = document.querySelector('[data-name-search]')


        console.log(this.textParam)
        this.$searchPageInput.value = this.textParam
        this.setPreloaderSearchList()
        this.sortSelect.changeState(this.sortParam)

        document.querySelector('[data-search-button]').addEventListener('click', () => {
            this.requestToSearchText(this.$searchPageInput.value)
        })
        this.setCurrentState()
        window.addEventListener('popstate', () => {
            this.router.reload()
        })
    }

    async setCurrentState() {
        this.pagination = new PaginationComponent({
            query: '#pagination',
            onChange: (pageNumber) => {
                this.router.addParams('page', pageNumber)
                this.router.redirectUrlState()
                this.pageParam = pageNumber
                this.setCurrentState()
                ScrollToTop('#top-element')
            }
        })
        this.pagination.clear()
        this.setPreloaderProducts()
        if (this.router.url.pathname === '/search' && this.textParam) {
            const res = await this.setState(this.requestToSearch)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$searchList.innerHTML = renderSearchComplete(res, false)
            }
        } else if (this.router.url.pathname === '/search/maker' && this.nameParam) {
            const res = await this.setState(this.requestToSearchMaker)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$title.innerHTML = `Поиск по производителю ${this.nameParam}`
                this.$searchList.innerHTML = this.renderSearchListTitle('Поиск по производителю', this.nameParam, res.products.count)
            }
        } else if (this.router.url.pathname === '/search/attributes' && this.keyParam && this.valueParam) {
            const res = await this.setState(this.requestToSearchAttributes)
            if (!this.alreadyHaveStatement) {
                this.alreadyHaveStatement = true
                this.$title.innerHTML = `Поиск по аттрибуту ${this.keyParam}`
                this.$searchList.innerHTML = this.renderSearchListTitle(`${this.keyParam}`, this.valueParam, res.products.count)
            }
        } else {
            this.router.redirectNotFound()
        }
        this.preloader.hide()
    }

    async setState(stateFunc) {
        const res = await stateFunc({
            name: this.nameParam,
            value: this.valueParam,
            text: this.textParam,
            page: this.pageParam,
            sort: this.sortParam,
            key: this.keyParam
        })
        this.renderProducts(res)
        this.pagination.render({
            count: res.products.count,
            currentPage: this.pageParam || 1
        })
        return res
    }

    renderSearchListTitle(type, title, count) {
        return `
            <div class="search-list__item">
                 <div class="search-list__header">
                     ${type}
                 </div>
                 <div class="search-list__body">
                     <span class="search-list__name">${title}</span>
                     <span class="search-list__count">(товаров - ${count})</span>
                 </div>
            </div>
        `
    }

    renderProducts(res) {
        this.$productList.innerHTML = renderProducts(res.products?.list || [], 'products__item') || 'Ничего не найдено'
        lazyLoadImages(this.$productList)
    }

    setPreloaderProducts() {
        this.$productList.innerHTML = `<div class="preloader"></div>`
    }

    setPreloaderSearchList() {
        this.$searchList.innerHTML = '<div class="search-list__loader"><div class="loader"></div></div>'
    }
}

export default SearchModule

