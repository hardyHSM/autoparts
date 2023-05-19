import scrollToTop from '../utils/utils.js'
import { locationModule } from '../common.modules.js'

export function pickLocationChange(onchange) {
    locationModule.onChooseCallback = (name, id) => {
        onchange(name, id)
    }
    document.querySelector('.pick-location__change').addEventListener('click', (e) => {
        scrollToTop('#top-element')
        locationModule.showLocationChoose()
    })
}