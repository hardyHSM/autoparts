import productService from '../service/product.service.js'
import ProductsModel from '../models/products.model.js'
import descriptionsModel from '../models/descriptions.model.js'
import filterService from '../service/filter.service.js'
import { decodeString, escapeRegExp } from '../utils/utils.js'
import DescriptionsModel from '../models/descriptions.model.js'
import ApiError from '../service/error.service.js'
import ProductService from '../service/product.service.js'


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
                productService.getOtherPackingProducts(product, product.info?._id || null),
                productService.getOtherProductsToLook(product)
            ])

            res.json({
                product: productService.removeSecretFields(req, product),
                breadcrumbs: catalogBreadcrumbs,
                productsToLook: productService.removeSecretFields(req, otherProductsToLook),
                otherPackingList: otherPackingProducts
            })
        } catch (e) {
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            const id = req.query?.id
            if (!('id' in req.query)) {
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

                if (req.query.category) {
                    params.category = req.query.category
                }
                if (req.query.subcategory) {
                    params.subcategory = req.query.subcategory
                }

                if (req.query.info) {
                    params.info = req.query.info
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
                    list: productService.removeSecretFields(req, products),
                    count
                })
            } else {
                const product = await productService.getProduct(id)
                res.json(productService.removeSecretFields(req, product))
            }
        } catch (e) {
            next(e)
        }
    }

    async add(req, res, next) {
        try {
            const product = await productService.addProduct(req.body)
            res.json({
                message: 'Продукция успешно добавлена в базу данных!',
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
                message: 'Продукция успешно изменена! ',
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

    async getDescriptions(req, res, next) {
        try {
            const id = req.query?.id
            if (!('id' in req.query)) {
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
            res.json({
                message: 'Товар успешно удален.'
            })
        } catch (e) {
            next(ApiError.BadRequest('Что-то пошло не так. Товара с таким идентификатором не существует.'))
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
                message: 'Описание товара успешно изменено!'
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
                    message: 'Что-то пошло не так'
                })
            }
            res.json({
                message: 'Описание товара успешно удалено.'
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
                message: 'Описание товара успешно добавлено.'
            })
        } catch (e) {
            next(e)
        }
    }

    async getAttributeValues(req, res, next) {
        try {
            const key = req.query?.key

            if (key === undefined) {
                const attributes = await ProductsModel.aggregate([
                    {
                        $project: {
                            attributes: { $objectToArray: '$attributes' }
                        }
                    },
                    { $unwind: '$attributes' },
                    {
                        $group: {
                            _id: '$attributes.k'
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            keys: { $addToSet: '$_id' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            keys: 1
                        }
                    }
                ])

                res.json(attributes[0]?.keys.sort() || [])
            } else {
                const attributes = await ProductsModel.aggregate([
                    {
                        $project: {
                            attributes: { $objectToArray: '$attributes' }
                        }
                    },
                    {
                        $unwind: '$attributes'
                    },
                    {
                        $match: { 'attributes.k': key }
                    },
                    {
                        $unwind: '$attributes.v'
                    },
                    {
                        $group: {
                            _id: {
                                'key': '$attributes.k',
                                'value': '$attributes.v'
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $group: {
                            _id: '$_id.key',
                            values: {
                                $addToSet: '$_id.value'
                            }
                        }
                    },
                    {
                        $project: {
                            key: '$_id',
                            values: '$values',
                            count: { $size: '$values' },
                            _id: 0
                        }
                    }
                ])

                res.json(attributes[0]?.values.sort() || [])
            }
        } catch (e) {
            next(ApiError.BadRequest('Что-то пошло не так.'))
        }
    }

}

const productController = new ProductController()

export default productController