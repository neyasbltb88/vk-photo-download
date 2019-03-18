import PhotoDownloadTemplates from './templates';
import HandlersManager from './handlers';
import SStorage from './storage';

export default class PhotoDownload {
    constructor(params = {}) {
        let that = this;

        // Ссылка, в которую обернута картинка, 
        // здесь нужнв для триггера создания/обновления кнопки
        this.imgContainer_id = 'pv_photo';

        // Объект всех селекторов, использующихся в кнопке
        this.selectors = {
            _prefix: 'PhotoDownload_',
            // id контейнера кнопки
            photoDownload_id: 'PhotoDownload',
            // Контейнер, в котором находится картинка и элементы управления,
            // создавать кнопку будем в нем
            imgContainer_class: 'pv_image_wrap',
            // id, который добавится тегу style
            style_id: 'PhotoDownloadStyle',

            // Класс-флаг, вешается на #PhotoDownload когда нет данных о разрешении
            // или в настройках отключен показ размеров картинки
            non_size: 'non_size',
            // Класс-флаг, вешается для плавного opacity кнопки после создания
            ready: 'ready',

            slide_in: 'slide_in',

            settings: 'settings',
            settings_open: 'settings_open',

            draw: 'draw',
            draw_fill: 'draw_fill',
            icon_cog: 'icon_cog',

            download_mode_true: 'download_mode_true',
            download_mode_false: 'download_mode_false',

            size_mode_control: 'size_mode_control',

            loaded_urls_mode_control: 'loaded_urls_mode_control',
            loaded_urls_mode_key_control: 'loaded_urls_mode_key_control',
            loaded_urls_mode_clear_control: 'loaded_urls_mode_clear_control',
            loaded_urls_active: 'loaded_urls_active',

            sett: {
                settings_wrap: 'settings_wrap',
                settings: 'settings',
                settings_body: 'settings_body',
                download_mode: 'download_mode',
                size_mode: 'size_mode',
                loaded_urls_mode: 'loaded_urls_mode',
                settings_item: 'settings_item',
                settings_item_action: 'settings_item_action',
                // loaded_urls_counter: 'loaded_urls_counter',

                settings_close_ico: 'settings_close_ico',
                settings_section: 'settings_section',
                settings_section_header: 'settings_section_header',
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
                // Класс для эффекта скачивания на иконке стрелки
                download_effect: 'download_effect',
            },
            // Метод получения селектора
            get(sel) {
                sel = sel.split('.');
                let error = false;
                let res = this;

                // Если селектор на верхнем уровне объекта, он отдается как есть
                if (sel.length === 1) {
                    res = this[sel];
                } else if (sel.length > 1) {
                    // Иначе получаем селектор из вложенных уровней
                    sel.forEach(part => {
                        try {
                            res = res[part];
                        } catch (err) {
                            error = true;
                        }
                    })

                    // И если селектор существует, дописываем к нему префикс
                    res = (error || !res) ? undefined : this._prefix + res;
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
                    selector: this.selectors.get('btn.btn'),
                    // При наведении на саму кнопку, будем обновлять в ней данные
                    handler: this._updateBtn,
                    child: true,
                },
            ], // Конец mouseover
        };

        // Настройки поведения кнопки
        this.settings = {
            // download_mode - флаг, задающий поведение клика по кнопке
            // Если true, то картинка будет скачиваться
            // Если false, то картинка будет открываться в новой вкладке
            _download_mode: params.download,
            get download_mode() {
                return this._download_mode;
            },
            set download_mode(val) {
                if (typeof val === 'boolean') {
                    this._download_mode = val;
                    that._saveSettings();

                    let upd = that._updateBtn(document.querySelector('#' + that.imgContainer_id));
                    if (upd === null) return null;

                    that.handlers.setSettingsState();
                }
            }, // _download_mode

            // show_size - флаг, отвечающий за показ размеров картинки при наведении на кнопку,
            // и соответственно, за выезжающую анимацию при наведении.
            // Если true, то размеры показываются
            // Если false, то размеры скрыты
            _show_size: true,
            get show_size() {
                return this._show_size;
            },
            set show_size(val) {
                if (typeof val === 'boolean') {
                    this._show_size = val;
                    that._saveSettings();

                    let upd = that._updateBtn(document.querySelector('#' + that.imgContainer_id));
                    if (upd === null) return null;

                    that.handlers.setSettingsState();
                }
            }, // _show_size

            // loaded_urls - флаг, отвечающий за отметку того, что текущая картинка уже была ранее скачена,
            // в виде желтой иконки стрелки
            _loaded_urls: true,
            get loaded_urls() {
                return this._loaded_urls;
            },
            set loaded_urls(val) {
                if (typeof val === 'boolean') {
                    this._loaded_urls = val;
                    that.handlers.setSettingsState();
                    that._checkLoadedUrl(true);
                }
            }, // _loaded_urls

            _loaded_urls_PKM: true,
            get loaded_urls_PKM() {
                return this._loaded_urls_PKM;
            },
            set loaded_urls_PKM(val) {
                if (typeof val === 'boolean') {
                    this._loaded_urls_PKM = val;
                    that.handlers.setSettingsState();

                    console.log('%c%s', (window.log_color) ? window.log_color.purple : '', '_loaded_urls_PKM: ' + val);
                }
            }, // _loaded_urls_PKM
        };

        // Объект для работы с ранее скаченными картинками
        this.loaded_urls = {
            _loaded_urls: [],
            // Добавить новый url в массив скаченных
            add(url) {
                if (typeof url === 'string' && !this.check(url)) {
                    this._loaded_urls.push(url);
                    that._saveLoadedUrls();
                    that._checkLoadedUrl();

                    return true;
                } else {
                    return false;
                }
            },
            // Проверить, есть ли этот url в скаченных
            check(url) {
                return this._loaded_urls.some(item => item === url);
            },
            // Получить массив скаченных url
            get() {
                return this._loaded_urls;
            },
            length() {
                return this.get().length;
            },
            // Установить новый массив скаченных url
            set(arr, storage = true) {
                if (arr instanceof Array) {
                    this._loaded_urls = arr;

                    if (storage) {
                        that._saveLoadedUrls();
                        that._checkLoadedUrl(true);
                    }

                    return true;
                } else {
                    return false;
                }
            },
            // Очистить массив скаченных url
            clear() {
                return this.set([]);
            }
        }; // _loaded_urls

        // Визуальное состояние кнопки
        this.state = {
            _settings: 'close',
            get settings() {
                return this._settings;
            },
            set settings(val) {
                if (typeof val === 'string') {
                    this._settings = val;
                    that._saveState();

                    let upd = that._updateBtn(document.querySelector('#' + that.imgContainer_id));
                    if (upd === null) return null;

                    that.handlers.applyState();
                }
            }, // _settings
        }

        // Объект хранения таймингов для синхронизации контроллера и анимаций
        this.timings = {
            delay: 250,
            open: 600,
            settings_open: 350,
            fill: 100,
            btn_transition_opacity: 250,
            btn_transition_transform: 250,
        }

        // Здесь будет храниться элемент кнопки
        this.wrap = null;

        // Здесь будет храниться информация о текущей картинке
        this.image_data = null;

        // Создаем инстанс шаблонизатора верстки
        this.template = new PhotoDownloadTemplates({
            selectors: this.selectors,
            timings: this.timings,
        });

        // Создаем инстанс контроллера событий внутри кнопки
        this.handlers = new HandlersManager({
            PhotoDownload: this,
            selectors: this.selectors,
            timings: this.timings,
        });

        // Создаем инстанс хранилища
        this.storage = new SStorage({
            // 'PhotoDownload'
            name: this.selectors.photoDownload_id,
            default: {
                settings: this.settings,
                state: this.state,
                loaded_urls: [],
            }
        });


        // Точка входа
        this.init();
    }

