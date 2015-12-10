# nSelect - jQuery custom select plugin

### Описание

nSelect - это простой плагин для кастоматизации выпадающего списка. Отличие от других подобных плагинов состоит в том, что он не перегружен лишним функционалом. Размер минифицированной версии составляет всего около 3 кб.

Сайт с документацией и примерами: [http://nselect.edbond.name/](http://nselect.edbond.name/)

Версия: 1.0.1

### Установка

Для начала нужно [скачать архив](https://github.com/edbond88/nselect/archive/master.zip) с плагином, из папки build взять файлы jquery.nselect.min.js, jquery.nselect.css и подключить к вашему проекту.

##### HTML

Файл со стилями подключается в head тэг:

```html
<link rel="stylesheet" href="jquery.nselect.css">
```

Сам плагин подключаем перед закрытием тэга body. Для плагина нужна библиотека jQuery > 1.6.0.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="jquery.nselect.js"></script>
```

##### CSS

В css файле вначале определены обязательные стили, без которых список будет некорректно отображаться. Далее следует базовая тема, котороую можно менять по своему усмотрению.

##### Установка с помощью bower

```
bower nselect
```


##### Инициализация

Для инициализации нужно вызвать плагин для нужного нам селекта:

```html
<select class="nselect" name="pets">
    <option value="1">Cat</option>
    <option value="2">Dog</option>
    <option value="3">Frog</option>
    <option value="4">Duck</option>
    <option value="5">Elephant</option>
</select>
```

```js
$('.nselect').nSelect();
```

### Конфигурация
Настраивать плагин можно с помощью следующих опций, которые передаются в виде объекта, как параметр в функцию.

Пример: 
```js
$(selector).nSelect({ option: value });
```

Полная документация доступна на сайте [http://nselect.edbond.name/](http://nselect.edbond.name/)
 
 
### Требование и поддержка
Для работы плагина нужна библиотека jQuery версии выше 1.6

Поддержка браузерами:

* Chrome & Mobile Chrome
* Firefox
* Opera
* Internet Explorer > 8
* Safari & Mobile Safari
 
 Сайт разработчика: [http://edbond.name/](http://edbond.name/)
