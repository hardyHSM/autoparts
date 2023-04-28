export default function ScrollToTop(query) {
    document.querySelector(query).scrollIntoView(
        {
            behavior: 'smooth',
            top: true,
            block: 'center'
        }
    )
}