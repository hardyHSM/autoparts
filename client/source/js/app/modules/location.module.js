import ModuleCore from '../../core/modules/module.core.js'

class LocationModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.state = true
        this.locationList = null
        this.onChoose = config.onChoose || new Function
        this.root = config.root
        this.defaultValue = 'г. Луганск'
        this.defaultDataset = null
    }

    async loadData() {
        try {
            this.locationList = await this.apiService.useRequest(this.router.locationsLink)
        } catch (e) {
            console.error(e.message)
        }
    }
    init() {
        super.init(() => {
            this.start()
        })
    }

    start() {
        this.defaultDataset = this.locationList.find(location => location.name === this.defaultValue)._id
        this.$root = document.querySelector(this.root)
        this.$cityDrop = this.$root.querySelector('.page-address__drop')
        this.$handler = this.$root.querySelector('[data-location-change]')
        this.$addressCurrent = this.$root.querySelector('.page-address__current')
        this.$cityCurrent = this.$root.querySelector('.page-address__current-city')
        this.$pick = this.$root.querySelector('.pick-address')
        this.$searchInput = this.$root.querySelector('.pick-address__input')
        this.$pickList = this.$root.querySelector('.pick-address__list')
        this.$buttonPlace = this.$root.querySelector('.page-address__buttons')
        this.initAuthData()
        this.registerInitHandlers()
    }

    registerInitHandlers() {
        this.$handler.addEventListener('click', () => {
            this.showLocationChoose()
        })
        document.addEventListener('mousedown', e => {
            if (this.state && !e.target.closest('.page-address')) {
                this.removeDrop()
                this.hideLocationList()
            }
        })
    }

    initAuthData() {
        if(this.auth) {
            let name = this.auth.isAuth ?
                this.auth.userData?.location?.name :
                localStorage.getItem('location')
            this.setLocationDisplay(name)
        }
    }

    setLocationDisplay(text) {
        this.renderCityLabel(text || this.defaultValue)
        this.renderCurrentCity(text || this.defaultValue)
    }

    async setUserLocation(text, id) {
        const idLocation = id?.trim() || null
        if (this.auth.isAuth) {
            try {
                await this.apiService.useRequest(this.router.locationsLink, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: idLocation
                    })
                })
            } catch (e) {
                console.log(e.message)
            }
        } else {
            if (text) {
                localStorage.setItem('location', text)
            } else {
                localStorage.removeItem('location')
            }
        }
    }

    renderCityLabel(text) {
        this.$addressCurrent.textContent = text
    }

    renderCurrentCity(text) {
        this.$cityCurrent.innerHTML = text
    }

    showSelectionButtons() {
        this.$buttonPlace.innerHTML = '<button type="button" class=\'page-address__yes button button_mini button_backwards-accent button_fat\'>да</button><button type="button" class=\'page-address__no button button_mini  button_backwards-negative button_fat\'>нет</button>'
        this.$cityButtonYes = document.querySelector('.page-address__yes')
        this.$cityButtonNo = document.querySelector('.page-address__no')
    }

    showLocationChoose() {
        this.showDrop()
        this.$buttonPlace.innerHTML = '<button type="button" class=\'page-address__change button button_mini button_backwards-neutral button_fat\'>Изменить</button>'

        document.querySelector('.page-address__change').addEventListener('click', e => {
            e.preventDefault()
            this.$pick.classList.add('pick-address_active')
            this.searchLocation()
        })
    }

    showLocationList() {
        this.$pick.classList.add('pick-address_active')
    }

    hideLocationList() {
        this.$pick.classList.remove('pick-address_active')
    }

    showDrop() {
        this.state = true
        this.$cityDrop.classList.add('page-address__drop_active')
    }

    removeDrop() {
        this.state = false
        this.$cityDrop.classList.remove('page-address__drop_active')
    }

    searchLocation() {
        this.$searchInput.value = ''
        this.$pickList.innerHTML = ''
        this.$searchInput.addEventListener('input', () => {
            this.eventInput()
        })
    }

    eventInput() {
        let text = this.$searchInput.value
        if (text.length === 0) {
            this.$pickList.innerHTML = ''
            return
        }
        const foundItems = []
        this.locationList.forEach(item => {
            let region = item.name
            if (foundItems.length < 5) {
                if (region.indexOf(text) >= 0) {
                    const search = text
                    const replaceWith = `<b>${text}</b>`

                    const selectedText = region.split(search).join(replaceWith)
                    foundItems.push({
                        text: selectedText,
                        id: item._id
                    })
                }
            }
        })
        this.$pickList.innerHTML = ''
        if (!foundItems.length) {
            this.$pickList.innerHTML += `<li class="pick-address__item pick-address__item_notfound">Ничего не найдено</li>`
        } else {
            foundItems.forEach(item => {
                this.$pickList.innerHTML += `<li class="pick-address__item" data-id="${item.id}" tabindex="0">${item.text}</li>`
            })
            this.registerHandlersForPickItems()
        }
    }

    registerHandlersForPickItems() {
        this.$pickList.querySelectorAll('.pick-address__item').forEach(element => {
            element.addEventListener('click', () => {
                this.onPick(element.textContent, element.dataset.id)
            })
        })
    }

    onPick(text, id) {
        this.$pick.classList.remove('pick-address_active')
        this.renderCurrentCity(`${text} ?`)
        this.$pickList.innerHTML = ''

        this.showSelectionButtons()

        this.$cityButtonNo.addEventListener('click', e => {
            this.setLocationDisplay()
            this.showLocationList()
            if(this.auth) this.setUserLocation(this.defaultValue, this.defaultDataset)
            this.onChoose(this.defaultValue, this.defaultDataset)
        })
        this.$cityButtonYes.addEventListener('click', e => {
            const value = this.$cityCurrent.textContent.replace('?', '').trim()
            this.removeDrop()
            this.renderCityLabel(value)
            this.state = false
            if(this.auth) this.setUserLocation(text, id)
            this.onChoose(value, id)
        })
    }
}

export default LocationModule