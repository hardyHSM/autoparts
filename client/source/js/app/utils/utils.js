import { Editor, HTMLMdNodeConvertorMap } from '@toast-ui/editor'
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
        const tempNode = document.createElement('div')
        tempNode.setAttribute('id', 'editor-temp-element')
        tempNode.style.display = 'none'
        document.body.appendChild(tempNode)
        const editor = new Editor({
            el: document.querySelector('#editor-temp-element'),
            initialEditType: 'markdown',
            initialValue: description
        })
        return editor.getHTML()
    }
}

export function getTemplateMailFeedback(data) {
    console.log(data)
    return html`
        <h2>Добрый день, уважаемый(-ая) ${data.name}</h2>
        <p>Вы задали вопрос на нашем сайте. Его содержание - ${data.text}</p>
        <br>
        <p>[Текст ответа]</p>
        <br>
        <p>С уважением, администрация сайта autoparts.com</p>
    `
}

export function getTemplateMailSelection(data) {
    console.log(data)
    return html`
        <h2>Добрый день, уважаемый(-ая) ${data.name}</h2>
        <p>Вы обратились за подбором запчастей к нашим специалистам.
            Вы запросили деталь - ${data.detail}, тип - ${dictionary[data.partType]}, в количестве ${data.count} шт. ;
        </p>
        <br>
        <p>[Текст ответа]</p>
        <br>
        <p>С уважением, администрация сайта autoparts.com</p>
    `
}