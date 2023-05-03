import productService from '../service/product.service.js'
import ProductsModel from '../models/products.model.js'
import ProducersModel from '../models/producers.model.js'

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
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            const id = req.query?.id
            if (!id) {
                const page = req.query.page || 1
                const sortName = req.query.sort_name || 'price'
                const sortType = req.query.sort_type || 1

                const sortData = {
                    [sortName]: sortType
                }

                const [products, count] = await Promise.all([
                    productService.getProductsByParams({}, sortData, (page - 1) * 20, 20),
                    productService.getCounts({})
                ])

                res.json({
                    list: products,
                    count
                })
            } else {
                const product = await productService.getProduct(id)
                res.json(product)
            }
        } catch (e) {
            next(e)
        }
    }

    async add(req, res, next) {
        try {
            const product = await productService.addProduct(req.body)
            res.json({
                success: 'Продукция успешно добавлена в базу данных!',
                product
            })
        } catch (e) {
            next(e)
        }
    }

    async change(req, res, next) {
        try {
            const { id, ...restBody } = req.body
            await productService.changeProduct(id, restBody)
            res.json({
                success: 'Продукция успешно изменена'
            })
        } catch (e) {
            next(e)
        }
    }

    async getAllProviders(req, res, next) {
        try {
            const providers = await ProductsModel.find().distinct('provider')
            res.json(providers)
        } catch (e) {

        }
    }

    async getAllDescriptions(req, res, next) {
        try {
            const descriptions = await ProducersModel.find().lean()
            res.json(descriptions)
        } catch (e) {
            next(e)
        }
    }

    async getAllStocks(req, res, next) {
        try {
            const stocks = await ProductsModel.find().distinct('stock')
            res.json(stocks)
        } catch (e) {
            next(e)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.body
            const result = await ProductsModel.findByIdAndDelete(id)
            if (!result) {
                return res.json({
                    success: 'Что-то пошло не так'
                })
            }
            res.json({
                success: 'Товар успешно удален.'
            })
        } catch (e) {
            next(e)
        }
    }
}

const productController = new ProductController()

export default productController