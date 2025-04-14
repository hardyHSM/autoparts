import { html } from 'code-tag'


const dictionary = {
    'original': 'оригинал',
    'any': 'любая',
    'substitute': 'заменитель'
}

export function debounce(callee, timeoutMs) {
    let previousCall = Date.now()
    let lastCallTimer = null
    return function (...args) {
        if ((Date.now() - previousCall) <= timeoutMs) {
            clearTimeout(lastCallTimer)
        }
        previousCall = Date.now()
        lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
    }
}

export function lazyLoadImages(node) {
    const images = node.querySelectorAll('img')

    const loadImg = (img) => {
        observer.unobserve(img)
        img.src = img.dataset.src
        img.style.opacity = 1
    }

    const observer = new IntersectionObserver((items) => {
        items.forEach(element => {
            if (element.intersectionRatio > 0) loadImg(element.target)
        })
    }, {
        root: null,
        threshold: 0.1
    })

    images.forEach(img => observer.observe(img))
}

export function getTotalPrice(products) {
    return products.reduce((acc, item) => {
        acc += (item.price * item.count)
        return acc
    }, 0)
}

export function getTotalPriceWithPromo(products, promo = 0) {
    let total = products.reduce((acc, item) => {
        acc += (item.price * item.count)
        return acc
    }, 0)
    total = total - promo
    if (total < 0) total = 0
    return total
}

export function parseDate(date) {
    return new Date(date).toLocaleString('en-GB', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    })
}

export function getProductsCount(products) {
    return products.reduce((acc, item) => {
        acc += item.count
        return acc
    }, 0)
}

export function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000)
}

export function sanitalize(text) {
    if (!text) return null
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&#039;')
}

export function decodeString(text) {
    if (!text) return null

    return text.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', '\'')
}

export function escapeRegex(str) {
    if (!str) return null
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}


export default function scrollToTop(node, type = 'smooth') {
    let root
    if (typeof node === 'string') {
        root = document.querySelector(node)
    } else {
        root = node
    }
    root.scrollIntoView(
        {
            behavior: type,
            top: true,
            block: 'center'
        }
    )
}

export function parseArrayToHTML(description) {
    if (Array.isArray(description)) {
        return description.reduce((acc, item) => {
            const { title, text, textList } = item
            if (title) {
                acc += `<h2>${title}</h2>`
            }
            if (text) {
                acc += `<p>${text}</p>`
            }
            if (textList) {
                let list = ''
                textList.forEach(item => {
                    list += `<li>${item}</li>`
                })
                acc += `<ul>${list}</ul>`
            }
            return acc
        }, '')
    } else {
        return decodeString(description)
    }
}

export function getTimeLabel({ minutes, hours, days }) {
    const data = []
    if(days) data.push(getDaysLabel(days))
    if(hours) {
        data.push(getHoursLabel(hours))
    } else {
        if(minutes) data.push(getMinutesLabel(minutes))
    }
    return data.join(', ')
}

export function getMinutesLabel(minutes) {
    const absMinutes = Math.abs(minutes);
    if (absMinutes % 10 === 1 && absMinutes % 100 !== 11) {
        return `${minutes} минута`;
    } else if (absMinutes % 10 >= 2 && absMinutes % 10 <= 4 && (absMinutes % 100 < 10 || absMinutes % 100 >= 20)) {
        return `${minutes} минуты`;
    } else {
        return `${minutes} минут`;
    }
}

export function getHoursLabel(hours) {
    const absHours = Math.abs(hours);
    if (absHours % 10 === 1 && absHours % 100 !== 11) {
        return `${hours} час`;
    } else if (absHours % 10 >= 2 && absHours % 10 <= 4 && (absHours % 100 < 10 || absHours % 100 >= 20)) {
        return `${hours} часа`;
    } else {
        return `${hours} часов`;
    }
}


export function getDaysLabel(n) {
    if (n % 100 >= 11 && n % 100 <= 14) {
        return `${n} дней`;
    }
    const lastDigit = n % 10;
    if (lastDigit === 1) {
        return `${n} день`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        return `${n} дня`;
    } else {
        return `${n} дней`;
    }
}

export function getTemplateMailFeedback(data) {
    return `
        <h2>Добрый день, уважаемый(-ая) ${data.name}</h2>
        <br>
        <p>Вы задали вопрос на нашем сайте. Его содержание - ${data.text}</p>
        <br>
        <p><i>*Текст ответа*</i></p>
        <br>
        <p>С уважением, администрация сайта autoparts.com</p>
    `
}

export function getTemplateMailSelection(data) {
    return `
        <h2>Добрый день, уважаемый(-ая) ${data.name}</h2>
        <br/>
        <p>Вы обратились за подбором запчастей к нашим специалистам.</p>
        <ul>
            <li>Вы запросили деталь - <b>${data.detail}</b></li>
            <li> тип - <b>${dictionary[data.partType]}</b></li>
            <li>в количестве <b>${data.count}шт. </b></li>
        </ul>
        <br/>
        <p><i>*Текст ответа*</i></p>
        <br/>
        <p>С уважением, администрация сайта autoparts.com</p>
    `
}

export function sortObjectByCount(data) {
    function sortArrayByCount(arr) {
        return arr.sort((a, b) => b.count - a.count)
    }

    let sortedData = JSON.parse(JSON.stringify(data))
    if (sortedData.products && sortedData.products.list) {
        sortedData.products.list = sortArrayByCount(sortedData.products.list)
    }

    if (sortedData.attributes) {
        sortedData.attributes.forEach(attr => {
            if (attr.values) {
                attr.values = sortArrayByCount(attr.values)
            }
        })
    }
    if (sortedData.makers) {
        sortedData.makers = sortArrayByCount(sortedData.makers)
    }

    return sortedData
}

export function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num)
}