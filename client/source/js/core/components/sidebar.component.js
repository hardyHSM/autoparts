class SidebarComponent {
    constructor({ root, buttonOpen, buttonClose, overlay }) {
        this.$node = document.querySelector(root)
        this.$buttonOpen = document.querySelector(buttonOpen)
        this.$buttonClose = document.querySelector(buttonClose)
        this.$overlay = document.querySelector(overlay)
        this.isOpen = false
    }
    init() {
        this.$buttonOpen.addEventListener('click', () => {
            this.open()
        })

        this.$buttonClose.addEventListener('click', () => {
            this.close()
        })

        document.body.addEventListener('click', e => {
            if (e.target.closest('.page-overlay')) {
                this.close()
            }
        })
        window.addEventListener('resize', () => {
            if(this.isOpen && window.innerWidth > 1280) {
                this.close()
            }
        })
    }
    close() {
        this.$overlay.classList.remove('page-overlay_active')
        this.$node.classList.remove('page-sidebar_active')
        this.isOpen = false
    }
    open() {
        this.$overlay.classList.add('page-overlay_active')
        this.$node.classList.add('page-sidebar_active')
        this.isOpen = true
    }
}

export default SidebarComponent