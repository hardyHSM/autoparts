import CategoriesModel from '../models/categories.model.js'
import SubCategoriesModel from '../models/subcategories.model.js'
import ProductsModel from '../models/products.model.js'
import productService from '../service/product.service.js'
import filterService from '../service/filter.service.js'

class CatalogController {

    async getList(req, res, next) {
        try {
            const categoriesArr = await CategoriesModel.find()
            const subCategoriesArr = await SubCategoriesModel.find().populate('category')

            res.json({
                categories: categoriesArr,
                subCategories: subCategoriesArr
            })
        } catch (e) {
            next(e)
        }
    }

    async getProducts (req, res, next) {
        try {
            const { category, subcategory } = req.params
            let { sort = 'popularity', page = 1, ...restQueries } = req.query
            const filterData = filterService.parseFilterQuery(restQueries)

            const sortData = {
                [sort]: 1
            }

            const { categoryData, subCategoryData } =  await productService.getProductClasses(category, subcategory)

            const productClass = {
                'category': categoryData._id,
                ...(subCategoryData && {
                    'subcategory' :subCategoryData._id
                })
            }

            const productQuery = {
                ...productClass,
                ...filterData
            }

            const catalogBreadcrumbs = productService.generateBreadcrumbs([categoryData, subCategoryData])
            const countDocuments = await productService.getCounts(productQuery)
            const products = await productService.getProductsToPage(productQuery, sortData, (page - 1) * 12, 12)
            const allProductsWithSameClass = await ProductsModel.find(productClass)
            const paramsData = await filterService.parseProductsToFilters(allProductsWithSameClass)

            res.json({
                path: catalogBreadcrumbs,
                products,
                count: countDocuments,
                currentPage: page,
                filtersData: paramsData
            })

        } catch (e) {
            next(e)
        }
    }
}

const catalogController = new CatalogController()

export default catalogController