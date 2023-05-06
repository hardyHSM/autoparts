import { escapeRegExp } from './utils.js'

export const escapeRegExpValidator = (value) => {
    value = escapeRegExp(value)
    return value
}