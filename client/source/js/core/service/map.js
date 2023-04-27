import '../modules/ymaps.js'

export default function renderMap() {
    ymaps.ready(function () {
        const myMap = new ymaps.Map(
                'map',
                {
                    center: [47.227929, 39.611513],
                    zoom: 14,
                    controls: ['zoomControl', 'zoomControl', 'fullscreenControl']
                },
                {
                    searchControlProvider: 'yandex#search'
                }
            ),
            myPlacemark = new ymaps.Placemark([47.227929, 39.611513], {
                balloonContentHeader: 'Адрес нашего офиса',
                balloonContentBody: 'ул. 1-й км Автодороги Ростов-Новошахтинск, 3-й проезд, стр. 7/12. Территория \'Спектр\'',
                balloonContentFooter: '',
                hintContent: 'Наш адрес'
            })

        myMap.geoObjects.add(myPlacemark)
    })

}

