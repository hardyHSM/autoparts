export default class ValidationComponent {
    static isValidEmail(str) {
        const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
        return regEmail.test(str)
    }

    static isValidTel(str) {
        return !str.includes('_')
    }

    static isValidPass(str) {
        return str.length >= 6
    }

    static isValidName(str) {
        return str.length > 1 && str.match(/^[ЁёА-я ,.'-]+$/) && !str.match(/\s+/)
    }

    static isEqualPassword(str1, str2) {
        return str1 === str2
    }

    static isEnoughText(str) {
        return str.length > 5
    }

    static isValidVin(vin) {
        return vin.length === 17
    }

    static isValidPart(name) {
        return name.length >= 3
    }

    static isValidLink(link) {
        return link.match(/^[^0-9а-яА-я]+$/g)
    }

    static isValidNumber(number) {
        return number.match(/^\d+$/)
    }

    static isValidCategory(category) {
        return category.match(/^[А-яa-z,. '-]+$/)
    }

    static isExist(text) {
        return text.length >= 1
    }

    static isValidOrder(text) {
        return text.match(/^(\<|\>)+(\d+)/i)
    }
}