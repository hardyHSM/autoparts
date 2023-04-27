export default class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static ValidationError(message, errors = []) {
        return new ApiError(422, message, errors)
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static ServerError() {
        return new ApiError(500, 'Ошибка на стороне сервера')
    }

    static ConflictError(message, errors = []) {
        return new ApiError(406, message, errors)
    }

    static ForbiddenError(message, errors = []) {
        return new ApiError(403, message, errors)
    }

    static EmailNotFound(message, errors = []) {
        return new ApiError(551, `Такой почты не существует`)
    }

    static EmailAlreadyExists(message, errors = []) {
        return new ApiError(409, `Пользователь с почтовым адресом ${message} уже существует`, errors)
    }
    static Error404() {
        return new ApiError(404, `Страница не найдена!`)
    }
}