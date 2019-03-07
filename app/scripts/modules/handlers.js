import Download from 'downloadjs';

export default class HandlersManager {
    constructor(params = {}) {
            this.PhotoDownload = params.PhotoDownload;
            this.default_event_name = 'click';

            this.handlers = {
                testHandler: this._testHandler,
                preventHandler: this._preventHandler,
                preventStopHandler: this._preventStopHandler,
                newTabHandler: this._newTabHandler,
                downloadHandler: this._downloadHandler,
            }
        } // constructor

    // Установить один или несколько обработчиков на элемент
    // Если на элементе были другие обработчики - они удаляются
    // В итоге на элементе гарантировано только переданный набор обработчиков
    set(elem, handler_name, event_name = this.default_event_name) {
        if (!elem) return false;

        let result = true;
        this.removeAll(elem, event_name);

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
        if (!elem || !handler_name || !this.handlers[handler_name]) return false;

        elem.addEventListener(event_name, this.handlers[handler_name]);

        return true;
    }

    // Удалить обработчик с переданным именем с элемента
    remove(elem, handler_name, event_name = this.default_event_name) {
        if (!elem || !handler_name || !this.handlers[handler_name]) return false;

        elem.removeEventListener(event_name, this.handlers[handler_name]);

        return true;
    }

    // Удалить все обработчики с элемента
    removeAll(elem, event_name = this.default_event_name) {
        if (!elem) return false;

        for (let handler in this.handlers) {
            elem.removeEventListener(event_name, this.handlers[handler]);
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

    _testHandler() {
        alert('_testHandler');
    }

    // Отменяет действие браузера
    _preventHandler(e) {
        e.preventDefault();
        return false;
    }

    // Останавливает всплытие, другие обработчики и отменяет действие браузера
    _preventStopHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }

    // Обработчик кнопки для режима открытия в новой вкладке
    _newTabHandler() {
        return true;
    }

    // Обработчик кнопки для режима скачивания
    _downloadHandler(e) {
        e.preventDefault();
        console.log('_downloadHandler');
        Download(e.currentTarget.href);
        return false;
    }
}