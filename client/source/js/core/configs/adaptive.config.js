const config = [
    {
        what: '.page-header__tel',
        where: '.page-header__bottom > .page-content',
        breakpoints: [
            {
                key: 'less',
                value: '960'
            }
        ],
        pos: 'beforeend'
    },
    {
        what: '.page-header__tel',
        where: '.page-header__row-top',
        breakpoints: [
            {
                key: 'more',
                value: '960'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.page-header__nav',
        where: '.page-header__content',
        breakpoints: [
            {
                key: 'less',
                value: '1280'
            }
        ],
        pos: 'afterend'
    },
    {
        what: '.page-header__nav',
        where: '.page-header__tel',
        breakpoints: [
            {
                key: 'more',
                value: '1280'
            }
        ],
        pos: 'afterend'
    },
    {
        what: '.page-header__search-wrapper',
        where: '.page-header__bottom > .page-content',
        breakpoints: [
            {
                key: 'less',
                value: '960'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.page-header__search-wrapper',
        where: '.page-header__row-top',
        breakpoints: [
            {
                key: 'less',
                value: '640'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.page-header__search-wrapper',
        where: '.page-header__row_last',
        breakpoints: [
            {
                key: 'more',
                value: '960'
            }
        ],
        pos: 'beforeend'
    },
    {
        what: '.button-catalog',
        where: '.page-header__bottom > .page-content',
        breakpoints: [
            {
                key: 'less',
                value: '960'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.button-catalog',
        where: '.page-header__column',
        breakpoints: [
            {
                key: 'more',
                value: '960'
            }
        ],
        pos: 'beforeend'
    },
    {
        what: '.button-catalog',
        where: '.page-header__bottom > .page-content',
        breakpoints: [
            {
                key: 'less',
                value: '960'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.page-header__address',
        where: '.page-header__bottom  > .page-content',
        breakpoints: [
            {
                key: 'less',
                value: '640'
            }
        ],
        pos: 'afterbegin'
    },
    {
        what: '.page-header__address',
        where: '.page-header__column',
        breakpoints: [
            {
                key: 'more',
                value: '640'
            }
        ],
        pos: 'afterbegin'
    }
]

export default config