class currencyQuotes {
    constructor(idContainer, timeChange) {
        // PROPS
        this.appContainer = document.getElementById(idContainer);
        this.classItem = 'quote-currency-item';
        this.direction = 'RIGHT';
        this.itemWidth = 0;
        this.maxWidth = 0;
        this.currentScrollX = 0;
        this.timeChange = timeChange * 1000;
        this.startAutoSlide = setInterval(this.scrollAnimate, this.timeChange);
        this.ranges = {
            leftSide: {
                from: 0,
                to: window.innerWidth / 2
            },
            rightSide: {
                from: window.innerWidth / 2,
                to: window.innerWidth
            }
        };
        // INIT
        this.getData()
            .then(res => {
                this.renderElements(res);
                this.setProps();
            });

        // EVENTS
        this.appContainer.addEventListener('mouseover', () => this.stopAutoSlide());
        this.appContainer.addEventListener('mouseout', () => this.startAutoSlide = setInterval(this.scrollAnimate, this.timeChange));
        this.appContainer.addEventListener('click', e => {
            const coordX = e.clientX;
            if (coordX >= this.ranges.leftSide.from && coordX <= this.ranges.leftSide.to) this.scrollLeft();
            if (coordX >= this.ranges.rightSide.from && coordX <= this.ranges.rightSide.to) this.scrollRight();
            return;
        });
        // // <--
        // this.appContainer.addEventListener('click', () => this.scrollRight());
        // this.appContainer.addEventListener('contextmenu', (e) => {
        //     e.preventDefault();
        //     this.scrollLeft()
        // }); 
        // // -->
    }

    getData = async () => {
        let response = await fetch('https://mercados.ambito.com//home/general');
        return await response.json();
    }

    renderElements = (elements) => {
        const childs = elements.reduce((acc, currentCurrency) => {
            const { compra, venta } = currentCurrency;
            if (compra && venta) return acc + this.quoteTemplate(currentCurrency);
            return acc;
        }, "");
        const list = `
            <ul class="quotes-currencies-list">
                ${childs}
            </ul>
        `;
        this.appContainer.innerHTML = list;
    }

    setProps = () => {
        let { appContainer, classItem } = this;
        this.itemWidth = document.querySelector(`.${classItem}`).scrollWidth;
        this.maxWidth = appContainer.scrollWidth - appContainer.offsetWidth;
    }

    quoteTemplate = (currency) => {
        const { nombre, compra, venta, variacion } = currency;
        return `
                <li class="quote-currency-item">
                    <span class="quote-icon ${this.variation(variacion)}"></span>
                    <span class="quote-name">${nombre}</span>
                    <span class="quote-price">${compra}</span>
                    <span class="quote-price">${venta}</span>
                </li>
            `;
    }

    variation = variation => {
        return variation.includes('-') ? 'down' : 'up'
    }

    setDirection = () => {
        const { currentScrollX, maxWidth } = this;
        if (currentScrollX === 0) this.direction = 'RIGHT';
        if (currentScrollX === maxWidth) this.direction = 'LEFT';
    }

    scrollAnimate = () => {
        this.setDirection();
        if (this.direction === 'LEFT') this.scrollLeft();
        if (this.direction === 'RIGHT') this.scrollRight();
    }

    scrollLeft = () => {
        this.setCurrentScrollX();
        this.appContainer.scroll({
            left: this.currentScrollX - this.itemWidth,
            behavior: 'smooth'
        });
    }

    scrollRight = () => {
        this.setCurrentScrollX();
        this.appContainer.scroll({
            left: this.currentScrollX + this.itemWidth,
            behavior: 'smooth'
        });
    }

    setCurrentScrollX = () => {
        this.currentScrollX = this.appContainer.scrollLeft;
    }

    stopAutoSlide = () => {
        clearInterval(this.startAutoSlide)
    };

}



