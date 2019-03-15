import Download from 'downloadjs';

// Класс для управления обработчиками внутри кнопки
export default class HandlersManager {
    constructor(params = {}) {
            // Переданный инстанс главного класса
            this.PhotoDownload = params.PhotoDownload;

            // Переданный объект селекторов
            this.sel = params.selectors;

            // Переданный объект таймингов
            this.timings = params.timings;

            // Тип события по умолчанию для обработчиков
            this.default_event_name = 'click';

            // Объект с перечислением всех возможных обработчиков
            this.handlers = {
                preventHandler: this._preventHandler.bind(this),
                newTabHandler: this._newTabHandler.bind(this),
                downloadHandler: this._downloadHandler.bind(this),
                startTimer: this._startTimer.bind(this),
                checkTimer: this._checkTimer.bind(this),
                closeTimingSettings: () => this.PhotoDownload.state.settings = 'close',
                downloadModeHandler: this._downloadModeHandler.bind(this),
                showSizeHandler: this._showSizeHandler.bind(this),
                downloadEffect: this.tempClass.bind(this, this.sel.get('btn.download_effect'), this.timings.settings_open + 250, `.${this.sel.get('btn.icon')}`),
            }

            this.timers = {
                delay: null,
                open: null,
            };
        } // constructor

    // Устанавливает обработчики в кнопке
    setHandlers() {
        let wrap = this.PhotoDownload.wrap;
        if (!wrap) return false;

        let btn = wrap.querySelector('.' + this.sel.get('btn.btn'));

        this.set(btn, 'startTimer', 'mousedown');
        this.set(btn, 'checkTimer', 'mouseup');
        this.set(btn, 'checkTimer', 'mouseleave');
        this.set(btn, 'preventHandler', 'click');

        // Галочка закрытия настроек
        let btn_close = wrap.querySelector('.' + this.sel.get('sett.settings_close_ico'));
        this.set(btn_close, 'closeTimingSettings', 'click');

        // Обработчик изменения настройки режима скачивания (клика по кнопке)
        let download_mode = wrap.querySelector('.' + this.sel.get('sett.download_mode'));
        this.set(download_mode, 'downloadModeHandler', 'change');

        // Обработчик изменения настройки отображения размера картинки
        let size_mode = wrap.querySelector('.' + this.sel.get('sett.size_mode'));
        this.set(size_mode, 'showSizeHandler', 'change');
    }

    // Обновляет настройки в кнопке
    setSettingsState() {
        let wrap = this.PhotoDownload.wrap;
        if (!wrap) return false;

        // _download_mode
        let download_mode = this.PhotoDownload.settings.download_mode.toString();
        let download_mode_block = wrap.querySelector('.' + this.sel.get('sett.download_mode'));
        let download_mode_control = download_mode_block.querySelector(`input[value=${download_mode}]`);
        download_mode_control.checked = true;

        // _show_size
        let size_mode_control = wrap.querySelector('#' + this.sel.size_mode_control);
        size_mode_control.checked = this.PhotoDownload.settings.show_size;
        if (this.PhotoDownload.settings.show_size) {
            wrap.classList.remove(this.sel.non_size);
        } else {
            wrap.classList.add(this.sel.non_size);
        }
    }

    // Обновляет визуальное состояние кнопки
    applyState() {
        let state = this.PhotoDownload.state;

        switch (state.settings) {
            case 'open_timing':
                this._openTimingSettings();
                break;

            case 'open':
                this._openSettings();
                break;

            case 'close':
                this._closeSettings();
                break;

            default:
                break;
        }
    }

