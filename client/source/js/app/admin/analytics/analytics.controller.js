import Highcharts from 'highcharts'
import MouseWheelZoom from 'highcharts/modules/mouse-wheel-zoom.js'
import analyticsModel from './analytics.model.js'
import AirDatepicker from 'air-datepicker'
import { apiService, router } from '../../common.modules.js'
import AnalyticsModule from '../../modules/analytics.module.js'


class AnalyticsController {
    async middleware() {
        return await analyticsModel.get()
    }

    async functional(_, data, module) {
        new AnalyticsModule({
            data,
            router,
            apiService,
            selector: '[data-analytics-root]'
        }).init()
    }
}


const analyticsController = new AnalyticsController()


export default analyticsController