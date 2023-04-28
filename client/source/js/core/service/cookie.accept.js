window.addEventListener('load', () => {
    const $cookieInfo = document.createElement('div');
    $cookieInfo.classList.add('cookie-info')

    if(!localStorage.getItem('cookie-warning')) {
        $cookieInfo.innerHTML = `
        <p class="cookie-info__text">Этот сайт использует cookie для хранения данных. Продолжая использовать сайт, Вы даёте согласие на использование данной технологии.</p>
        <button class="cookie-info__button"></button>
        `;
        document.body.appendChild($cookieInfo)
        document.querySelector('.cookie-info__button').addEventListener('click', () => {
            $cookieInfo.remove();
            localStorage.setItem('cookie-warning', true)
        });
    }
})