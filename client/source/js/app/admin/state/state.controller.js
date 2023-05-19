import CategoriesModel from '../categories/categories.model.js'
import SubcategoriesModel from '../subcategories/subcategories.model.js'
import UsersModel from '../users/users.model.js'
import ProductsModel from '../products/products.model.js'
import SalesModel from '../sales/sales.model.js'

class StateController {
    async middleware() {
        const [categories, subcategories, users, products, orders, sales] = await Promise.all([
            CategoriesModel.findAll(),
            SubcategoriesModel.findAll(),
            UsersModel.findAll(),
            ProductsModel.findAll(),
            SalesModel.countOrders(),
            SalesModel.countSales(),
        ])
        return {
            categories: categories.length,
            subcategories: subcategories.length,
            products: products.count,
            users: users.count,
            orders,
            sales
        }
    }
}

export default new StateController()