import { validationResult } from 'express-validator'
import ApiError from '../service/error.service.js'
import FeedBackModel from '../models/feedback.model.js'
import UsersModel from '../models/users.model.js'
import productService from '../service/product.service.js'
import { decodeString, escapeRegExp } from '../utils/utils.js'
import feedbackModel from '../models/feedback.model.js'
import OrdersModel from '../models/orders.model.js'
import FeedbackModel from '../models/feedback.model.js'
import mailService from '../service/mail.service.js'
import CategoriesModel from '../models/categories.model.js'
import usersModel from '../models/users.model.js'

class FeedBackController {
    async addMessage(req, res, next) {
        try {
            const feedback = await FeedBackModel.create(req.body)
            if (req.user) {
                const user = await UsersModel.findById(req.user.id)
                feedback.user = user
                user.feedbacks.push(feedback)
                user.notifications.push({
                    messageType: 'info',
                    message: `Вы оставили вопрос. Его содержание: ${feedback.text}`,
                    createdTime: new Date()
                })
                await feedback.save()
                await user.save()
            }


            res.json({
                message: 'Мы получили ваше письмо, в скором времени мы вам ответим на него!'
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            if (('id' in req.query)) {
                const feedback = await FeedbackModel.findById(req.query.id)
                res.json(feedback)
            } else {
                const page = req.query.page || 1
                const sortName = req.query.sort_name || 'createdAt'
                const sortType = req.query.sort_type || 1
                const params = {}

                if (req.query.name) {
                    params.name = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.name.trim())))
                }
                if (req.query.email) {
                    params.email = productService.parseQueryRegexp(escapeRegExp(decodeString(req.query.email.trim())))
                }

                const sortData = {
                    [sortName]: sortType
                }


                const [list, count] = await Promise.all([
                    feedbackModel
                    .find(params)
                    .sort(sortData)
                    .skip((page - 1) * 20)
                    .limit(20)
                    .exec(),
                    feedbackModel.find().count()
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
            const feedback = await feedbackModel.findById(id)
            if(!feedback) {
                next(ApiError.BadRequest('Обратная связь не найдена!'))
            }
            feedback.answer = answer
            feedback.isAnswered = true
            mailService.sendAnswer(feedback.email, answer)
            await feedback.save()
            res.json({
                message: 'Вы успешно ответили на обратную связь!'
            })
        } catch (e) {
            next(e)
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.body
            const feedback = await FeedBackModel.findById(id)

            const result = await UsersModel.findByIdAndUpdate(
                feedback.user,
                { $pull: { feedbacks: id } },
                { new: true }
            );
            await feedback.deleteOne()
            res.json({
                message: 'Вопрос успешно удален'
            })
        } catch (e) {
            next(e)
        }
    }
}

const productController = new FeedBackController()

export default productController