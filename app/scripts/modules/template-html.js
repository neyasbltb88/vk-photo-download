export default function(sel, timings, icons) {

    return /* html */ `
    <div class="${sel.get('sett.settings_wrap')}">
        <div class="${sel.get('sett.settings')}">
            <div class="${sel.get('sett.settings_close_ico')}"></div>

            <div class="${sel.get('sett.settings_body')}">

                <!-- Режим клика -->
                <div class="${sel.get('sett.settings_section')}">
                <div class="${sel.get('sett.settings_section_header')}">Режим клика</div>

                    <ul class="${sel.get('sett.download_mode')}">
                        <li class="${sel.get('sett.settings_item')}">
                            <input type="radio" id="${sel.download_mode_true}" name="download_mode" value="true">
                            <label for="${sel.download_mode_true}" class="${sel.get('sett.settings_item_action')}">Скачать</label>
                        </li>
                        <li class="${sel.get('sett.settings_item')}">
                            <input type="radio" id="${sel.download_mode_false}" name="download_mode" value="false">
                            <label for="${sel.download_mode_false}" class="${sel.get('sett.settings_item_action')}">В новой вкладке</label>
                        </li>
                    </ul>
                </div>
                
                <!-- Размер изображения -->
                <div class="${sel.get('sett.settings_section')}">
                <div class="${sel.get('sett.settings_section_header')}">Размер изображения</div>

                    <ul class="${sel.get('sett.size_mode')}">
                        <li class="${sel.get('sett.settings_item')}">
                            <input type="checkbox" id="${sel.size_mode_control}" name="size_mode" value="true">
                            <label for="${sel.size_mode_control}" class="${sel.get('sett.settings_item_action')}">Показывать</label>
                        </li>
                    </ul>
                </div>

                <!-- Отмечать скаченные -->
                <div class="${sel.get('sett.settings_section')}">
                <div class="${sel.get('sett.settings_section_header')}">Отмечать скаченные</div>

                    <ul class="${sel.get('sett.loaded_urls_mode')}">
                        <li class="${sel.get('sett.settings_item')}">
                            <input type="checkbox" id="${sel.loaded_urls_mode_control}" name="loaded_urls_mode" value="true">
                            <label for="${sel.loaded_urls_mode_control}" class="${sel.get('sett.settings_item_action')}">Запоминать URL</label>
                        </li>

                        <li class="${sel.get('sett.settings_item')}">
                            <input type="checkbox" id="${sel.loaded_urls_mode_key_control}" name="loaded_urls_mode_key" value="true" disabled>
                            <label for="${sel.loaded_urls_mode_key_control}" class="${sel.get('sett.settings_item_action')}">+ клики ПКМ</label>
                        </li>

                        <li class="${sel.get('sett.settings_item')}">
                            <button id="${sel.loaded_urls_mode_clear_control}">Очистить <span></span> URL</button>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

    </div>

    <a class="${sel.get('btn.btn')}" href="#!" target="_blank" draggable="false">
        <div class="${sel.get('btn.icon')}">
            ${icons.get('green', 'cog', false)}
        </div>
        <div class="${sel.get('btn.main_title_wrap')}">
            <div class="${sel.get('btn.main_title_inner')}">
                <div class="${sel.get('btn.size')}"></div>
                <div class="${sel.get('btn.settings_title')}">Настройки</div>
            </div>
        </div>
    </a>
    `;
}