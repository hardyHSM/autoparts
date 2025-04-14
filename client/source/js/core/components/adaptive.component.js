export default class ElementTransporter {
    prevWindowWidth = window.innerWidth;
    isResizing = false; // Флаг для предотвращения лишних вызовов

    appendElements(config) {
        config.forEach(item => this.toChange(item));

        window.addEventListener('resize', () => {
            if (!this.isResizing) {
                this.isResizing = true;
                requestAnimationFrame(() => {
                    if (window.innerWidth !== this.prevWindowWidth) {
                        config.forEach(item => this.toChange(item));
                        this.prevWindowWidth = window.innerWidth;
                    }
                    this.isResizing = false;
                });
            }
        });
    }

    toChange(config) {
        const $element = document.querySelector(config.what);
        const $where_element = document.querySelector(config.where);

        if (!$element || !$where_element) return;

        config.breakpoints.forEach(({ key, value }) => {
            if ((key === 'less' && window.innerWidth <= value) ||
                (key === 'more' && window.innerWidth > value)) {
                $where_element.insertAdjacentElement(config.pos, $element);
            }
        });
    }
}