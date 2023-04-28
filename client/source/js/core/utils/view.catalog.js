function changeProductsViewHandler() {
    const $viewButtons = document.querySelectorAll('.view-catalog__item')
    const $productList = document.querySelector('#products_list')

    $viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            $viewButtons.forEach(item => {
                item.classList.remove('view-catalog__item_active')
            })
            button.classList.add('view-catalog__item_active')

            if (button.dataset.view === 'table') {
                $productList.classList.add('products__list_table')
            } else {
                $productList.classList.remove('products__list_table')
            }
        })
    })
    window.addEventListener('resize', (e) => {
        if (window.innerWidth < 1280) {
            $productList.classList.remove('products__list_table')
            $viewButtons.forEach(item => {
                item.classList.remove('view-catalog__item_active')
            })
            document.querySelector('[data-view=list]').classList.add('view-catalog__item_active')
        }
    })
}

export default changeProductsViewHandler