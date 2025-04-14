import PagesModel from '../models/pages.model.js'
import pagesService from '../service/pages.service.js'
import ApiError from '../service/error.service.js'


class PagesController {
    async get(req,res,next) {
        try {
            const id = req.query?.id
            if('id' in req.query) {
                const page = await pagesService.getPage(id)
                res.json(page)
            } else {
                const pages = await PagesModel.find({})
                res.json(pages)
            }
        } catch(e) {
            next(e)
        }
    }
    async change(req,res,next) {
        try {
            if(req.body.id) {
                await pagesService.changePage(req.body)
                res.json({
                    message: 'Изменение редактируемой страницы произошло успешно.'
                })
            } else {
                await pagesService.reposition(req.body)
                res.json({
                    message: 'Изменение отображения страниц произошло успешно.'
                })
            }
        } catch(e) {
            next(e)
        }
    }

    async add(req,res,next) {
        try {
            const result = await pagesService.addPage(req.body)
            res.json({
                message: 'Страница успешно добавлена в базу данных.'
            })
        } catch(e) {
            next(e)
        }
    }

    async delete(req,res,next) {
        try {
            const id = req.body.id
            await pagesService.deletePage(id)
            res.json({
                message: 'Страница успешно удалена из базы данных.'
            })
        } catch(e) {
            next(e)
        }
    }
}


const pagesController = new PagesController()


export default pagesController