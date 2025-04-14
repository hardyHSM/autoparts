import ModuleCore from '../../core/modules/module.core.js'

class CatalogMenuModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.selector = config.selector
    }
    async init() {
        try {
            this.data = await this.apiService.useRequest(this.router.catalogLink)
            super.init(() => {
                this.start()
            })
        } catch(e) {
            console.log(e)
        }
    }

    start() {
        this.$node = document.querySelector(this.selector)
        this.render(this.data)
        registerHandlers()
    }

    render({ categories, subCategories }) {
        const data = categories.map(cat => {
            return {
                ...cat,
                children: subCategories.filter(subcat => subcat.category?._id === cat?._id)
            }
        }).sort((prev, next) => prev.number - next.number)

        let view = ``
        data.forEach(block => {
            const list = block.children.reduce((acc, curr) => {
                acc += `
                    <li class="catalog-item__point">
                        <a href="/catalog/${block.link}/${curr.link}" class="catalog-item__link">${curr.name}</a>
                    </li> `
                return acc
            }, '')
            view += `
                <div class="catalog-item">
                    <div class="catalog-item__header">
                        <button type="button" class="catalog-item__title">${block.name}</button>
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
        this.$node.innerHTML = view
    }
}

export default CatalogMenuModule

function registerHandlers() {
    const $buttonCatalog = document.querySelector('.button-catalog')
    const $catalogMenu = document.querySelector('.catalog-menu')
    const $overlay = document.querySelector('.page-overlay')
    const $catalogHeaders = document.querySelectorAll('.catalog-item__header')


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