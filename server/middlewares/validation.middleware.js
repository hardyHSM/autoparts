import { validationResult } from 'express-validator'
import ApiError from '../service/error.service.js'

export default async function validationMiddleware(req, res, next) {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return next(ApiError.ValidationError('Ошибка при валидации', errors.array()))
    } else {
        next()
    }
}