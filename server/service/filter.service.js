import FiltersModel from '../models/filters.model.js'

class FilterService {
    async parseProductsToFilters(products) {
        try {
            const params = {
                maker: [],
                attributes: {}
            }
            const start = Date.now()
            const settings = await FiltersModel.find().lean()

            for ( const product of products ) {
                if (!params.maker.includes(product.maker)) {
                    params.maker.push(product.maker)
                }
                for ( const attribute in product.attributes ) {
                    if (!params.attributes.hasOwnProperty(attribute.trim())) {

                        params.attributes[attribute] = {
                            type: settings.find(s => s.name === attribute)?.type || 'false',
                            list: []
                        }
                    }
                    if (Array.isArray(product.attributes[attribute])) {
                        product.attributes[attribute].forEach(item => {
                            if (!params.attributes[attribute].list.includes(item.trim())) {
                                params.attributes[attribute].list.push(item.trim())
                            }
                        })
                    } else {
                        if (!params.attributes[attribute].list.includes(product.attributes[attribute.trim()])) {
                            params.attributes[attribute].list.push(product.attributes[attribute.trim()])
                        }
                    }
                }
            }
            return params
        } catch (e) {
            console.log(e)
            return null
        }
    }

    parseFilterQuery(data) {
        try {
            const result = {}
            for ( const key of Object.keys(data) ) {
                if (key === 'Марка') {
                    result['maker'] = {
                        $in: data[key].split(',')
                    }
                } else if (key === 'name') {
                    result['title'] = {
                        $regex: new RegExp(`${data[key]}`, 'gi')
                    }
                } else {
                    result[`attributes.${key}`] = {
                        $in: data[key].split(',')
                    }
                }
            }
            return result
        } catch (e) {
            return null
        }
    }

}

const filterService = new FilterService()

export default filterService