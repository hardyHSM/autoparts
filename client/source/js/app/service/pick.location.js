import scrollToTop from '../utils/utils.js'
import { locationModule } from '../common.modules.js'

export function pickLocationChange(onchange) {
    locationModule.onChoose = (name, id) => {
        onchange(name, id)
    }
    document.querySelector('[data-location-order]').addEventListener('click', (e) => {
        scrollToTop('#top-element')
        locationModule.showLocationChoose()
    })
}