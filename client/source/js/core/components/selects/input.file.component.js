import ModalComponent from '../modal.component.js'

class InputFileComponent {
    constructor(config) {
        this.$root = document.querySelector(config.root)
        this.$input = this.$root.querySelector('[data-file-input]')
        this.$image = this.$root.querySelector('img')
        this.$deleteButton = document.querySelector('[data-file-delete]')
        this.allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
        this.file = null
    }

    init() {
        this.$input.addEventListener('change', ({ target }) => {
            const file = target.files[0]
            if (!file) return
            if (!this.allowedTypes.includes(file.type)) {
                new ModalComponent({
                    template: 'default',
                    title: 'Загрузка изображения',
                    text: `Данный формат не разрешён!`
                }).create()
                return
            }
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.addEventListener('load', ({ target }) => {
                this.$image.src = target.result
                this.file = target.result
            })

        })
        this.$deleteButton.addEventListener('click', () => {
            this.$image.src = '/img/assets/no_photo.jpg'
            this.file = 'delete'
        })
    }
}

export default InputFileComponent