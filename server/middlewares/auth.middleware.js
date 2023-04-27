import tokenService from '../service/token.service.js'
import UsersModel from '../models/users.model.js'


export default async function authMiddleware(req, res, next) {
    try {
        const { refreshToken } = req.cookies
        const userDataRefresh = await tokenService.validateRefreshToken(refreshToken)
        const refreshTokenFromDB = await tokenService.findToken(refreshToken)
        const user = await UsersModel.findById(userDataRefresh.id)

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