export default class ElementTransporter {
    prevWindowWidth = null

    appendElements(config) {
        config.forEach(item => this.toChange(item))
        this.prevWindowWidth = window.innerWidth
        window.addEventListener('resize', e => {
            if (window.innerWidth !== this.prevWindowWidth) {
                config.forEach(item => this.toChange(item))
            }
        })
    }

    toChange(config) {
        const $element = document.querySelector(config.what)
        const $where_element = document.querySelector(config.where)
        config.breakpoints.forEach(({ key, value }) => {
            if (key === 'less') {
                if (window.innerWidth <= value) {
                    $where_element.insertAdjacentElement(config.pos, $element)
                }
            }
            if (key === 'more') {
                if (window.innerWidth > value) {
                    $where_element.insertAdjacentElement(config.pos, $element)
                }
            }
        })

    }
}


