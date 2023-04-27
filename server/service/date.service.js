export default class DateService {
    static nextDay() {
        const dt = new Date()
        return dt.setDate(dt.getDate() + 1) / 1000
    }
}
