import ProductsModel from '../models/products.model.js'
import CategoriesModel from '../models/categories.model.js'
import SubCategoriesModel from '../models/subcategories.model.js'
import ProducersModel from '../models/producers.model.js'
import ApiError from './error.service.js'


class ProductService {
    async getCounts(query) {
        return await ProductsModel.find(query).count().exec()
    }

    async getProductsToPage(query, sortData, page, limit) {
        return await ProductsModel.find(query).sort(sortData).skip(page).limit(limit).exec()
    }

    async getProductClasses(cat, subcat) {
        const categoryData = await CategoriesModel.findOne({ link: cat }).exec()
        const subCategoryData = await SubCategoriesModel.findOne({ link: subcat }).exec()

        if (!categoryData) {
            throw ApiError.BadRequest('Категории не существует!')
        }

        return {
            categoryData: categoryData || undefined,
            subCategoryData: subCategoryData || undefined
        }
    }

    async getProduct(id) {
        const product = await ProductsModel.findById(id).populate(['info', 'category', 'subcategory']).exec()

        if (!product) {
            throw ApiError.BadRequest('Продукция не найдена!')
        }
        return product
    }

    async getOtherPackingProducts(currentProduct, info) {
        const products = await ProductsModel.find({ info })
        return products.map(product => {
            return {
                '_id': product._id,
                'size': product.attributes['Фасовка']
            }
        }).filter(pr => !currentProduct._id.equals(pr._id) && pr.size)
    }

    async getOtherProductsToLook(product) {
        let productsToLook = await ProductsModel.aggregate([
            { $match: { maker: `${product.maker}` } },
            { $sample: { size: 5 } }
        ])

        if (!productsToLook.length) {
            productsToLook = await ProductsModel.aggregate([
                { $match: { subcategory: `${product.subcategory}` } },
                { $sample: { size: 5 } }
            ])
        }

        productsToLook = productsToLook.filter(pr => !product._id.equals(pr._id))

        return productsToLook || []
    }

    async getProductsBySearch({ text, sortData, count, page}) {
        const products = {
            list: await ProductsModel.find({ title: { $regex: new RegExp(`${text}`, 'gi') } }).sort(sortData).limit(count).skip((page - 1) * 12),
            count: await ProductsModel.find({ title: { $regex: new RegExp(`${text}`, 'gi') } }).count().exec()
        }
        const makers = await ProductsModel.aggregate([
            {
                $match: { maker: { $regex: new RegExp(`${text}`, 'gi') } }
            },
            {
                $group: {
                    '_id': '$maker',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: 1,
                    name: '$_id'
                }
            }
        ])

        let categories = await CategoriesModel.find({ name: { $regex: new RegExp(`${text}`, 'gi') } })
        let subCategories = await SubCategoriesModel.find({ name: { $regex: new RegExp(`${text}`, 'gi') } }).populate('category')

        categories = await this.getCountProductsByAttribute(categories, 'category')
        subCategories = await this.getCountProductsByAttribute(subCategories, 'subcategory')


        const attributes = await this.parseAttributesSearch(text)

        return { products, categories, subCategories, attributes, makers }
    }

    async getProductsSearchQuery({ sortData, page, query }) {
        return {
            list: await ProductsModel.find(query).sort(sortData).limit(12).skip((page - 1) * 12).exec(),
            count: await ProductsModel.find(query).count().exec()
        }
    }

    async getCountProductsByAttribute(data, attr) {
        const query = {}

        const res = await Promise.all(data.map((item) => {
            query[`${attr}`] = item._id
            return ProductsModel.find(query).count().exec()
        }))
        return JSON.parse(JSON.stringify(data)).map((it, index) => {
            it.count = res[index]
            return it
        })
    }

    async parseAttributesSearch(searchText) {
        return ProductsModel.aggregate([
            {
                $project: {
                    attributes: { $objectToArray: '$attributes' }
                }
            },
            {
                $unwind: '$attributes'
            },
            {
                $match: { 'attributes.v': { $regex: new RegExp(`${searchText}`, 'gi') } }
            },
            {
                $unwind: '$attributes.v'
            },
            {
                $match: { 'attributes.v': { $regex: new RegExp(`${searchText}`, 'gi') } }
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
                        $push: {
                            'name': '$_id.value',
                            count: { $sum: '$count' }
                        }
                    }
                }
            },
            {
                $project: {
                    key: '$_id',
                    values: '$values',
                    count: 1,
                    _id: 0
                }
            }
        ])
    }

    generateBreadcrumbs(data) {
        let prev = 'catalog'
        const res = data.filter(item => item).map(item => {
            if(!item.link) return item
            prev += `/${item.link}`
            item.link = prev
            return item
        })
        return res
    }
}

const productService = new ProductService()

export default productService