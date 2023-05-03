class MultiSelectComponent {
    constructor({ query, type, optionList, addObserver, deleteObserver }) {
        this.$node = document.querySelector(query)
        this.$body = this.$node.querySelector('[data-select-body]')
        this.$selectedListNode = this.$node.querySelector('[data-select-list]')
        this.$arrowIcon = this.$node.querySelector('[data-select-arrow]')
        this.$field = this.$node.querySelector('[data-input]')
        this.addObserver = addObserver || new Function()
        this.removeObserver = deleteObserver || new Function()
        this.optionList = optionList
        this.query = query
        this.type = type
        this.selectedList = []
    }

    init() {
        this.registerHandlers()
    }

    render() {
        this.renderSuggestionsList(this.optionList)
    }

    registerHandlers() {
        document.body.addEventListener('click', e => {
            if (!e.target.closest(this.query) &&
                !e.target.classList.contains('select__item') &&
                !e.target.closest('.select__added-item')
            ) {
                this.close()
            }
        })
        this.$node.addEventListener('click', ({ target }) => {
            if (target === this.$arrowIcon) {
                if (this.$body.querySelectorAll('.select__item').length) {
                    this.$node.classList.toggle('select_active')
                }
            }
            if (target === this.$field) {
                this.open()
            }
            if (target.classList.contains('select__item')) {
                this.selectItem(target.textContent.trim())
            }
            if (target.closest('.select__added-item')) {
                this.removeItem(target.closest('.select__added-item').textContent.trim())
            }
        })
        this.$field.addEventListener('input', (e) => {
            this.searchController()
        })
    }

    searchController(target = this.$field) {
        let searchValue = target.value.trim().toLowerCase()
        let data = this.optionList.filter(item => item.value.toLowerCase().includes(searchValue))
        this.open()
        this.renderSuggestionsList(data)
        this.renderSelectedList()
    }

    renderSuggestionsList(list) {
        if (!list.length) {
            this.$body.innerHTML = `<span class="select__notfound">Ничего не найдено...</span>`
            return
        }
        this.$body.innerHTML = ''
        list.forEach(item => {
            if (!this.selectedList.includes(item.value)) {
                this.$body.innerHTML += `<li class="select__item" data-select-item data-value="${item.dataset}">${item.value}</li>`
            }
        })
    }

    hasItem(value) {
        return this.optionList.find(item => item.value === value)
    }

    removeItem(content, handler = true) {
        this.selectedList = this.selectedList.filter(item => item !== content)

        this.searchController()
        // this.showSelectedList()
        // this.renderSelectedList()
        this.open()
        if (handler) this.removeObserver({ type: this.type, value: content })
    }

    selectItem(content, handler = true) {
        this.selectedList.push(content)

        this.searchController()
        // this.showSelectedList()
        // this.renderSelectedList()
        if (handler) this.addObserver({ type: this.type, value: content })
    }

    renderSelectedList() {
        if(this.selectedList.length) {
            if(this.selectedList.length === this.optionList.length) {
                this.close()
            }
            this.showSelectedList()
        } else {
            this.hideSelectedList()
        }
        this.$selectedListNode.innerHTML = ''
        this.selectedList.forEach(content => {
            this.$selectedListNode.innerHTML += `
            <li class="select__added-item">
                ${content}
                <svg>
                    <use xlink:href="img/svg/sprite.svg#close"></use>
                </svg>
            </li>
            `
        })
    }

    open() {
        this.$node.classList.add('select_active')
    }

    close() {
        this.$node.classList.remove('select_active')
    }

    showSelectedList() {
        this.$selectedListNode.classList.add('select__added-list_active')
    }

    hideSelectedList() {
        this.$selectedListNode.classList.remove('select__added-list_active')
    }
}

export default MultiSelectComponent