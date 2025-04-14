import ModuleCore from '../../core/modules/module.core.js'
import Highcharts from 'highcharts'
import AirDatepicker from 'air-datepicker'
import { html } from 'code-tag'
import { formatNumber, getDaysLabel, getHoursLabel, getMinutesLabel, getTimeLabel } from '../utils/utils.js'
import DatePickerComponent from '../../core/components/date.picker.component.js'
import { router } from '../common.modules.js'

const statusConfig = {
    'Сделка завершена': '#008000',
    'В процессе': '#244993',
    'Отменён': '#ff0000',
    'Не обработан': '#ffa500'
}


class AnalyticsModule extends ModuleCore {
    constructor(config) {
        super(config)
        this.data = config.data
        this.onChange = config.onChange || new Function
    }

    init() {
        this.registerHandlers()
        this.initDatePicker()
        DatePickerComponent.changeParams(DatePickerComponent.getRangeParams())
        this.changeState()
    }

    setState() {
        this.renderState()
        this.initGraphSales()
        this.initGraphOrders()
        this.initGraphCategory()
        this.initGraphSubcategory()
        this.initGraphSalesStatus()
        this.renderProducts()
    }

    renderProducts() {
        return html`
            <ul class="analytics-legend__list analytics-legend__list_products" data-legend-list>
                <li class="analytics-legend__row analytics-legend__row_head">
                    <span class="analytics-legend__item analytics-legend__item_image"></span>
                    <span class="analytics-legend__item">Товар</span>
                    <span class="analytics-legend__item">На складе</span>
                    <span class="analytics-legend__item">Цена</span>
                    <span class="analytics-legend__item">Продано</span>
                    <span class="analytics-legend__item">Выручка</span>
                </li>
                ${this.analytics.popularProducts.reduce((acc, { product, totalSold, totalRevenue }) => {
                    return acc + html`
                        <li class="analytics-legend__row">
                            <div class="analytics-legend__item analytics-legend__item_image">
                                <img src="/${product.image || 'img/assets/no_photo.jpg'}" alt="${product.title}">
                            </div>
                            <div class="analytics-legend__item analytics-legend__item_wide">
                                <div class="analytics-legend__wrapper">
                                    <div class="analytics-legend__header">
                                        <a href="/products/${product._id}" class="analytics-legend__title">${product.maker}</a>
                                    </div>
                                    <p class="analytics-legend__descr">${product.title}</p>
                                </div>
                            </div>
                            <span class="analytics-legend__item analytics-legend__item_count">${product.count}&nbsp;шт.</span>
                            <div class="analytics-legend__item">
                                <span class="price" data-price>
                                   ${product.price}&nbsp;₽
                                </span>
                            </div>
                            <span class="analytics-legend__item">${totalSold}&nbsp;шт.</span>
                            <div class="analytics-legend__item">
                                <strong class="analytics-legend__total">
                                    ${formatNumber(totalRevenue)}&nbsp;₽
                                </strong>
                            </div>
                        </li>
                    `
                }, '')}
                ${this.analytics.popularProducts.length > 5 ?
                    `<li class="analytics-legend__row analytics-legend__row_more">
                        <button type="button" class="button button_backwards-neutral button_mini analytics-legend__more" data-legend-more>Показать все</button>
                    </li>`
                    : ''
                }
            </ul>
        `
    }

    registerHandlers() {
        this.$node.addEventListener('click', ({ target }) => {
            const $button = target.closest('[data-legend-more]')
            if ($button) {
                const $list = target.closest('[data-legend-list]')
                if ($list.classList.contains('analytics-legend__list_full')) {
                    $list.classList.remove('analytics-legend__list_full')
                    $button.textContent = 'Показать все'
                } else {
                    $list.classList.add('analytics-legend__list_full')
                    $button.textContent = 'Скрыть'
                }
            }
        })
    }

    fillEmptyDays() {
        const aggregatedData = this.analytics.sales
        const timestamps = aggregatedData.map(item => new Date(item.key).getTime())
        const minTimestamp = Math.min(...timestamps)
        const maxTimestamp = new Date(+DatePickerComponent.getRangeParams()[1]).getTime() + 86400000 - 1


        const dataMap = {}
        aggregatedData.forEach(item => {
            dataMap[new Date(item.key).getTime()] = item.totalSum
        })

        const oneDay = 24 * 60 * 60 * 1000
        const filledData = []
        for ( let ts = minTimestamp; ts < maxTimestamp; ts += oneDay ) {
            filledData.push([ts, dataMap[ts] || 0])
        }
        return filledData
    }

