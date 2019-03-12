// Класс для шаблонизации верстки кнопки и ее стилей
export default class PhotoDownloadTemplates {
    constructor(params = {}) {
            // Переданный объект селекторов
            this.sel = params.selectors;

            // Объект, генерирующий разноцветные иконки
            this.icons = {
                _colors: {
                    green: '#00B75A',
                    red: '#F92672',
                    white: '#FFFFFF',
                    yellow: '#FFC000',
                },
                _prefix: 'data:image/svg+xml;charset=utf-8,',
                _template: {
                    /* html */
                    arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16">
                                <path fill="{{color}}" d="M 4,0 4,8 0,8 8,16 16,8 12,8 12,0 4,0 z"/>
                            </svg>`,
                    /* html */
                    ok: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" version="1.1" viewbox="0 0 512 512">
                            <path fill="{{color}}" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                        </svg>`,
                    /* html */
                    cog: `<svg class="cog" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435.29151 456.46127" version="1.1" width="435.2915" height="456.46127">
                            <g transform="translate(-155.4149,40.478503)">
                                <path class="cog_path" style="display:inline;stroke:{{color}};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1"
                                    d="m 258.15264,70.630447 c 25.28637,-22.526545 48.63737,-34.408525 71.039,-41.069 v -53.478 c 30.41876,-5.863806 59.48563,-4.968141 87.738,0 v 53.479 c 28.8038,8.565535 51.61963,23.119045 71.039,41.069 l 46.309,-26.759995 c 21.86242,23.783755 35.04856,49.293465 43.929,75.968998 l -46.329,26.74 c 6.50875,27.35967 6.5082,54.71933 0,82.079 l 46.329,26.74 c -8.99458,28.70805 -24.09088,53.75507 -43.929,75.957 l -46.309,-26.74 c -22.06268,20.9628 -46.09268,33.0726 -71.039,41.059 v 53.479 c -31.59152,6.25473 -60.47926,5.29935 -87.738,0 v -53.479 c -25.4605,-7.63148 -49.19415,-21.13429 -71.039,-41.059 l -46.309,26.74 c -20.18428,-21.75708 -33.84909,-47.70525 -43.929,-75.958 l 46.329,-26.74 c -7.19947,-30.9594 -5.78496,-57.61181 0,-82.079 l -46.329,-26.74 c 10.39157,-30.733913 25.59075,-55.349053 43.929,-75.968998 z"/>
                            </g>
                            <g transform="translate(-2.3153218e-6)">
                                <g transform="translate(-9.9997883,-9.9949418)">
                                    <circle class="cog_circle" cx="227.64554" cy="238.22559" r="78.324982"
                                        style="stroke:{{color}};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
                                </g>
                            </g>
                        </svg>`,
                    /* html */
                    circle: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="{{color}}" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path>
                            </svg>`,
                    /* html */
                    check_circle: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="{{color}}" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                                </svg>`,
                },
                _temp(template, color) {
                    let _template = this._template[template] ? this._template[template] : this._template.arrow;
                    return _template.replace(/\{\{.*\}\}/gm, color ? color : 'white');
                },
                get(color, template, url = true) {
                    let _color = this._colors[color] ? this._colors[color] : color;
                    let svg = this._temp(template, _color).replace(/[\s]{2,}/gm, ' ');
                    return url ? this._prefix + encodeURIComponent(svg) : svg;
                }
            };
        } // constructor

    // Метод для отображения размеров картинки в кнопке
    setSize(size, image_data) {
        if (image_data.width && image_data.height) {
            size.classList.remove(this.sel.non_size);
            size.textContent = `${image_data.width}x${image_data.height}`;
        } else {
            size.classList.add(this.sel.non_size);
            size.textContent = '';
        }
    }

    // Метод создания контейнера с кнопкой
    createDownloadContainer(parent) {
        let wrap = document.createElement('div');
        wrap.id = this.sel.photoDownload_id;

        // Заполнение контейнера внутренними элементами
        wrap.innerHTML = this.getInnerElems();

        setTimeout(() => {
            wrap.classList.add(this.sel.ready);
            // Для теста, чтобы настройки сразу открыты были
            wrap.classList.add(this.sel.settings);
            wrap.classList.add(this.sel.settings_open);

            wrap.querySelector('.cog').classList.add(this.sel.draw);
        }, 0);

        parent.appendChild(wrap);

        return wrap;
    }

