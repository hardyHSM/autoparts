const search = document.querySelector('.page-search__input')
const searchIcon = document.querySelector('.page-search__icon')
const searchWrapper = document.querySelector('.page-search')
const searchButton = document.querySelector('.page-search__button')
const overlay = document.querySelector('.page-overlay')
const pageTel = document.querySelector('.page-header__tel')
const buttonMenu = document.querySelector('.button-menu')
const headerNav  = document.querySelector('.page-header__nav')
const pageHeader = document.querySelector('.page-header')
const pageFilter = document.querySelector('.page-filter')



document.body.addEventListener('click', e => {
    if (e.target.closest('.page-overlay')) {
        buttonMenu.classList.remove('button-menu_active')
        pageHeader.classList.remove('page-header_active')
        headerNav.classList.remove('page-header__nav_active')
        overlay.classList.remove('page-overlay_active')
        pageTel.classList.remove('page-header__tel_active')
    }
})

window.addEventListener('resize', () => {
    if (headerNav.classList.contains('page-header__nav_active') && window.innerWidth > 960) {
        overlay.classList.remove('page-overlay_active')
        pageHeader.classList.remove('page-header_active')
    }
    if (headerNav.classList.contains('page-header__nav_active') && window.innerWidth < 960) {
        overlay.classList.add('page-overlay_active')
        pageHeader.classList.add('page-header_active')
    }
    if (window.innerWidth < 960 && window.innerWidth > 640 && searchWrapper.classList.contains('page-search_active')) {
        pageTel.classList.add('page-header__tel_active')
    }
    if (pageFilter) {
        if (window.innerWidth > 1280 && pageFilter.classList.contains('page-filter_active')) {
            pageFilter.classList.remove('page-filter_active')
            overlay.classList.remove('page-overlay_active')
        }
    }
})
