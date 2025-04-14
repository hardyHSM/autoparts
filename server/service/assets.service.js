import sharp from 'sharp'
import path from 'path'
import { v4 } from 'uuid'
import fs from 'fs/promises'
import { JSDOM } from 'jsdom'


class AssetsService {
    createImage(blob) {
        const type = blob.split(';')[0].split('/')[1]
        const uri = blob.split(';base64,').pop()
        const data = Buffer.from(uri, 'base64')
        const picName = `${v4()}.${type}`

        return sharp(data)
        .png({ palette: true, compressionLevel: 7 })
        .ensureAlpha()
        .flatten({ background: '#ffffff' })
        .jpeg({ mozjpeg: true, quality: 75 })
        .webp({ lossless: true, quality: 60, alphaQuality: 80, force: false })
        .toFile(path.join(__basedir, 'server', 'assets', picName))
        .then(() => {
            return `assets/${picName}`
        })
    }

    async getFile(filePath) {
        return await fs.readFile(filePath, 'utf-8')
    }

    async createFile(filePath, content) {
        return await fs.writeFile(filePath, content, 'utf-8');
    }

    convertToDOM(html) {
        return new JSDOM(html)
    }
}


const assetsService = new AssetsService()
export default assetsService