import { validationResult } from 'express-validator'
import ApiError from '../service/error.service.js'


export async  function validateObject(obj, validations) {

    const req = {
        body: obj,
    }
    for (let validation of validations) {
        await validation.run(req);
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        throw ApiError.ValidationError('Ошибка валидации', errors.array())
    }
    return true;
}

export function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function decodeString(text) {
    if (!text) return null
    return text
    .replace(/\&amp\;/g, '&')
    .replace(/\&lt\;/g, '<')
    .replace(/\&gt\;/g, '>')
    .replace(/\&quot\;/g, '"')
    .replace(/\&\#039\;/g, '\'')
}