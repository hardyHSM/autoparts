import ApiError from '../service/error.service.js'
import SelectionsModel from '../models/selection.model.js'
import UsersModel from '../models/users.model.js'
import productService from '../service/product.service.js'
import { decodeString, escapeRegExp } from '../utils/utils.js'
import mailService from '../service/mail.service.js'

const dictionary = {
    'original': 'оригинал',
    'any': 'любая',
    'substitute': 'заменитель',
}

class SelectionController {
    async addSelection(req, res, next) {
        try {
            const selection = await SelectionsModel.create(req.body)
            if(req.user) {
                const user = await UsersModel.findById(req.user.id)
                selection.user = user
                user.selections.push(selection)
                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили заявку на подбор запчасти. Vin - ${selection.vin}, название запчасти - ${selection.detail}, тип запчасти - ${dictionary[selection.partType]}, количество - ${selection.count}.`,
                    createdTime: new Date()
                })
                await selection.save()
                await user.save()
            }

            res.json({
                message: 'Запрос выполнен, ожидайте! На вашу почту придет ответ от администрации сайта.'
            })
        } catch (e) {
            next(e)
        }
    }
    async get(req, res, next) {
        try {
            if (req.query.id) {
                const selection = await SelectionsModel.findById(req.query.id)
                res.json(selection)
            } else {
                const page = req.query.page || 1
                const sortName = req.query.sort_name || 'createdAt'
                const sortType = req.query.sort_type || 1
                const params = {}

                if (req.query.email) {
                    params.email = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.email.trim())))
                }

                if (req.query.vin) {
                    params.vin = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.vin.trim())))
                }

                if (req.query.detail) {
                    params.detail = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.detail.trim())))
                }


                const sortData = {
                    [sortName]: sortType
                }


                const [list, count] = await Promise.all([
                    SelectionsModel
                    .find(params)
                    .sort(sortData)
                    .skip((page - 1) * 20)
                    .limit(20)
                    .exec(),
                    SelectionsModel.find().count()
                ])
                res.json({ list, count })
            }
        } catch (e) {
            next(e)
        }
    }
    async change(req, res, next) {
        try {
            const id = req.body.id
            const answer = decodeString(req.body.answer)
            const selection = await SelectionsModel.findById(id)
            if(!selection) {
                next(ApiError.BadRequest('Обратная связь не найдена!'))
            }
            selection.answer = answer
            selection.isAnswered = true
            await mailService.sendAnswer(selection.email, answer)
            await selection.save()
            res.json({
                message: 'Вы успешно ответили на подбор запчастей!'
            })
        } catch (e) {
            next(e)
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.body
            const selection = await SelectionsModel.findById(id)

            await UsersModel.findByIdAndUpdate(
                selection.user,
                { $pull: { selections: id } },
                { new: true }
            );
            await selection.deleteOne()

            res.json({
                message: 'Вопрос успешно удален'
            })
        } catch (e) {
            next(e)
        }
    }
}

const productController = new SelectionController()

export default productController