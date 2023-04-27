class SelectInputComponent {
    constructor({ query, type, data, onSelectAdd, onSelectDelete }) {
        this.node = document.querySelector(query)
        this.body = this.node.querySelector('[data-select-body]')
        this.addedListNode = this.node.querySelector('[data-select-list]')
        this.arrowIcon = this.node.querySelector('[data-select-arrow]')
        this.field = this.node.querySelector('[data-input]')
        this.onSelectAdd = onSelectAdd
        this.onSelectDelete = onSelectDelete
        this.data = data
        this.query = query
        this.type = type
        this.addedList = []
    }

    render() {
        this.renderChoiceList(this.data)
        this.registerHandlers()
    }

    registerHandlers() {
        document.body.addEventListener('click', e => {
            if (!e.target.closest(this.query) && !e.target.classList.contains('select__item') && !e.target.closest('.select__added-item')) {
                this.close()
            }
        })
        this.node.addEventListener('click', ({ target }) => {
            if (target === this.arrowIcon) {
                if (this.body.querySelectorAll('.select__item').length) {
                    this.node.classList.toggle('select_active')
                }
            }
            if (target === this.field) {
                this.searchItems()
            }
            if (target.classList.contains('select__item')) {
                this.addItemToList(target.textContent.trim())
            }
            if (target.closest('.select__added-item')) {
                this.removeItemFromList(target.closest('.select__added-item')
                .textContent.trim())
            }
        })
        this.field.addEventListener('input', (e) => {
            this.searchItems()
        })
    }

    searchItems(target = this.field) {
        let searchValue = target.value.trim()
        let data = searchValue
            ? this.data.filter(item => item.value.toLowerCase().includes(searchValue.toLowerCase()))
            : this.data

        if (!data.length) {
            this.body.innerHTML = `<span class="select__notfound">Ничего не найдено...</span>`
        } else {
            this.fillDataWithCheck(data)
        }
    }

    showAddedList() {
        this.addedListNode.classList.add('select__added-list_active')
    }

    hideAddedList() {
        this.addedListNode.classList.remove('select__added-list_active')
    }

    hasItem(value) {
        return this.data.find(item => item.value === value)
    }

    removeItemFromList(content, callback = true) {
        this.addedList = this.addedList.filter(item => item !== content)
        if (!this.addedList.length) this.hideAddedList()

        this.searchItems()
        this.renderAddedList()
        this.open()
        if (callback) {
            this.onSelectDelete({
                type: this.type,
                value: content
            })
        }
    }

    addItemToList(content, callback = true) {
        this.addedList.push(content)

        this.searchItems()
        this.renderAddedList()
        this.showAddedList()
        if (callback) {
            this.onSelectAdd({
                type: this.type,
                value: content
            })
        }
    }

    renderAddedList() {
        this.addedListNode.innerHTML = ''
        this.addedList.forEach(content => {
            this.addedListNode.innerHTML +=
                `
            <li class="select__added-item">
                ${content}
                <svg>
                    <use xlink:href="img/svg/sprite.svg#close"></use>
                </svg>
            </li>
            `
        })
    }

    fillDataWithCheck(list) {
        this.renderChoiceList(list)
        if (this.body.querySelectorAll('.select__item').length) {
            this.open()
        } else {
            this.close()
        }
    }

    renderChoiceList(list) {
        this.body.innerHTML = ''
        list.forEach(item => {
            if (!this.addedList.includes(item.value)) {
                this.body.innerHTML += `<li class="select__item" data-select-item data-value="${item.dataset}">${item.value}</li>`
            }
        })
    }

    open() {
        this.node.classList.add('select_active')
    }

    close() {
        this.node.classList.remove('select_active')
    }
}

export default SelectInputComponent