import productService from '../service/product.service.js'
import ProductsModel from '../models/products.model.js'
import descriptionsModel from '../models/descriptions.model.js'
import filterService from '../service/filter.service.js'
import { decodeString, escapeRegExp } from '../utils/utils.js'
import DescriptionsModel from '../models/descriptions.model.js'
import ApiError from '../service/error.service.js'


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
                const params = {}

                if (req.query.title) {
                    params.title = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.title.trim())))
                }
                if (req.query.maker) {
                    params.maker = productService.parseQueryRegexp(req.query.maker)
                }
                if (req.query.count) {
                    params.count = productService.parseOrderQueryRegexp(req.query.count)
                }

                if (req.query.popularity) {
                    params.popularity = productService.parseOrderQueryRegexp(req.query.popularity)
                }

                const sortData = {
                    [sortName]: sortType
                }

                const [products, count] = await Promise.all([
                    productService.getProductsByParams(
                        params,
                        sortData,
                        (page - 1) * 20,
                        20
                    ),
                    productService.getCounts(params)
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
            const product = await productService.changeProduct(id, restBody)
            res.json({
                success: 'Продукция успешно изменена',
                product
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
            const id = req.query?.id
            if (!id) {
                const page = req.query.page
                const params = {}
                if (req.query.title) {
                    params.title = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.title.trim())))
                }
                const [descriptions, count] = await Promise.all([
                    descriptionsModel
                    .find(params)
                    .limit(req.query.page ? 40 : 20)
                    .skip(req.query.page ? (page - 1) * 40 : 0)
                    .lean(),
                    descriptionsModel.find(params).count().lean()
                ])

                res.json({ list: descriptions, count })
            } else {
                const description = await descriptionsModel.findById(id)
                res.json(description)
            }

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

    async getAllMakers(req, res, next) {
        try {
            const makers = await ProductsModel.find().distinct('maker')
            res.json(makers)
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

    async changeProductDescription(req, res, next) {
        try {
            const description = await DescriptionsModel.findById(req.body.id)
            if (!description) {
                next(ApiError.BadRequest('Описание товара с таким id не найдено!'))
            }
            description.title = req.body.title
            description.description = req.body.description
            await description.save()
            res.json({
                success: 'Описание товара успешно изменено!'
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteProductDescription(req, res, next) {
        try {
            const { id } = req.body
            const result = await DescriptionsModel.findByIdAndDelete(id)
            if (!result) {
                return res.json({
                    success: 'Что-то пошло не так'
                })
            }
            res.json({
                success: 'Описание товара успешно удалено.'
            })
        } catch (e) {
            next(e)
        }
    }

    async addProductDescription(req, res, next) {
        try {
            const { id } = req.body
            await DescriptionsModel.create({
                title: req.body.title,
                description: req.body.description || ''
            })
            res.json({
                success: 'Описание товара успешно добавлено.'
            })
        } catch (e) {
            next(e)
        }
    }

}

const productController = new ProductController()

export default productController