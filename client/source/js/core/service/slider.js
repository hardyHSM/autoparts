import Swiper, { Navigation } from 'swiper'


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
