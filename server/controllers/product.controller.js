import productService from '../service/product.service.js'

class ProductController {
    async getFullProduct(req, res, next) {
        try {
            const id = req.params.productId
            const product = await productService.getProduct(id)

            const catalogBreadcrumbs = productService.generateBreadcrumbs([
                product.category,
                product.subcategory,
                { name: product.title }
            ])
            const [otherPackingProducts, otherProductsToLook] = await Promise.all([
                productService.getOtherPackingProducts(product, product.info._id),
                productService.getOtherProductsToLook(product)
            ])

            res.json({
                product,
                breadcrumbs: catalogBreadcrumbs,
                productsToLook: otherProductsToLook,
                otherPackingList: otherPackingProducts
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

const productController = new ProductController()

export default productController