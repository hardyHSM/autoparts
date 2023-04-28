class ButtonComponent {
    constructor(query) {
        this.$node = document.querySelector(query)
        this.text = this.$node.textContent.trim()
    }

    setPreloaderState(type = 'white') {
        this.$node.classList.add('buton_hidden-text')
        if (type === 'white') {
            this.$node.innerHTML += '<div class="loader loader_white"></div>'
        } else {
            this.$node.innerHTML += '<div class="loader"></div>'
        }
        this.$node.disabled = true
    }

    setTextState(text = this.text) {
        this.$node.querySelector('.loader').remove()
        this.$node.classList.remove('buton_hidden-text')
        this.$node.disabled = false
    }

    toggleDisabled() {
        if (this.$node.disabled) {
            this.$node.disabled = false
        } else {
            this.$node.disabled = true
        }
    }
}

export default ButtonComponent