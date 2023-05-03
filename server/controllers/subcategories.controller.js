import ApiError from '../service/error.service.js'
import SubcategoriesModel from '../models/subcategories.model.js'
import CategoriesModel from '../models/categories.model.js'

class SubcategoriesController {
    async get(req, res, next) {
        try {
            let result
            if (!req.query.id) {
                result = await SubcategoriesModel.find().populate('category')
            } else {
                result = await SubcategoriesModel.findById(req.query.id).populate('category')
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
            const { id, name, link, categoryId } = req.body
            const subcategory = await SubcategoriesModel.findById(id)
            const category = await CategoriesModel.findById(categoryId)

            if (!subcategory || !category) {
                return next(ApiError.BadRequest('Такой категории или подкатегории не существует!'))
            }

            subcategory.name = name
            subcategory.link = link
            subcategory.category = category
            await subcategory.save()
            res.json({
                success: 'Категория успешно изменена!'
            })
        } catch (e) {
            next(e)
        }
    }

    async add(req, res, next) {
        try {
            const { name, link, categoryId } = req.body
            const category = await CategoriesModel.findById(categoryId)
            if (!category) {
                return next(ApiError.BadRequest('Такой категории не существует!'))
            }

            await SubcategoriesModel.create({
                name,
                link,
                category
            })
            res.json({
                success: 'Подкатегория успешно добавлена!'
            })
        } catch (e) {
            next(e)
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.body
            const result = await SubcategoriesModel.findByIdAndDelete(id)
            if (!result) {
                return res.json({
                    success: 'Что-то пошло не так'
                })
            }
            res.json({
                success: 'Подкатегория успешно удалена.'
            })
        } catch (e) {
            next(e)
        }
    }
}

const subcategoriesController = new SubcategoriesController()


export default subcategoriesController