export default function contentEditor(root, content, className = '') {
    tinymce.remove()
    tinymce.init({
            selector: root,
            height: 550,
            valid_elements: '*[*]',
            extended_valid_elements: '*[*]',
            body_class: className,
            editable_root: true,
            editable_class: 'editable',
            preserve_invalid_children: true,
            elementpath: false,
            content_css: 'css/main.css',
            content_style: 'html{height: 100%} body {padding: 10px}',
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
            ],
            toolbar: 'insertTemplate | help code image |' + 'undo redo | blocks | ' +
                'bold italic underline forecolor backcolor fontsize | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | codesample preview',
            font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt',
            paste_data_images: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            init_instance_callback: function (editor) {
                editor.setContent(content)
            },
            file_picker_callback: (cb, value, meta) => {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')

                input.addEventListener('change', (e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()

                    reader.onload = () => {
                        cb(reader.result, { title: file.name })
                    }

                    reader.readAsDataURL(file)
                })

                input.click()
            },
            setup: function (editor) {
                editor.on('init', function () {
                    editor.getBodyClassList = function () {
                        return [...editor.getBody().classList]
                    }
                })
                editor.ui.registry.addMenuButton('insertTemplate', {
                    text: 'Шаблоны',
                    class: 'tox tox-tbtn--bespoke',
                    fetch: function (callback) {
                        const templates = [
                            {
                                title: 'Обычная секция',
                                classList: 'page-section section-default editor-content',
                                content: '<h1 class="page-section__title">Заголовок 1</h1>\n' +
                                    '<div class="page-section__body">\n' +
                                    '    <h2 class="page-section__subtitle">Заголовок 2</h2><br>\n' +
                                    '    <p>\n' +
                                    '        Таким образом, семантический разбор внешних противодействий не даёт нам иного выбора, кроме определения распределения внутренних резервов и ресурсов. Господа, граница обучения кадров в значительной степени обусловливает важность как самодостаточных, так и внешне зависимых концептуальных решений! Господа, синтетическое тестирование способствует подготовке и реализации благоприятных перспектив.\n' +
                                    '    </p>\n' +
                                    '</div>'
                            },
                            {
                                title: 'Cекция список',
                                classList: 'page-section',
                                content: '<h1 class="page-section__title">Оплата</h1><div class="page-section__body"> <ul class="section-payment__list"> <li class="section-payment__item payment-item"> <div class="payment-item__header"> <b class="payment-item__method">Заголовок 1</b> <p class="page-section__descr payment-item__subtitle">Lorem ipsum dolor sit amet.</p> </div> <div class="payment-item__content"> <p class="page-section__descr payment-item__descr">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aperiam at cum dignissimos dolorem dolores eligendi esse eveniet fugiat itaque modi nemo nihil pariatur quis quo quos, repellat rerum tempora veritatis voluptates! Dolor, eveniet, temporibus.</p> </div> </li> <li class="section-payment__item payment-item"> <div class="payment-item__header"> <b class="payment-item__method">Заголовок 2</b> <p class="page-section__descr payment-item__subtitle">Lorem ipsum dolor sit amet.</p> </div> <div class="payment-item__content"> <p class="page-section__descr payment-item__descr">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis ullam vel voluptates! Ea facere labore nam nulla ullam! Asperiores autem illum incidunt, magnam quam quisquam sit. Atque commodi, culpa expedita inventore labore quasi rem. Ab, aspernatur at cum esse excepturi nisi placeat, qui quod reiciendis, saepe sit tempore temporibus totam?</p> </div> </li> <li class="section-payment__item payment-item"> <div class="payment-item__header"> <b class="payment-item__method">Заголовок 3</b> <p class="page-section__descr payment-item__subtitle">Lorem ipsum dolor.</p> </div> <div class="payment-item__content"> <p class="page-section__descr payment-item__descr">Lorem ipsum dolor.</p> </div> </li> </ul></div>'
                            }
                        ]
                        const items = templates.map(template => ({
                            type: 'menuitem',
                            text: template.title,
                            onAction: function () {
                                editor.getBody().className = `mce-content vsc-initialized ${template.classList}`
                                editor.insertContent(template.content)
                            }
                        }))
                        callback(items)
                    },
                    onSetup: function (editor) {
                        document.querySelector('[data-mce-name="inserttemplate"]').classList.add('tox-tbtn--bespoke')
                    }
                })
            }
        }
    )
}