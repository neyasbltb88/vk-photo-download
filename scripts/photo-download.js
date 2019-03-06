class PhotoDownload {
    constructor() {
        this.photoDownload_id = 'PhotoDownload';
        this.imgContainer_id = 'pv_photo';
        this.imgContainer_class = 'pv_image_wrap';

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

        // id, который добавится тегу style
        this.style_id = 'PhotoDownloadStyle';
        // Объект, генерирующий разноцветные иконки
        this.icons = {
            _colors: {
                green: '#00B75A',
                red: '#F92672',
                white: '#FFFFFF',
                yellow: '#FFC000',
            },
            _prefix: 'data:image/svg+xml;charset=utf-8,',
            /* html */
            _template: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16">
                            <path fill="{{color}}" d="M 4,0 4,8 0,8 8,16 16,8 12,8 12,0 4,0 z"/>
                        </svg>`,
            _temp: function(color) {
                return this._template.replace(/\{\{.*\}\}/gm, color ? color : 'white');
            },
            get(color, url = true) {
                let _color = this._colors[color] ? this._colors[color] : color;
                let svg = this._temp(_color).replace(/[\s]{2,}/gm, ' ');
                return url ? this._prefix + encodeURIComponent(svg) : svg;
            }
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
        let parent = elem.closest('.' + this.imgContainer_class);

        // Если в родительском контейнере еще нет кнопки
        if (!parent.querySelector('#' + this.photoDownload_id)) {
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
        let parent = elem.closest('.' + this.imgContainer_class);
        let wrap = document.createElement('div');
        wrap.id = this.photoDownload_id;

        wrap.innerHTML = this._createInnerElems();

        setTimeout(() => {
            wrap.classList.add('ready');
        }, 0);

        parent.appendChild(wrap);
    }

    _createInnerElems() {
        return /* html */ `
            <a class="PhotoDownload_btn" href="#!" target="_blank" draggable="false">
                <div class="PhotoDownload_icon"></div>
                <div class="PhotoDownload_size"></div>
            </a>
        `;
    }

    _createStyleContent() {
        return /* css */ `
        #${this.photoDownload_id} {
            background-color: #000;
            border-top-left-radius: 4px;
            position: absolute;
            bottom: 0;
            left: 100%;
            opacity: 0;
            transform: translate3d(-38px, 0, 1px);
            will-change: transform, opacity;
            transition: opacity .25s ease-in-out, transform .25s ease-in-out !important;
        }
        .${this.imgContainer_class}:hover #${this.photoDownload_id}.ready {
            opacity: .3;
        }
        .${this.imgContainer_class} #${this.photoDownload_id}.ready:hover {
            opacity: .8;
            transform: translate3d(-100%, 0, 1px);
        }
        .PhotoDownload_btn {
            display: flex;
            align-items: center;
            padding: 10px;
        }
        .PhotoDownload_btn:hover {
            text-decoration: none;
        }
        .PhotoDownload_icon {
            background-image: url('${this.icons.get('white')}');
            background-size: contain;
            background-repeat: no-repeat;
            height: 18px;
            width: 18px;
        }
        .PhotoDownload_btn:hover .PhotoDownload_icon {
            background-image: url('${this.icons.get('green')}');
        }
        #${this.photoDownload_id} .PhotoDownload_size:not(.non_size) {
            padding-left: 10px;
            color: #C3CFE0 !important;
        }
        `;
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
        style.id = this.style_id;
        style.textContent = this._createStyleContent();

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



window.photoDownload = new PhotoDownload();