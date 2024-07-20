class QuickAddToCard extends HTMLElement {
    onPopupVariantChangeUnsubscriber = undefined;
    constructor() {
        super();
        this.init();
    }

    init() {
        this.onPopupVariantChangeUnsubscriber = subscribe(
            PUB_SUB_EVENTS.optionValueSelectionChange_popup,
            this.handleOptionValueChange.bind(this)
        );

        this.overlay = document.querySelector('[js-quick-atc-overlay]')
        document.querySelectorAll('[js-quick-add-to-cart-btn]').forEach(gridElm => {
            gridElm.addEventListener('click', ({currentTarget}) => {
                const productHandle = currentTarget.dataset.productHandle
                this.renderProductInfo(productHandle)
            })
        })
        this.overlay.addEventListener('click', ({currentTarget}) => {
            !this.classList.contains('hide') ? ((this.classList.add('hide')),(this.overlay.classList.add('hide'))):""
        })
        
    }
    handleOptionValueChange(argm) {
        console.log({argm})
        const { event, selectedOptionValues, target } = argm.data
        const productHandle = target.dataset.productUrl
        const url = `${productHandle}/?option_values=${selectedOptionValues.join(',')}&view=quick-popup`

        this.fetchAndUpdateOptions(url)

    }
    fetchAndUpdateOptions(url) {
        console.log({url})
        fetch(url)
        .then(resp => resp.text())
        .then(htmlText => {
            const html = new DOMParser().parseFromString(htmlText, "text/html")
            this.querySelector('product-form').replaceWith(html.body.querySelector('product-form'))
        })
    }
    renderProductInfo(handle) {
        const url = `${location.origin}/products/${handle}?view=quick-popup`

        fetch(url)
        .then(resp => resp.text())
        .then(htmlText => {
            const html = new DOMParser().parseFromString(htmlText, "text/html")
            this.classList.contains('hide') ? ((this.classList.remove('hide')),(this.overlay.classList.remove('hide'))):""
            this.innerHTML =''
            this.insertAdjacentElement('beforeend', html.body.querySelector('.product__card'))
            const crossBtn = document.querySelector('[js-popup-cross-btn]')
            crossBtn.addEventListener('click', ({currentTarget}) => {
                !this.classList.contains('hide') ? ((this.classList.add('hide')),(this.overlay.classList.add('hide'))):""
            })
        })
    }

    disconnectedCallback() {
        this.onPopupVariantChangeUnsubscriber();
    }

    
}

customElements.define('quick-add-to-card', QuickAddToCard)

document.addEventListener('DOMContentLoaded', function() {
    function changeVariantHandler(e) {
        console.log({e}, e.detail)

    }
    document.addEventListener('variant-change-event-occured', changeVariantHandler)
})