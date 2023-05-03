import ProductsModel from '../models/products.model.js'
import CategoriesModel from '../models/categories.model.js'
import SubCategoriesModel from '../models/subcategories.model.js'
import ProducersModel from '../models/producers.model.js'
import ApiError from './error.service.js'
import AssetsService from './assets.service.js'


class ProductService {
    async getCounts(query) {
        return await ProductsModel.find(query).countDocuments().lean()
    }

    async getProductsByParams(query, sortData, page, limit) {
        return await ProductsModel.find(query).sort(sortData).skip(page).limit(limit).lean()
    }

    async getProductClasses(cat, subcat) {

        const [categoryData, subCategoryData] = await Promise.all([
            CategoriesModel.findOne({ link: cat }).lean(),
            SubCategoriesModel.findOne({ link: subcat }).lean()
        ])


        if (!categoryData) {
            throw ApiError.BadRequest('Категории не существует!')
        }

        if (subcat?.length && !subCategoryData) {
            throw ApiError.BadRequest('Подкатегории не существует!')
        }

        return {
            categoryData: categoryData || undefined,
            subCategoryData: subCategoryData || undefined
        }
    }

    async getProduct(id) {
        const product = await ProductsModel.findById(id).populate(['info', 'category', 'subcategory'])

        if (!product) {
            throw ApiError.BadRequest('Продукция не найдена!')
        }
        return product
    }

    async getOtherPackingProducts(currentProduct, info) {
        const products = await ProductsModel.find({ info }).lean()
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

    async getProductsBySearch({ text, sortData, count, page }) {
        const [list, productCount, makers, categories, subCategories, attributes] = await Promise.all([
            ProductsModel.find({ title: { $regex: new RegExp(`${text}`, 'gi') } }).lean().sort(sortData).limit(count).skip((page - 1) * 12),
            ProductsModel.find({ title: { $regex: new RegExp(`${text}`, 'gi') } }).lean().count(),
            ProductsModel.aggregate([
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
            ]),
            CategoriesModel.find({ name: { $regex: new RegExp(`${text}`, 'gi') } }),
            SubCategoriesModel.find({ name: { $regex: new RegExp(`${text}`, 'gi') } }).populate('category'),
            this.parseAttributesSearch(text)
        ])

        let [categoriesWithCount, subCategoriesWithCount] = await Promise.all([
            this.getCountProductsByAttribute(categories, 'category'),
            this.getCountProductsByAttribute(subCategories, 'subcategory')
        ])

        return {
            products: {
                list,
                count: productCount
            },
            categories: categoriesWithCount,
            subCategories: subCategoriesWithCount,
            attributes,
            makers
        }
    }

    async getProductsSearchQuery({ sortData, page, query }) {
        const [list, count] = await Promise.all([
            ProductsModel.find(query).lean().sort(sortData).limit(12).skip((page - 1) * 12),
            ProductsModel.find(query).lean().count()
        ])
        const products = {
            list,
            count
        }
        return products
    }

    async getCountProductsByAttribute(data, attr) {
        const query = {}

        const res = await Promise.all(data.map((item) => {
            query[`${attr}`] = item._id
            return ProductsModel.find(query).lean().count()
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
            if (!item.link) return item
            prev += `/${item.link}`
            item.link = prev
            return item
        })
        return res
    }

    async addProduct(data) {
        const { categoryId, subcategoryId, descriptionId, image, attributes, ...body } = data
        const [existProduct, category, subcategory, info] = await Promise.all([
            ProductsModel.findOne({ title: body.title }),
            CategoriesModel.findById(categoryId),
            SubCategoriesModel.findById(subcategoryId),
            ProducersModel.findById(descriptionId)
        ])
        if (!category || !subcategory || !info) {
            throw ApiError.BadRequest('Проверьте введённые данные!')
        }

        if (existProduct) {
            throw ApiError.ConflictError('Товар с таким названием уже существует!')
        }

        const candidateProduct = {}

        for ( const key in body ) {
            candidateProduct[key] = body[key]
        }

        candidateProduct.category = category
        candidateProduct.subcategory = subcategory
        candidateProduct.info = info
        candidateProduct.attributes = Object.keys(attributes).length === 0 ? { 'Характеристика': 'Отсутствует' } : attributes


        if (image) {
            if (image === 'delete') {
                candidateProduct.image = null
            } else {
                candidateProduct.image = await AssetsService.createImage(image)
            }
        }

        const product = await ProductsModel.create(candidateProduct)
        return product
    }

    async changeProduct(id, rest) {
        const { categoryId, subcategoryId, descriptionId, image, ...body } = rest
        const product = await this.getProduct(id)
        if (!product) {
            throw ApiError.BadRequest('Продукция не найдена!')
        }
        const category = await CategoriesModel.findById(categoryId)
        const subcategory = await SubCategoriesModel.findById(subcategoryId)
        const info = await ProducersModel.findById(descriptionId)
        if (!category || !subcategory || !info) {
            throw ApiError.BadRequest('Ошибка при вводе данных!')
        }
        product.category = category
        product.subcategory = subcategory
        product.info = info

        if (image) {
            if (image === 'delete') {
                product.image = null
            } else {
                const url = await AssetsService.createImage(image)
                product.image = url
            }
        }

        for ( const key in body ) {
            if (key in product) {
                product[key] = body[key]
            }
        }
        await product.save()
    }
}

const productService = new ProductService()

export default productService