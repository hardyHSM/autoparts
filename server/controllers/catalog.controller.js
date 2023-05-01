import CategoriesModel from '../models/categories.model.js'
import SubCategoriesModel from '../models/subcategories.model.js'
import ProductsModel from '../models/products.model.js'
import productService from '../service/product.service.js'
import filterService from '../service/filter.service.js'

class CatalogController {

    async getList(req, res, next) {
        try {
            const [categoriesArr, subCategoriesArr] = await Promise.all([
                CategoriesModel.find(),
                SubCategoriesModel.find().populate('category')
            ])

            res.set('Cache-Control', 'public, max-age=259200').json({
                categories: categoriesArr,
                subCategories: subCategoriesArr
            })
        } catch (e) {
            next(e)
        }
    }

    async getFilters(req, res, next) {
        try {
            const { category, subcategory } = req.params
            const { categoryData, subCategoryData } = await productService.getProductClasses(category, subcategory)
            const productClass = {
                'category': categoryData._id,
                ...(subCategoryData && {
                    'subcategory': subCategoryData._id
                })
            }

            const products = await ProductsModel.find(productClass, { maker: 1, attributes: 1 }).lean()
            const filtersData = await filterService.parseProductsToFilters(products)
            res.json({
                filtersData
            })
        } catch (e) {
            next(e)
        }
    }

    async getProducts(req, res, next) {
        try {
            const { category, subcategory } = req.params
            let { sort = 'popularity', page = 1, ...restQueries } = req.query
            const filterData = filterService.parseFilterQuery(restQueries)

            const sortData = {
                [sort]: 1
            }

            const { categoryData, subCategoryData } = await productService.getProductClasses(category, subcategory)
            const productClass = {
                'category': categoryData._id,
                ...(subCategoryData && {
                    'subcategory': subCategoryData._id
                })
            }

            const productQuery = {
                ...productClass,
                ...filterData
            }
            const catalogBreadcrumbs = productService.generateBreadcrumbs([categoryData, subCategoryData])


            const [countDocuments, productsWithParams] = await Promise.all(
                [
                    productService.getCounts(productQuery),
                    productService.getProductsToPage(productQuery, sortData, (page - 1) * 12, 12)
                ]
            )

            res.json({
                path: catalogBreadcrumbs,
                products: productsWithParams,
                count: countDocuments,
                currentPage: page
            })
        } catch (e) {
            next(e)
        }
    }
}

const catalogController = new CatalogController()

export default catalogController