    // Метод, генерирующий верстку самой кнопки
    getInnerElems() {
        return /* html */ `
            <div class="${this.sel.get('sett.settings_wrap')}">
                <div class="${this.sel.get('sett.settings')}">
                    <div class="${this.sel.get('sett.settings_header')}">
                        <div class="${this.sel.get('sett.settings_header_ico')}"></div>
                        <div class="${this.sel.get('sett.settings_header_text')}">Режим клика</div>
                    </div>
                    <div class="${this.sel.get('sett.settings_body')}">
                        <ul class="${this.sel.get('sett.settings_mode')}">
                            <li class="${this.sel.get('sett.settings_item')}">
                                <input type="radio" id="${this.sel.download_mode_true}" name="download_mode" value="true" checked>
                                <label for="${this.sel.download_mode_true}" class="${this.sel.get('sett.settings_item_action')}">Скачать</label>
                            </li>
                            <li class="${this.sel.get('sett.settings_item')}">
                                <input type="radio" id="${this.sel.download_mode_false}" name="download_mode" value="false">
                                <label for="${this.sel.download_mode_false}" class="${this.sel.get('sett.settings_item_action')}">В новой вкладке</label>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <a class="${this.sel.get('btn.btn')}" href="#!" target="_blank" draggable="false">
                <div class="${this.sel.get('btn.icon')}">
                    ${this.icons.get('green', 'cog', false)}
                </div>
                <div class="${this.sel.get('btn.main_title_wrap')}">
                    <div class="${this.sel.get('btn.main_title_inner')}">
                        <div class="${this.sel.get('btn.size')}"></div>
                        <div class="${this.sel.get('btn.settings_title')}">Настройки</div>
                    </div>
                </div>
            </a>
        `;
    }

