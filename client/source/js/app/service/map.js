import './ymaps.js'

export default function renderMap() {
    ymaps.ready(function () {
        const myMap = new ymaps.Map(
                'map',
                {
                    center: [48.565550, 39.378953],
                    zoom: 16,
                    controls: ['zoomControl', 'zoomControl', 'fullscreenControl'],
                },
                {
                    searchControlProvider: 'yandex#search'
                }
            ),
            myPlacemark = new ymaps.Placemark([48.565550, 39.378953], {
                balloonContentHeader: 'Адрес нашего офиса',
                balloonContentBody: '',
                balloonContentFooter: '',
                hintContent: 'Наш адрес'
            })
        myMap.behaviors.enable('scrollZoom');
        myMap.geoObjects.add(myPlacemark)
    })

}

