import template_html from './template-html';
import template_css from './template-css';

// Класс для шаблонизации верстки кнопки и ее стилей
export default class PhotoDownloadTemplates {
    constructor(params = {}) {
            // Переданный объект селекторов
            this.sel = params.selectors;

            // Переданный объект таймингов
            this.timings = params.timings;

            // Объект, генерирующий разноцветные иконки
            this.icons = {
                _colors: {
                    green: '#00B75A',
                    red: '#F92672',
                    white: '#FFFFFF',
                    yellow: '#FFC000',
                    black: '#000000',
                    grey: '#C3CFE0',
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
                    /* html */
                    square: `<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="{{color}}" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
                            </svg>`,
                    /* html */
                    check_square: `<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="{{color}}" d="M400 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zm-204.686-98.059l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L184 302.745l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.25 16.379 6.25 22.628.001z"></path>
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


    setLoadedUrl(wrap, setting_active, check) {
        if (!wrap) return null;

        let btn = wrap.querySelector('.' + this.sel.get('btn.btn'));
        let icon = btn.querySelector('.' + this.sel.get('btn.icon'));

        if (setting_active && check) {
            btn.classList.add(this.sel.get('loaded_urls_active'));
            icon.title = 'Это изображение уже было скачено ранее';
        } else {
            btn.classList.remove(this.sel.get('loaded_urls_active'));
            icon.title = '';
        }
    }

    // Метод для отображения размеров картинки в кнопке
    setSize(wrap, image_data, non_size) {
        let size = wrap.querySelector('.' + this.sel.get('btn.size'));

        if (image_data.width && image_data.height) {
            if (non_size) {
                wrap.classList.remove(this.sel.non_size);
            } else {
                wrap.classList.add(this.sel.non_size);
            }

            size.textContent = `${image_data.width}x${image_data.height}`;
        } else {
            wrap.classList.add(this.sel.non_size);
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
        }, 0);

        parent.appendChild(wrap);

        return wrap;
    }

    // Метод добавления на страницу стилей, необходимых для работы PhotoDownload
    injectCSS() {
        let style = document.createElement('style');
        style.id = this.sel.style_id;
        style.textContent = this.getStyleContent();

        document.head.appendChild(style);
    }

    // Метод, генерирующий верстку самой кнопки
    getInnerElems() {
        return template_html(this.sel, this.timings, this.icons);
    }

    // Метод, шаблонизирующий стили кнопки
    getStyleContent() {
        return template_css(this.sel, this.timings, this.icons);
    }
}