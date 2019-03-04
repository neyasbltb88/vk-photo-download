// --- Дополнительные инструменты ---
function liveReloadClientInit() {
    if (!window.liveReloadClient) {
        window.liveReloadClient = true;

        class LiveReloadClient {
            constructor(activate_livereload) {
                this.live_reload_url = 'http://localhost:35729/livereload.js';
                this.server_url = 'http://localhost:3000';
                this.scripts = [];
                this.scripts_url = [];
                this.activate_livereload = activate_livereload;
                this.livereload_loaded = false;
                this.work_scripts_loaded = false;
                this.state_livereload = null;
                this.btn = null;
                this.btn_base_class = 'live-reload-btn';
                this.btn_style_hide = [
                    ' position: fixed;',
                    'min-height: 40px;',
                    'top: 0;',
                    'left: 0;',
                    'padding: 0 5px;',
                    'font-size: 10px;',
                    'align-items: center;',
                    'border-radius: 5px;',
                    'background-color: rgba(37, 48, 60, .7);',
                    'box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.42);',
                    'cursor: pointer;',
                    'z-index: 9999;',
                    'user-select: none;',
                    'display: none;'
                ].join(' ');

                this.btn_style_ready = this.btn_style_hide + [
                    ' display: flex;',
                    'color: #C3CFE0 !important;',
                    'border: 1px solid #C3CFE0 !important;',
                ].join(' ');

                this.btn_style_disable = this.btn_style_ready + [
                    ' cursor: default;',
                    'opacity: .3;',
                ].join(' ');

                this.btn_style_active = this.btn_style_hide + [
                    ' display: flex;',
                    'color: #ffc000 !important;',
                    'border: 1px solid #ffc000 !important;',
                ].join(' ');

                this.btn_style_error = this.btn_style_hide + [
                    ' display: flex;',
                    'color: #F92672 !important;',
                    'border: 1px solid #F92672 !important;',
                ].join(' ');



                // Точка входа
                this.init();
            }

            // Метод инъекции массива скриптов на страницу
            // TODO: проверять абсолютность src
            insertScripts(scripts) {
                scripts.forEach(script => {
                    if (script.src === this.live_reload_url) return;

                    this.scripts_url.push(script.src);

                    let elem = document.createElement('script');
                    script.src ? elem.src = script.src : null;
                    script.className ? elem.className = script.className : null;
                    script.id ? elem.id = script.id : null;
                    script.textContent ? elem.textContent = script.textContent : null;

                    let show_name = script.id || script.className || script.src
                    console.log('%c%s', (window.log_color) ? window.log_color.yellow : '', `*ScriptsAutoload* подключение скрипта: ${show_name}`);

                    document.head.appendChild(elem);
                });

                this.work_scripts_loaded = true;
            }

            // Метод сбора скриптов, подключенных к html на сервере
            fetchScriptsUrl(server_url) {
                fetch(server_url, { mode: 'cors' })
                    .then(response => response.text())
                    .then(text => {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(text, "text/html");

                        let scripts_selector = 'script:not(#__bs_script__)';

                        this.scripts = Array.from(doc.querySelectorAll(scripts_selector));

                        this.insertScripts(this.scripts);
                    })
                    .catch(err => {
                        console.log('%c%s', (window.log_color) ? window.log_color.red : '', '*ScriptsAutoload* не удалось подключить рабочие скрипты');
                        console.log(err);
                    })
            }

            stateLiveReloadButton(state = {}) {
                this.btn.setAttribute('style', this[`btn_style_${state.state}`]);
                this.btn.className = `${this.btn_base_class} live-reload-${state.state}`;
            }

            handlerLiveReloadButton(e) {
                if (e.target.classList.contains('live-reload-disable')) {
                    return;
                } else if (window.LiveReload && e.target.classList.contains('live-reload-ready')) {
                    // console.log('LiveReload загружен, кнопка ready');

                    LiveReload.connector.connect();
                } else if (window.LiveReload && e.target.classList.contains('live-reload-active')) {
                    // console.log('LiveReload загружен, кнопка active');

                    LiveReload.connector.disconnect();
                } else if (!window.LiveReload && e.target.classList.contains('live-reload-ready')) {
                    // console.log('LiveReload не загружен, кнопка ready');

                    if (document.querySelector('script.live_reload_client')) {
                        document.querySelector('script.live_reload_client').remove();
                    }

                    this.fetchLiveReloadScript(this.live_reload_url);
                } else if (window.LiveReload && e.target.classList.contains('live-reload-error')) {
                    // console.log('LiveReload загружен, кнопка error');

                    LiveReload.connector.connect();
                } else if (!window.LiveReload && e.target.classList.contains('live-reload-error')) {
                    // console.log('LiveReload не загружен, кнопка error');

                    this.stateLiveReloadButton({
                        state: 'ready',
                    });

                    if (document.querySelector('script.live_reload_client')) {
                        document.querySelector('script.live_reload_client').remove();
                    }

                    this.fetchLiveReloadScript(this.live_reload_url);
                }

            }

            // Установить обработчики события коннекта/дисконнекта скрипта livereload с сервером
            handlerLiveReloadConnect() {
                // Коннект
                LiveReload.connector.handlers.connected = () => {
                    console.log('%c%s', (window.log_color) ? window.log_color.green : '', '*ScriptsAutoload* livereload подключен к серверу');
                    this.state_livereload = 'connect';
                    this.stateLiveReloadButton({
                        state: 'active',
                    });

                    if (!this.work_scripts_loaded) {
                        this.fetchScriptsUrl(this.server_url);
                    }

                }

                // Дисконнект
                LiveReload.connector.handlers.disconnected = (reason, delay) => {
                    console.log('%c%s', (window.log_color) ? window.log_color.red : '', '*ScriptsAutoload* livereload отключен от сервера');

                    console.log(`Причина дисконнекта: ${reason}`);

                    if (reason === 'manual') {
                        this.stateLiveReloadButton({
                            state: 'ready',
                        });
                    } else if (reason === 'broken' && this.state_livereload !== 'manual') {
                        this.stateLiveReloadButton({
                            state: 'error',
                        });

                        console.log(`Переподключение через: ${delay}`);
                    } else if (reason === 'broken' && this.state_livereload === 'manual') {
                        this.stateLiveReloadButton({
                            state: 'ready',
                        });
                    } else if (reason === 'cannot-connect') {
                        this.stateLiveReloadButton({
                            state: 'error',
                        });

                        console.log(`Переподключение через: ${delay}`);
                    }

                    this.state_livereload = reason;
                }

                // Ошибка
                LiveReload.connector._onerror = (error) => {
                    console.log('Событие ошибки', error);
                }

                // Из-за такого не срабатывает перезагрузка
                // LiveReload.connector.handlers.message = (message) => {
                // console.log('Событие сообщения', message);
                // }
            }

            // Не лагающая рекурсивная проверка доступности body
            checkBody(callback, arg) {
                requestAnimationFrame(function launch(arg) {
                    if (!document.body) {
                        requestAnimationFrame(launch.bind(this, arg));
                    } else {
                        callback.call(this, arg);
                    }
                }.bind(this, arg))
            }

            insertLiveReloadButton(btn) {
                document.body.appendChild(btn);

                if (this.state_livereload === 'connect') {
                    this.stateLiveReloadButton({
                        state: 'active',
                    });
                } else if (this.state_livereload === 'manual') {
                    liveReloadClient.stateLiveReloadButton({ state: 'ready' });
                } else if (this.state_livereload === null) {
                    liveReloadClient.stateLiveReloadButton({ state: 'ready' });
                } else {
                    liveReloadClient.stateLiveReloadButton({ state: 'error' });
                }

            }

            createLiveReloadButton() {
                let btn = document.createElement('div');
                btn.classList.add(this.btn_base_class);
                btn.textContent = 'LiveReload';

                // btn.setAttribute('style', this.btn_style_hide);

                btn.addEventListener('click', this.handlerLiveReloadButton.bind(this));

                this.btn = btn;

                this.checkBody(this.insertLiveReloadButton, btn);
            }

            // livereload скрипт успешно загружен
            fetchLiveReloadScriptSuccess() {
                console.log('%c%s', (window.log_color) ? window.log_color.yellow : '', '*ScriptsAutoload* загружен скрипт livereload');

                this.livereload_loaded = true;

                // Когда скрипт будет загружен, подвязаться к событиям livereload
                this.handlerLiveReloadConnect();

                this.stateLiveReloadButton({
                    state: 'active',
                });

            }

            // Ошибка загрузки livereload скрипта
            fetchLiveReloadScriptError() {
                console.log('%c%s', (window.log_color) ? window.log_color.red : '', '*ScriptsAutoload* не удалось подключить livereload');
                this.stateLiveReloadButton({
                    // state: 'ready',
                    state: 'error',
                });

                if (!this.work_scripts_loaded) {
                    this.fetchScriptsUrl(this.server_url);
                }

            }

            // Метод подгрузки скрипта автоматического обновления страницы
            fetchLiveReloadScript(live_reload_url) {
                if (!document.querySelector('script.live_reload_client')) {
                    let live_reload_client = document.createElement('script');
                    live_reload_client.className = 'live_reload_client';
                    live_reload_client.src = live_reload_url;

                    live_reload_client.addEventListener('load', () => {
                        this.fetchLiveReloadScriptSuccess();
                    });
                    live_reload_client.addEventListener('error', () => {
                        this.fetchLiveReloadScriptError();
                    });

                    document.head.appendChild(live_reload_client);

                    // // Если еще нет кнопки
                    // if (!document.querySelector(`.${this.btn_base_class}`)) {
                    //     // Создать кнопку управления livereload
                    //     this.createLiveReloadButton();
                    // }
                }
            }

            init() {
                if (this.activate_livereload !== false) {
                    // Подключение скрипта автоматического обновления страницы
                    // Для его работы должен быть запущен сервер livereload
                    this.fetchLiveReloadScript(this.live_reload_url);
                }



                // Если еще нет кнопки
                if (!document.querySelector(`.${this.btn_base_class}`)) {
                    // Создать кнопку управления livereload
                    this.createLiveReloadButton();
                }

            }

        }


        window.liveReloadClient = new LiveReloadClient();
    }
}

