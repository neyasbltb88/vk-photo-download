export default function(sel, timings, icons) {

    return /* css */ `
    #${sel.photoDownload_id} {
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
        transition: opacity ${timings.btn_transition_opacity}ms ease-in-out, transform ${timings.btn_transition_transform}ms ease-in-out !important;
    }

    /* При наведении на блок картинки в просмотрщике */
    .${sel.imgContainer_class}:hover #${sel.photoDownload_id}.${sel.ready} {
        opacity: .3;
    }
    /* При наведении на wrap кнопки */
    .${sel.imgContainer_class} #${sel.photoDownload_id}.${sel.ready}:hover {
        opacity: .8;
    }
    /* Если размер картинки должен отображаться */
    #${sel.photoDownload_id}.${sel.ready}:not(.${sel.non_size}):hover {
        transform: translate3d(-100%, 0, 1px);
    }

    /* Если размер картинки не должен отображаться, в кнопке будет всегда слово "Настройки" */
    #${sel.photoDownload_id}.${sel.non_size} .${sel.get('btn.main_title_inner')} {
        transform: translate3d(0, -29px, 1px);
    }

    /* Выдвинуть кнопку при наличии slide_in */
    #${sel.photoDownload_id}.${sel.ready}.${sel.slide_in} {
        opacity: .8;
        transform: translate3d(-100%, 0, 1px);
    }

    /* Режим быстрого скачивания */
    #${sel.photoDownload_id}.${sel.ready}.${sel.watch_mode},
    .${sel.imgContainer_class}:hover #${sel.photoDownload_id}.${sel.watch_mode} {
        opacity: .8;
    }

    #${sel.photoDownload_id}.${sel.ready}.${sel.watch_mode}:not(.${sel.non_size}) {
        transform: translate3d(-100%, 0, 1px);
    }

    /* Режим быстрого скачивания при показе разрешения картинки и большой кнопке */
    #${sel.photoDownload_id}.${sel.watch_mode}:not(.${sel.non_size}):not(.${sel.icon_cog}) .${sel.get('btn.btn')} {
        border: 1px solid ${icons._colors.green} !important;
        border-top-left-radius: 4px;
    }
    #${sel.photoDownload_id}.${sel.watch_mode}:not(.${sel.non_size}):not(.${sel.icon_cog}) .${sel.get('btn.btn')}.${sel.get('loaded_urls_active')} {
        border: 1px solid ${icons._colors.yellow} !important;
        border-top-left-radius: 4px;
    }

    /* Режим быстрого скачивания при отключенном показе разрешения и маленкой кнопке */
    #${sel.photoDownload_id}.${sel.watch_mode}.${sel.non_size}:not(.${sel.icon_cog}) .${sel.get('btn.icon')} {
        border: 1px solid ${icons._colors.green} !important;
        border-top-left-radius: 4px;
    }
    #${sel.photoDownload_id}.${sel.watch_mode}.${sel.non_size}:not(.${sel.icon_cog}) .${sel.get('loaded_urls_active')} .${sel.get('btn.icon')} {
        border: 1px solid ${icons._colors.yellow} !important;
        border-top-left-radius: 4px;
    }


    .${sel.get('btn.btn')} {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 10px 0 0;
        background-color: #000;
        border-top-left-radius: 4px;
        color: #C3CFE0 !important;
        box-sizing: border-box;
    }

    .${sel.get('btn.btn')}:hover {
        text-decoration: none;
    }

    .${sel.get('btn.icon')} {
        background-image: url('${icons.get('white', 'arrow')}');
        background-size: contain;
        background-repeat: no-repeat;
        height: 18px;
        width: 18px;
        position: relative;
        padding: 9px;
        background-size: 18px 18px;
        background-position: center;
    }

    /* Эффект скачивания */
    .${sel.get('btn.icon')}:before {
        content: '';
        background-image: url('${icons.get('white', 'arrow')}');
        background-size: contain;
        background-repeat: no-repeat;
        height: 18px;
        width: 18px;
        position: absolute;
        left: 50%;
        top: 50%;
        opacity: .8;
        will-change: transform, opacity;
        transform: translate(-50%, -50%);
        transition: transform ${timings.settings_open - 100}ms cubic-bezier(.22,.73,.43,.65), opacity ${timings.settings_open}ms cubic-bezier(.38,.75,.46,1) !important;
    }

    .${sel.get('btn.icon')}.${sel.get('btn.download_effect')}:before {
        transition: transform ${timings.settings_open + 100}ms cubic-bezier(.5,.69,.2,1.6), opacity ${timings.settings_open + 100}ms ease-in-out !important;
        transform: translate(-50%, -50%) scale3d(2, 2, 2);
        opacity: .1;
    }

    .${sel.get('btn.btn')}:hover .${sel.get('btn.icon')},
    .${sel.get('btn.btn')}:hover .${sel.get('btn.icon')}:before {
        background-image: url('${icons.get('green', 'arrow')}');
    }

    .${sel.watch_mode} .${sel.get('btn.icon')},
    .${sel.watch_mode} .${sel.get('btn.icon')}:before {
        background-image: url('${icons.get('green', 'arrow')}');
    }

    /* Отметка о ранее скаченной картинке */
    .${sel.get('btn.btn')}.${sel.get('loaded_urls_active')} .${sel.get('btn.icon')},
    .${sel.get('btn.btn')}.${sel.get('loaded_urls_active')} .${sel.get('btn.icon')}:before {
        background-image: url('${icons.get('yellow', 'arrow')}');
    }

    #${sel.photoDownload_id} .${sel.get('btn.size')} {
        color: ${icons._colors.grey} !important;
        flex-grow: 1;
        text-align: center;
        height: 15px;
    }

    /* Для открытых настроек */
    #${sel.photoDownload_id}.${sel.ready}.${sel.settings} {
        opacity: .8 !important;
        transform: translate3d(-100%, 0, 1px);
    }

    #${sel.photoDownload_id}.${sel.settings} .${sel.get('btn.btn')} {
        border-top-left-radius: 0;
    }

    #${sel.photoDownload_id}.${sel.settings} .${sel.get('btn.btn')}:before {
        content: '';
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 20px);
        height: 1px;
        background-color: rgba(255, 255, 255, .1);
    }

    .${sel.get('btn.main_title_wrap')} {
        flex-grow: 1;
        height: 14px;
        overflow: hidden;
        text-align: center;
        user-select: none;
    }

    #${sel.get('photoDownload_id')} .${sel.get('btn.main_title_inner')} {
        will-change: transform;
        transition: transform ${timings.settings_open}ms ease-out !important;
    }

    .${sel.get('btn.main_title_inner')} * {
        margin-bottom: 14px;
    }

    /* Для открытых настроек показываем слово "Настройки" */
    #${sel.photoDownload_id}.${sel.ready}.${sel.settings_open} .${sel.get('btn.main_title_inner')} {
        transform: translate3d(0, -29px, 1px);
    }

    /* Спрятать иконку стрелки при наличии icon_cog */
    #${sel.photoDownload_id}.${sel.ready}.${sel.icon_cog} .${sel.get('btn.icon')}, 
    #${sel.photoDownload_id}.${sel.ready}.${sel.icon_cog} .${sel.get('btn.icon')}:before {
        background-image: none;
    }

    #${sel.photoDownload_id}:not(.${sel.settings}) .${sel.get('sett.settings_wrap')} {
        height: 0;
        overflow: hidden;
    }

    #${sel.photoDownload_id}.${sel.ready}.${sel.settings} .${sel.get('sett.settings_wrap')} {
        height: auto;
    }

    #${sel.photoDownload_id}.${sel.ready} .${sel.get('sett.settings')} {
        position: relative;
        background-color: #000;
        border-top-left-radius: 4px;
        font-size: 12px;
        width: 160px;
        will-change: transform;
        transform: translate3d(0, 100%, 1px);
        transition: transform ${timings.settings_open}ms ease-out !important;
        user-select: none;
    }

    /* Выдвинуть настройки вверх при наличии settings_open */
    #${sel.photoDownload_id}.${sel.ready}.${sel.settings_open} .${sel.get('sett.settings')} {
        transform: translate3d(0, 0%, 1px);
    }
    
    .${sel.get('sett.settings_body')} {
        padding: 0 10px;
    }

    .${sel.get('sett.settings_body')} ul {
        padding: 5px 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
    }

    .${sel.get('sett.settings_item')} {
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
    }

    .${sel.get('sett.settings_item')}:not(:last-child) {
        margin-bottom: 5px;
    }

    .${sel.get('sett.settings_item')} input[type=radio],
    .${sel.get('sett.settings_item')} input[type=checkbox] {
        margin: 0;
        display: none;
    }

    .${sel.get('sett.settings_item')} button {
        margin: 0 auto;
        background-color: transparent;
        font-size: 12px;
        padding: 2px;
        border: 1px solid;
        border-color: ${icons._colors.grey}; 
        border-radius: 2px;
        width: 100%;
        cursor: pointer;
    }

    .${sel.get('sett.settings_item')} button:hover,
    .${sel.get('sett.settings_item')} button:hover span {
        color: ${icons._colors.green} !important;
    }

    .${sel.get('sett.settings_item')} button:active,
    .${sel.get('sett.settings_item')} button:active span {
        color: ${icons._colors.green} !important;
        border-color: ${icons._colors.green} !important;
    }

    .${sel.get('sett.settings_item_action')} {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 18px;
        padding-left: 20px;
        cursor: pointer;
        background-size: 14px 14px;
        background-repeat: no-repeat;
        background-position: 0 center;
    }

    /* Иконки для радиокнопок */
    input[type=radio] + .${sel.get('sett.settings_item_action')} {
        background-image: url('${icons.get('white', 'circle')}');
    }
    input[type=radio]:not([disabled]) + .${sel.get('sett.settings_item_action')}:hover {
        background-image: url('${icons.get('green', 'circle')}');
    }
    input[type=radio]:checked + .${sel.get('sett.settings_item_action')} {
        background-image: url('${icons.get('white', 'check_circle')}');
    }
    input[type=radio]:not([disabled]):checked + .${sel.get('sett.settings_item_action')}:hover {
        background-image: url('${icons.get('green', 'check_circle')}');
    }

    /* Иконки для чекбоксов */
    input[type=checkbox] + .${sel.get('sett.settings_item_action')} {
        background-image: url('${icons.get('white', 'square')}');
    }
    input[type=checkbox]:not([disabled]) + .${sel.get('sett.settings_item_action')}:hover {
        background-image: url('${icons.get('green', 'square')}');
    }
    input[type=checkbox]:checked + .${sel.get('sett.settings_item_action')} {
        background-image: url('${icons.get('white', 'check_square')}');
    }
    input[type=checkbox]:not([disabled]):checked + .${sel.get('sett.settings_item_action')}:hover {
        background-image: url('${icons.get('green', 'check_square')}');
    }

    input[disabled] + .${sel.get('sett.settings_item_action')} {
        opacity: .4;
        cursor: default;
    }

    /* Иконка шестеренки */
    #${sel.get('photoDownload_id')} .cog {
        width: 18px;
        height: 18px;
        transform: rotate(30deg);
        opacity: 0;
    }

    #${sel.photoDownload_id}.${sel.ready}.${sel.icon_cog} .${sel.get('btn.icon')} .cog {
        opacity: 1;
    }

    #${sel.get('photoDownload_id')} .cog .cog_circle {
        fill: none;
        fill-opacity: 0;
        stroke-width: 25;
    }

    #${sel.get('photoDownload_id')} .cog .cog_path {
        fill: none;
        fill-opacity: 0;
        stroke-width: 25;
        stroke-dasharray: 1669;
        stroke-dashoffset: 1669;
        transition: stroke-dashoffset ${timings.settings_open}ms linear, fill-opacity ${timings.fill}ms ease-out !important;
    }

    #${sel.get('photoDownload_id')} .cog.${sel.draw} .cog_path {
        transition: stroke-dashoffset ${timings.open}ms linear, fill-opacity ${timings.fill}ms ease-out !important;
        stroke-dashoffset: 0;
    }

    #${sel.photoDownload_id}.${sel.ready} .cog.${sel.draw_fill} .cog_path {
        fill: #00b75a;
        fill-opacity: 1;
    }

    #${sel.photoDownload_id}.${sel.ready} .cog.${sel.draw_fill} .cog_circle {
        fill: #000;
        stroke-width: 15;
        fill-opacity: 1;
    }

    /* === Для настроек с секциями === */

    /* Галочка вверху слева, закрывающая настройки */
    .${sel.get('sett.settings_close_ico')} {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-image: url('${icons.get('white', 'ok')}');
        background-size: 16px 16px;
        background-position: center;
        background-repeat: no-repeat;
        padding: 6px 10px;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .${sel.get('sett.settings_close_ico')}:hover {
        background-image: url('${icons.get('green', 'ok')}');
    }

    /* Секция настроек */
    .${sel.get('sett.settings_section')}:last-child {
        padding-bottom: 5px;
    }

    /* При ховере на секцию, но не на заголовок, заголовку давать зеленый цвет */
    .${sel.get('sett.settings_section')}:hover .${sel.get('sett.settings_section_header')} {
        color: ${icons._colors.green} !important;
    }
    .${sel.get('sett.settings_section')} .${sel.get('sett.settings_section_header')}:hover  {
        color: ${icons._colors.grey} !important;
    }

    /* При ховере на секцию, но не на заголовок, подчеркиванию заголовка давать зеленый цвет */
    .${sel.get('sett.settings_section')}:hover .${sel.get('sett.settings_section_header')}:after {
        background-color: ${icons._colors.green};
        opacity: .3;
    }
    .${sel.get('sett.settings_section')} .${sel.get('sett.settings_section_header')}:hover:after {
        background-color: ${icons._colors.white};
        opacity: .1;
    }

    /* Заголовок секции настроек */
    #${sel.photoDownload_id} .${sel.get('sett.settings_section_header')} {
        position: relative;
        cursor: default;
        font-weight: bold;
        min-height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        transition: color ${timings.fill}ms ease-out !important;
    }

    /* Черта под заколовком секции настроек */
    .${sel.get('sett.settings_section_header')}:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 0px);
        height: 1px;
        background-color: ${icons._colors.white};
        opacity: .1;
    }

    `;
}