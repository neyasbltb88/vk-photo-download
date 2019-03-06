import Download from 'downloadjs';
import PhotoDownloadTemplates from './templates';

export default class PhotoDownload {
    constructor(params = {}) {
        // Ссылка, в которую обернута картинка, 
        // здесь нужнв для триггера создания/обновления кнопки
        this.imgContainer_id = 'pv_photo';

        this.selectors = {
            // id контейнера кнопки
            photoDownload_id: 'PhotoDownload',
            // Контейнер, в котором находится картинка и элементы управления,
            // создавать кнопку будем в нем
            imgContainer_class: 'pv_image_wrap',
            // id, который добавится тегу style
            style_id: 'PhotoDownloadStyle',
        };

        this.template = new PhotoDownloadTemplates({
            selectors: this.selectors
        });

        // Объект с описанием обработчиков
        this.triggers = {
            mouseover: [
                // Селектор ссылки, в которую обернута картинка в просмотрщике
                {
                    type: 'id',
                    selector: this.imgContainer_id,
                    handler: this._updateBtn,
                    child: true,
                },
                {
                    type: 'class',
                    selector: 'PhotoDownload_btn',
                    handler: this._updateBtn,
                    child: true,
                },
            ], // Конец mouseover
        };

        this.last_image_data = {
            src: null,
            width: null,
            height: null,
        };


        // Точка входа
        this.init();
    }

    _updateBtn(elem) {
        let parent = elem.closest('.' + this.selectors.imgContainer_class);

        // Если в родительском контейнере еще нет кнопки
        if (!parent.querySelector('#' + this.selectors.photoDownload_id)) {
            // то создадим ее
            this._createDownloadContainer(elem);
        }

        let btn = parent.querySelector('.PhotoDownload_btn');
        let size = parent.querySelector('.PhotoDownload_size');
        this.last_image_data = window.Photoview.genData(cur.pvCurPhoto);

        // Если ссылка в кнопке не та, которая нужна сейчас
        if (btn.href !== this.last_image_data.src) {
            console.log('btn.href !== this.last_image_data.src');

            btn.href = this.last_image_data.src;

            if (this.last_image_data.width && this.last_image_data.height) {
                size.classList.remove('non_size');
                size.textContent = `${this.last_image_data.width}x${this.last_image_data.height}`;
            } else {
                size.classList.add('non_size');
                size.textContent = '';
            }
        }
    }

    _createDownloadContainer(elem) {
        let parent = elem.closest('.' + this.selectors.imgContainer_class);
        let wrap = document.createElement('div');
        wrap.id = this.selectors.photoDownload_id;

        wrap.innerHTML = this.template.getInnerElems();

        setTimeout(() => {
            wrap.classList.add('ready');
        }, 0);

        parent.appendChild(wrap);
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
                    // console.log('> ' + trigger.selector);
                    trigger.handler.call(this, target);
                }
            }
        }

        if (trigger.type === 'class') {
            if (target.classList.contains(trigger.selector)) {
                compliance = true;

                if (trigger.handler) {
                    // console.log('> ' + trigger.selector);
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
        let style = document.createElement('style');
        style.id = this.selectors.style_id;
        style.textContent = this.template.getStyleContent();

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