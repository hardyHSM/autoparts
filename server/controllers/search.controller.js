import productService from '../service/product.service.js'
import ApiError from '../service/error.service.js'

class SearchController {
    async searchOptions(req, res, next) {
        try {
            const params = {
                text: req.body.text,
                count: req.body.count || 12,
                page: req.body.page || 1,
                sort: req.body.sort || 'popularity'
            }
            console.log(params)
            const sortData = {
                [params.sort]: 1
            }

            if (!params.text) {
                return next(ApiError.BadRequest('Некорректный запрос'))
            }

            const result = await productService.getProductsBySearch({
                text: params.text,
                count: params.count,
                page: params.page,
                sortData
            })

            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async searchMaker(req, res, next) {
        try {
            const params = {
                text: req.body.text,
                page: req.body.page || 1,
                sort: req.body.sort || 'popularity',
                maker: req.body.name
            }
            const sortData = {
                [params.sort]: 1
            }
            if (!params.maker) {
                return next(ApiError.BadRequest('Некорректный запрос'))
            }

            const query = {
                title: { $regex: new RegExp(`${params.text}`, 'gi') },
                maker: params.maker
            }
            if (!params.text) delete query.title

            const result = await productService.getProductsSearchQuery({
                sortData,
                query,
                page: params.page
            })


            res.status(200).json({
                products: result
            })
        } catch (e) {
            next(e)
        }
    }

    async searchAttributes(req, res, next) {
        try {
            const params = {
                text: req.body.text,
                page: req.body.page || 1,
                sort: req.body.sort || 'popularity',
                attrKey: req.body.key,
                attrValue: req.body.value
            }
            const sortData = {
                [params.sort]: 1
            }

            if (!params.attrKey || !params.attrValue) {
                return next(ApiError.BadRequest('Некорректный запрос'))
            }

            const query = {
                title: { $regex: new RegExp(`${params.text}`, 'gi') },
                [`attributes.${params.attrKey}`]: params.attrValue
            }

            if (!params.text) delete query.title

            const result = await productService.getProductsSearchQuery({
                sortData,
                query,
                page: params.page,
            })

            res.status(200).json({
                products: result
            })
        } catch (e) {
            next(e)
        }
    }
}


const searchController = new SearchController()

export default searchController