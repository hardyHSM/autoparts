import { html } from 'code-tag'
import MultiInputComponent from './selectsinputs/multiinput.component.js'
import SelectInputComponent from './selectsinputs/select.input.component.js'
import InputCompleteComponent from './selectsinputs/input.complete.component.js'
import { apiService, router } from '../../app/common.modules.js'
import { debounce, generateId } from '../../app/utils/utils.js'
import Sortable from 'sortablejs'


class DataEditorComponent {
    constructor({ root, data = {} }) {
        this.$node = document.querySelector(root)
        this.data = Object.entries(data)
        this.map = []
    }

    async init() {
        this.attributesKeys = await this.getAttributesKeys()
        this.render(this.processingAttributes())
        this.afterRender()
    }

    serializeData() {
        let error = false
        const data = {}
        this.$node.querySelectorAll('[data-editor-row]').forEach(row => {
            const $key = row.querySelector('[data-editor-input]')
            const key = $key.value.trim()
            const line = this.map.find(row => row.input === $key)
            const value = line.select instanceof InputCompleteComponent ?
                this.map.find(row => row.input === $key).select.value.trim() :
                this.map.find(row => row.input === $key).select.data

            if (key.length === 0 || value.length === 0) {
                error = true
            }

            data[key] = value
        })
        if(error) return false
        return data
    }

    async getAttributesKeys() {
        return await apiService.useRequest(router.productsAttributesLink)
    }

    afterRender() {
        const $tbody = this.$node.querySelector('tbody')

        new Sortable($tbody, {
            handle: '[data-editor-drag]',
            animation: 150,
            wapThreshold: 0.5
        })
        this.$node.querySelectorAll('[data-editor-input]').forEach($input => {
            const values = this.data.find(item => item[0] === $input?.value)[1]
            this.createComponent($input, values)
        })
        this.registerHandlers()
    }

    createComponent($input, values) {
        const id = $input.dataset.editorInput
        const $value = this.$node.querySelector(`[data-editor-value="${id}"]`)
        const inputComponent = new InputCompleteComponent({
            id,
            selector: `[data-editor-input="${id}"]`,
            data: this.attributesKeys
        })
        inputComponent.init()


        const Component = $value.dataset.editorType === 'select' ? MultiInputComponent : InputCompleteComponent

        const select = new Component({
            id,
            selector: `[data-editor-value='${id}']`,
            data: values,
            changeData: async function (key) {
                const res = await apiService.useRequest(router.productsAttributesSearchKey(key))
                if ($value.dataset.editorType === 'select') {
                    this.complete = res
                } else {
                    this.data = res
                }
            }
        })
        select.init($input.value)
        this.map.push({ input: $input, select })
    }

    registerHandlers() {
        this.$node.addEventListener('click', ({ target }) => {
            const deleteButton = target.closest('[data-editor-delete]')
            const addStringButton = target.closest('[data-button-string')
            const addArrayButton = target.closest('[data-button-array')
            if (deleteButton) {
                const row = deleteButton.closest('[data-editor-row]')
                this.removeRow(row)
            }
            if (addStringButton) {
                this.createRow('string')
            }
            if (addArrayButton) {
                this.createRow('array')
            }

        })
        this.$node.querySelectorAll('[data-editor-input]').forEach(field => {
            field.addEventListener('input', debounce(this.changeValue.bind(this), 800))
        })
    }

    createRow(type) {
        const { html, id } = this.parseAttributeToHTML(['', type === 'string' ? '' : []])
        this.$node.querySelector('tbody').insertAdjacentHTML('beforeend', html)
        const $input = this.$node.querySelector(`[data-editor-input="${id}"]`)
        $input.addEventListener('input', debounce(this.changeValue.bind(this), 800))
        this.createComponent($input, [])
    }

    changeValue({ target }) {
        const select = this.map.find(({ select }) => select.id === target.dataset.editorInput).select
        select.changeData(target.value)
    }

    removeRow(row) {
        const id = row.dataset.editorRow
        this.map = this.map.filter(({ input, select }) => {
            if (select.key !== id) {
                return true
            } else {
                select.destroy()
                return false
            }
        })
        row.remove()
    }

    processingAttributes() {
        return this.data.map((attribute) => {
            return this.parseAttributeToHTML(attribute).html
        }).join('')
    }

    parseAttributeToHTML([key, value]) {
        const id = generateId()
        const type = !Array.isArray(value) ? this.createInput([key, value], id) : this.createSelect([key, value], id)

        return {
            html: html`
                <tr class="table__row" data-editor-row="${id}">
                    <td class="table__col table__col_small table__col_button table__col_drag" data-editor-drag>
                        <svg>
                            <use xlink:href="img/svg/sprite.svg#drag"></use>
                        </svg>
                    </td>
                    <td class="table__col">
                        <div class="entry-input entry-input_complete">
                            <input type="text" class="entry-input__field" placeholder="Введите ключ аттрибута" value="${key}" data-editor-input="${id}"/>
                            <ul class="entry-input__complete">
                            </ul>
                        </div>
                    </td>
                    <td class="table__col">
                        ${type}
                    </td>
                    <td class="table__col table__col_small">
                        <button type="button" class="button button_mini button_danger button_icon-only" data-editor-delete>
                            Удалить
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#trash"></use>
                            </svg>
                        </button>
                    </td>
                </tr>
            `,
            id
        }
    }

    createInput([key, value], id) {
        return html`
            <div class="entry-input entry-input_complete">
                <input type="text" class="entry-input__field" placeholder="Введите значение аттрибута" value="${value}" data-editor-value="${id}" data-editor-type="field"/>
                <ul class="entry-input__complete">
                </ul>
            </div>`
    }

    createSelect([key, value], id) {
        return html`
            <div class="select select_multi select_multi-input" data-editor-value="${id}" data-editor-type="select">
                <div class="select__header">
                    <input type="text" class="select__field" placeholder="Введите значение аттрибута" data-input/>
                </div>
                <ul class="select__added-list" data-select-list></ul>
                <ul class="select__body" data-select-body></ul>
            </div>
        `
    }

    render(attributes) {
        this.$node.innerHTML = `
            <table class="table table_classic table_editor">
                <thead>
                <tr class="table__header table__row">
                    <th class="table__col table__col_small"></th>
                    <th class="table__col">Название аттрибута</th>
                    <th class="table__col">Значение аттрибута</th>
                    <th class="table__col table__col_small">Удаление</th>
                </tr>
                </thead>
                <tbody>
                ${attributes}
                </tbody>
                <tfoot class="table__footer">
                <tr class="table__row">
                    <td class="table__col table__col_full table__bottom">
                        <button type="button" class="button button_mini button_dark button_icon-only button_big-icon" title="Добавить аттрибут со значением в виде строчки" data-button-string>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#string"></use>
                            </svg>
                        </button>
                        <button type="button" class="button button_mini button_dark button_icon-only" title="Добавить аттрибут со значением в виде массива" data-button-array>
                            <svg>
                                <use xlink:href="img/svg/sprite.svg#object"></use>
                            </svg>
                        </button>
                    </td>
                </tr>
                </tfoot>
            </table>
        `
    }
}

export default DataEditorComponent