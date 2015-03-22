(function ($) {
    $.nSelect = function($element, opt) {
        var $this = this,
            customScrollFlag = false,
            defaults = {
                topList        : false,
                firstTitle     : '',
                theme          : 'nsOrange',
                disabled       : false,
                scrollbarTheme : 'dark',
                afterChange    : function() {},
                afterOpen      : function() {}
            },
            options = $.extend(defaults, opt);


        function init() {
            var $nSelect = renderSelect($element),
                el = {
                    selectBtn : $('.nselect__head', $nSelect),
                    selectHeadInner : $('.nselect__head SPAN', $nSelect),
                    selectList : $('.nselect__list', $nSelect),
                    selectItem : $('.nselect__inner li', $nSelect)
                }

            el.selectBtn.on('click', selectBtnClick);
            el.selectItem.on('click', selectItemClick);

            function selectBtnClick() {
                var $that = $(this);

                if ($nSelect.hasClass('_active')) {
                    closeSelect($that, $nSelect);
                } else {
                    openSelect($that, $nSelect);
                }

                // Активация кастомного скроллбара,
                // если он установлен
                if (!customScrollFlag && jQuery.mCustomScrollbar) {
                    customScrollUpdate(el.selectList);
                }
            }

            function selectItemClick() {
                var $that = $(this);

                changeSelectItem($nSelect, $that);
                options.afterChange($that);
                closeSelect($that);
            }
        }

        function renderSelect($elem) {
            var modClass = {
                    'top' : ''
                    ,'disabled' : ''
                },
                context = '',
                el = {},
                selectedOpt,
                noSelected = false,
                selectTitle = $elem.data('title') || '',
                selectName = $elem.attr('name') || '',
                titleHtml,
                titleVal;

            $elem.hide();

            if (options.topList) {
                modClass.top = '_top';
            }
            
            if ($elem.hasClass('_disabled') || options.disabled) {
                modClass.disabled = '_disabled';
            }

            // Создаем обертку вокруг селекта
            context = $elem
                        .wrap('<div class="nselect '+modClass.top+' '+options.theme+' '+modClass.disabled+'" data-name="'+selectName+'" data-val=""></div>')
                        .closest('.nselect')
                        .prepend('<div class="nselect__inner">'+
                                    '<ul class="nselect__list"></ul>'+
                                '</div>');

            // Первые элементы: внутрянка обертки и список
            el = {
                'selectList' : $('.nselect__list', context),
                'selectItem' : {}
            }

            // Заполняем списков из опшинов
            $elem.find('option').each(function(index) {
                var $that = $(this),
                    val = $that.val(),
                    html = $that.html(),
                    activeClass = '',
                    newItem;

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
            el.selectItem = $('.nselect__inner li', context)

            // Если юзер не задал явно selected для опшинов,
            // то делаем первый элемент "выбранным" в списке
            if (selectedOpt === undefined) {
                console.log('auto first title')
                noSelected = true;
                selectedOpt = $elem.find('option');
                el.selectItem.eq(0).addClass('_active');
            }

            // Делаем кнопку с выбранным элементом из списка
            titleHtml = selectedOpt.html();
            titleVal = selectedOpt.val();

            // Выводим заголовок в кнопку из options.firstTitle
            if (options.firstTitle !== '' && noSelected) {
                console.log('options.firstTitle')

                el.selectItem.removeClass('_active');
                $elem.val('');
                titleHtml = options.firstTitle;
                titleVal = '';
            } 

            // Выводим заголовок в кнопку из data-title
            if (selectTitle !== '' && noSelected) {
                console.log('data-title');

                el.selectItem.removeClass('_active');
                $elem.val('');
                titleHtml = selectTitle;
                titleVal = '';
            }

            context.prepend('<h6 class="nselect__head" data-val="'+titleVal+'"><span>'+titleHtml+'</span></h6>');

            $('.nselect__head', context)
                .attr('title', $('.nselect__head SPAN', context).html())

            return context;
        }

        function closeSelect(el, ctx) {
            if (ctx === undefined) {
                $('.nselect').removeClass('_active');
                return;
            }

            ctx.removeClass('_active');
            $(window).trigger('niceClose');
        }

        function openSelect(el, ctx) {
            ctx.addClass('_active');
            options.afterOpen(el);
            $(window).trigger('nOpen');
        }

        function setNewValue(newVal, ctx) {
            $element.val(newVal);
            ctx.data('val', newVal);
        }

        function changeSelectItem(ctx, item) {
            var $that = $(item),
                innerItem = $that.find('span').html(),
                newVal = $that.data('val');

            $that.addClass('_active').siblings('li').removeClass('_active');
            
            ctx.addClass('_checked');

            $('.nselect__head', ctx).attr('title', innerItem)
            $('.nselect__head SPAN', ctx).html(innerItem);
            setNewValue(newVal, ctx);

            $(window).trigger('nChange');
        }

        function customScrollUpdate(el) {
            el.mCustomScrollbar('destroy');
            el.mCustomScrollbar({
                theme: options.scrollbarTheme
            });
            customScrollFlag = true;
        }

        init();

        // console.log($this)
        return $this;
    };

    //TODO: оформить как-то нормально
    $(document).on('click', function(e){
        if (!$(e.target).closest('.nselect').length && $('.nselect._active').length != 0) {
            $('.nselect').removeClass('_active');
        }
    });


    $.fn.nSelect = function(options){
        return this.each(function(){
            var np = new $.nSelect($(this), options);
        });
    };

})(jQuery);