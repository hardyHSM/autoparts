import { validationResult } from 'express-validator'
import ApiError from '../service/error.service.js'
import SelectionsModel from '../models/selection.model.js'
import UsersModel from '../models/users.model.js'

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
                user.selections.push(selection)
                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили заявку на подбор запчасти. Vin - ${selection.vin}, название запчасти - ${selection.detail}, тип запчасти - ${dictionary[selection.partType]}, количество - ${selection.count}.`,
                    createdTime: new Date()
                })
                await user.save()
            }

            res.json({
                message: 'Запрос выполнен, ожидайте!'
            })
        } catch (e) {
            next(e)
        }
    }
}

const productController = new SelectionController()

export default productController