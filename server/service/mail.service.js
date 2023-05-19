import nodemailer from 'nodemailer'
import ApiError from './error.service.js'
import { config } from 'dotenv'
config()

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(user, link) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'Активация аккаунта на',
                text: '',
                html:
                    `
                    <div>
                        <span>Здравстуйте, ${user.firstName} ${user.lastName || ''}</span>
                        <h1>Регистрация на сайте Автозапчасти</h1>
                        <p>Для активации перейдите по ссылке</p>
                        <a href="${link}" style="font-size: 24px">Подтвердить почту</a>
                    </div>
                `
            })
        } catch (e) {

        }
    }

    async sendRecoveryMail(user, link) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'Восстановление пароля',
                text: '',
                html:
                    `
                    <div>
                        <span>Здравстуйте, ${user.firstName} ${user.lastName || ''}</span>
                        <h1>Восстановление пароля на сайте Автозапчасти</h1>
                        <p>Для восстановления пароля, перейдите по ссылке</p>
                        <a href="${link}" style="font-size: 24px">Сбросить пароль</a>
                    </div>
                `
            })
        } catch (e) {

        }
    }

    async sendAnswer(email, data) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Ответ от администрации сайта autoparts.com',
                text: '',
                html: data
            })
        } catch (e) {

        }
    }
}

const mailService = new MailService()

export default mailService