import ApiError from '../service/error.service.js'

export default function errorMiddleware(err, req, res, next) {
    console.log(err)
    if (err instanceof ApiError) {
        if (err.status === 404) {
            return res.redirect('/404')
        }
        return res.status(err.status).json({ message: err.message, errors: err.errors })
    }
    console.log(err)
    return res.status(500).json({ message: 'Непредвиденная ошибка' })
}