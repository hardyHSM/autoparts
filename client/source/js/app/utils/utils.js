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
    if(!text) return null
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>','&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&#039;')
}