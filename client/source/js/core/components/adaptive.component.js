export default class ElementTransporter {
    constructor() {
        this.prevWindowWidth = null
    }

    appendElements(config) {
        window.addEventListener('DOMContentLoaded', () => {
            this.prevWindowWidth = document.body.clientWidth
            config.forEach(item => this.toChange(item))
        })
        new ResizeObserver(() => {
            if(document.body.clientWidth !== this.prevWindowWidth) {
                config.forEach(item => this.toChange(item))
            }
        }).observe(document.body)
    }

    toChange(config) {
        const $element = document.querySelector(config.what)
        const $where_element = document.querySelector(config.where)
        config.breakpoints.forEach(({key, value }) => {
            if (key === 'less') {
                if (window.innerWidth <= value) {
                    $where_element.insertAdjacentElement(config.pos, $element)
                }
            } else {
                if (window.innerWidth > value) {
                    $where_element.insertAdjacentElement(config.pos, $element)
                }
            }
        })

    }
}


