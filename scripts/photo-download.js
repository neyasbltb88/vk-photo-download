class PhotoDownload {
    constructor(params = {}) {
        this.photoDownload_id = params.photoDownload_id;
        this.imgContainer_id = params.imgContainer_id;

        // Объект с описанием обработчиков
        this.triggers = {
            mouseover: {
                imgContainer: {
                    type: 'id',
                    selector: this.imgContainer_id,
                    handler: this.test,
                },
            }, // Конец mouseover
            click: {
                // Для теста
                pv_comments: {
                    type: 'id',
                    selector: 'pv_comments',
                    handler: this.test,
                },
            }, // Конец click
        };

        this.style_id = 'PhotoDownloadStyle';


        // Точка входа
        this.init();
    }

    test(elem) {
        console.log('Тестовый обработчик');
        // console.log(elem);
    }

    // Метод для тестовой подсветки элемента на котором сработал watcher
    _highlighter(elem, timeout) {
        elem.classList.add('photo_download_highlight');

        setTimeout(() => {
            elem.classList.remove('photo_download_highlight');
        }, timeout);
    }

    // Метод, который вызывает нужный обработчик при нужном событии
    _watchTrigger(event) {
        // console.log(event);
        // console.log('type:', event.type);

        // Смотрим, есть ли обработчики полученного типа события
        // На самом деле они всегда должны быть, но все же
        let triggers = this.triggers[event.type];
        if (triggers === undefined) return;

        // Берем элемент, на котором сработало событие
        let target = event.target;

        // Цикл по объекту обработчиков полученного типа события
        for (let trigger in triggers) {
            // Ищем соответствия таргета события и элементов в объекте обработчиков

            if (triggers[trigger].type === 'id') {
                if (target.id === triggers[trigger].selector) {
                    if (triggers[trigger].handler) {
                        this._highlighter(target, 1500);
                        triggers[trigger].handler.call(this, target);
                    }
                }
            }

            if (triggers[trigger].type === 'class') {
                if (target.classList.contains(triggers[trigger].selector)) {
                    if (triggers[trigger].handler) {
                        this._highlighter(target, 1500);
                        triggers[trigger].handler.call(this, target);
                    }
                }
            }
        }
    }

    // Установка на document слушателей типов событий, имеющихся в объекте обработчиков
    _initWatcher() {
        let types = Object.keys(this.triggers);
        types.forEach(type => document.addEventListener(type, this._watchTrigger.bind(this)))
    }

    // Метод добавления на страницу стилей, необходимых для работы PhotoDownload
    _injectCSS() {
        let style_content = /* css */ `
        .photo_download_highlight {
            outline: 1px solid #f00 !important;
        }
        `;

        let style = document.createElement('style');
        style.id = this.style_id;
        style.textContent = style_content;

        document.head.appendChild(style);
    }


    // Точка входа
    init() {
        console.log('%c%s', (window.log_color) ? window.log_color.blue : '', 'PhotoDownload: Init');

        // Добавляем стили PhotoDownload
        this._injectCSS();

        // Инициализируем обработчики событий
        this._initWatcher();
    }
}



window.photoDownload = new PhotoDownload({
    photoDownload_id: 'PhotoDownload',
    imgContainer_id: 'pv_photo',
});