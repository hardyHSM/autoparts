import pagesModel from '../models/pages.model.js'
import ApiError from './error.service.js'
import { decodeString, validateObject } from '../utils/utils.js'
import { check } from 'express-validator'
import path from 'path'
import assetsService from './assets.service.js'
import he from 'he'
import PagesModel from '../models/pages.model.js'
import AssetsService from './assets.service.js'
import { minify } from 'html-minifier-terser'
import fs from 'fs/promises'


const areKeysUnique = (array, keys) => {
    return keys.every(key => {
        const values = array.map(item => item[key])
        return values.length === new Set(values).size
    })
}


const validatePage = async (page) => {
    return await validateObject(page, [
        check('inHeader').isBoolean().withMessage('Значение inHeader, должно содержать либо true, либо false'),
        check('inBottom').isBoolean().withMessage('Значение inBottom, должно содержать либо true, либо false'),
        check('name').escape().trim().matches(/^[А-Яа-яЁё]+(\s[А-Яа-яЁё]+)*$/).withMessage('Название страницы должно содержать только русские буквы'),
        check('link').escape().trim().matches(/^[A-Za-z0-9_\-\.]+$/).withMessage('Ссылка на страницу должна содержать только латинские буквы без пробелов'),
        check('order').isInt()
    ])
}

class PagesService {
    async reposition(adminPages) {
        const databasePages = await pagesModel.find()
        if (!areKeysUnique(adminPages, ['name', 'link'])) {
            throw ApiError.BadRequest('Значения ссылки и названия страницы должны быть уникальны!')
        }

        for ( const page of adminPages ) {
            const dataBasePage = databasePages.find(p => p.id === page.id)
            if (!dataBasePage) {
                throw ApiError.BadRequest('Страница с таким идентификатором не найдена, что-то пошло не так!')
            }
            await validatePage(page)
            dataBasePage.name = page.name
            dataBasePage.link = page.link
            dataBasePage.order = page.order
            dataBasePage.inHeader = page.inHeader
            dataBasePage.inBottom = page.inBottom

            await dataBasePage.save()

        }
        return {
            message: 'Изменение контента страницы произошло успешно.'
        }
    }

    async getPage(id) {
        const page = await PagesModel.findById(id)
        if (!page) {
            throw ApiError.BadRequest('Страницы с таким идентификатором не существует.')
        }
        const file = await AssetsService.getFile(path.join(__server, 'pages', page.content))
        let dom = assetsService.convertToDOM(file)
        const data = page.toObject()
        data.classList = dom.window.document.querySelector('#page-section').className
        data.content = dom.window.document.querySelector('#page-section').innerHTML
        return data
    }

    async addPage(page) {
        const [existsPageName, existsPageLink, order] = await Promise.all([
            pagesModel.findOne({ name: page.name }).exec(),
            pagesModel.findOne({ link: page.link }).exec(),
            pagesModel.countDocuments()
        ])
        if (existsPageLink || existsPageName) {
            throw ApiError.BadRequest('Значения ссылки и названия страницы должны быть уникальны!')
        }
        const pageName = `${Date.now()}-${page.link}.html`

        await this.proccessFile(
            path.join(__server, 'html', 'template.html'),
            page.content,
            page.name,
            path.join(__server, 'pages', pageName)
        )
        await pagesModel.create({
            name: page.name,
            link: page.link,
            inHeader: page.inHeader,
            inBottom: page.inBottom,
            order: order,
            content: pageName
        })
    }

    async proccessFile(from, content, name, to) {

        const file = await assetsService.getFile(from)
        const dom = assetsService.convertToDOM(file)
        dom.window.document.querySelector('#page-section').innerHTML = he.decode(content.body)
        dom.window.document.querySelector('#page-section').className = ''
        dom.window.document.querySelector('#page-section').classList.add('page-section', ...content.classList)
        dom.window.document.title = name
        const modifiedHtml = dom.serialize()
        const minifiedHtml = await minify(modifiedHtml, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyCSS: true,
            minifyJS: true
        })
        await assetsService.createFile(to, minifiedHtml)
    }

    async changePage(data) {
        const page = await PagesModel.findById(data.id)
        const [existsPageName, existsPageLink] = await Promise.all([
            pagesModel.findOne({ name: page.name }).exec(),
            pagesModel.findOne({ link: page.link }).exec()
        ])
        if (!existsPageLink._id.equals(page._id) || !existsPageName._id.equals(page._id)) {
            throw ApiError.BadRequest('Такая ссылка либо названия страницы есть уже у другой страницы.')
        }
        await this.proccessFile(
            path.join(__server, 'pages', page.content),
            data.content,
            data.name,
            path.join(__server, 'pages', page.content)
        )
        page.name = data.name
        page.link = data.link
        page.inHeader = data.inHeader
        page.inBottom = data.inBottom
        await page.save()
    }

    async deletePage(id) {
        const page = await pagesModel.findByIdAndDelete(id)
        if (!page) {
            throw ApiError.BadRequest('Страница не найдена!')
        }
        await fs.unlink(path.join(__server, 'pages', page.content))
    }
}

const pagesService = new PagesService()


export default pagesService