    initDatePicker() {
        new DatePickerComponent({
            root: '[data-date-select]',
            minDate: this.data.minTimestamp,
            initState: DatePickerComponent.getRangeParams(),
            onChange: (data) => {
                const parsedData = data.map(item => item.getTime())
                DatePickerComponent.changeParams(parsedData)
                this.changeState()
            }
        }).init()
    }

    initGraphSales() {
        if (this.salesChart) {
            this.salesChart.destroy()
        }
        this.salesChart = Highcharts.chart('sales-chart', {
            chart: {
                zooming: {
                    type: 'x',
                    mouseWheel: true
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                title: { text: 'Дата' }
            },
            yAxis: {
                title: {
                    text: 'Тыс. руб.'
                }
            },
            tooltip: {
                pointFormat: `Выручка: {point.y}&nbsp;₽`
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    color: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'rgb(199, 113, 243)'],
                            [0.7, 'rgb(76, 175, 254)']
                        ]
                    },
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                router.redirectToOrder(this.category)
                            }
                        }
                    }
                }
            },
            series: [{
                type: 'area',
                name: 'Выручка',
                data: this.fillEmptyDays()
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 640
                    },
                    chartOptions: {
                        yAxis: {
                            visible: false
                        }
                    }
                }]
            }
        })
    }

    initGraphOrders() {
        if (this.productsChart) {
            this.productsChart.destroy()
        }
        this.productsChart = Highcharts.chart('products-chart', {
            title: '',
            chart: {
                zooming: {
                    type: 'x',
                    mouseWheel: true
                },
                width: null,
                height: null
            },
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        'heelo'
                }
            },
            xAxis: {
                type: 'datetime',
                title: { text: 'Дата' }
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                    text: null
                }
            },
            tooltip: {
                pointFormat: `Продано: {point.y} шт.`
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                router.redirectToOrder(this.category)
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Товары',
                data: this.analytics.sales.map(({ totalCount, key }) => [
                    new Date(key).getTime(),
                    totalCount
                ])
            }]
        })
    }

    initGraphCategory() {
        if (this.categoryChart) {
            this.categoryChart.destroy()
        }
        this.categoryChart = Highcharts.chart('category-chart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true,
                type: 'pie',
                events: {
                    load: ({ target }) => {
                        const legend = target.series[0].data
                        document.querySelector('[data-category-legend]').innerHTML = this.renderLegend(legend, this.analytics.categoryStats, 'Категория')
                    }
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    center: ['50%', '50%'],
                    size: '100%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false
                }
            },
            series: [{
                name: 'Популярность',
                colorByPoint: true,
                data: this.analytics.categoryStats.map(category => {
                    return {
                        name: category.key,
                        y: +category.popularity
                    }
                })
            }]
        })
    }

    initGraphSubcategory() {
        if (this.subcategoryChart) {
            this.subcategoryChart.destroy()
        }
        this.subcategoryChart = Highcharts.chart('subcategory-chart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true,
                type: 'pie',
                events: {
                    load: ({ target }) => {
                        const legend = target.series[0].data
                        document.querySelector('[data-subcategory-legend]').innerHTML = this.renderLegend(legend, this.analytics.subcategoryStats, 'Подкатегория', 'analytics-legend__list_big', 10)
                    }
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false
                }
            },
            series: [{
                name: 'Популярность',
                colorByPoint: true,
                data: this.analytics.subcategoryStats.map(subcategory => {
                    return {
                        name: subcategory.key,
                        y: +subcategory.popularity
                    }
                })
            }]
        })
    }

    initGraphSalesStatus() {
        const data = this.analytics.statusSales
        data.list.sort((a, b) => b.percentage - a.percentage)
        if (this.graphSalesStatus) {
            this.graphSalesStatus.destroy()
        }

        this.graphSalesStatus = Highcharts.chart('sales-status-chart', {
            chart: {
                type: 'pie',
                custom: {},
                events: {
                    render() {
                        const chart = this,
                            series = chart.series[0]
                        let customLabel = chart.options.chart.custom.label

                        if (!customLabel) {
                            customLabel = chart.options.chart.custom.label =
                                chart.renderer.label(
                                    'Кол-во заказов<br/>' +
                                    `<strong>${data.total}</strong>`
                                )
                                .css({
                                    color: '#000',
                                    fontSize: '16',
                                    textAnchor: 'middle'
                                })
                                .add()
                        }

                        const x = series.center[0] + chart.plotLeft
                        const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2)

                        customLabel.attr({ x, y })
                        customLabel.css({
                            fontSize: `${series.center[2] / 12}px`
                        })
                    }
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderRadius: 8,
                    dataLabels: [{
                        enabled: false,
                        format: '{point.name}'
                    }, {
                        enabled: true,
                        distance: '-10%',
                        format: '{point.percentage:.0f}%',
                        style: {
                            fontSize: '1em'
                        }
                    }],
                    showInLegend: true
                }
            },
            series: [{
                name: 'Процент',
                colorByPoint: true,
                innerSize: '75%',
                data: data.list.map(item => {
                    return {
                        name: item.status,
                        y: item.percentage,
                        color: statusConfig[item.status]
                    }
                })
            }]
        })


    }

    createProductPath(data) {
        let str = data.key
        if (str.split(' ').length > 1) {
            return str
        }
        if (data?.category) {
            str += ' ' + data.category.toLowerCase()
        }
        return str.trim()
    }

    renderLegend(legend, stats, title, className = '', limit = 5) {
        const sortedStats = [...stats].sort((a, b) => b.popularity - a.popularity)
        return html`
            <ul class="analytics-legend__list ${className}" data-legend-list>
                <li class="analytics-legend__row">
                    <span class="analytics-legend__item">${title}</span>
                    <span class="analytics-legend__item">Выручка</span>
                    <span class="analytics-legend__item analytics-legend__item_small">Кол-во</span>
                    <span class="analytics-legend__item analytics-legend__item_small">%</span>
                </li>
                ${sortedStats.reduce((acc, item) => {
                    const { color } = legend.find(l => l.name === item.key)
                    acc += html`
                        <li class="analytics-legend__row">
                            <span class="analytics-legend__item analytics-legend__item_color">
                                <span class="analytics-legend__color" style="background-color: ${color}"></span>
                                ${this.createProductPath(item)}
                            </span>
                            <span class="analytics-legend__item">${formatNumber(item.total)}&nbsp;₽</span>
                            <span class="analytics-legend__item analytics-legend__item_small">${item.totalCount}</span>
                            <span class="analytics-legend__item analytics-legend__item_small">${Number(item.popularity).toFixed(2)}</span>
                        </li>
                    `
                    return acc
                }, '')}
                ${sortedStats.length > limit ?
                        `<li class="analytics-legend__row analytics-legend__row_more">
                            <button type="button" class="button button_backwards-neutral button_mini analytics-legend__more" data-legend-more>Показать все</button>
                        </li>`
                        : ''
                }
            </ul>
        `
    }

    renderDifference(diff, isZero = false) {
        if (diff === 0) return isZero ? `<small class="analytics-block__small"> 0% </small>` : ''
        if (diff > 0) {
            return html`
                <div class="analytics-block__rate">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#arrow-up"></use>
                    </svg>
                    <span>${diff}%</span>
                </div>
            `
        }
        if (diff < 0) {
            return html`
                <div class="analytics-block__rate analytics-block__rate_negative">
                    <svg>
                        <use xlink:href="img/svg/sprite.svg#arrow-up"></use>
                    </svg>
                    <span>${diff}%</span>
                </div>`
        }
    }

    renderState() {
        this.$node.innerHTML = html`
            <div class="analytics__row">
                <div class="analytics-block analytics-block_chart">
                    <h3 class="analytics-block__title">График продаж по сумме выручки за определенный период</h3>
                    <div class="analytics-block__body">
                        <div class="analytics-block__info analytics-legend">
                            <ul class="analytics-legend__list">
                                <li class="analytics-legend__row">
                                    <span class="analytics-legend__item">Выручка за период</span>
                                    <span class="analytics-legend__item">Средний чек</span>
                                    <span class="analytics-legend__item">Ср. кол-во товаров в заказе</span>
                                </li>
                                <li class="analytics-legend__row">
                                    <div class="analytics-legend__item">
                                        <strong class="analytics-block__count">${formatNumber(this.analytics.revenueTotal)}&nbsp;₽</strong>
                                        ${this.renderDifference(this.analytics.differenceRevenue)}
                                    </div>
                                    <div class="analytics-legend__item">
                                        <strong class="analytics-block__count">${formatNumber(this.analytics.averageTotal)}&nbsp;₽</strong>
                                        ${this.renderDifference(this.analytics.differenceAverageTotal)}
                                    </div>
                                    <div class="analytics-legend__item">
                                        <div>
                                            <strong class="analytics-block__count">${formatNumber(this.analytics.averageProductCount)}
                                            </strong>
                                            <small class="analytics-block__small"> шт.</small>
                                        </div>
                                        ${this.renderDifference(this.analytics.differenceAverageCount)}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div id="sales-chart" class="analytics__chart"></div>
                    </div>
                </div>
                <div class="analytics-block analytics-block_small analytics-block_chart">
                    <h3 class="analytics-block__title">Количество проданных товаров за период</h3>
                    <div class="analytics-block__body">
                        <div class="analytics-block__info">
                            <div class="analytics-block__state">
                                <strong class="analytics-block__count">${formatNumber(this.analytics.productsTotal)}</strong>
                                <small class="analytics-block__small"> шт.</small>
                            </div>
                            ${this.renderDifference(this.analytics.differenceProducts)}
                        </div>
                        <div id="products-chart" class="analytics__chart"></div>
                    </div>
                </div>
            </div>
            <div class="analytics__row">
                <div class="analytics-block analytics-block_piechart">
                    <h3 class="analytics-block__title">Топ категорий по количеству проданных товаров</h3>
                    <div class="analytics-block__body">
                        <div class="analytics-block__info analytics-legend" data-category-legend>

                        </div>
                        <div id="category-chart" class="analytics__chart"></div>
                    </div>
                </div>
                <div class="analytics-block analytics-block_small">
                    <h3 class="analytics-block__title">Статусы заказов</h3>
                    <div class="analytics-block__body">
                        <div id="sales-status-chart" class="analytics__chart"></div>
                    </div>
                </div>
            </div>
            <div class="analytics__row">
                <div class="analytics__column">
                    <div class="analytics__item analytics-block">
                        <h3 class="analytics-block__title">Скорость выполнения заказа</h3>
                        <ul class="analytics-legend__list">
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item important">
                                    Среднее время, которое проходит от оформления заказа до получения товара
                                    пользователем
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#info"></use>
                                    </svg>
                                </div>
                            </li>
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item">
                                    <strong class="analytics-block__count">${getTimeLabel(this.analytics.averageRunTime)}</strong>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="analytics__item analytics-block">
                        <h3 class="analytics-block__title">Прогнозирование прибыли (динамика продаж)</h3>
                        <ul class="analytics-legend__list">
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item important">
                                    Прогнозирование прибыли с учётом изменения среднего чека и изменения числа заказов
                                    за прошедший период на следующий промежуток в ${getDaysLabel(this.analytics.days)}
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#info"></use>
                                    </svg>
                                </div>
                            </li>
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item">
                                    <strong class="analytics-block__count">${formatNumber(this.analytics.potentialRevenueByProfit)}&nbsp;₽ </strong>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="analytics__item analytics-block">
                        <h3 class="analytics-block__title">Прогнозирование прибыли (статусы заказов)</h3>
                        <ul class="analytics-legend__list">
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item important">
                                    Прогнозирование прибыли на основе еще не выполненных заказов
                                    <svg>
                                        <use xlink:href="img/svg/sprite.svg#info"></use>
                                    </svg>
                                </div>
                            </li>
                            <li class="analytics-legend__row">
                                <div class="analytics-legend__item">
                                    <strong class="analytics-block__count">${formatNumber(this.analytics.potentialRevenueByStatus)}&nbsp;₽ </strong>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="analytics-block analytics-block_piechart">
                    <h3 class="analytics-block__title">Топ подкатегорий по количеству проданных товаров</h3>
                    <div class="analytics-block__body ">
                        <div class="analytics-block__info" data-subcategory-legend>

                        </div>
                        <div id="subcategory-chart" class="analytics__chart"></div>
                    </div>
                </div>
            </div>
            <div class="analytics__row">
                <div class="analytics-block">
                    <h3 class="analytics-block__title">Топ популярных товаров за выбранный период</h3>
                    <div class="analytics-block__body ">
                        <div class="analytics-block__info" data-products>
                            ${this.renderProducts()}
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    async changeState() {
        this.showPreloader()
        this.analytics = await this.apiService.useRequest(this.router.analyticsRangeLink)
        this.setState()
    }
}

export default AnalyticsModule