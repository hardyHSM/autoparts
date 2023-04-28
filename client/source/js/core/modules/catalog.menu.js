
class CatalogMenu {
    constructor(config) {
        this.router = config.router
        this.apiService = config.apiService
        this.$node = document.querySelector(config.selector)
    }

    async init() {
        try {
            const data = await this.apiService.useRequest(this.router.catalogLink)
            this.view(data)
            registerHandlers()
        } catch (e) {
            console.log('catalog error')
            console.log(e)
        }
    }

    view({ categories, subCategories }) {
        const data = categories.map(cat => {
            return {
                ...cat,
                children: subCategories.filter(subcat => subcat.category._id === cat._id)
            }
        }).sort((prev, next) => prev.number - next.number)

        let html = ``
        data.forEach(block => {
            const list = block.children.reduce((acc, curr) => {
                acc += `<li class="catalog-item__point">
                            <a href="/catalog/${block.link}/${curr.link}" class="catalog-item__link">${curr.name}</a>
                        </li> `
                return acc
            }, '')
            html += ` 
                    <div class="catalog-item">
                        <div class="catalog-item__header">
                            <b class="catalog-item__title">${block.name}</b>
                            <a href="/catalog/${block.link}"
                               class="catalog-item__link-all button button_mini button_backwards-accent">все
                                <svg>
                                    <use xlink:href="img/svg/sprite.svg#arrow-small"></use>
                                </svg>
                            </a>
                        </div>
                        <ul class="catalog-item__list">
                            ${list}
                        </ul>
                   </div>`
        })
        this.$node.innerHTML = html
    }
}

export default CatalogMenu

function registerHandlers() {
    const $buttonCatalog = document.querySelector('.button-catalog')
    const $catalogMenu = document.querySelector('.catalog-menu')
    const $overlay = document.querySelector('.page-overlay')
    const $catalogHeaders = document.querySelectorAll('.catalog-item__header')
    const $catalogLinks = document.querySelectorAll('.catalog-item__link-all')


    $buttonCatalog.addEventListener('click', function () {
        toggleCatalog()
    })

    $overlay.addEventListener('click', function () {
        if ($catalogMenu.classList.contains('catalog-menu_active')) {
            toggleCatalog()
        }
    })


    $catalogHeaders.forEach(element => {
        element.querySelector('.catalog-item__title').addEventListener('click', () => {
            const $list = element.parentNode.querySelector('.catalog-item__list')

            if ($list.classList.contains('catalog-item__list_active')) {
                $list.classList.remove('catalog-item__list_active')
                element.classList.remove('catalog-item__header_active')
                return 0
            }
            $catalogHeaders.forEach(item => {
                const $list = item.parentNode.querySelector('.catalog-item__list')
                $list.classList.remove('catalog-item__list_active')
                item.classList.remove('catalog-item__header_active')
            })
            $list.classList.add('catalog-item__list_active')
            element.classList.add('catalog-item__header_active')
        })
    })

    function toggleCatalog() {
        $buttonCatalog.classList.toggle('button-catalog_active')
        $overlay.classList.toggle('page-overlay_active')
        $catalogMenu.classList.toggle('catalog-menu_active')
    }

}