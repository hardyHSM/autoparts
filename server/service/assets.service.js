import sharp from 'sharp'
import path from 'path'
import { v4 } from 'uuid'

class AssetsService {
    createImage(blob) {
        const type = blob.split(';')[0].split('/')[1]
        const uri = blob.split(';base64,').pop()
        const data = Buffer.from(uri, 'base64')
        const picName = `${v4()}.${type}`

        return sharp(data)
        .png({ palette: true, compressionLevel: 7 })
        .ensureAlpha()
        .jpeg({ mozjpeg: true, quality: 75 })
        .webp({ lossless: true, quality: 60, alphaQuality: 80, force: false })
        .toFile(path.join(__basedir, 'server', 'assets', picName))
        .then(() => {
            return `assets/${picName}`
        })
    }
}


const assetsService = new AssetsService()
export default assetsService