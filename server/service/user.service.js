import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import ApiError from './error.service.js'
import UsersModel from '../models/users.model.js'
import DateService from './date.service.js'
import tokenService from './token.service.js'
import mailService from './mail.service.js'

const dictionary = {
    'firstName': 'имя',
    'lastName': 'фамилия',
    'tel': 'телефон',
    'email': 'почта',
    'password': 'пароль'
}

class UserService {
    async registration(body) {
        const { firstName, lastName, email, password, repassword, tel } = body
        const candidate = await UsersModel.findOne({ email })
        if (candidate) {
            throw ApiError.EmailAlreadyExists(email)
        }
        if (password !== repassword) {
            throw ApiError.BadRequest('Пароли не совпадают')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const activationData = {
            maxDate: DateService.nextDay(),
            link: v4()
        }

        const candidateUser = {
            firstName,
            lastName,
            email,
            password: hashPassword,
            activationData,
            tel,
            notifications: []
        }

        candidateUser.notifications.push({
            messageType: 'info',
            message: 'Вы успешно зарегистрировались',
            createdTime: new Date()
        })

        candidateUser.notifications.push({
            messageType: 'info',
            message: `На вашу почту ${candidateUser.email} была отправлена ссылка с активацией!`,
            createdTime: new Date()
        })


        mailService.sendActivationMail(candidateUser, `${process.env.API_URL}/activate/${activationData.link}`)

        const user = await UsersModel.create(candidateUser)


        const plainUser = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        const token = tokenService.generateToken({ ...plainUser })
        await tokenService.saveToken(plainUser.id, token)

        return {
            token,
            plainUser
        }
    }

    async changeProfile(userToken, body) {
        const user = await UsersModel.findById(userToken.id)

        let createMessage = `Вы успешно изменили текущие параметры профиля: `

        for ( const key in body ) {
            if (user[key] !== body[key]) {
                createMessage += `${dictionary[key]}, `
                if (key === 'email') {
                    await this.changeEmail(user, body[key])
                } else {
                    user[key] = body[key]
                }
            }
        }

        createMessage = createMessage.replace(/,[^,]+$/g, '')


        user.notifications.push({
            messageType: 'success',
            message: createMessage,
            createdTime: new Date()
        })

        await user.save()
    }

    async changeEmail(user, candidateEmail) {
        const existingUser = await UsersModel.findOne({email: candidateEmail})
        if(existingUser) {
            throw ApiError.EmailAlreadyExists(candidateEmail)
        }
        user.isActivated = false
        user.email = candidateEmail
        user.activationData = {
            maxDate: DateService.nextDay(),
            link: v4()
        }
        user.notifications.push({
            messageType: 'info',
            message: `На вашу почту ${user.email} была отправлена ссылка с активацией!`,
            createdTime: new Date()
        })
        mailService.sendActivationMail(user, `${process.env.API_URL}/activate/${user.activationData.link}`)
        return await user.save()
    }

    async login(email, password) {
        const user = await UsersModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const plainUser = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        const token = tokenService.generateToken({ ...plainUser })

        await tokenService.saveToken(plainUser.id, token)
        return { token, user: plainUser }
    }

    async recoveryPassword(password, repassword, link) {
        const user = await UsersModel.findOne({ 'recoveryPasswordData.link': link })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка смены пароля!')
        }
        if (password !== repassword) {
            throw ApiError.BadRequest('Пароли не совпадают!')
        }

        user.password = await bcrypt.hash(password, 10)
        user.recoveryPasswordData = null

        user.notifications.push({
            messageType: 'success',
            message: 'Вы успешно восстановили пароль от своего аккаунта!',
            createdTime: new Date()
        })

        await user.save()
    }

    async changePassword(tokenUser, prevPassword, newPassword) {
        const user = await UsersModel.findById(tokenUser.id)
        const isPasswordRight = await bcrypt.compare(prevPassword, user.password)
        if (!isPasswordRight) {
            throw ApiError.ForbiddenError('Введенный пароль неверный!')
        }
        if (prevPassword === newPassword) {
            throw ApiError.ConflictError('Новый пароль должен отличаться от предыдущего!')
        }
        user.password = await bcrypt.hash(newPassword, 10)

        user.notifications.push({
            messageType: 'success',
            message: 'Вы успешно изменили пароль от своего аккаунта!',
            createdTime: new Date()
        })

        await user.save()
    }

    async passwordChangeLink(link) {
        const user = await UsersModel.findOne({ 'recoveryPasswordData.link': link })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка смены пароля!')
        }
        const today = Date.now() / 1000

        if (today > user.recoveryPasswordData.maxDate) {
            throw ApiError.BadRequest('Срок действия ссылки истёк, получите её еще раз!')
        }
        return user
    }

    async passwordRecovery(email) {
        const user = await UsersModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('Ошибка, пользователь с текущей почтой отсутствует!')
        }
        const recoveryPasswordData = {
            maxDate: DateService.nextDay(),
            link: v4()
        }

        mailService.sendRecoveryMail(user, `${process.env.API_URL}/pass-recovery/${recoveryPasswordData.link}`)

        user.notifications.push({
            messageType: 'info',
            message: `На вашу почту ${user.email} была отправлена ссылка с восстановлением пароля!`,
            createdTime: new Date()
        })

        user.recoveryPasswordData = recoveryPasswordData

        await user.save()
    }

    async activate(activationLink) {
        const user = await UsersModel.findOne({ 'activationData.link': activationLink })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        const today = Date.now() / 1000

        if (today > user.activationData.maxDate) {
            throw ApiError.BadRequest('Срок действия ссылки истёк, получите новую в личном кабинете!')
        }
        user.activationData = {
            dateActivation: today
        }
        user.isActivated = true

        user.notifications.push({
            messageType: 'success',
            message: `Ваша почта ${user.email} была успешно подтверждена!`,
            createdTime: new Date()
        })

        await user.save()
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async info(token) {
        const userData = tokenService.validateRefreshToken(token)
        const user = await UsersModel.findById(userData.id).populate('location')

        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
            tel: user.tel,
            isActivated: user.isActivated,
            cart: user.cart,
            unreadMessagesCount: this.getUnreadMessagesCount(user.notifications)
        }
    }

    getUnreadMessagesCount(notifications) {
        return notifications.reduce((acc, message) => {
            if (!message.isChecked) {
                acc += 1
            }
            return acc
        }, 0)
    }

    async getOrders(id) {
        let user = await UsersModel.findById(id).populate('orders')
        user = await user.populate('orders.products.product')
        return user.orders
    }

    async getNotifications(id) {
        const user = await UsersModel.findById(id).populate('notifications')
        user.notifications = user.notifications.map(message => {
            message.isChecked = true
            return message
        })
        await user.save()
        return user.notifications
    }
}

const userService = new UserService()


export default userService