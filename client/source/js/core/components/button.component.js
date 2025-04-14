class ButtonComponent {
    constructor(button) {
        this.$node = button instanceof HTMLElement ? button : document.querySelector(button)
        this.text = this.$node.textContent.trim()
        this.style = this.$node.style.transition
    }

    setPreloaderState(type = 'white') {
        this.$node.classList.add('buton_hidden-text')
        this.$node.style.transition = ''
        if (type === 'white') {
            this.$node.innerHTML += '<div class="loader loader_white"></div>'
        } else {
            this.$node.innerHTML += '<div class="loader"></div>'
        }
        this.$node.disabled = true
    }

    setTextState(text = this.text) {
        this.$node.style.transition = this.style
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