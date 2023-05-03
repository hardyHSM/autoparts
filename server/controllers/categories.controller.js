import CategoriesModel from '../models/categories.model.js'
import ApiError from '../service/error.service.js'

class CategoriesController {
    async get(req, res, next) {
        try {
            let result
            if (!req.query.id) {
                result = await CategoriesModel.find()
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
            category.name = name
            category.link = link
            category.number = parseInt(order)
            await category.save()
            res.json({
                success: 'Категория успешно изменена!'
            })
        } catch (e) {
            next(e)
        }
    }

    async add(req, res, next) {
        try {
            const { name, link, order } = req.body
            const existCategory = await CategoriesModel.findOne({ link })

            if (existCategory) {
                return next(ApiError.BadRequest('Категория с такой ссылкой уже существует'))
            }
            await CategoriesModel.create({
                name,
                link,
                number: parseInt(order)

            })
            res.json({
                success: 'Категория успешно добавлена!'
            })
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const result = await CategoriesModel.findByIdAndDelete(id)
            if(!result) {
                return res.json({
                    success: 'Что-то пошло не так'
                })
            }
            res.json({
                success: 'Категория успешно удалена'
            })
        } catch (e) {
            next(e)
        }
    }
}

const categoriesController = new CategoriesController()


export default categoriesController