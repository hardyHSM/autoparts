export const template = `
    <button class="page-popup__close" data-close></button>
    <div class="page-popup__container">
        
    </div>
`


export const states = {
    loginEmail:
        `
            <h2 class="page-popup__title">Вход на сайт</h2>
            <div class="page-popup__errors" data-errors>
            </div>
            <form >
                <div class="page-popup__block">
                    <div class="entry-input">
                        <input type="email"  name="email" class="page-popup__input entry-input__field" placeholder="E-mail" data-email/>
                    </div>
                </div>
                <div>
                    <div class="entry-input">
                        <input type="password" name="password" autocomplete="off" class="page-popup__input entry-input__field" placeholder="Пароль" data-pass/>
                    </div>
                    <button type="button" class="page-popup__link page-popup__link-forget" data-forget-pass tabindex="-1">Забыли пароль?</button>
                </div>
                <button class="page-popup__button button button_accent" type="submit" data-login-submit autofocus>Войти</button>
            </form>
            <div class="page-popup__registration">
                <a href="/reg" class="page-popup__link-reg">Регистрация</a>
            </div>
       `,
    forgetPass:
        `
            <h2 class="page-popup__title">Смена Пароля</h2>
            <div class="page-popup__descr">Ссылка на смену пароля будет отправлена на email, даже если Вы введёте номер,
                используемый для авторизации
            </div>
            <div class="page-popup__errors" data-errors>
    
            </div>
            <form >
                <div class="page-popup__block">
                    <div class="entry-input">
                        <input type="email" autocomplete="off" class="page-popup__input entry-input__field" placeholder="E-mail" data-email/>
                    </div>
                </div>
                <button class="page-popup__button button button_accent page-popup__button-pass" type="submit" data-login-submit>Отправить письмо</button>
            </form>
            <button class="page-popup__link-remember" data-remember-pass>Вспомнил пароль</button>
         `,
    sendRecoveryMail:
        `
            <h2 class="page-popup__title">Смена Пароля</h2>
            <div class="page-popup__descr" data-info>Ссылка для смены пароля отправлена на почту <b></b></div>
            <a href="#" class="page-popup__button button button_accent page-popup__button-close" data-close>Закрыть</a>
        `
}