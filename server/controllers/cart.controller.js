import cartService from '../service/cart.service.js'

class CartController {
    async getUserCart(req, res, next) {
        try {
            const cart = await cartService.getUserCart(req.user.id)
            const total = await cartService.getCartPriceByUser(req.user.id)
            res.json({
                cart,
                total
            })
        } catch (e) {
            next(e)
        }
    }

    async addProduct(req, res, next) {
        try {
            const addedProduct = await cartService.addProduct(req.body?.id, req.user?.id)
            const totalCartPrice = await cartService.getCartPriceByUser(req.user.id)

            res.json({
                addedProduct,
                totalCartPrice
            })
        } catch (e) {
            next(e)
        }
    }

    async getProductsByIDs(req, res, next) {
        try {
            const cart = req.body?.products

            const products = await cartService.getProductsByIDs(cart)

            res.json({
                products
            })
        } catch (e) {
            next(e)
        }
    }

    async changeProductCount(req, res, next) {
        try {
            await cartService.changeProductCount(req.user.id, req.body.id, req.body.value)

            res.json({
                message: 'Количество продукции успешно изменено!'
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            await cartService.deleteProduct(req.user.id, req.body.id)

            res.json({
                message: 'Товар удалён из корзины!'
            })
        } catch (e) {
            next(e)
        }
    }
}

const cartController = new CartController()

export default cartController