    // Метод, реализующий режимы быстрого клика и удержания ЛКМ на кнопке
    _startTimer(e) {
        // Если нажата не ЛКМ - выходим
        if (e.which !== 1) return false;

        // Настройки закрыты
        if (this.PhotoDownload.state.settings == 'close') {
            // Ставим таймер задержки на время, отведенное для быстрого клика
            this.timers.delay = setTimeout(() => {
                // Если таймер задержки не сброшен, запускаем состояние открытия настроек
                this.PhotoDownload.state.settings = 'open_timing';

                // И ставим таймер на время анимации открытия
                // Пока не выполнится этот таймер, вход в настройки можно отменить, отпустив ЛКМ
                this.timers.open = setTimeout(() => {
                    // Если этот таймер не сброшен, входим в настройки
                    this.PhotoDownload.state.settings = 'open';
                }, this.timings.open);

            }, this.timings.delay);

            // Настройки открыты
        } else if (this.PhotoDownload.state.settings == 'open') {
            // Убираем иконку шестеренки
            this.PhotoDownload.wrap.querySelector('.cog')
                .classList.remove(this.sel.draw, this.sel.draw_fill);

            setTimeout(() => {
                // Если за время, отведенное на быстрый клик, настройки еще открыты,
                // то закроем их
                if (this.PhotoDownload.state.settings == 'open') {
                    this.PhotoDownload.state.settings = 'close';
                }
            }, this.timings.delay);

        }
    }

    _checkTimer(e) {
        // Если нажата не левая кнопка мыши, то выходим
        if (e.which !== 1) return false;

        // Если быстрый клин и настройки закрыты, то будет обработчик скачивания
        if (this.timers.delay && !this.timers.open && this.PhotoDownload.state.settings == 'close') {

            // Тут действие для простого клика
            // В зависимости от флага вешаем либо обработчик скачивания, либо открытия новой вкладки
            if (this.PhotoDownload.settings.download_mode) {
                this.set(e.currentTarget, ['downloadHandler', 'downloadEffect']);
            } else {
                this.set(e.currentTarget, ['newTabHandler', 'downloadEffect']);
            }
        }

        // Если быстрый клик и настройки открыты, то будет обработчик закрытия настроек
        if (this.timers.delay && !this.timers.open && this.PhotoDownload.state.settings == 'open') {
            this.PhotoDownload.state.settings = 'close';
        }

        // Долгий клик и настройки открыты
        if (this.timers.delay && this.timers.open && this.PhotoDownload.state.settings == 'open') {
            // // Здесь настройки должны быть уже открыты и для события клика, 
            // // которое будет сразу после этого mouseup, блокируем действие
            this.set(e.currentTarget, 'preventHandler');
        }

        if (this.PhotoDownload.state.settings == 'open_timing') {
            this.set(e.currentTarget, 'preventHandler');
            this.PhotoDownload.state.settings = 'close';
        }

        // Обнуляем все таймеры для следующего раза
        clearTimeout(this.timers.delay);
        this.timers.delay = null;
        clearTimeout(this.timers.open);
        this.timers.open = null;
    }

    // Запуск открытия настроек
    _openTimingSettings() {
        this.PhotoDownload.wrap.classList.add(this.sel.icon_cog);
        this.PhotoDownload.wrap
            .querySelector('.cog')
            .classList.add(this.sel.draw);
    }

    // Настройки открыты
    _openSettings() {
        this._openTimingSettings();

        let open = () => {
            this.PhotoDownload.wrap.classList.add(this.sel.settings, this.sel.settings_open);
            setTimeout(() => {
                this.PhotoDownload.wrap
                    .querySelector('.cog')
                    .classList.add(this.sel.draw_fill);
            }, this.timings.settings_open);
        }

        if (this.PhotoDownload.settings.show_size) {
            open();
        } else {
            // Если сначала нужно выдвинуть кнопку
            this.PhotoDownload.wrap.classList.add(this.sel.slide_in);
            setTimeout(() => {
                open();
            }, this.timings.btn_transition_transform);
        }
    }

