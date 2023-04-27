window.addEventListener('load', () => {
    const button_menu = document.querySelector('.button-menu')
    const overlay = document.querySelector('.page-overlay')
    const header_nav = document.querySelector('.page-header__nav')
    const page_header = document.querySelector('.page-header')

    button_menu.addEventListener('click', () => {
        header_nav.classList.toggle('page-header__nav_active')
        overlay.classList.toggle('page-overlay_active')
        button_menu.classList.toggle('button-menu_active')
        page_header.classList.toggle('page-header_active')
    })
})