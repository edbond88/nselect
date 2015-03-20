/* ОЧЕНЬ красивый выпадающий список
    Параметры:
    topList : false - если тру то список выпадает вверх
    firstTitle: '' - если задано, то будет отображаться в заголовке списка
                       так же у селекта может быть data-title, которая отображается
                       только в самый первый раз
    theme: '' - класс добавляемый к обертке
    scrollbarTheme: 'blue' - тема для кастомного скроллбара
    afterChange : function() {} - колбеки 
    afterOpen : function() {} - колбеки

    Так же формируются события:
    niceClose
    niceOpen
    niceChange
    
*/
(function ($) {
    $.niceSelect = function(elem, opt) {
        var $this = this
            ,context = ''
            ,el = {}
            ,options = {}
            ,customScrollFlag = false;

        init(elem, opt);

        function closeSelect() {
            context.removeClass('_active');
            $(window).trigger('niceClose');
        }

        function openSelect() {
            context.addClass('_active');
            options.afterOpen();
            $(window).trigger('niceOpen');
        }

        function setNewValue(newVal) {
            el.hiddenSelect.val(newVal);
            context.data('val', newVal);
        }

        function customScrollUpdate(elem) {
            elem.mCustomScrollbar('destroy');
            elem.mCustomScrollbar({
                theme: options.scrollbarTheme
            });
            customScrollFlag = true;
        }

        function renderSelect($elem) {
            var modClass = {
                'top' : ''
                ,'disabled' : ''
            }
            ,selectedOpt
            ,noSelected = false
            ,selectName = $elem.data('title') || '';

            $elem.hide();

            if (options.topList) modClass.top = '_top';
            if ($elem.hasClass('_disabled')) modClass.disabled = '_disabled';

            // Создаем обертку вокруг селекта
            context = $elem
                        .wrap('<div class="nice-select '+modClass.top+' '+options.theme+' '+modClass.disabled+'" data-name="'+$elem.attr('name')+'" data-val=""></div>')
                        .closest('.nice-select')
                        .prepend('<div class="nice-select__inner js-nice-select__inner">'+
                                    '<ul class="nice-select-list js-nice-select-list"></ul>'+
                                '</div>');

            // Первые элементы: внутрянка обертки и список
            el = {
                'selectInner' : $('.js-nice-select__inner', context)
                ,'selectList' : $('.js-nice-select-list', context)
                ,'hiddenSelect' : $elem
            }

            // Заполняем списков из опшинов
            $elem.find('option').each(function(index) {
                var $that = $(this)
                    ,val = $that.val()
                    ,html = $that.html()
                    ,activeClass = ''
                    ,newItem;

                // Если есть selected то добавляем активный класс к li
                // и записываем этот опшин в переменную для дальнейших действий
                if ($that.attr('selected')) {
                    selectedOpt = $that;
                    activeClass = 'class="_active"';
                } else {
                    activeClass = '';
                }

                newItem = '<li '+activeClass+' data-val="'+val+'"><span>'+html+'</span></li>';

                el.selectList.append(newItem)
            });
            el.selectItem = $('.js-nice-select__inner li', context)

            // Если не было у опшинов selected то добавляем активный класс к
            // первому li
            if (selectedOpt === undefined) {
                noSelected = true;
                selectedOpt = $elem.find('option');
                el.selectItem.eq(0).addClass('_active');
            }

            // Делаем кнопку с выбранным элементом из списка
            var titleHtml = selectedOpt.html()
                titleVal = selectedOpt.val();

            // Если заголовок не пункт селекта, а заданный пользователем,
            // то показываем все li
            if (options.firstTitle !== '' && noSelected) {
                el.selectItem.removeClass('_active');
                titleHtml = options.firstTitle;
                titleVal = '';
            } 

            // Если задано ПЕРВЫЙ тайтл для селекта
            if (selectName !== '') {
                el.selectItem.removeClass('_active');
                titleHtml = selectName;
                titleVal = '';
            }

            context.prepend('<h6 class="nice-select-head js-nice-head" data-val="'+titleVal+'"><span>'+titleHtml+'</span></h6>')
            el.selectBtn = $('.js-nice-head', context);
            el.selectBtn.attr('title', $('.js-nice-head SPAN', context).html())
            el.selectHeadInner = $('.js-nice-head SPAN', context);
        }

        function init($element, opt) {
            var defaults = {
                'topList' : false
                ,'firstTitle': ''
                ,'theme': ''
                ,'scrollbarTheme': 'blue'
                ,'afterChange' : function() {}
                ,'afterOpen' : function() {}
            };

            options = $.extend(defaults, opt);

            renderSelect($element);

            el.selectBtn.on('click', selectBtnClick);
            el.selectItem.on('click', selectItemClick);

            //TODO: доделать баг с событием на закрытие
            $(document).on('click', function(event){
                var $et = $(event.target);
                if (!$et.closest(context).length && $('.nice-select._active').length) {
                    closeSelect();
                }
            });

            function selectBtnClick(e) {
                var $that = $(this);

                if (context.hasClass('_active')) {
                    closeSelect();
                } else {
                    openSelect();
                }

                if (!customScrollFlag && jQuery.mCustomScrollbar) {
                    customScrollUpdate(el.selectList);
                }
            }

            function selectItemClick() {
                var $that = $(this)
                    ,ctx = $that.closest('.js-nice-select')
                    ,innerItem = $that.find('span').html()
                    ,newVal = $that.data('val')

                // if ($that.hasClass('_active')) return;

                $that.addClass('_active').siblings('li').removeClass('_active');


                // if (options.firstTitle == '' && $that.index() == 0) {
                //     context.removeClass('_checked');
                // } else {
                //     context.addClass('_checked');
                // }

                context.addClass('_checked');

                el.selectBtn.attr('title', innerItem)
                el.selectHeadInner.html(innerItem);
                setNewValue(newVal);

                options.afterChange($that);

                $(window).trigger('niceChange');

                closeSelect();
            }   

        }

        $this.closeSelect = function() {
            closeSelect();
        }

        return $this;
    };

    $.fn.niceSelect = function(options){
        return this.each(function(){
            var np = new $.niceSelect($(this), options);
        });
    };

})(jQuery);