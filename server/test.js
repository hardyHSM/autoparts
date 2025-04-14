import OrdersModel from './models/orders.model.js'
import fs from 'fs/promises'
import LocationsModel from './models/locations.model.js'
import { Faker, ru } from '@faker-js/faker'
import ProductsModel from './models/products.model.js'


function getRandomDateISO(startYear, endDate) {
    const start = new Date(`${startYear}-01-01T00:00:00.000`).getTime()
    const end = new Date(endDate).getTime()
    const randomTimestamp = Math.floor(Math.random() * (end - start)) + start
    return new Date(randomTimestamp).toISOString()
}

function getNextDateISO(baseDate) {
    let minDays = 1
    let maxDays = 7
    let baseTime = new Date(baseDate).getTime()

    let randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays
    let randomTime = baseTime + randomDays * 24 * 60 * 60 * 1000
    let randomHours = Math.floor(Math.random() * 24)
    let randomMinutes = Math.floor(Math.random() * 60)
    let randomSeconds = Math.floor(Math.random() * 60)

    randomTime += randomHours * 60 * 60 * 1000
    randomTime += randomMinutes * 60 * 1000
    randomTime += randomSeconds * 1000

    return new Date(randomTime).toISOString()
}

function getRandomStatus() {
    const random = Math.random();

    if (random < 0.7) {
        return 'Сделка завершена';
    } else if (random < 0.8) {
        return 'Не обработан';
    } else if (random < 0.9) {
        return 'Отменён';
    }
    return 'В процессе';
}


const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateProducts = (products) => {
    const length = getRandomNumber(1, 3)
    const productsCount = getRandomNumber(1, 3)

    let result = new Array(length).fill({})

    result = result.map(() => {
        const product = getRandomElement(products)
        return {
            count: productsCount,
            price: product.price,
            product
        }
    })
    return {
        list: result,
        total: result.reduce((total, item) => total + (item.count * item.price), 0)
    }
}

const faker = new Faker({ locale: [ru] })
//
export const fill = async () => {
    const count = 1000
    let newOrders = new Array(count).fill({})
    const locations = await LocationsModel.find()
    const products = await ProductsModel.find().lean()
    const paymentList = ['call', 'getting']
    const deliveryList = [1, 0]
    const sex = ['male', 'female']

    newOrders = newOrders.map(() => {
        const date = getRandomDateISO(2023, new Date())
        const closeIn = getNextDateISO(date)
        const location = getRandomElement(locations)
        const address = faker.location.streetAddress() + ' ' + faker.location.secondaryAddress()
        const prd = generateProducts(products)
        const order = {}
        const sexType = getRandomElement(sex)

        order.firstName = faker.person.firstName(sexType)
        order.lastName = faker.person.lastName(sexType)
        order.createdAt = new Date(date)
        order.location = location
        order.promo = false
        order.payment = getRandomElement(paymentList)
        order.delivery = Boolean(getRandomElement(deliveryList))
        order.address = address
        order.tel = '+7' + faker.phone.number()
        order.email = faker.internet.email()
        order.products = prd.list
        order.total = prd.total
        order.status = getRandomStatus()
        if(order.status === 'Сделка завершена') {
            order.closeTime = new Date(closeIn)
        }
        return order
    })

    await OrdersModel.collection.drop();
    await OrdersModel.insertMany(newOrders);
}

//fill()
