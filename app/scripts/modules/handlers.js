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
                closeTimingSettings: () => this.PhotoDownload.state.settings = 'close_timing',
                downloadModeHandler: this._downloadModeHandler.bind(this),
            }

            this.timers = {
                delay: null,
                open: null,
            };
        } // constructor

    setSettingsState() {
        let wrap = this.PhotoDownload.wrap;
        if (!wrap) return false;

        let download_mode = this.PhotoDownload.settings.download_mode.toString();
        let download_mode_block = wrap.querySelector('.' + this.sel.get('sett.download_mode'));
        let download_mode_control = download_mode_block.querySelector(`input[value=${download_mode}]`);
        download_mode_control.checked = true;
    }

    setHandlers() {
        let wrap = this.PhotoDownload.wrap;
        if (!wrap) return false;

        let btn = wrap.querySelector('.' + this.sel.get('btn.btn'));

        this.set(btn, 'startTimer', 'mousedown');
        this.set(btn, 'checkTimer', 'mouseup');
        this.set(btn, 'checkTimer', 'mouseleave');
        this.set(btn, 'preventHandler', 'click');

        let settings_wrap = wrap.querySelector('.' + this.sel.get('sett.settings_wrap'));
        this.set(settings_wrap, 'closeWatcher', 'transitionend');

        let btn_close = wrap.querySelector('.' + this.sel.get('sett.settings_header_ico'));
        this.set(btn_close, 'closeTimingSettings', 'click');

        let download_mode = wrap.querySelector('.' + this.sel.get('sett.download_mode'));
        this.set(download_mode, 'downloadModeHandler', 'change');
    }

    applyState() {
        let state = this.PhotoDownload.state;

        switch (state.settings) {
            case 'open_timing':
                this._openTimingSettings();
                break;

            case 'open':
                this._openSettings();
                break;

            case 'close_timing':
                this._closeTimingSettings();
                break;

            case 'close':
                this._closeSettings();
                break;

            default:
                break;
        }
    }

    _startTimer(e) {
        if (e.which !== 1) return false;

        if (this.PhotoDownload.state.settings == 'close') {
            this.timers.delay = setTimeout(() => {
                this.PhotoDownload.state.settings = 'open_timing';

                this.timers.open = setTimeout(() => {
                    this.PhotoDownload.state.settings = 'open';
                }, this.timings.open);

            }, this.timings.delay);
        } else if (this.PhotoDownload.state.settings == 'open') {
            setTimeout(() => {
                if (this.PhotoDownload.state.settings == 'open') {
                    this.PhotoDownload.state.settings = 'close_timing';
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
                this.set(e.currentTarget, 'downloadHandler');
            } else {
                this.set(e.currentTarget, 'newTabHandler');
            }
        }

        // Если быстрый клик и настройки открыты, то будет обработчик закрытия настроек
        if (this.timers.delay && !this.timers.open && this.PhotoDownload.state.settings == 'open') {
            this.PhotoDownload.state.settings = 'close_timing';
        }

        // Долгий клик и настройки открыты
        if (this.timers.delay && this.timers.open && this.PhotoDownload.state.settings == 'open') {
            // // Здесь настройки должны быть уже открыты и для события клика, 
            // // которое будет сразу после этого mouseup, блокируем действие
            this.set(e.currentTarget, 'preventHandler');
        }

        if (this.PhotoDownload.state.settings == 'open_timing') {
            this.set(e.currentTarget, 'preventHandler');
            this.PhotoDownload.state.settings = 'close_timing';
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
        this.PhotoDownload.wrap.classList.add(this.sel.icon_cog);
        this.PhotoDownload.wrap
            .querySelector('.cog')
            .classList.add(this.sel.draw_fill, this.sel.draw);
        this.PhotoDownload.wrap.classList.add(this.sel.settings);
        this.PhotoDownload.wrap.classList.add(this.sel.settings_open);
    }

    // Запуск закрытия настроек
    _closeTimingSettings() {
        this.PhotoDownload.wrap
            .querySelector('.cog')
            .classList.remove(this.sel.draw, this.sel.draw_fill);
        this.PhotoDownload.wrap.classList.remove(this.sel.settings_open);

        setTimeout(() => {
            this.PhotoDownload.state.settings = 'close';
        }, this.timings.close_settings);
    }

    // Настройки закрыты
    _closeSettings() {
        this.PhotoDownload.wrap.classList.remove(this.sel.icon_cog);
        this.PhotoDownload.wrap.classList.remove(this.sel.settings);
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

    // === Обработчики ===

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
        console.log('_preventHandler');
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