    // Запуск закрытия настроек
    _closeSettings() {
        let close = () => {
            this.PhotoDownload.wrap.classList.remove(this.sel.icon_cog);
            this.PhotoDownload.wrap.classList.remove(this.sel.settings);

            // if (!this.PhotoDownload.settings.show_size) {
            setTimeout(() => {
                this.PhotoDownload.wrap.classList.remove(this.sel.slide_in);
            }, this.timings.btn_transition_transform);
            // }
        }

        this.PhotoDownload.wrap
            .querySelector('.cog')
            .classList.remove(this.sel.draw, this.sel.draw_fill);
        this.PhotoDownload.wrap.classList.remove(this.sel.settings_open);

        setTimeout(() => {
            close();
        }, this.timings.settings_open);
    }

    // Установить один или несколько обработчиков на элемент
    // Если на элементе были другие обработчики - они удаляются
    // В итоге на элементе гарантировано только переданный набор обработчиков
    set(elem, handler_name, event_name = this.default_event_name) {
        if (!elem || !handler_name) return false;

        let result = true;

        // Удаляем все уже имеющиеся обработчики
        this.removeAll(elem, event_name);

        // Ставим нужные
        if (handler_name instanceof Array) {
            handler_name.forEach(name => {
                this.add(elem, name, event_name);
            });
        } else if (typeof handler_name === 'string') {
            this.add(elem, handler_name, event_name);
        } else {
            result = false;
        }

        return result;
    }

    // Добавить обработчик с переданным именем на элемент
    add(elem, handler_name, event_name = this.default_event_name) {
        if (!elem || !handler_name || !this.getHandler(handler_name)) return false;

        elem.addEventListener(event_name, this.getHandler(handler_name));

        return true;
    }

    // Удалить обработчик с переданным именем с элемента
    remove(elem, handler_name, event_name = this.default_event_name) {
        if (!elem || !handler_name || !this.getHandler(handler_name)) return false;

        elem.removeEventListener(event_name, this.getHandler(handler_name));

        return true;
    }

    // Удалить все обработчики с элемента
    removeAll(elem, event_name = this.default_event_name) {
        if (!elem) return false;

        for (let handler in this.handlers) {
            elem.removeEventListener(event_name, this.getHandler(handler));
        }

        return true;
    }

    // Получить имена всех обработчиков
    getHandlersNames() {
        return Object.keys(this.handlers);
    }

    // Получить объект всех функций-обработчиков
    getHandlers() {
        return this.handlers;
    }

    // Получить функцию-обработчик
    getHandler(handler_name) {
        return this.handlers[handler_name];
    }

    // === Служебные ===

    tempClass(class_name, timeout, elem) {
        if (elem instanceof Event) {
            elem = elem.currentTarget;
        } else if (typeof elem === 'string') {
            elem = document.querySelector(elem);
        } else if (elem === undefined) {
            elem = this;
        }

        elem.classList.remove(class_name);

        setTimeout(() => {
            elem.classList.add(class_name);
        }, 0);

        setTimeout(() => {
            elem.classList.remove(class_name);
        }, timeout);
    }

    // === Обработчики ===

    // Меняет настройку показа разрешения картинки при наведении
    _showSizeHandler(e) {
        this.PhotoDownload.settings.show_size = e.target.checked;
    }

    // Меняет настройку режима скачивания
    _downloadModeHandler(e) {
        let value = e.target.value;

        if (value === 'true') {
            this.PhotoDownload.settings.download_mode = true;
        } else if (value === 'false') {
            this.PhotoDownload.settings.download_mode = false;
        }
    }

    // Отменяет действие браузера
    _preventHandler(e) {
        e.preventDefault();
        return false;
    }

    // Обработчик кнопки для режима открытия в новой вкладке
    _newTabHandler(e) {
        this.remove(e.currentTarget, 'newTabHandler');
        return true;
    }

    // Обработчик кнопки для режима скачивания
    _downloadHandler(e) {
        e.preventDefault();
        Download(e.currentTarget.href);

        this.remove(e.currentTarget, 'downloadHandler');
        return false;
    }
}