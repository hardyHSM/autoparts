import Swiper, { Navigation } from 'swiper'

function touchCapable() {
    return (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch) ||
        navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0
    )
}


window.addEventListener('load', () => {
    new Swiper('.intro-slider', {
        modules: [Navigation],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        simulateTouch: true,
        breakpoints: {
            0: {
                allowTouchMove: false
            },
            640: {
                allowTouchMove: true
            }
        }
    })
})
