export default class PreloaderComponent {
    constructor(query) {
        this.$node = document.querySelector(query)
    }

    show() {
        this.$node.classList.remove('page__preloader_hide')
    }

    hide() {
        document.querySelector('.page__wrapper').style.opacity = '1'
        this.$node.classList.add('page__preloader_hide')
        this.$node.remove()
    }
}



