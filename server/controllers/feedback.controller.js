import { validationResult } from 'express-validator'
import ApiError from '../service/error.service.js'
import FeedBackModel from '../models/feedback.model.js'
import UsersModel from '../models/users.model.js'

class FeedBackController {
    async addMessage(req, res, next) {
        try {
            const feedback = await FeedBackModel.create(req.body)
            if(req.user) {
                const user = await UsersModel.findById(req.user.id)
                user.feedbacks.push(feedback)
                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили вопрос. Его содержание: ${feedback.text}`,
                    createdTime: new Date()
                })
                await user.save()
            }

            res.json({
                message: 'Мы получили ваше письмо, в скором времени мы вам ответим на него!'
            })
        } catch (e) {
            next(e)
        }
    }
}

const productController = new FeedBackController()

export default productController