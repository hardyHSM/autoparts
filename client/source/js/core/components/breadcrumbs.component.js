class BreadcrumbsComponent {
    constructor(query) {
        this.$node = document.querySelector(query)
    }

    renderMain() {
        this.insertNode(`
            <li class="breadcrumbs__item">
                <a href="/" class="breadcrumbs__link" title="Главная">Главная</a>
            </li>
        `)
    }

    renderPath(path) {
        this.clear()
        this.renderMain()
        let html = path.map(item => {
            if (item === path.at(-1)) {
                return this.renderCurrent(item)
            } else {
                return this.renderLink(item)
            }
        }).join('')
        this.$node.innerHTML += html
    }

    renderLink(item) {
        return `
        <li class="breadcrumbs__item">
            <a href="/${item.link}" class="breadcrumbs__link" title="${item.name}">${item.name}</a>
        </li>
        `
    }

    renderCurrent(item) {
        return `
         <li class="breadcrumbs__item breadcrumbs__item_span">
            <span title="${item.name}">${item.name}</span>
         </li>
        `
    }

    insertNode(value) {
        this.$node.innerHTML += value
    }

    clear() {
        this.$node.innerHTML = ''
    }
}

export default BreadcrumbsComponent