    // Метод обновления данных в кнопке
    _updateBtn(elem) {
        if (!elem) return null;
        this.parent = elem.closest('.' + this.selectors.imgContainer_class);
        if (!this.parent) return null;

        // Если в родительском контейнере еще нет кнопки
        if (!this.parent.querySelector('#' + this.selectors.photoDownload_id)) {
            // то создадим ее
            this.wrap = this.template.createDownloadContainer(this.parent);

            // Применим состояние настроек
            this.handlers.setSettingsState();

            // Применим состояние кнопки
            this.handlers.applyState();

            // Повесим на нее обработчики
            this.handlers.setHandlers();
        }

        let btn = this.wrap.querySelector('.' + this.selectors.get('btn.btn'));

        // Получаем из недр ВК информацию о максимальной версии открытой в просмотрщике картинки
        this.image_data = window.Photoview.genData(window.cur.pvCurPhoto);

        // Проверим, не был ли новый url ранее уже скачен
        this._checkLoadedUrl();

        // Обновим ссылку в кнопке
        btn.href = this.image_data.src;

        // Установим информацию о размерах картинки, которая по ссылке
        this.template.setSize(this.wrap, this.image_data, this.settings.show_size);
    }

    // === LoadedUrl ===

    // Если разрешено в настройке, добавляет url в массив ранее скаченных
    _addLoadedUrl(url) {
        if (this.settings.loaded_urls) {
            this.loaded_urls.add(url);
        }
    }

