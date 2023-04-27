class SidebarComponent {
    constructor({ root, buttonOpen, buttonClose, overlay }) {
        this.node = document.querySelector(root)
        this.buttonOpen = document.querySelector(buttonOpen)
        this.buttonClose = document.querySelector(buttonClose)
        this.overlay = document.querySelector(overlay)
    }
    init() {

        this.buttonOpen.addEventListener('click', () => {
            this.overlay.classList.add('page-overlay_active')
            this.node.classList.add('page-sidebar_active')
        })

        this.buttonClose.addEventListener('click', () => {
            this.overlay.classList.remove('page-overlay_active')
            this.node.classList.remove('page-sidebar_active')
        })

        document.body.addEventListener('click', e => {
            if (e.target.closest('.page-overlay')) {
                this.node.classList.remove('page-sidebar_active')
            }
        })
    }
}

export default SidebarComponent