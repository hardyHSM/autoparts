import renderProductPage from '../views/render.product.page.js'
import ButtonComponent from '../../core/components/button.component.js'
import renderProducts from '../views/render.products.js'
import scrollToTop, { lazyLoadImages } from '../utils/utils.js'
import ModuleCore from '../../core/modules/module.core.js'
import { html } from 'code-tag'

class ProductModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.breadcrumbs = config.breadcrumbs
        this.cart = config.cart
        this.product = null
        this.$node = document.querySelector('#product-module')
        this.$sidebar = document.querySelector('#product-sidebar')

        this.renderProductPage = renderProductPage.bind(this)
        this.renderProducts = renderProducts.bind(this)

    }

    async init() {
        try {
            const res = await this.apiService.useRequest(this.router.apiLink)
            this.breadcrumbs.renderPath(res.breadcrumbs)
            this.renderProduct(res.product, res.otherPackingList)
            this.renderSideBar(res.productsToLook)
            this.registerHandlers()
            this.product = res.product
            this.preloader.hide()
        } catch (e) {
            this.router.redirectNotFound()
        }
    }

    registerHandlers() {
        this.$node.querySelector('[data-properties-all]').addEventListener('click', () => {
            scrollToTop('.properties_full')
        })
        if (this.addButton) {
            this.addButton.$node.addEventListener('click', async (e) => {
                this.addButton.setPreloaderState()
                await this.cart.addProduct(e.target.dataset.id, this.product)
                await this.userNav.changeState()
                this.addButton.setTextState()
            })
        }
    }

    renderSideBar(products) {
        this.$sidebar.innerHTML = this.renderProducts(products)
        lazyLoadImages(this.$sidebar)
    }

    renderProduct(res, sizes) {
        const formattedAttributes = Object
        .entries(res.attributes)
        .sort((prev, next) => {
            if(Array.isArray(next[1])) {
                return -1
            } else {
                return next[0] - prev[0]
            }
        })
        this.$node.dataset.productId = res._id
        document.querySelector('[data-product-title]').innerHTML = `Купить ${res.title}`
        document.querySelector('title').innerHTML = res.title
        if (this.auth?.userData?.role?.toLowerCase() === 'admin') {
            document.querySelector('[data-product-header]').innerHTML += `
                <a class="button button_backwards-accent button_icon"
                   href="/admin/catalog/products/edit?id=${res._id}">
                    Редактировать товар
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#change"></use>
                    </svg>
                </a>
            `
        }


        this.$node.innerHTML = this.renderProductPage({ formattedAttributes, sizes, res })
        if (res.count) {
            this.addButton = new ButtonComponent('[data-add-product]')
        }
    }

}

export default ProductModule