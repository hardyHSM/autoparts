import LocationsModel from '../models/locations.model.js'
import ApiError from '../service/error.service.js'
import UsersModel from '../models/users.model.js'

class LocationController {
    async getLocations(req, res, next) {
        try {
            const locations = await LocationsModel.find()
            res.json(locations)
        } catch (e) {
            next(e)
        }
    }

    async getLocationById(req, res, next) {
        try {
            const location = await LocationsModel.findById(req.id)
            if (!location) {
                next(ApiError.BadRequest('Локация не найдена'))
            }
            res.json(location)
        } catch (e) {
            next(e)
        }
    }

    async setLocation(req, res, next) {
        try {
            const { id: idUser } = req.user
            const { id: idLocation } = req.body

            const location = await LocationsModel.findById(idLocation)
            if (!location) {
                next(ApiError.BadRequest('Локация не найдена'))
            }
            const user = await UsersModel.findById(idUser)
            user.location = location
            user.notifications.push({
                messageType: 'success',
                message: `Вы изменили свою локацию на ${location.name}`,
                createdTime: new Date()
            })


            await user.save()
            res.json(location)
        } catch (e) {
            next(e)
        }
    }
}

const locationController = new LocationController()

export default locationController