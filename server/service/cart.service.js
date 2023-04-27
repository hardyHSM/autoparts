import productService from './product.service.js'
import UsersModel from '../models/users.model.js'
import ApiError from './error.service.js'


class CartService {
    async addProduct(productId, userId) {
        const product = await productService.getProduct(productId)
        const user = await UsersModel.findById(userId).populate('cart.list.product')

        if (!product) {
            throw ApiError.BadRequest('Продукт не найден!')
        }

        const index = user.cart.list.findIndex(pr => pr.product.equals(product._id))

        const plainProduct = {
            product,
            count: 1
        }

        if (index >= 0) {
            user.cart.list[index].count++
        } else {
            user.cart.list.push(plainProduct)
        }
        user.cart.updateTime = new Date()
        await user.save()
        return user.cart.list[index] || plainProduct
    }

    async getUserCart(userId) {
        const user = await UsersModel.findById(userId).populate('cart.list.product')

        return user.cart || { message: 'Корзина пустая' }
    }

    async getCartPriceByUser(userId) {
        const user = await UsersModel.findById(userId).populate('cart.list.product')

        return this.getCartPrice(user.cart.list)
    }

    getCartPrice(list) {
        return list.reduce((acc, cartItem) => {
            acc += (cartItem.product.price * cartItem.count)
            return acc
        }, 0)
    }

    async getProductsByIDs(plainCart = []) {
        const promises = plainCart.map(async ({ id }) => {
            const product = await productService.getProduct(id)
            if (!product) {
                throw ApiError.BadRequest('Продукции с таким id не существует!')
            } else {
                return product
            }
        })
        const products = await Promise.all(promises)

        return plainCart.map(item => {
            item.product = products.find(p => p._id.equals(item.id))
            delete item.id
            return item
        })
    }

    async changeProductCount(userId, productId, count) {
        const user = await UsersModel.findById(userId).populate('cart.list.product')

        const productIndex = user.cart.list.findIndex(item => item.product._id.equals(productId))

        if (productIndex < 0) {
            throw ApiError.BadRequest('Товар не найден в вашей корзине!')
        }
        user.cart.updateTime = new Date()
        user.cart.list[productIndex].count = count

        await user.save()
    }

    async deleteProduct(userId, productId) {
        const user = await UsersModel.findById(userId).populate('cart.list.product')

        user.cart.updateTime = new Date()
        user.cart.list = user.cart.list.filter(item => !item.product._id.equals(productId))

        await user.save()
    }
}


export default new CartService()