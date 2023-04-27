import userService from '../service/user.service.js'
import csrf from 'csrf'

class UserController {
    async registration(req, res, next) {
        try {
            const userData = await userService.registration(req.body)


            res.cookie('refreshToken', userData.token, {
                maxAge: 2592000000,
                // httpOnly: true,
                // secure: true,
                sameSite: 'strict'
            })
            res.status(200).json({
                ...userData.plainUser
            })
        } catch (e) {
            next(e)
        }
    }

    async changeProfile(req, res, next) {
        try {
            await userService.changeProfile(req.user, req.body)
            res.status(200).json({
                'message': 'Вы успешно изменили параметры профиля!'
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            console.log(req.body)
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.token, {
                maxAge: 2592000000,
                // httpOnly: true,
                // secure: true,
                SameSite: 'strict'
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json({
                'state': 'true'
            })
        } catch (e) {
            next(e)
        }
    }

    async recoveryPassword(req, res, next) {
        try {
            const { password, repassword, link } = req.body
            await userService.recoveryPassword(password, repassword, link)
            res.status(200).json({
                message: 'Пароль успешно изменён!'
            })
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const { prevPassword, newPassword } = req.body

            await userService.changePassword(req.user, prevPassword, newPassword)
            res.status(200).json({
                message: 'Пароль успешно изменён!'
            })
        } catch (e) {
            next(e)
        }
    }

    async passwordChangeLink(req, res, next) {
        try {
            const resetLink = req.params.link
            await userService.passwordChangeLink(resetLink)

            return res.status(200).json({
                link: resetLink
            })
        } catch (e) {
            next(e)
        }
    }

    async passwordRecovery(req, res, next) {
        try {
            const { email } = req.body
            await userService.passwordRecovery(email)

            res.status(200).json({
                message: 'Сообщение отправлено на почту!'
            })
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.json({
                'message': 'Ваш аккаунт успешно подтверждён!'
            })
        } catch (e) {
            next(e)
        }
    }

    async info(req, res, next) {
        try {
            if(!req.user) {
                res.json(null)
                return
            }
            const { refreshToken } = req.cookies
            const info = await userService.info(refreshToken)
            res.json({
                info,
                csrf: new csrf().create(req.user.id + process.env.JWT_ACCESS_SECRET)
            })
        } catch (e) {
            next(e)
        }
    }

    async getOrders(req, res, next) {
        try {
            const orders = await userService.getOrders(req.user.id)
            res.json(orders)
        } catch (e) {
            next(e)
        }
    }

    async getNotifications(req, res, next) {
        try {
            const notifications = await userService.getNotifications(req.user.id)
            res.json(notifications)
        } catch (e) {
            next(e)
        }
    }
}

const userController = new UserController()

export default userController