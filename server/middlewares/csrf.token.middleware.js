import ApiError from '../service/error.service.js'
import csrf from 'csrf'

export default async function csrfTokenMiddleware(req, res, next) {
    try {
        if(req.user) {
            const token = req.headers['x-csrf-token']
            if(!token) next(ApiError.ForbiddenError('x-csrf-token error!'))
            const verify = new csrf().verify(req.user.id + process.env.JWT_ACCESS_SECRET, token)
            if(!verify) next(ApiError.ForbiddenError('x-csrf-token error!'))
            next()
        } else {
            next()
        }
    } catch(e) {
        next(e)
    }
}