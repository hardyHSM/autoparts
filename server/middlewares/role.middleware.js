// import jwt from 'jsonwebtoken'
// import UsersModel from '../models/users.model.js'
//
// export const isAdmin = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization
//         const token = authHeader.split(' ')[1]
//
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//         const user = UsersModel.findById(decodedToken.id)
//
//
//         if(decodedToken.isAdmin && user.isAdmin) {
//             next()
//         } else {
//             throw new Error('Нет доступа! Что-то пошло не так!')
//         }
//     } catch (e) {
//         console.error(e.error)
//     }
// }