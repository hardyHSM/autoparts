import ApiError from '../service/error.service.js'
import SubcategoriesModel from '../models/subcategories.model.js'
import CategoriesModel from '../models/categories.model.js'

class SubcategoriesController {
    async get(req, res, next) {
        try {
            let result
            if (!('id' in req.query)) {
                const sortName = req.query.sort_name || 'number'
                const sortType = req.query.sort_type || 1
                const sortData = {
                    [sortName]: sortType
                }
                result = await SubcategoriesModel.find().sort(sortData).populate('category')
            } else {
                result = await SubcategoriesModel.findById(req.query.id).populate('category')
                if (!result) {
                    next(ApiError.BadRequest('Такой подкатегории не существует!'))
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

            const existSubcategoryLink = await SubcategoriesModel.findOne({ link })

            if (existSubcategoryLink && (existSubcategoryLink.id !== subcategory.id)) {
                return next(ApiError.BadRequest('Подкатегория с такой ссылкой уже существует!'))
            }


            subcategory.name = name
            subcategory.link = link
            subcategory.category = category
            await subcategory.save()
            res.json({
                message: 'Подкатегория успешно изменена!'
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
                return next(ApiError.BadRequest('Такой подкатегории не существует!'))
            }

            await SubcategoriesModel.create({
                name,
                link,
                category
            })
            res.json({
                message: 'Подкатегория успешно добавлена!'
            })
        } catch (e) {
            next(e)
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.body
            const result = await SubcategoriesModel.findByIdAndDelete(id)
            res.json({
                message: 'Подкатегория успешно удалена.'
            })
        } catch (e) {
            next(ApiError.BadRequest('Что-то пошло не так. Подкатегории с таким идентификатором не существует.'))
        }
    }
}

const subcategoriesController = new SubcategoriesController()


export default subcategoriesController