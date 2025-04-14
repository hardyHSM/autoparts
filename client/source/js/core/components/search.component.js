import { debounce, escapeRegex, lazyLoadImages, sanitalize } from '../../app/utils/utils.js'
import ModuleCore from '../../core/modules/module.core.js'
import renderProducts from '../../app/views/render.products.js'
import { renderSearchComplete } from '../../app/views/render.search.js'

class SearchComponent extends ModuleCore {
    constructor(config) {
        super(config)
        this.searchIsActive = false
    }
    cacheElements() {
        this.$elements = {
            searchField: document.querySelector('.page-search__field'),
            searchIcon: document.querySelector('#page-search .page-search__icon'),
            pageTel: document.querySelector('.page-header__tel'),
            overlay: document.querySelector('.page-overlay'),
            searchWrapper: document.querySelector('#page-search'),
            searchButton: document.querySelector('.page-search__button'),
            searchComplete: document.querySelector('.page-search__complete'),
            searchListHeader: document.querySelector('[data-header-searchlist]'),
            searchLoader: document.querySelector('.page-search__loader')
        }
    }

    bindMethods() {
        [
            'requestToSearch',
            'toggleSearch',
            'openSearch',
            'closeSearch',
            'searchAction',
            'changePage'
        ].forEach(fn => this[fn] = this[fn].bind(this))
    }

    init() {
        super.init(() => {
            this.start()
        })
    }

    start() {
        this.bindMethods()
        this.cacheElements()
        this.$elements.searchIcon.addEventListener('click', this.toggleSearch)
        this.$elements.searchField.addEventListener('focus', this.openSearch)
        this.$elements.overlay.addEventListener('click', this.closeSearch)
        this.$elements.searchField.addEventListener('input', debounce(this.searchAction, 800))
        this.$elements.searchButton.addEventListener('click', this.changePage)
        this.$elements.searchButton.addEventListener('blur', this.closeSearch)
    }

    async searchAction() {
        if (!this.$elements.searchField.value.length) return
        this.enableLoader()
        const res = await this.requestToSearch({
            text: this.$elements.searchField.value,
            count: 5
        })
        this.disableLoader()
        this.$elements.searchWrapper.classList.add('page-search_complete')
        this.$elements.searchComplete.classList.add('page-search__complete_active')
        this.$elements.searchListHeader.innerHTML = renderSearchComplete(res)
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
        this.$elements.productList.innerHTML = renderProducts(res.products?.list || [], 'products__item') || 'Ничего не найдено'
        lazyLoadImages(this.$elements.productList)
    }

    setPreloaderSearchList() {
        this.$elements.searchList.innerHTML = '<div class="search-list__loader"><div class="loader"></div></div>'
    }

    toggleSearch() {
        if (this.searchIsActive) {
            this.closeSearch()
        } else {
            this.openSearch()
        }
    }

    openSearch() {
        this.searchIsActive = true
        this.$elements.searchField.focus()
        this.$elements.searchIcon.classList.add('page-search__icon_active')
        this.$elements.overlay.classList.add('page-overlay_active')
        this.$elements.searchWrapper.classList.add('page-search_active')
        this.$elements.searchButton.classList.add('page-search__button_active')
        if (window.innerWidth < 960 && window.innerWidth > 640) {
            this.$elements.pageTel.classList.add('page-header__tel_active')
        }
        if (this.$elements.searchField.value.length) {
            this.$elements.searchComplete.classList.add('page-search__complete_active')
            this.$elements.searchWrapper.classList.add('page-search_complete')
        }
    }

    closeSearch() {
        this.searchIsActive = false
        this.$elements.searchComplete.classList.remove('page-search__complete_active')
        this.$elements.overlay.classList.remove('page-overlay_active')
        this.$elements.searchWrapper.classList.remove('page-search_active')
        this.$elements.searchWrapper.classList.remove('page-search_complete')
        this.$elements.searchButton.classList.remove('page-search__button_active')
        this.$elements.pageTel.classList.remove('page-header__tel_active')
    }

    enableLoader() {
        this.$elements.searchLoader.classList.add('page-search__loader_active')
    }

    disableLoader() {
        this.$elements.searchLoader.classList.remove('page-search__loader_active')
    }

    // API

    changePage() {
        const value = sanitalize(this.$elements.searchField.value)
        if(value.length === 0) return
        this.router.redirect(`/search?text=${value}`)
    }

    async requestToSearch(params) {
        return this.makeSearchRequest(this.router.searchLink, params)
    }

    async makeSearchRequest(url, { text, ...params }) {
        return this.apiService.useRequest(url, {
            method: 'OPTIONS',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: escapeRegex(text), ...params })
        })
    }


}

export default SearchComponent
