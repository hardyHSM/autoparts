export default function ScrollToTop(query) {
    document.querySelector(query).scrollIntoView(
        {
            behavior: 'auto',
            top: true,
            block: 'center'
        }
    )
}