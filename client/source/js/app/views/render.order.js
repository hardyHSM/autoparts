import { getTotalPrice, getTotalPriceWithPromo } from '../utils/utils.js'
import { html } from 'code-tag'

export function renderOrderProducts(data) {
    return `
        <div class="order-products__list">
            ${data.products.reduce((acc, { product, count }) => {
                acc += `
                        <div class="order-products__item">
                            <div class="order-products__info">
                                <strong class="order-products__maker">
                                    ${product.maker}
                                </strong>
                                <p class="order-products__title">${product.title}</p>
                            </div>
                            <div class="order-products__price">${product.price} ₽</div>
                            <div class="order-products__count">${count} шт.</div>
                            <div class="order-products__all">${product.price * count} ₽</div>
                        </div>
                    `
                return acc
            }, '')}
        </div>
        <div class="order-products__detail">
            <strong class="order-products__title order-products__key">Сумма</strong>
            <i class="order-products__value">${getTotalPrice(data.products)} ₽</i>
        </div>
        <div class="order-products__detail">
            <strong class="order-products__title order-products__key">Промо-код</strong>
            <i class="order-products__value">${data.promo ? '-330 ₽ ' : 'Отсутствует'}</i>
        </div>
        <div class="order-products__detail">
            <strong class="order-products__title order-products__key">Итого</strong>
            <i class="order-products__value">${data.promo ? getTotalPriceWithPromo(data.products, 330) : getTotalPriceWithPromo(data.products, 0)}
                ₽</i>
        </div>
        <p class="order-products__descr">Информация о цене и наличии товара, а также о стоимости и условиях доставки
            является предварительной и будет уточнена в момент оформления заказа.</p>

    `
}

export function renderOrderFirstStage(auth) {
    const location = auth.isAuth ? (auth?.userData?.location?.name || 'г. Луганск') : (localStorage.getItem('location') || 'г. Луганск')
    return `
        <h2 class="order-form__title">Доставка</h2>
        <div class="order-form__delivery">
            <label class="order-form__radio-label radio">
                <input type="radio" name="delivery" value="false" class="radio__input" checked>
                <div class="radio__view">
                    <div class="radio__header">
                        <span class="radio__title">Самовывоз</span>
                        <span class="radio__right">0 ₽</span>
                    </div>
                    <p class="radio__descr">
                        Весь заказ будет готов к выдаче, но можно забирать и частями по мере поступления
                    </p>
                </div>
            </label>
            <label class="order-form__radio-label radio">
                <input type="radio" name="delivery" value="true" class="radio__input">
                <div class="radio__view">
                    <div class="radio__header">
                        <span class="radio__title">Курьером</span>
                        <span class="radio__right">145 ₽</span>
                    </div>
                    <p class="radio__descr">
                        Курьер доставит весь заказ по удобному вам адресу
                    </p>
                </div>
            </label>
        </div>
        <div class="order-form__location pick-location">
            <span class="pick-location__address" data-address>${location}</span>
            <button type="button" class="pick-location__change">Выбрать другой пункт</button>
        </div>
        <h2 class="order-form__title">Получатель</h2>
        <div class="form__row">
            <div class="form__item field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Имя</b>
                    <span class="field-block__req">(обязательное)</span>
                </div>
                <div class="entry-input entry-input_icon entry-input_req">
                    <input type="text" name="firstName"  placeholder="Имя" class="entry-input__field" value="${auth?.userData?.firstName || ''}" data-name/>
                </div>
                <div class="field-block__undertext_error"></div>
            </div>
            <div class="form__item field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Фамилия</b>
                    <span class="field-block__req"></span>
                </div>
                <div>
                    <div class="entry-input">
                        <input type="text" name="lastName"  placeholder="Фамилия" class="entry-input__field" value="${auth?.userData?.lastName || ''}" data-lastname/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form__row">
            <div class="form__item field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Телефон</b>
                    <span class="field-block__req">(обязательно)</span>
                </div>
                <div class="entry-input entry-input_icon entry-input_req">
                    <input type="tel" name="tel"  class="entry-input__field" value="${auth?.userData?.tel || ''}" data-tel/>
                </div>
                <div class="field-block__undertext_error"></div>
            </div>
            <div class="form__item field-block">
                <div class="field-block__header">
                    <b class="field-block__title">Email</b>
                    <span class="field-block__req">(обязательное)</span>
                </div>
                <div class="entry-input entry-input_icon entry-input_req">
                    <input type="email" name="email" autocomplete="none" placeholder="Email" class="entry-input__field" value="${auth?.userData?.email || ''}" data-email/>
                </div>
                <div class="field-block__undertext_error"></div>
            </div>
        </div>
        <button class="order-form__submit button button_accent" data-next-stage>Продолжить</button>
    `
}

export function renderOrderSecondStage() {
    return `
        <h2 class="order-form__title">Оплата</h2>
        <div class="order-form__info message message_accent message_icon">
            Заказ успешно оформлен, осталось только выбрать способ оплаты
            <svg>
                <use xlink:href="img/svg/sprite.svg#message"></use>
            </svg>
        </div>
        <div class="order-form__payment">
            <label class="order-form__radio-label radio">
                <input type="radio" name="payment" value="getting" class="radio__input" checked>
                <div class="radio__view">
                    <div class="radio__header">
                        <span class="radio__title">При получении</span>
                    </div>
                    <p class="radio__descr">
                        Оплата продукции будет произведена вами наличными при получении товара
                    </p>
                </div>
            </label>
            <label class="order-form__radio-label radio">
                <input type="radio" name="payment" value="call" class="radio__input">
                <div class="radio__view">
                    <div class="radio__header">
                        <span class="radio__title">Звонок оператору</span>
                    </div>
                    <p class="radio__descr">
                        Вы можете получить звонок от нашего оператора и договориться об иных способах оплаты
                    </p>
                </div>
            </label>
        </div>
        <div class="order-form__buttons">
            <button class="order-form__checkout button button_accent" data-checkout>Оформить заказ</button>
            <button class="order-form__checkout button button_neutral" data-back>Назад</button>
        </div>
    `
}

export function renderOrderSuccess() {
    return `
        <h2 class="order-form__title">Ваш заказ принят!</h2>
        <p class="order-form__descr">Если у вас возникли вопросы, пожалуйста <a href="/page_contacts" class="order-form__link">свяжитесь с нами</a>!</p>
        <p class="order-form__descr">Спасибо за покупку в нашем магазине</p>
    `
}