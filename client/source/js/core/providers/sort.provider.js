class SortProvider {
    constructor(config) {
        this.$root = document.querySelector(config.root)
        this.sortData = {}
        this.default = config.default
        this.changeStateHandler = config.changeStateHandler
        this.router = config.router
    }

    init() {
        this.registerHandler()
        this.initRoutes()
    }

    initRoutes() {
        const sortName = this.router.getParam('sort_name')
        const sortType = this.router.getParam('sort_type')
        if (sortName !== null && sortType !== null) {
            this.sortData = {
                key: sortName,
                type: Number(sortType)

            }
        } else {
            this.sortData = {
                key: this.default,
                type: 1
            }
        }
        this.renderSortState(this.sortData.key)
    }

    registerHandler() {
        this.$root.addEventListener('click', ({ target }) => {
            const sortName = target.closest('[data-sort]')?.dataset?.sort
            if (sortName) {
                this.changeSortState(sortName)
            }
        })
    }

    changeSortState(name) {
        if (this.sortData.key === name) {
            this.sortData.type = this.sortData.type === 1 ? -1 : 1
        } else {
            this.sortData = {}
            this.sortData.key = name
            this.sortData.type = -1
        }
        this.changeStateHandler(this.sortData.key, this.sortData.type)
        this.renderSortState(name)
    }

    renderSortState(name) {
        const $nodeSort = this.$root.querySelector(`[data-sort="${name}"]`)
        this.removeAllIcons()
        if (this.sortData.type === 1) {
            this.showAscIcon($nodeSort)
        } else {
            this.showDescIcon($nodeSort)
        }
    }

    removeAllIcons() {
        this.$root.querySelectorAll('[data-sort] svg').forEach(item => item.innerHTML = '')
    }

    showAscIcon(target) {
        target.querySelector('svg').innerHTML = `<use xlink:href="img/svg/sprite.svg#sort_up"></use>`
    }

    showDescIcon(target) {
        target.querySelector('svg').innerHTML = `<use xlink:href="img/svg/sprite.svg#sort_down"></use>`
    }
}

export default SortProvider