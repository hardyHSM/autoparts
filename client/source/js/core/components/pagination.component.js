import { html } from 'code-tag'

class PaginationComponent {
    constructor({ query, onChange }) {
        this.$node = document.querySelector(query)
        this.$list = this.$node.firstElementChild
        this.onChange = onChange
    }

    clear() {
        this.$list.innerHTML = ''
    }

    render({ count, currentPage, limit = 12 }) {
        currentPage = +currentPage
        const pagesCount = Math.ceil(count / limit)
        if (pagesCount === 1) return false

        let html = ''

        if (pagesCount < 7) {
            for ( let i = 1; i <= pagesCount; i++ ) {
                if (currentPage === i) {
                    html += this.createPaginationItem(false, i, true)
                } else {
                    html += this.createPaginationItem(true, i)
                }
            }
        } else if (currentPage >= 5 && currentPage <= (pagesCount - 4)) {
            html += this.createPaginationItem(true, 1)
            html += this.createPaginationItem(false, '...')

            for ( let i = -2; i <= 2; i++ ) {
                if (i === 0) {
                    html += this.createPaginationItem(false, (currentPage + i), true)
                } else {
                    html += this.createPaginationItem(true, (currentPage + i))
                }
            }
            html += this.createPaginationItem(false, '...')
            html += this.createPaginationItem(true, pagesCount)

        } else if (currentPage > (pagesCount - 4)) {
            html += this.createPaginationItem(true, 1)
            html += this.createPaginationItem(false, '...')
            for ( let i = pagesCount - 4; i <= pagesCount; i++ ) {
                if (currentPage === i) {
                    html += this.createPaginationItem(false, i, true)
                } else {
                    html += this.createPaginationItem(true, i)
                }
            }
        } else {
            for ( let i = 1; i <= 5; i++ ) {
                if (currentPage === i) {
                    html += this.createPaginationItem(false, i, true)
                } else {
                    html += this.createPaginationItem(true, i)
                }
            }
            html += this.createPaginationItem(false, '...')
            html += this.createPaginationItem(true, pagesCount)
        }

        this.$list.innerHTML = html
        this.registerHandlers()
    }

    registerHandlers() {
        this.$list.querySelectorAll('button').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                this.onChange(link.dataset.page)
            })
        })
    }

    createPaginationItem(isLink = true, value, active = false) {
        if (isLink) {
            return html`
                <li class="pagination__item">
                    <button data-page="${value}" class="pagination__link">${value}</button>
                </li>`
        } else {
            return html`
                <li class="pagination__item">
                    <span class="pagination__link ${active && 'pagination__link_active'}">${value}</span>
                </li>`
        }
    }
}

export default PaginationComponent