import ApiError from '../service/error.service.js'

export default async function authAccessMiddleware(req, res, next) {
    try {
        if(req.user) {
            next()
        } else {
           next(ApiError.Error404())
        }
    } catch(e) {
        next(e)
    }
}