    // Метод, шаблонизирующий стили кнопки
    getStyleContent() {
            return /* css */ `
            #${this.sel.photoDownload_id} {
                background-color: transparent;
                border-top-left-radius: 0;
                color: #C3CFE0;
                display: flex;
                flex-direction: column;
                position: absolute;
                bottom: 0;
                left: 100%;
                opacity: 0;
                transform: translate3d(-38px, 0, 1px);
                will-change: transform, opacity;
                transition: opacity .25s ease-in-out, transform .25s ease-in-out !important;
            }
            
            .${this.sel.imgContainer_class}:hover #${this.sel.photoDownload_id}.${this.sel.ready} {
                opacity: .3;
            }
            
            .${this.sel.imgContainer_class} #${this.sel.photoDownload_id}.${this.sel.ready}:hover {
                opacity: .8;
                transform: translate3d(-100%, 0, 1px);
            }
            
            .${this.sel.get('btn.btn')} {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: #000;
                border-top-left-radius: 4px;
                color: #C3CFE0 !important;
            }
            
            .${this.sel.get('btn.btn')}:hover {
                text-decoration: none;
            }
            
            .${this.sel.get('btn.icon')} {
                background-image: url('${this.icons.get('white', 'arrow')}');
                background-size: contain;
                background-repeat: no-repeat;
                height: 18px;
                width: 18px;
            }
            
            .${this.sel.get('btn.btn')}:hover .${this.sel.get('btn.icon')} {
                background-image: url('${this.icons.get('green', 'arrow')}');
            }
            
            #${this.sel.photoDownload_id} .${this.sel.get('btn.size')}:not(.non_size) {
                padding-left: 10px;
                color: #C3CFE0 !important;
                flex-grow: 1;
                text-align: center;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} {
                opacity: .8 !important;
                transform: translate3d(-100%, 0, 1px);
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('btn.btn')} {
                border-top-left-radius: 0;
                position: relative;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('btn.btn')}:before {
                content: '';
                position: absolute;
                top: -1px;
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 30px);
                height: 1px;
                background-color: rgba(255, 255, 255, .1);
            }
            
            .${this.sel.get('btn.main_title_wrap')} {
                flex-grow: 1;
                height: 14px;
                overflow: hidden;
                text-align: center;
                user-select: none;
            }
            
            #${this.sel.get('photoDownload_id')} .${this.sel.get('btn.main_title_inner')} {
                will-change: transform;
                transition: transform .25s ease-out !important;
            }
            
            .${this.sel.get('btn.main_title_inner')} * {
                margin-bottom: 14px;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('btn.main_title_inner')} {
                transform: translate3d(0, -28px, 1px);
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('btn.icon')} {
                background-image: none;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('btn.icon')} .cog {
                width: 18px;
                height: 18px;
                transform: rotate(30deg);
            }
            
            #${this.sel.photoDownload_id}:not(.${this.sel.settings}) .${this.sel.get('sett.settings_wrap')} {
                height: 0;
                overflow: hidden;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings} .${this.sel.get('sett.settings_wrap')} {
                height: auto;
            }
            
            #${this.sel.get('photoDownload_id')} .${this.sel.get('sett.settings')} {
                background-color: #000;
                border-top-left-radius: 4px;
                font-size: 12px;
                width: 150px;
                will-change: transform;
                transform: translate3d(0, 100%, 1px);
                transition: transform .25s ease-out !important;
                user-select: none;
            }
            
            #${this.sel.photoDownload_id}.${this.sel.settings_open} .${this.sel.get('sett.settings')} {
                transform: translate3d(0, 0%, 1px);
            }
            
            .${this.sel.get('sett.settings_header')} {
                position: relative;
                display: flex;
                align-items: center;
                padding-right: 16px;
            }
            
            .${this.sel.get('sett.settings_header')}:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 30px);
                height: 1px;
                background-color: rgba(255, 255, 255, .1);
            }
            
            .${this.sel.get('sett.settings_body')} {
                padding: 10px;
            }
            
            .${this.sel.get('sett.settings_header_ico')} {
                background-image: url('${this.icons.get('white', 'ok')}');
                background-size: 16px 16px;
                background-position: center;
                background-repeat: no-repeat;
                padding: 6px 10px;
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            
            .${this.sel.get('sett.settings_header_ico')}:hover {
                background-image: url('${this.icons.get('green', 'ok')}');
            }
            
            .${this.sel.get('sett.settings_header_text')} {
                text-align: right;
                flex-grow: 1;
                cursor: default;
                font-weight: bold;
            }
            
            .${this.sel.get('sett.settings_mode')} {
                padding: 0;
                margin: 0;
                list-style: none;
                display: flex;
                flex-direction: column;
            }
            
            .${this.sel.get('sett.settings_item')} {
                display: flex;
                align-items: center;
                position: relative;
                cursor: pointer;
            }
            
            .${this.sel.get('sett.settings_item')}:not(:last-child) {
                margin-bottom: 5px;
            }
            
            .${this.sel.get('sett.settings_item')} input[type=radio] {
                margin: 0;
                display: none;
            }
            
            .${this.sel.get('sett.settings_item_action')} {
                display: flex;
                align-items: center;
                width: 100%;
                height: 18px;
                padding-left: 20px;
                cursor: pointer;
                background-image: url('${this.icons.get('white', 'circle')}');
                background-size: 14px 14px;
                background-repeat: no-repeat;
                background-position: 0 center;
            }
            
            .${this.sel.get('sett.settings_item_action')}:hover {
                background-image: url('${this.icons.get('green', 'circle')}');
            }
            
            .${this.sel.get('sett.settings_item')} input[type=radio]:checked~.${this.sel.get('sett.settings_item_action')} {
                background-image: url('${this.icons.get('white', 'check_circle')}');
            }
            
            .${this.sel.get('sett.settings_item')} input[type=radio]:checked~.${this.sel.get('sett.settings_item_action')}:hover {
                background-image: url('${this.icons.get('green', 'check_circle')}');
            }
            
            .cog .cog_circle {
                fill: none;
                fill-opacity: 0;
                stroke-width: 25;
            }
            
            #${this.sel.get('photoDownload_id')} .cog.${this.sel.draw} .cog_path {
                transition: stroke-dashoffset .5s linear, fill-opacity .1s ease-out !important;
                stroke-dashoffset: 0;
            }

            #${this.sel.get('photoDownload_id')} .cog .cog_path {
                fill: none;
                fill-opacity: 0;
                stroke-width: 25;
                stroke-dasharray: 1669;
                stroke-dashoffset: 1669;
                transition: stroke-dashoffset .1s linear, fill-opacity .1s ease-out !important;
            }
            
            #${this.sel.photoDownload_id} .cog.${this.sel.draw_fill} .cog_path {
                fill: #00b75a;
                fill-opacity: 1;
            }
            
            #${this.sel.photoDownload_id} .cog.${this.sel.draw_fill} .cog_circle {
                fill: #000;
                stroke-width: 15;
                fill-opacity: 1;
            }
        `;
        } // getStyleContent

}