// === Дополнительные инструменты ===



/////////////////////////////////////////////////////////////
//          === ЗДЕСЬ ИНИЦИАЛИЗАЦИЯ СКРИПТОВ ====          //
/////////////////////////////////////////////////////////////
// Не будем запускать скрипт, если скрипт загрузился в iframe.
// Нужно для того, чтобы скрипт повторно не срабатывал из iframe
if (window.top === window) {

    window.log_color = {
        green: [
            'color: #272822;',
            'background-color: #A6E22E;',
            'padding: 2px 10px;',
            'width: 100%'
        ].join(' '),
        red: [
            'color: #272822;',
            'background-color: #F92672;',
            'padding: 2px 10px;'
        ].join(' '),
        yellow: [
            'color: #272822;',
            'background-color: #E6DB74;',
            'padding: 2px 10px;'
        ].join(' '),
        orange: [
            'color: #272822;',
            'background-color: #FD971F;',
            'padding: 2px 10px;'
        ].join(' '),
        blue: [
            'color: #272822;',
            'background-color: #66D9EF;',
            'padding: 2px 10px;'
        ].join(' '),
        purple: [
            'color: #272822;',
            'background-color: #AE81FF;',
            'padding: 2px 10px;'
        ].join(' ')
    };

    console.log('%c%s', (window.log_color) ? window.log_color.green : '', `*ScriptsAutoload* Скрипт запущен на странице: ${document.title}`);

    // --- Подключение дополнительных инструментов ---

    liveReloadClientInit();

    // === Подключение дополнительных инструментов ===

    window.addEventListener('load', () => {
        // Если нужен запуск после загрузки страницы

    });
}