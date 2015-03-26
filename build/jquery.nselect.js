/*!
== nSelect jQuery custom select plugin == 
Version: 1.0.1
Plugin URI: http://nselect.edbond.name/
Author: Ed Bond
Author URI: http://edbond.name/
License: MIT License (MIT)
*/

/*
Copyright 2015 Ed Bond (email: edbond88@gmail.com)
*/
(function ($) {
    $.nSelect = function($element, opt) {
        var $this = this,
            customScrollFlag = false,
            defaults = {
                topList         : false,
                firstTitle      : '',
                theme           : 'nsOrange',
                disabled        : false,
                scrollbarTheme  : 'dark',
                hideAfterSelect : false,
                afterChange     : function() {},
                afterOpen       : function() {}
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

                // Custom scrollbar activation
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

            // Create wrap around select
            context = $elem
                        .wrap('<div class="nselect ns-sys '+modClass.top+' '+options.theme+' '+modClass.disabled+'" data-name="'+selectName+'" data-val=""></div>')
                        .closest('.nselect.ns-sys')
                        .prepend('<div class="nselect__inner">'+
                                    '<ul class="nselect__list"></ul>'+
                                '</div>');

            el = {
                'selectList' : $('.nselect__list', context),
                'selectItem' : {}
            }

            $elem.find('option').each(function(index) {
                var $that = $(this),
                    val = $that.val(),
                    html = $that.html(),
                    activeClass = '',
                    hideClass = '',
                    newItem;

                if ($that.attr('selected')) {
                    selectedOpt = $that;
                    activeClass = '_active';

                    if (options.hideAfterSelect == true) {
                        hideClass = '_hide';
                    }
                } else {
                    activeClass = '';
                    hideClass = ''
                }


                newItem = '<li class="'+activeClass+' '+hideClass+'" data-val="'+val+'"><span>'+html+'</span></li>';

                el.selectList.append(newItem)
            });
            el.selectItem = $('.nselect__inner li', context)

            if (selectedOpt === undefined) {
                // console.log('auto first title')
                noSelected = true;
                selectedOpt = $elem.find('option');
                el.selectItem.eq(0).addClass('_active');
                if (options.hideAfterSelect == true) {
                    el.selectItem.eq(0).addClass('_hide');
                }
            }

            titleHtml = selectedOpt.html();
            titleVal = selectedOpt.val();

            if (options.firstTitle !== '' && noSelected) {
                // console.log('options.firstTitle')
                el.selectItem.removeClass('_active');
                $elem.val('');
                titleHtml = options.firstTitle;
                titleVal = '';
            } 

            if (selectTitle !== '' && noSelected) {
                // console.log('data-title');
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

            if (options.hideAfterSelect == true) {
                $that.addClass('_hide').siblings('li').removeClass('_hide');
            }
            
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

        return $this;
    };

    //TODO: refract this block
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