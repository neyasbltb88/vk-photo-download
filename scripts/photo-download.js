class PhotoDownload {
    constructor(params = {}) {
        this.photoDownload_id = params.photoDownload_id;
        this.imgContainer_id = params.imgContainer_id;

        // Объект с описанием обработчиков
        this.triggers = {
            mouseover: [
                // Селектор ссылки, в которую обернута картинка в просмотрщике
                {
                    type: 'id',
                    selector: this.imgContainer_id,
                    // handler: this._createDownloadContainer,
                    handler: this.test,
                    child: true,
                },
            ], // Конец mouseover

            click: [
                // Для теста
                {
                    type: 'id',
                    selector: 'pv_comments',
                    handler: this.test,
                    child: true,
                },
            ], // Конец click
        };

        this.style_id = 'PhotoDownloadStyle';


        // Точка входа
        this.init();
    }

    _createDownloadContainer(elem) {
        let parent = elem.parentElement;

        let wrap = document.createElement('div');
        wrap.id = this.photoDownload_id;

        parent.appendChild(wrap);

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

    _checkComplianceChild(target, trigger) {
        let parent = (trigger.type === 'id') ?
            target.closest('#' + trigger.selector) :
            target.closest('.' + trigger.selector);

        if (parent) {
            this._checkComplianceTarget(parent, trigger);
        }
    }

    _checkComplianceTarget(target, trigger) {
        let compliance = false;

        // Два отдельных условия для того, чтобы была возможность назначить
        // разные обработчики по id и по классу на один элемент, и они сработали оба
        if (trigger.type === 'id') {
            if (target.id === trigger.selector) {
                compliance = true;

                if (trigger.handler) {
                    this._highlighter(target, 1500);
                    trigger.handler.call(this, target);
                }
            }
        }

        if (trigger === 'class') {
            if (target.classList.contains(trigger.selector)) {
                compliance = true;

                if (trigger.handler) {
                    this._highlighter(target, 1500);
                    trigger.handler.call(this, target);
                }
            }
        }

        return compliance;
    }

    // Метод, который вызывает нужный обработчик при нужном событии
    _watchTrigger(event) {
        // Смотрим, есть ли обработчики полученного типа события
        // На самом деле они всегда должны быть, но все же
        let triggers = this.triggers[event.type];
        if (triggers === undefined) return;

        // Берем элемент, на котором сработало событие
        let target = event.target;

        // Цикл по объекту обработчиков полученного типа события
        triggers.forEach(trigger => {
            // Если цели события нет в объекте обработчиков, но в обработчике указано, 
            // что он может срабатывать на дочернем элементе
            if (!this._checkComplianceTarget(target, trigger) && trigger.child) {
                // Попробуем найти родительский элемент цели, соответствующий селектору
                // из объекта обработчиков
                this._checkComplianceChild(target, trigger);
            }
        });
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

        #${this.photoDownload_id} {
            background-color: #fff;
            width: 50px;
            height: 50px;
            position: absolute;
            bottom: 0;
            right: 0;
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