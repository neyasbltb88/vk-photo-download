# VK Photo Download

***Описание***:
JS скрипт, создающий кнопку для скачивания изображения в максимально доступном разрешении из просмотрщика Вконтакте

***

### ***Демонстрация***:

> При наведении на изображение, открытое в просмотрщике ВК, появляется полупрозрачная кнопка для скачивания:
![Состояние кнопки при наведении на изображение](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/1.jpg "Состояние кнопки при наведении на изображение")

> При наведении на саму кнопку, она становится ярче и показывает разрешение целевого изображения:
![Состояние кнопки при наведении на нее](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/2.jpg "Состояние кнопки при наведении на нее")

> Для входа в настройки зажмите и удерживайте левую кнопку мыши на кнопке скачивания:
![Состояние кнопки в режиме настроек](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/2.1.jpg "Состояние кнопки в режиме настроек")

***

### ***Описание настроек***:
- **Режим клика:** Изменяет реакцию кнопки на простой быстрый клик.
  - *Скачать:* По клику на кнопку скачивает текущее изображение в максимально доступном разорешении в папку загрузок по умолчанию.
  - *В новой вкладке:* По клику на кнопку открывает текущее изображение в максимально доступном разорешении в новой вкладке. Автоматического скачивания не происходит.
- **Размер изображения:** 
  - *Показывать:* Если этот пункт отмечен, то при наведении на кнопку, она выезжает справа и отображает максимально доступное разрешение изображеня, с котрым оно может быть скачено. Если галочка снята, то при наведении кнопка не выезжает под мышкой и разрешение не показывается.
- **Отмечать скаченные:**
  - *Запоминать URL:* Если галочка отмечена, то адреса скачиваемых изображений запоминаются в локальное хранилище. В следующий раз при открытии изображения для информирования о том, что оно уже было ранее скачено, стрелочка на кнопке будет желтого цвета.
  - *+ клики ПКМ:* Эта опция доступна, если разрешено запоминать URL. Если отмечена, то сохранение адреса текущей картинки будет происходить даже при нажатии Правой Кнопки Мышки и нажатии на Колесико мышки. Это может быть полезно если вы выбираете пункт "Сохранить ссылку как" из контекстного меню на кнопке или при открытии картинки в новой вкладке с помощью клика колесом мыши по кнопке.
  - *Очистить URL:* Очищает из локального хранилища все сохраненные адреса скаченных изображений.
- **Быстрое скачивание**
  - *Ждать нажатия Enter:* Если галочка отмечена, то кнопка переходит в активный режим. Она остается постоянно видимой и по нажатию клавиши Enter скачивает текущее изображение в папку по умолчанию

***

### ***Активация***:

- Для теста можно открыть консоль на любой странице ВК и вставить следующий код:
  ```js
  fetch('https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/dist/vk-photo-download.min.js')
      .then(response => response.text())
      .then(response => eval(response))
  ```

  **Важно: Для этого режима нужно отключить AdBlock на странице ВК. По каким то причинам домен githubusercontent попадает под его блокировку!**

  > ![Вставка скрипта для активации в консоль](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/3.jpg "Вставка скрипта для активации в консоль")

- Для постоянного использования лучше всего воспользоваться расширением для браузера, которое может добавлять собственные скрипты для указанных сайтов.
  Одним из таких расширений является **[Resource Override](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii?hl=ru)**

  Создаем правило для адреса `https://vk.com/*` и выбираем `Inject File`:
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/4.jpg "Конфигурация Resource Override")

  Вписываем имя скрипта `vk-photo-download`(может быть любым) и нажимаем `Edit File`:
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/5.jpg "Конфигурация Resource Override")

  В открывшийся редактор вставляем содержимое файла **[/dist/vk-photo-download.min.js](https://github.com/neyasbltb88/vk-photo-download/blob/master/dist/vk-photo-download.min.js)**
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/6.jpg "Конфигурация Resource Override")

***

## TODO:

* ~~Найти возможность получать адрес изображения с максимальным разрешением~~ (v1.0.0)
* ~~Найти возможность вставлять кнопку в динамически создаваемую разметку просмотрщика изображения~~ (v1.0.0)
* ~~Обойти защиту CORS, и сделать прямое скачивание по клику на кнопку~~ (v1.1.0)
* ~~Сделать настройки режима для клика по кнопке (скачать/открыть в новой вкладке)~~ (v1.2.0)
* ~~Сделать настройку, отключающую показ размеров изображения (чтобы кнопка не выезжала) при наведении на кнопку~~ (v1.3.0)
* ~~Сделать анимацию иконки со стрелкой во время скачивания~~ (v1.4.0)
* ~~Сделать запоминание скаченных ранее картинок, менять цвет кнопки на таких картинках~~ (v1.5.0)
* ~~Сделать настройку, при которой кнопка будет фиксироваться и ожидать нажатия Enter для скачивания текущего изображения~~ (v1.6.0)
* Сделать настройку составления имени файла, с которым будет скачено изображение
* Найти возможность получать адрес изображения с максимальным разрешением для не открытого в просмотрщике изображения
* Добавлять кнопку скачивания на все миниатюры изображений(на стене, в сообщениях, в уведомлениях и т.д.), чтобы была возможность скачать их не открывая в просмотрщике
* Улучшить механизм обновления информации в кнопке
