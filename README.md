# VK Photo Download

***Описание***:
JS скрипт, создающий кнопку для скачивания изображения в максимально доступном разрешении из просмотрщика Вконтакте

#### ***Предупреждение***:
В текущей версии не работает прямое скачивание изображения по клику на кнопку.
Это связано с тем, что технически изображение находится на другом домене.
Будут исправлено в следующем релизе.

Пока по клику на кнопку изображение открывается в новой вкладке. 
По правлму клику можно выбрать из контекстного меню пункт `Сохранить ссылку как...`

***

#### ***Демонстрация***:

> При наведении на изображение, открытое в просмотрщике ВК, появляется полупрозрачная кнопка для скачивания:
![Состояние кнопки при наведении на изображение](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/1.jpg "Состояние кнопки при наведении на изображение")

> При наведении на саму кнопку, она становится ярче и показывает разрешение целевого изображения:
![Состояние кнопки при наведении на нее](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/2.jpg "Состояние кнопки при наведении на нее")

#### ***Активация***:

- Для теста можно открыть консоль на любой странице ВК и вставить следующий код:
  ```js
  fetch('https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/scripts/photo-download.js')
      .then(response => response.text())
      .then(response => eval(response))
  ```

  > ![Вставка скрипта для активации в консоль](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/3.jpg "Вставка скрипта для активации в консоль")

- Для постоянного использования лучше всего воспользоваться расширением для браузера, которое может добавлять собственные скрипты для указанных сайтов.
  Одним из таких расширений является **[Resource Override](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii?hl=ru)**

  Создаем правило для адреса `https://vk.com/*` и выбираем `Inject File`:
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/4.jpg "Конфигурация Resource Override")

  Вписываем имя скрипта `vk-photo-download`(может быть любым) и нажимаем `Edit File`:
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/5.jpg "Конфигурация Resource Override")

  В открывшийся редактор вставляем содержимое файла **[/scripts/photo-download.js](https://github.com/neyasbltb88/vk-photo-download/blob/master/scripts/photo-download.js)**
  > ![Конфигурация Resource Override](https://raw.githubusercontent.com/neyasbltb88/vk-photo-download/master/img/6.jpg "Конфигурация Resource Override")

***

### TODO:

* ~~Найти возможность получать адрес изображения с максимальным разрешением~~ (v1.0.0)
* ~~Найти возможность вставлять кнопку в динамически создаваемую разметку просмотрщика изображения~~ (v1.0.0)
* Обойти защиту CORS, и сделать прямое скачивание по клику на кнопку
* Найти возможность получать адрес изображения с максимальным разрешением для не открытого в просмотрщике изображения
* Добавлять кнопку скачивания на все миниатюры изображений(на стене, в сообщениях, в уведомлениях и т.д.), чтобы была возможность скачать их не открывая в просмотрщике

