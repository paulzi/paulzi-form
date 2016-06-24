# PaulZi Form

[![NPM version](http://img.shields.io/npm/v/paulzi-form.svg?style=flat)](https://www.npmjs.org/package/paulzi-form)
![Bower version](http://img.shields.io/bower/v/paulzi-form.svg?style=flat)

Дополнительный функционал по отправке html форм.

Демо: http://paulzi.ru/paulzi-form/

[English readme](https://github.com/paulzi/paulzi-form)

[v2.x](https://github.com/paulzi/paulzi-form/tree/2.x)

## Установка

Установка через NPM
```sh
npm install paulzi-form
```

Установка через Bower
```sh
bower install paulzi-form
```

Или установите вручную.

Подключите библиотеку после jQuery. Выберите вариант подключения скрипта:

### всё в одном (встроенные зависимости)

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/paulzi-form/dist/paulzi-form.all.min.js">
```

### раздельный (внешние зависимости)

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/form-extra-events/dist/form-extra-events.min.js">
<script src="/bower_components/form-association-polyfill/dist/form-association-polyfill.min.js">
<script src="/bower_components/jquery-iframe-ajax/dist/jquery-iframe-ajax.min.js">
<script src="/bower_components/paulzi-form/dist/paulzi-form.min.js">
```

## Возможности

### Дополнительные события форм

Библиотека предоставляет следующие события: `submitlast`, `submitbefore`, `submitstart`, `submitend`.

Дополнительно вы можете указать атрибут  `data-catch-download` для кнопки отправки, чтобы переопределить значение этого атрибута для формы при отправке.

Более подробно читайте тут: [paulzi/form-extra-events](http://github.com/paulzi/form-extra-events)

### Полифил HTML5 form атрибутов

Библиотека обеспечивает работоспособность html5 атрибутов `form`, `formaction`, `formmethod`, `formenctype`, `formtarget` в старых браузерах.

Подробнее: [paulzi/form-association-polyfill](http://github.com/paulzi/form-association-polyfill)

### Не отправлять пустые поля

Установите атрибут `data-submit-empty="false"` у поля, формы или другого родительского элемента, чтобы это поле не отправлялось, если оно не заполнено.

Пример:

```html
<form action="action.php" method="post" data-submit-empty="false">
    Price: <input type="text" name="price1" value=""> - <input type="text" name="price2" value=""><br>
    <fieldset data-submit-empty="true">
        <legend>Colors</legend>
        <input type="hidden" name="colors" value="">
        <input type="checkbox" name="colors[]" value="1"> black
        <input type="checkbox" name="colors[]" value="2"> red
    </fieldset>
    <button type="submit">Filter</button>
</form>
```

### Блокировка повторной отправки формы

По-умолчанию все формы становятся защищены от повторной отправки до тех пор, пока не будет получен ответ от сервера. Вы можете отменить это поведение в глобальных настройках (смотрите ниже).

Также вы можете указать атрибут `data-lock` для конкретной формы:

```html
<form action="action.php" method="post" data-lock="false">
    Your name: <input type="text" name="name" value="">
    <button type="submit">Submit</button>
</form>
```

### Отображения состояния отправки формы

По-умолчанию, всем формам, которые переходят в состояние отправки, ей добавляется класс `form-loading`. Аналогично добавляется класс `btn-loading` для кнопки, с помощью которой эта форма была отправлена (по-умолчанию, это первая кнопка).

Дополнительно, вы можете указать атрибуты `data-loading-text` и `data-loading-icon` для кнопки отправки. Тогда в процессе отправки, содержимое кнопки будет заменено на следующий шаблон:
```html
<button><i class="<%= icon %>"></i><%= text %></button>
```

Вы можете изменить шаблон в глобальных опциях (смотрите ниже).

Пример:

```html
<!-- font awesome -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-text="Submitting..." data-loading-icon="fa fa-refresh fa-spin">Submit</button>

<!-- bootstrap glyph -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-text="Submitting..." data-loading-icon="glyphicon glyphicon-refresh">Submit</button>
```

### Отправка формы через AJAX

Библиотека предоставляет возможность отправить форму через AJAX, включая формы с файлами.

Когда идёт отправка с файлами `input[type="file"]` используется XMLHttpRequest 2 или iframe для старых браузеров. Подробнее об отправке через iframe читайте здесь: [paulzi/jquery-iframe-ajax](http://github.com/paulzi/jquery-iframe-ajax).

AJAX запрос будет полностью эквивалентен запросу, как если бы форма отправлялась обычным способом, в том числе с поддержкой html5 атрибутов form, элементов `input[type="image"]` и файлов.

Для отправки формы через AJAX, добавьте атрибут `data-via="ajax"` к форме:

```html
<form action="action.php" method="post" data-via="ajax">
    Your name: <input type="text" name="name" value="">
    <button type="submit">Submit</button>
</form>
```

При отправке формы через AJAX, генерируются дополнительные события:

- `submitajax` - срабатывает при отправке формы через ajax, событие можно отменить вызвав `preventDefault()`;
- `submitbefore`, `submitstart`, `submitend (data, jqXHR)` - события также доступны, как и в дополнительных событиях, но свойство события `transport` будет равно `'ajax'`;
- `submitdone (data, jqXHR, error)` - срабатывает после получения успешного ответа;
- `submitfail (data, jqXHR, error)` - срабатывает после получения ошибки;
- `uploadprogress` - срабатывает в процессе отправки формы;
- `downloadprogress` - срабатывает в процессе получения ответа;
- `uploadend` - срабатывает после окончания процесса отправки и перехода в состояние получения ответа;

События `uploadprogress`, `downloadprogress`, `uploadend` доступны только в браузерах с поддержкой [XMLHttpRequest 2](http://caniuse.com/#feat=xhr2). В объекте события доступны свойства `loaded`, `total`, `lengthComputable`.
 
Пример:

```html
<form id="avatar-form" action="action.php" method="post" enctype="multipart/form-data" data-via="ajax">
    Avatar: <input type="file" name="file">
    <button type="submit">Upload</button>
</form>
<script>
$(document).on('submitstart', '#avatar-form', function () {
    $(this).find('button').html('Uploading...');
});
$(document).on('uploadprogress', '#avatar-form', function (e) {
    if (e.lengthComputable) {
        $(this).find('button').html(Math.round(100 * e.loaded / e.total) + '%');
    }
});
$(document).on('submitend', '#avatar-form', function () {
    $(this).find('button').html('Upload');
});
</script>
```

### Сценарии

Установите атрибут `data-via` на кнопке отправки, для переопределения метода отправки формы.

Установите атрибут `data-via` в поле, или родительском элементе, для того, чтобы определить можно ли отправлять это поле с помощью текущего метода отправки.

Пример:

```html
<form action="action.php" method="post">
    Your name: <input type="text" name="name" value=""><br>
    Export name: <input type="text" name="export_name" value="" data-via="default"><br>
    <fieldset data-via="default">
        <legend>Export settings</legend>
        <input type="checkbox" name="compress" value="1"> compress
    </fieldset>
    <button type="submit" data-via="ajax">Save</button>
    <button type="submit" data-via="default" formaction="save.php">Export</button>
</form>
```

### Обработчик AJAX ответов

Если в заголовках ответа будет установлен `X-Redirect`, то библиотека осуществит переход клиентской страницы по указанному URL.

Если `Content-Type` ответа равен `text/html`, тогда каждый элемент в ответе будет обработан следующим образом:

- берётся значение атрибута `data-insert-to` (по-умолчанию: `output`) в этом элементе или форме - это будет селектор для поиска цели;
- берётся значение атрибута `data-insert-context` (по-умолчанию: `this`) в этом элементе или форме - это будет контекст поиска;
- берётся значение атрибута `data-insert-method` (по-умолчанию: `html`) в этом элементе или форме - это будет наименование применяемой функции (объявленная как плагин через `$.fn.functionname`).

Контекст поиска может иметь следующие значения:

- `this` - запускает следующий код: `$form.search(selector).method(element)`;
- `document` - запускает следующий код: `$(selector).method(element)`;
- другие значения - запускает следующий код: `$form.closest(context).find(selector).method(element)`.

Пример формы:

```html
<div class="cart-amount">0</div>
<div class="product-card">
    <form action="cart.php" method="post" data-via="ajax">
        <input type="text" name="amount" value="1">
        <button type="submit">Add to cart</button>
        <output></output>
    </form>
</div>
```

Пример ответа:

```html
<div class="cart-amount" data-insert-to=".cart-amount" data-insert-context="document" data-insert-mode="replaceWith">0</div>
<button type="submit" data-insert-to="button" data-insert-mode="replaceWith">Added to cart</button>
<div class="alert alert-success">Product added in cart!</div>
```

Для всех новых вставляемых элементов генерируются события:

- `contentprepare` - генерируется **до** вставки элемента в DOM (событие генерируется для формы);
- `contentinit` - генерируется **после** вставки элемента в DOM (событие генерируется для формы).
 
Таким образом вы можете инициализировать все JavaScript компонетны после загрузки страницы и после AJAX запроса. Для этого используйте следующий код:
```javascript
$(function () {
    $(document).trigger('contentinit', [$(document)]);
});
$(document).on('contentinit', function (e, $elements, operation, $target) {
    $elements.find('.datepicker').datepicker();
});
```

Вы можете отменить поведение, описанное в данном пункте, путём вызова `preventDefault()` в собыитии `submitend`.

## Глобальные опции

Вы можете изменить настроки библиотеки, путём изменения объекта `window.PaulZiForm` (в любое время, как до, так и после подключения скрипта).

Пример:

```javascript
window.PaulZiForm = $.extend(true, window.PaulZiForm || {}, {
    classes: {
        formLoading: 'my-form-class'
    },
    attributes: {
        lock: 'data-may-attribute'
    }
});
```

Опции:

- `classes` *(plain object)* - список наименований классов
    - `formLoading` *(string) по-умолчанию: 'form-loading'* - класс состояния отправки формы
    - `btnLoading` *(string) по-умолчанию: 'btn-loading'* - класс кнопки при состоянии отправки формы
- `attributes` *(plain object)* - список наименований атрибутов
    - `via` *(string) по-умолчанию: 'data-via'* - атрибут метода отправки формы
    - `lock` *(string) по-умолчанию: 'data-lock'* - атрибут блокировки повторной отправки формы
    - `submitEmpty` *(string) по-умолчанию: 'data-submit-empty'* - атрибут запрета отправки пустых значений поля
    - `to` *(string) по-умолчанию: 'data-insert-to'* - атрибут цели при обработке ajax-ответа
    - `context` *(string) по-умолчанию: 'data-insert-context'* - атрибут контекста при обработке ajax-ответа
    - `mode` *(string) по-умолчанию: 'data-insert-mode'* - атрибут режима при обработке ajax-ответа
    - `loadingText` *(string) по-умолчанию: 'data-loading-text'* - атрибут альтернативного текста кнопки, в состоянии отправки формы
    - `loadingIcon` *(string) по-умолчанию: 'data-loading-icon'* - атрибут иконки кнопки, в состоянии отправки формы
- `defaults` *(plain object)* - значения по-умолчанию
    - `lock` *(bool) по-умолчанию: true* - запретить по-умолчанию повторную отправку для всех форм
    - `submitEmpty` *(bool) по-умолчанию: true* - отправлять пустые поля по-умолчанию для всех форм
    - `to` *(string) по-умолчанию: 'output'* - селектор цели по-умолчанию при обработке ajax-ответа
    - `context` *(string) по-умолчанию: 'this'* - контекст по-умолчанию при обработке ajax-ответа
    - `mode` *(string) по-умолчанию: 'html'* - режим вставки по-умолчанию при обработке ajax-ответа
    - `skipOnError` *(bool) по-умолчанию: false* - запретить обработку ajax-ответв случае получения ошибки
- `buttonLoadingTemplate` *(function)* - шаблон состояния кнопки при отправке формы (подробнее ниже)
- `defaultTemplate` *(function)* - здесь хранится шаблон по-умолчанию
- `buttonLoadingForce` *(bool) по-умолчанию: false* - включить принудительное использование шаблона, даже если атрибуты `data-loading-text` и `data-loading-icon` не заполнены

`buttonLoadingTemplate` в данную функцию шаблона передаётся объект со следующими параметрами:
 
- form - элемент формы;
- btn  - элемент кнопки;
- text - содержимое атрибута `data-loading-text`;
- icon - содержимое атрибута `data-loading-icon`.

Функция должна возвращать строку(html), jQuery-объект или `false` (чтобы шаблон не применялся).

## Своя сборка

Установите [Grunt](http://gruntjs.com/), закоментируйте строки в `Grunt.js` с ненужными `src/*` файлами, и запустите команду `grunt`.

## Требования

- jQuery 1.7+
- [form-extra-events](https://github.com/paulzi/form-extra-events/) (встроен в версию "всё в одном")
- [form-association-polyfill](https://github.com/paulzi/form-association-polyfill/) (встроен в версию "всё в одном")
- [jquery-iframe-ajax](https://github.com/paulzi/jquery-iframe-ajax/) (встроен в версию "всё в одном")

## Поддержка браузеров

Протестирован со следующими браузерами:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?