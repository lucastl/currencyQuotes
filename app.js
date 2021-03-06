class currencyQuotes {
    constructor(idContainer, timeChange) {
        // PROPS
        this.appContainer = document.getElementById(idContainer);
        this.classItem = 'quote-currency-item';
        this.direction = 'RIGHT';
        this.itemWidth = 0;
        this.maxWidth = 0;
        this.currentXscroll = 0;
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
        this.initXswipe = 0;

        // INIT
        this.getData()
            .then(res => {
                this.renderElements(res);
                this.setProps();
            });

        // EVENTS
        this.appContainer.addEventListener('mouseover', () => this.stopAutoSlide(), false);
        this.appContainer.addEventListener('mouseout', () => this.startAutoSlide = setInterval(this.scrollAnimate, this.timeChange), false);
        this.appContainer.addEventListener('dblclick', e => this.detectSideScreen(e), false);
        // // <--
        // this.appContainer.addEventListener('click', () => this.scrollRight());
        // this.appContainer.addEventListener('contextmenu', (e) => {
        //     e.preventDefault();
        //     this.scrollLeft()
        // }); 
        // // -->
        ['mousedown', 'touchstart'].forEach(e => {
            this.appContainer.addEventListener(e, this.startSwipe, false);
        });
    };

    getData = async () => {
        let response = await fetch('https://mercados.ambito.com//home/general');
        return await response.json();
    };

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
    };

    setProps = () => {
        let { appContainer, classItem } = this;
        this.itemWidth = document.querySelector(`.${classItem}`).scrollWidth;
        this.maxWidth = appContainer.scrollWidth - appContainer.offsetWidth;
    };

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
    };

    variation = variation => {
        return variation.includes('-') ? 'down' : 'up'
    };

    setDirection = () => {
        const { currentXscroll, maxWidth } = this;
        if (currentXscroll === 0) this.direction = 'RIGHT';
        if (currentXscroll === maxWidth) this.direction = 'LEFT';
    };

    scrollAnimate = () => {
        this.setDirection();
        if (this.direction === 'LEFT') this.scrollLeft();
        if (this.direction === 'RIGHT') this.scrollRight();
    };

    scrollLeft = () => {
        this.setCurrentScrollX();
        this.appContainer.scroll({
            left: this.currentXscroll - this.itemWidth,
            behavior: 'smooth'
        });
    };

    scrollRight = () => {
        this.setCurrentScrollX();
        this.appContainer.scroll({
            left: this.currentXscroll + this.itemWidth,
            behavior: 'smooth'
        });
    };

    setCurrentScrollX = () => {
        this.currentXscroll = this.appContainer.scrollLeft;
    };

    stopAutoSlide = () => {
        clearInterval(this.startAutoSlide)
    };

    detectSideScreen = e => {
        const coordX = e.clientX;
        if (coordX >= this.ranges.leftSide.from && coordX <= this.ranges.leftSide.to) this.scrollRight();
        if (coordX >= this.ranges.rightSide.from && coordX <= this.ranges.rightSide.to) this.scrollLeft();
        return;
    };

    startSwipe = e => {
        this.appContainer.style.cursor = 'grabbing';
        this.setCurrentScrollX();
        this.initXswipe = e.clientX;
        ['mousemove', 'touchmove'].forEach(e => {
            this.appContainer.addEventListener(e, this.swipig, false);
        });
        ['mouseup', 'touchend'].forEach(e => {
            this.appContainer.addEventListener(e, this.endSwipe, false);
        });
    };

    swipig = e => {
        const dx = e.clientX - this.initXswipe;
        this.appContainer.scrollLeft = this.currentXscroll - dx;
    };

    endSwipe = () => {
        this.appContainer.style.cursor = 'grab';
        ['mousemove', 'touchmove'].forEach(e => {
            this.appContainer.removeEventListener(e, this.swipig, false);
        });
        ['mouseup', 'touchend'].forEach(e => {
            this.appContainer.removeEventListener(e, this.endSwipe, false);
        });
    };

}



