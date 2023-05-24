export function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function decodeString(text) {
    if (!text) return null
    return text
    .replace(/\&amp\;/g, '&')
    .replace(/\&lt\;/g, '<')
    .replace(/\&gt\;/g, '>')
    .replace(/\&quot\;/g, '"')
    .replace(/\&\#039\;/g, '\'')
}