export default class PhotoDownloadTemplates {
    constructor(params = {}) {
            this.selectors = params.selectors;

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
        } // constructor

    getInnerElems() {
        return /* html */ `
            <a class="${this.selectors.PhotoDownload_btn}" href="#!" target="_blank" draggable="false">
                <div class="${this.selectors.PhotoDownload_icon}"></div>
                <div class="${this.selectors.PhotoDownload_size}"></div>
            </a>
        `;
    }

    getStyleContent() {
            return /* css */ `
        #${this.selectors.photoDownload_id} {
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
        .${this.selectors.imgContainer_class}:hover #${this.selectors.photoDownload_id}.${this.selectors.ready} {
            opacity: .3;
        }
        .${this.selectors.imgContainer_class} #${this.selectors.photoDownload_id}.${this.selectors.ready}:hover {
            opacity: .8;
            transform: translate3d(-100%, 0, 1px);
        }
        .${this.selectors.PhotoDownload_btn} {
            display: flex;
            align-items: center;
            padding: 10px;
        }
        .${this.selectors.PhotoDownload_btn}:hover {
            text-decoration: none;
        }
        .${this.selectors.PhotoDownload_icon} {
            background-image: url('${this.icons.get('white')}');
            background-size: contain;
            background-repeat: no-repeat;
            height: 18px;
            width: 18px;
        }
        .${this.selectors.PhotoDownload_btn}:hover .${this.selectors.PhotoDownload_icon} {
            background-image: url('${this.icons.get('green')}');
        }
        #${this.selectors.photoDownload_id} .${this.selectors.PhotoDownload_size}:not(.${this.selectors.non_size}) {
            padding-left: 10px;
            color: #C3CFE0 !important;
        }
        `;
        } // getStyleContent

}