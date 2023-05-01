import jwt from 'jsonwebtoken'
import UsersModel from '../models/users.model.js'
import ApiError from '../service/error.service.js'

const adminAccessMiddleware = (req, res, next) => {
    try {
        const role = req.user.role.toLowerCase()
        if (role === 'admin') {
            next()
        } else {
            next(ApiError.Error404())
        }
    } catch (e) {
        next(ApiError.Error404())
    }
}

export default adminAccessMiddleware