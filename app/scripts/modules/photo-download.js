import PhotoDownloadTemplates from './templates';
import HandlersManager from './handlers';

export default class PhotoDownload {
    constructor(params = {}) {
        let that = this;

        // Ссылка, в которую обернута картинка, 
        // здесь нужнв для триггера создания/обновления кнопки
        this.imgContainer_id = 'pv_photo';

        // Объект всех селекторов, использующихся в кнопке
        this.selectors = {
            _prefix: 'PhotoDownload',
            // id контейнера кнопки
            photoDownload_id: 'PhotoDownload',
            // Контейнер, в котором находится картинка и элементы управления,
            // создавать кнопку будем в нем
            imgContainer_class: 'pv_image_wrap',
            // id, который добавится тегу style
            style_id: 'PhotoDownloadStyle',

            // Класс-флаг, вешается на .PhotoDownload_size когда нет данных о разрешении
            non_size: 'non_size',
            // Класс-флаг, вешается для плавного opacity кнопки после создания
            ready: 'ready',

            settings: 'settings',
            settings_open: 'settings_open',

            draw: 'draw',
            draw_fill: 'draw_fill',

            download_mode_true: 'download_mode_true',
            download_mode_false: 'download_mode_false',

            sett: {
                settings_wrap: 'settings_wrap',
                settings: 'settings',
                settings_header: 'settings_header',
                settings_header_ico: 'settings_header_ico',
                settings_header_text: 'settings_header_text',
                settings_body: 'settings_body',
                settings_mode: 'settings_mode',
                settings_item: 'settings_item',
                settings_item_action: 'settings_item_action',
            },

            btn: {
                // Класс кнопки (тега a)
                btn: 'btn',
                // Класс блока иконки
                icon: 'icon',
                main_title_wrap: 'main_title_wrap',
                main_title_inner: 'main_title_inner',
                // Класс блока, в котором отображается разрешение картинки
                size: 'size',
                settings_title: 'settings_title',
            },
            // Метод получения селектора
            get(sel) {
                sel = sel.split('.');
                let error = false;
                let res = this;

                // Если селектор на верхнем уровне объекта, он отдается как есть
                if (sel.length === 1) {
                    res = this[sel];
                } else {
                    // Иначе получаем селектор из вложенных уровней
                    sel.forEach(part => {
                        try {
                            res = res[part];
                        } catch (err) {
                            error = true;
                        }
                    })

                    // И если селектор существует, дописываем к нему префикс
                    res = (error || !res) ? undefined : `${this._prefix}_${res}`;
                }

                return res;
            }
        };

        // Объект с описанием обработчиков
        this.triggers = {
            mouseover: [
                // Селектор ссылки, в которую обернута картинка в просмотрщике
                {
                    type: 'id',
                    selector: this.imgContainer_id,
                    // При наведении на контейнер картинки, будем обновлять(создавать) кнопку
                    handler: this._updateBtn,
                    child: true,
                },
                // Селектор родительского блока кнопки
                {
                    type: 'class',
                    selector: this.selectors.PhotoDownload_btn,
                    // При наведении на саму кнопку, будем обновлять в ней данные
                    handler: this._updateBtn,
                    child: true,
                },
            ], // Конец mouseover
        };

        // Флаг, задающий поведение клика по кнопке
        // Если true, то картинка будет скачиваться
        // Если false, то картинка будет открываться в новой вкладке
        this.flag_download = {
            _flag: params.download,
            get flag() {
                return this._flag;
            },
            set flag(val) {
                if (typeof val === 'boolean') {
                    this._flag = val;
                    that._addBtnHandlers(this._flag);
                }
            }
        };

        // Здесь будет храниться элемент кнопки
        this.wrap = null;

        // Создаем инстанс шаблонизатора верстки
        this.template = new PhotoDownloadTemplates({
            selectors: this.selectors
        });

        // Создаем инстанс контроллера событий внутри кнопки
        this.handlers = new HandlersManager({
            PhotoDownload: this
        });


        // Точка входа
        this.init();
    }

    // Добавляет на кнопку обработчики скачивания/открытия в новой вкладке
    _addBtnHandlers() {
        if (!this.wrap) return false;

        let btn = this.wrap.querySelector('.' + this.selectors.get('btn.btn'));

        // В зависимости от флага вешаем либо обработчик скачивания, либо открытия новой вкладки
        if (this.flag_download.flag) {
            this.handlers.set(btn, 'downloadHandler');
        } else {
            this.handlers.set(btn, 'newTabHandler');
        }
    }

    // Метод обновления данных в кнопке
    _updateBtn(elem) {
        this.parent = elem.closest('.' + this.selectors.imgContainer_class);

        // Если в родительском контейнере еще нет кнопки
        if (!this.parent.querySelector('#' + this.selectors.photoDownload_id)) {
            // то создадим ее
            this.wrap = this.template.createDownloadContainer(this.parent);
            // И повесим на нее обработчики
            this._addBtnHandlers();
        }

        let btn = this.wrap.querySelector('.' + this.selectors.get('btn.btn'));
        let size = this.wrap.querySelector('.' + this.selectors.get('btn.size'));

        // Получаем из недр ВК информацию о максимальной версии открытой в просмотрщике картинки
        let image_data = window.Photoview.genData(window.cur.pvCurPhoto);

        // Если ссылка в кнопке не та, которая нужна сейчас
        if (btn.href !== image_data.src) {
            // Обновим ссылку в кнопке
            btn.href = image_data.src;

            // И размеры картинки, которая по ссылке
            this.template.setSize(size, image_data);
        }
    }

    // Проверка на то, является ли цель события дочерним элементом селектора из объекта триггеров
    _checkComplianceChild(target, trigger) {
        let parent = (trigger.type === 'id') ?
            target.closest('#' + trigger.selector) :
            target.closest('.' + trigger.selector);

        if (parent) {
            // Если да, запустим обработчик для родителя
            this._checkComplianceTarget(parent, trigger);
        }
    }

    // Проверка на соответствие цели события с селекторами объекта триггеров
    _checkComplianceTarget(target, trigger) {
        let compliance = false;

        // Два отдельных условия для того, чтобы была возможность назначить
        // разные обработчики по id и по классу на один элемент, и они сработали оба
        if (trigger.type === 'id') {
            if (target.id === trigger.selector) {
                compliance = true;

                if (trigger.handler) {
                    trigger.handler.call(this, target);
                }
            }
        }

        if (trigger.type === 'class') {
            if (target.classList.contains(trigger.selector)) {
                compliance = true;

                if (trigger.handler) {
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
            // Ищем обработчик для цели события
            // Если вернется false, то не найден
            let compliance = this._checkComplianceTarget(target, trigger);

            // Если цели события нет в объекте обработчиков, но в обработчике указано, 
            // что он может срабатывать на дочернем элементе
            if (!compliance && trigger.child) {
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

        // Инициализируем обработчики глобальных событий на document
        this._initWatcher();
    }
}