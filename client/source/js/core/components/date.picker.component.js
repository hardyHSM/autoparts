import AirDatepicker from 'air-datepicker'
import { router } from '../../app/common.modules.js'


class DatePickerComponent {
    constructor({ root, initState, minDate, onChange, router, singleDate }) {
        this.root = root
        this.router = router
        this.minDate = minDate
        this.initState = initState
        this.singleDate = singleDate || false
        this.onChange = onChange.bind(this) || new Function
    }
    init() {
        let selectedRange = null

        if(this.initState[0] === this.initState[1]) {
            this.initState.pop()
        }

        let picker

        picker = new AirDatepicker(this.root, {
            dateFormat: 'dd MMMM yyyy',
            language: 'ru',
            isMobile: true,
            range: true,
            minDate: this.minDate,
            multipleDatesSeparator: ' - ',
            maxDate: new Date(),
            selectedDates: this.initState,
            buttons: this.createButtons(),
            onSelect: (dp) => {
                if(this.singleDate && dp.datepicker.selectedDates.length === 1) {
                    selectedRange = [dp.datepicker.selectedDates[0], dp.datepicker.selectedDates[0]]
                } else if(dp.datepicker.selectedDates.length === 2) {
                    selectedRange = dp.datepicker.selectedDates
                } else {
                    selectedRange = null
                }
            },
            onHide: (isFinished) => {
                if (isFinished && selectedRange) {
                    this.onChange(selectedRange, picker)
                }
            }
        })
    }

    createButtons() {
        const now = new Date()
        const buttons = [
            {
                content: 'Последние 7 дней',
                onClick: (dp) => {
                    const range = [
                        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime(),
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            {
                content: 'Последние 30 дней',
                onClick: (dp) => {
                    const range = [
                        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).getTime(),
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            {
                content: 'Прошлый месяц',
                onClick: (dp) => {
                    const range = [
                        new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
                        new Date(now.getFullYear(), now.getMonth(), 0).getTime()
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            {
                content: 'За полгода',
                onClick: (dp) => {
                    const range = [
                        new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).getTime(),
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            {
                content: 'За год',
                onClick: (dp) => {
                    const range = [
                        new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime(),
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            {
                content: 'За всё время',
                onClick: (dp) => {
                    const range = [
                        this.minDate,
                        now
                    ]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            },
            'clear']

        if(this.singleDate) {
            buttons.unshift({
                content: 'За сегодня',
                onClick: (dp) => {
                    const range = [new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(), new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()]
                    dp.clear()
                    dp.selectDate(range)
                    dp.hide()
                }
            })
        }
        return buttons
    }

    static getRangeParams(min) {
        const now = new Date()
        const minimumTimeStamp = min || new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime()
        const range = []
        if (router.getParam('from')) {
            range[0] = +router.getParam('from')
        } else {
            range[0] = new Date(minimumTimeStamp).getTime()
        }

        if (router.getParam('to')) {
            range[1] = +router.getParam('to')
        } else {
            range[1] = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        }
        return range
    }

    static changeParams(data) {
        router.addParams('from', data[0])
        router.addParams('to', data[1])
        router.redirectUrlState()
    }
}

export default DatePickerComponent