    // Обновляет отображение в кнопке, если это разрешено в насройках
    // и ее href есть в массиве ранее скаченных
    _checkLoadedUrl(immediate = false) {
        // immediate - флаг, при наличии которого изменение отобразится на кнопке немедленно,
        // иначе - только после переключения картинки.
        // Нужно для того, чтобы иконка не становилась желтой сразу под мышкой при скачивании,
        // но при переключении настройки "Отмечать скаченные", изменения отобразятся сразу
        if (!immediate) {
            if (!this.wrap) return;
            let btn = this.wrap.querySelector('.' + this.selectors.get('btn.btn'));
            if (!btn || (this.image_data.src === btn.href)) return;
        }

        let check = this.loaded_urls.check(this.image_data.src);
        this.template.setLoadedUrl(this.wrap, this.settings.loaded_urls, check);

        let counter_span = this.wrap.querySelector(`#${this.selectors.loaded_urls_mode_clear_control} span`);
        counter_span.textContent = this.loaded_urls.length();
    }

    // --- LoadedUrl ---

    // === Watcher ===

    // Установка на document слушателей типов событий, имеющихся в объекте обработчиков
    _initWatcher() {
        let types = Object.keys(this.triggers);
        types.forEach(type => document.addEventListener(type, this._watchTrigger.bind(this)))
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
            let compliance = this._checkComplianceTarget(target, trigger, event.type);

            // Если цели события нет в объекте обработчиков, но в обработчике указано, 
            // что он может срабатывать на дочернем элементе
            if (!compliance && trigger.child) {
                // Попробуем найти родительский элемент цели, соответствующий селектору
                // из объекта обработчиков
                this._checkComplianceChild(target, trigger, event.type);
            }
        });
    }

    // Проверка на соответствие цели события с селекторами объекта триггеров
    _checkComplianceTarget(target, trigger, type) {

        if (type === 'click') {
            console.log('_checkComplianceTarget', {
                target,
                trigger
            });
        }

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

    // Проверка на то, является ли цель события дочерним элементом селектора из объекта триггеров
    _checkComplianceChild(target, trigger, type) {

        if (type === 'click') {
            console.log('_checkComplianceChild', {
                target,
                trigger
            });
        }


        let parent = (trigger.type === 'id') ?
            target.closest('#' + trigger.selector) :
            target.closest('.' + trigger.selector);

        if (parent) {
            // Если да, запустим обработчик для родителя
            this._checkComplianceTarget(parent, trigger);
        }
    }

    // --- Watcher ---

    // === Storage ===

    _saveSettings() {
        let res = this.storage.set('settings', this.settings);
        // console.log(res);
    }

    _saveState() {
        let res = this.storage.set('state', this.state);
        // console.log(res);
    }

    _saveLoadedUrls() {
        let res = this.storage.set('loaded_urls', this.loaded_urls);
        // console.log(res);
    }

    _restoreStorage() {
        let storage = this.storage.getAll();

        for (let storage_obj in storage) {
            for (let obj in storage[storage_obj]) {
                if (obj.charAt(0) === '_') {
                    this[storage_obj][obj] = storage[storage_obj][obj];
                }
            }
        }

        this._updateBtn(document.querySelector('#' + this.imgContainer_id));
    }

    // --- Storage ---


    // Точка входа
    init() {
        console.clear();
        console.log('%c%s', (window.log_color) ? window.log_color.blue : '', 'PhotoDownload: Init');

        // Добавляем стили PhotoDownload
        this.template.injectCSS();

        // Восстанавливаем сохраненное в LocalStorage состояние
        this._restoreStorage();

        // Инициализируем обработчики глобальных событий на document
        this._initWatcher();
    }
}