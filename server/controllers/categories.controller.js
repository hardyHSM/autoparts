import CategoriesModel from '../models/categories.model.js'
import ApiError from '../service/error.service.js'
import productService from '../service/product.service.js'
import { decodeString, escapeRegExp } from '../utils/utils.js'
import UsersModel from '../models/users.model.js'
import SubcategoriesModel from '../models/subcategories.model.js'

class CategoriesController {
    async get(req, res, next) {
        try {
            let result
            if (!('id' in req.query)) {
                const sortName = req.query.sort_name || 'number'
                const sortType = req.query.sort_type || 1
                const sortData = {
                    [sortName]: sortType
                }
                result = await CategoriesModel.find().sort(sortData)
            } else {
                result = await CategoriesModel.findById(req.query.id)
                if (!result) {
                    next(ApiError.BadRequest('Такой категории не существует!'))
                }
            }

            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    async change(req, res, next) {
        try {
            const { id, name, link, order } = req.body
            const category = await CategoriesModel.findById(id)
            if (!category) {
                return next(ApiError.BadRequest('Такой категории не существует!'))
            }

            const existCategoryName = await CategoriesModel.findOne({ name })
            const existCategoryLink = await CategoriesModel.findOne({ link })

            if (existCategoryLink && (existCategoryLink.id !== category.id)) {
                return next(ApiError.BadRequest('Категория с такой ссылкой уже существует!'))
            }
            if (existCategoryName && (existCategoryName.id !== category.id)) {
                return next(ApiError.BadRequest('Категория с таким названием уже существует!'))
            }


            category.name = name
            category.link = link
            category.number = parseInt(order)
            await category.save()
            res.json({
                message: 'Категория успешно изменена!'
            })
        } catch (e) {
            next(e)
        }
    }

    async add(req, res, next) {
        try {
            const { name, link, order } = req.body
            const existCategoryName = await CategoriesModel.findOne({ name })
            const existCategoryLink = await CategoriesModel.findOne({ link })

            if (existCategoryLink) {
                return next(ApiError.BadRequest('Категория с такой ссылкой уже существует!'))
            }
            if (existCategoryName) {
                return next(ApiError.BadRequest('Категория с таким названием уже существует!'))
            }
            await CategoriesModel.create({
                name,
                link,
                number: parseInt(order)

            })
            res.json({
                message: 'Категория успешно добавлена!'
            })
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            await CategoriesModel.findByIdAndDelete(id)
            await SubcategoriesModel.deleteMany({ category: id });
            res.json({
                message: 'Категория успешно удалена'
            })
        } catch (e) {
            next(ApiError.BadRequest('Что-то пошло не так. Категории с таким идентификатором не существует, либо еще что-то.'))
        }
    }
}

const categoriesController = new CategoriesController()


export default categoriesController