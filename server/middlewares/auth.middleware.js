import tokenService from '../service/token.service.js'
import UsersModel from '../models/users.model.js'


export default async function authMiddleware(req, res, next) {
    try {
        const { refreshToken } = req.cookies
        const userDataRefresh = tokenService.validateRefreshToken(refreshToken)
        const [refreshTokenFromDB, user] =
            await Promise.all([tokenService.findToken(refreshToken), UsersModel.findById(userDataRefresh.id)])



        if (!userDataRefresh || !refreshTokenFromDB || !user) {
            req.user = null
        } else {
            req.user = userDataRefresh
        }
    } catch (e) {
        req.user = null
    } finally {
        next()
    }
}