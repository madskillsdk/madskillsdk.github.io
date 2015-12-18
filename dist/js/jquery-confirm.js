/*!
 * jquery-confirm v1.8.0 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2015 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('jquery-confirm requires jQuery');
}

var jconfirm, Jconfirm;
(function ($) {
    "use strict";
    $.confirm = function (options) {
        /*
         *  Alias of jconfirm
         */
        return jconfirm(options);
    };
    $.alert = function (options) {
        /*
         *  Alias of jconfirm
         */
        options.cancelButton = false;
        return jconfirm(options);
    };
    $.dialog = function (options) {
        /*
         *  Alias of jconfirm
         */
        options.cancelButton = false;
        options.confirmButton = false;
        options.confirmKeys = [13];
        return jconfirm(options);
    };
    jconfirm = function (options) {
        /*
         * initial function for calling.
         */
        if (jconfirm.defaults) {
            /*
             * Merge global defaults with plugin defaults
             */
            $.extend(jconfirm.pluginDefaults, jconfirm.defaults);
        }
        /*
         * merge options with plugin defaults.
         */
        var options = $.extend({}, jconfirm.pluginDefaults, options);
        return new Jconfirm(options);
    };
    Jconfirm = function (options) {
        /*
         * constructor function Jconfirm,
         * options = user options.
         */
        $.extend(this, options);
        this._init();
    };
    Jconfirm.prototype = {
        _init: function () {
            var that = this;
            this._rand = Math.round(Math.random() * 99999);
            this._buildHTML();
            this._bindEvents();
            setTimeout(function () {
                that.open();
            }, 0);
        },
        animations: ['anim-scale', 'anim-top', 'anim-bottom', 'anim-left', 'anim-right', 'anim-zoom', 'anim-opacity', 'anim-none', 'anim-rotate', 'anim-rotatex', 'anim-rotatey', 'anim-scalex', 'anim-scaley'],
        _buildHTML: function () {
            /*
             * Cleaning animations.
             */
            this.animation = 'anim-' + this.animation.toLowerCase();
            if (this.animation === 'none')
                this.animationSpeed = 0;

            /*
             * Append html to body.
             */
            this.$el = $(this.template).appendTo(this.container).addClass(this.theme);
            this.$el.find('.jconfirm-box-container').addClass(this.columnClass);

            this.CSS = {
                '-webkit-transition-duration': this.animationSpeed / 1000 + 's',
                'transition-duration': this.animationSpeed / 1000 + 's',
                '-webkit-transition-timing-function': 'cubic-bezier(0.27, 1.12, 0.32, ' + this.animationBounce + ')',
                'transition-timing-function': 'cubic-bezier(0.27, 1.12, 0.32, ' + this.animationBounce + ')'
            };

            this.$el.find('.jconfirm-bg').css(this.CSS);
            this.$b = this.$el.find('.jconfirm-box').css(this.CSS).addClass(this.animation);
            this.$body = this.$b; // alias

            /*
             * Add rtl class if rtl option has selected
             */
            if (this.rtl)
                this.$el.addClass("rtl");

            /*
             * Setup title contents
             */
            this.setTitle();
            this.contentDiv = this.$el.find('div.content');
            this.$content = this.contentDiv; // alias
            
            /*
             * Settings up buttons
             */
            this.$btnc = this.$el.find('.buttons');
            if (this.confirmButton && this.confirmButton.trim() !== '') {
                this.$confirmButton = $('<button class="btn">' + this.confirmButton + '</button>').appendTo(this.$btnc).addClass(this.confirmButtonClass);
            }
            
            if (this.cancelButton && this.cancelButton.trim() !== '') {
                this.$cancelButton = $('<button class="btn">' + this.cancelButton + '</button>').appendTo(this.$btnc).addClass(this.cancelButtonClass);
            }

            if (!this.confirmButton && !this.cancelButton) {
                this.$btnc.remove();
            }

            if (!this.confirmButton && !this.cancelButton && this.closeIcon === null) {
                this.$closeButton = this.$b.find('.closeIcon').show();
            }

            if (this.closeIcon === true) {
                this.$closeButton = this.$b.find('.closeIcon').show();
            }

            this.setContent();

            if (this.autoClose)
                this._startCountDown();
        },
        setTitle: function (string) {
            this.title = (typeof string !== 'undefined') ? string : this.title;

            if (this.title) {
                this.$el.find('div.title').html('<i class="' + this.icon + '"></i> ' + this.title);
            } else {
                this.$el.find('div.title').remove();
            }
        },
        setContent: function (string) {
            var that = this;
            this.content = (string) ? string : this.content;
            var animate = (string) ? true : false;

            /*
             * Set content.
             */
            if (typeof this.content === 'boolean') {
                if (!this.content)
                    this.contentDiv.remove(); else
                    console.error('Invalid option for property content: passed TRUE');
            } else if (typeof this.content === 'string') {

                if (this.content.substr(0, 4).toLowerCase() === 'url:') {
                    this.contentDiv.html('');
                    this.$btnc.find('button').prop('disabled', true);
                    var url = this.content.substring(4, this.content.length);
                    $.get(url).done(function (html) {
                        that.contentDiv.html(html);
                    }).always(function (data, status, xhr) {
                        if (typeof that.contentLoaded === 'function')
                            that.contentLoaded(data, status, xhr);

                        that.$btnc.find('button').prop('disabled', false);
                        that.setDialogCenter();
                    });
                } else {
                    this.contentDiv.html(this.content);
                }

            } else if (typeof this.content === 'function') {

                this.contentDiv.html('');
                this.$btnc.find('button').attr('disabled', 'disabled');

                var promise = this.content(this);
                if (typeof promise !== 'object') {
                    console.error('The content function must return jquery promise.');
                } else if (typeof promise.always !== 'function') {
                    console.error('The object returned is not a jquery promise.');
                } else {
                    promise.always(function (data, status) {
                        that.$btnc.find('button').removeAttr('disabled');
                        that.setDialogCenter();
                    });
                }

            } else {
                console.error('Invalid option for property content, passed: ' + typeof this.content);
            }

            this.setDialogCenter(animate);
        },
        _startCountDown: function () {
            var opt = this.autoClose.split('|');
            if (/cancel/.test(opt[0]) && this.type === 'alert') {
                return false;
            } else if (/confirm|cancel/.test(opt[0])) {
                this.$cd = $('<span class="countdown">').appendTo(this['$' + opt[0] + 'Button']);
                var that = this;
                that.$cd.parent().click();
                var time = opt[1] / 1000;
                this.interval = setInterval(function () {
                    that.$cd.html(' [' + (time -= 1) + ']');
                    if (time === 0) {
                        that.$cd.parent().trigger('click');
                        clearInterval(that.interval);
                    }
                }, 1000);
            } else {
                console.error('Invalid option ' + opt[0] + ', must be confirm/cancel');
            }
        },
        _bindEvents: function () {
            var that = this;
            var boxClicked = false;

            this.$el.find('.jconfirm-scrollpane').click(function (e) {
                // ignore propagated clicks
                if (!boxClicked) {
                    // background clicked
                    if (that.backgroundDismiss) {
                        that.cancel();
                        that.close();
                    } else {
                        that.$b.addClass('hilight');
                        setTimeout(function () {
                            that.$b.removeClass('hilight');
                        }, 400);
                    }
                }
                boxClicked = false;
            });

            this.$el.find('.jconfirm-box').click(function (e) {
                boxClicked = true;
            });

            if (this.$confirmButton) {
                this.$confirmButton.click(function (e) {
                    e.preventDefault();
                    var r = that.confirm(that.$b);
                    that.onAction();

                    if (typeof r === 'undefined' || r)
                        that.close();
                });
            }
            if (this.$cancelButton) {
                this.$cancelButton.click(function (e) {
                    e.preventDefault();
                    var r = that.cancel(that.$b);
                    that.onAction();

                    if (typeof r === 'undefined' || r)
                        that.close();
                });
            }
            if (this.$closeButton) {
                this.$closeButton.click(function (e) {
                    e.preventDefault();
                    that.cancel();
                    that.onAction();
                    that.close();
                });
            }
            if (this.keyboardEnabled) {
                setTimeout(function () {
                    $(window).on('keyup.' + this._rand, function (e) {
                        that.reactOnKey(e);
                    });
                }, 500);
            }

            $(window).on('resize.' + this._rand, function () {
                that.setDialogCenter(true);
            });

        },
        reactOnKey: function key(e) {

            /*
             * prevent keyup event if the dialog is not last!
             */
            var a = $('.jconfirm');
            if (a.eq(a.length - 1)[0] !== this.$el[0])
                return false;

            var key = e.which;
            // Do not react if Enter/Space is pressed on input elements
            if (this.contentDiv.find(':input').is(':focus') && /13|32/.test(key))
                return false;

            if ($.inArray(key, this.cancelKeys) !== -1) {
                /*
                 * Cancel key pressed.
                 */
                if (!this.backgroundDismiss) {
                    /*
                     * If background dismiss is false, Glow the modal.
                     */
                    this.$el.find('.jconfirm-bg').click();
                    return false;
                }

                if (this.$cancelButton) {
                    this.$cancelButton.click();
                } else {
                    this.close();
                }
            }
            if ($.inArray(key, this.confirmKeys) !== -1) {
                /*
                 * Confirm key pressed.
                 */
                if (this.$confirmButton) {
                    this.$confirmButton.click();
                }
            }
        },
        setDialogCenter: function (animate) {
            var windowHeight = $(window).height();
            var boxHeight = this.$b.outerHeight();
            var topMargin = (windowHeight - boxHeight) / 2;
            var minMargin = 100;
            if (boxHeight > (windowHeight - minMargin)) {
                var style = {
                    'margin-top': minMargin / 2,
                    'margin-bottom': minMargin / 2
                }
            } else {
                var style = {
                    'margin-top': topMargin
                }
            }
            if (animate) {
                this.$b.animate(style, {
                    duration: this.animationSpeed,
                    queue: false
                });
            } else {
                this.$b.css(style);
            }
        },
        close: function () {
            var that = this;

            if (this.isClosed())
                return false;

            if (typeof this.onClose === 'function')
                this.onClose();
            /*
             unbind the window resize & keyup event.
             */
            $(window).unbind('resize.' + this._rand);
            if (this.keyboardEnabled)
                $(window).unbind('keyup.' + this._rand);

            that.$el.find('.jconfirm-bg').removeClass('seen');
            this.$b.addClass(this.animation);

            setTimeout(function () {
                that.$el.remove();
            }, this.animationSpeed + 10); // wait 10 miliseconds more, ensure everything is done.

            jconfirm.record.closed += 1;
            jconfirm.record.currentlyOpen -= 1;

            if (jconfirm.record.currentlyOpen < 1)
                $('body').removeClass('jconfirm-noscroll');

            return true;
        },
        open: function () {
            var that = this;
            if (this.isClosed())
                return false;

            that.$el.find('.jconfirm-bg').addClass('seen');

            $('body').addClass('jconfirm-noscroll');
            this.$b.removeClass(this.animations.join(' '));
            /**
             * Blur the focused elements, prevents re-execution with button press.
             */
            $('body :focus').trigger('blur');
            this.$b.find('input[autofocus]:visible:first').focus();
            jconfirm.record.opened += 1;
            jconfirm.record.currentlyOpen += 1;
            if (typeof this.onOpen === 'function')
                this.onOpen();
            return true;
        },
        isClosed: function () {
            return (this.$el.css('display') === '') ? true : false;
        }
    };

    jconfirm.pluginDefaults = {
        template: '<div class="jconfirm"><div class="jconfirm-bg"></div><div class="jconfirm-scrollpane"><div class="container"><div class="row"><div class="jconfirm-box-container span6 offset3"><div class="jconfirm-box"><div class="closeIcon"><span class="glyphicon glyphicon-remove"></span></div><div class="title"></div><div class="content"></div><div class="buttons"></div><div class="jquery-clear"></div></div></div></div></div></div></div>',
        title: 'Hello',
        content: 'Are you sure to continue?',
        contentLoaded: function () {
        },
        icon: '',
        confirmButton: 'Okay',
        cancelButton: 'Cancel',
        confirmButtonClass: 'btn-default',
        cancelButtonClass: 'btn-default',
        theme: 'white',
        animation: 'scale',
        animationSpeed: 400,
        animationBounce: 1.5,
        keyboardEnabled: false,
        rtl: false,
        confirmKeys: [13, 32], // ENTER or SPACE key
        cancelKeys: [27], // ESC key
        container: 'body',
        confirm: function () {
        },
        cancel: function () {
        },
        backgroundDismiss: true,
        autoClose: false,
        closeIcon: null,
        columnClass: 'col-md-6 col-md-offset-3',
        onOpen: function () {
        },
        onClose: function () {
        },
        onAction: function () {
        }
    };

    jconfirm.record = {
        opened: 0,
        closed: 0,
        currentlyOpen: 0
    };
})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pxdWVyeS1jb25maXJtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBVUEsSUFBSSxPQUFPLFdBQVcsYUFBYTtJQUMvQixNQUFNLElBQUksTUFBTTs7O0FBR3BCLElBQUksVUFBVTtBQUNkLENBQUMsVUFBVSxHQUFHO0lBQ1Y7SUFDQSxFQUFFLFVBQVUsVUFBVSxTQUFTOzs7O1FBSTNCLE9BQU8sU0FBUzs7SUFFcEIsRUFBRSxRQUFRLFVBQVUsU0FBUzs7OztRQUl6QixRQUFRLGVBQWU7UUFDdkIsT0FBTyxTQUFTOztJQUVwQixFQUFFLFNBQVMsVUFBVSxTQUFTOzs7O1FBSTFCLFFBQVEsZUFBZTtRQUN2QixRQUFRLGdCQUFnQjtRQUN4QixRQUFRLGNBQWMsQ0FBQztRQUN2QixPQUFPLFNBQVM7O0lBRXBCLFdBQVcsVUFBVSxTQUFTOzs7O1FBSTFCLElBQUksU0FBUyxVQUFVOzs7O1lBSW5CLEVBQUUsT0FBTyxTQUFTLGdCQUFnQixTQUFTOzs7OztRQUsvQyxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksU0FBUyxnQkFBZ0I7UUFDcEQsT0FBTyxJQUFJLFNBQVM7O0lBRXhCLFdBQVcsVUFBVSxTQUFTOzs7OztRQUsxQixFQUFFLE9BQU8sTUFBTTtRQUNmLEtBQUs7O0lBRVQsU0FBUyxZQUFZO1FBQ2pCLE9BQU8sWUFBWTtZQUNmLElBQUksT0FBTztZQUNYLEtBQUssUUFBUSxLQUFLLE1BQU0sS0FBSyxXQUFXO1lBQ3hDLEtBQUs7WUFDTCxLQUFLO1lBQ0wsV0FBVyxZQUFZO2dCQUNuQixLQUFLO2VBQ047O1FBRVAsWUFBWSxDQUFDLGNBQWMsWUFBWSxlQUFlLGFBQWEsY0FBYyxhQUFhLGdCQUFnQixhQUFhLGVBQWUsZ0JBQWdCLGdCQUFnQixlQUFlO1FBQ3pMLFlBQVksWUFBWTs7OztZQUlwQixLQUFLLFlBQVksVUFBVSxLQUFLLFVBQVU7WUFDMUMsSUFBSSxLQUFLLGNBQWM7Z0JBQ25CLEtBQUssaUJBQWlCOzs7OztZQUsxQixLQUFLLE1BQU0sRUFBRSxLQUFLLFVBQVUsU0FBUyxLQUFLLFdBQVcsU0FBUyxLQUFLO1lBQ25FLEtBQUssSUFBSSxLQUFLLDJCQUEyQixTQUFTLEtBQUs7O1lBRXZELEtBQUssTUFBTTtnQkFDUCwrQkFBK0IsS0FBSyxpQkFBaUIsT0FBTztnQkFDNUQsdUJBQXVCLEtBQUssaUJBQWlCLE9BQU87Z0JBQ3BELHNDQUFzQyxvQ0FBb0MsS0FBSyxrQkFBa0I7Z0JBQ2pHLDhCQUE4QixvQ0FBb0MsS0FBSyxrQkFBa0I7OztZQUc3RixLQUFLLElBQUksS0FBSyxnQkFBZ0IsSUFBSSxLQUFLO1lBQ3ZDLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxpQkFBaUIsSUFBSSxLQUFLLEtBQUssU0FBUyxLQUFLO1lBQ3JFLEtBQUssUUFBUSxLQUFLOzs7OztZQUtsQixJQUFJLEtBQUs7Z0JBQ0wsS0FBSyxJQUFJLFNBQVM7Ozs7O1lBS3RCLEtBQUs7WUFDTCxLQUFLLGFBQWEsS0FBSyxJQUFJLEtBQUs7WUFDaEMsS0FBSyxXQUFXLEtBQUs7Ozs7O1lBS3JCLEtBQUssUUFBUSxLQUFLLElBQUksS0FBSztZQUMzQixJQUFJLEtBQUssaUJBQWlCLEtBQUssY0FBYyxXQUFXLElBQUk7Z0JBQ3hELEtBQUssaUJBQWlCLEVBQUUseUJBQXlCLEtBQUssZ0JBQWdCLGFBQWEsU0FBUyxLQUFLLE9BQU8sU0FBUyxLQUFLOzs7WUFHMUgsSUFBSSxLQUFLLGdCQUFnQixLQUFLLGFBQWEsV0FBVyxJQUFJO2dCQUN0RCxLQUFLLGdCQUFnQixFQUFFLHlCQUF5QixLQUFLLGVBQWUsYUFBYSxTQUFTLEtBQUssT0FBTyxTQUFTLEtBQUs7OztZQUd4SCxJQUFJLENBQUMsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLLGNBQWM7Z0JBQzNDLEtBQUssTUFBTTs7O1lBR2YsSUFBSSxDQUFDLEtBQUssaUJBQWlCLENBQUMsS0FBSyxnQkFBZ0IsS0FBSyxjQUFjLE1BQU07Z0JBQ3RFLEtBQUssZUFBZSxLQUFLLEdBQUcsS0FBSyxjQUFjOzs7WUFHbkQsSUFBSSxLQUFLLGNBQWMsTUFBTTtnQkFDekIsS0FBSyxlQUFlLEtBQUssR0FBRyxLQUFLLGNBQWM7OztZQUduRCxLQUFLOztZQUVMLElBQUksS0FBSztnQkFDTCxLQUFLOztRQUViLFVBQVUsVUFBVSxRQUFRO1lBQ3hCLEtBQUssUUFBUSxDQUFDLE9BQU8sV0FBVyxlQUFlLFNBQVMsS0FBSzs7WUFFN0QsSUFBSSxLQUFLLE9BQU87Z0JBQ1osS0FBSyxJQUFJLEtBQUssYUFBYSxLQUFLLGVBQWUsS0FBSyxPQUFPLFlBQVksS0FBSzttQkFDekU7Z0JBQ0gsS0FBSyxJQUFJLEtBQUssYUFBYTs7O1FBR25DLFlBQVksVUFBVSxRQUFRO1lBQzFCLElBQUksT0FBTztZQUNYLEtBQUssVUFBVSxDQUFDLFVBQVUsU0FBUyxLQUFLO1lBQ3hDLElBQUksVUFBVSxDQUFDLFVBQVUsT0FBTzs7Ozs7WUFLaEMsSUFBSSxPQUFPLEtBQUssWUFBWSxXQUFXO2dCQUNuQyxJQUFJLENBQUMsS0FBSztvQkFDTixLQUFLLFdBQVc7b0JBQ2hCLFFBQVEsTUFBTTttQkFDZixJQUFJLE9BQU8sS0FBSyxZQUFZLFVBQVU7O2dCQUV6QyxJQUFJLEtBQUssUUFBUSxPQUFPLEdBQUcsR0FBRyxrQkFBa0IsUUFBUTtvQkFDcEQsS0FBSyxXQUFXLEtBQUs7b0JBQ3JCLEtBQUssTUFBTSxLQUFLLFVBQVUsS0FBSyxZQUFZO29CQUMzQyxJQUFJLE1BQU0sS0FBSyxRQUFRLFVBQVUsR0FBRyxLQUFLLFFBQVE7b0JBQ2pELEVBQUUsSUFBSSxLQUFLLEtBQUssVUFBVSxNQUFNO3dCQUM1QixLQUFLLFdBQVcsS0FBSzt1QkFDdEIsT0FBTyxVQUFVLE1BQU0sUUFBUSxLQUFLO3dCQUNuQyxJQUFJLE9BQU8sS0FBSyxrQkFBa0I7NEJBQzlCLEtBQUssY0FBYyxNQUFNLFFBQVE7O3dCQUVyQyxLQUFLLE1BQU0sS0FBSyxVQUFVLEtBQUssWUFBWTt3QkFDM0MsS0FBSzs7dUJBRU47b0JBQ0gsS0FBSyxXQUFXLEtBQUssS0FBSzs7O21CQUczQixJQUFJLE9BQU8sS0FBSyxZQUFZLFlBQVk7O2dCQUUzQyxLQUFLLFdBQVcsS0FBSztnQkFDckIsS0FBSyxNQUFNLEtBQUssVUFBVSxLQUFLLFlBQVk7O2dCQUUzQyxJQUFJLFVBQVUsS0FBSyxRQUFRO2dCQUMzQixJQUFJLE9BQU8sWUFBWSxVQUFVO29CQUM3QixRQUFRLE1BQU07dUJBQ1gsSUFBSSxPQUFPLFFBQVEsV0FBVyxZQUFZO29CQUM3QyxRQUFRLE1BQU07dUJBQ1g7b0JBQ0gsUUFBUSxPQUFPLFVBQVUsTUFBTSxRQUFRO3dCQUNuQyxLQUFLLE1BQU0sS0FBSyxVQUFVLFdBQVc7d0JBQ3JDLEtBQUs7Ozs7bUJBSVY7Z0JBQ0gsUUFBUSxNQUFNLGtEQUFrRCxPQUFPLEtBQUs7OztZQUdoRixLQUFLLGdCQUFnQjs7UUFFekIsaUJBQWlCLFlBQVk7WUFDekIsSUFBSSxNQUFNLEtBQUssVUFBVSxNQUFNO1lBQy9CLElBQUksU0FBUyxLQUFLLElBQUksT0FBTyxLQUFLLFNBQVMsU0FBUztnQkFDaEQsT0FBTzttQkFDSixJQUFJLGlCQUFpQixLQUFLLElBQUksS0FBSztnQkFDdEMsS0FBSyxNQUFNLEVBQUUsNEJBQTRCLFNBQVMsS0FBSyxNQUFNLElBQUksS0FBSztnQkFDdEUsSUFBSSxPQUFPO2dCQUNYLEtBQUssSUFBSSxTQUFTO2dCQUNsQixJQUFJLE9BQU8sSUFBSSxLQUFLO2dCQUNwQixLQUFLLFdBQVcsWUFBWSxZQUFZO29CQUNwQyxLQUFLLElBQUksS0FBSyxRQUFRLFFBQVEsS0FBSztvQkFDbkMsSUFBSSxTQUFTLEdBQUc7d0JBQ1osS0FBSyxJQUFJLFNBQVMsUUFBUTt3QkFDMUIsY0FBYyxLQUFLOzttQkFFeEI7bUJBQ0E7Z0JBQ0gsUUFBUSxNQUFNLG9CQUFvQixJQUFJLEtBQUs7OztRQUduRCxhQUFhLFlBQVk7WUFDckIsSUFBSSxPQUFPO1lBQ1gsSUFBSSxhQUFhOztZQUVqQixLQUFLLElBQUksS0FBSyx3QkFBd0IsTUFBTSxVQUFVLEdBQUc7O2dCQUVyRCxJQUFJLENBQUMsWUFBWTs7b0JBRWIsSUFBSSxLQUFLLG1CQUFtQjt3QkFDeEIsS0FBSzt3QkFDTCxLQUFLOzJCQUNGO3dCQUNILEtBQUssR0FBRyxTQUFTO3dCQUNqQixXQUFXLFlBQVk7NEJBQ25CLEtBQUssR0FBRyxZQUFZOzJCQUNyQjs7O2dCQUdYLGFBQWE7OztZQUdqQixLQUFLLElBQUksS0FBSyxpQkFBaUIsTUFBTSxVQUFVLEdBQUc7Z0JBQzlDLGFBQWE7OztZQUdqQixJQUFJLEtBQUssZ0JBQWdCO2dCQUNyQixLQUFLLGVBQWUsTUFBTSxVQUFVLEdBQUc7b0JBQ25DLEVBQUU7b0JBQ0YsSUFBSSxJQUFJLEtBQUssUUFBUSxLQUFLO29CQUMxQixLQUFLOztvQkFFTCxJQUFJLE9BQU8sTUFBTSxlQUFlO3dCQUM1QixLQUFLOzs7WUFHakIsSUFBSSxLQUFLLGVBQWU7Z0JBQ3BCLEtBQUssY0FBYyxNQUFNLFVBQVUsR0FBRztvQkFDbEMsRUFBRTtvQkFDRixJQUFJLElBQUksS0FBSyxPQUFPLEtBQUs7b0JBQ3pCLEtBQUs7O29CQUVMLElBQUksT0FBTyxNQUFNLGVBQWU7d0JBQzVCLEtBQUs7OztZQUdqQixJQUFJLEtBQUssY0FBYztnQkFDbkIsS0FBSyxhQUFhLE1BQU0sVUFBVSxHQUFHO29CQUNqQyxFQUFFO29CQUNGLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzs7WUFHYixJQUFJLEtBQUssaUJBQWlCO2dCQUN0QixXQUFXLFlBQVk7b0JBQ25CLEVBQUUsUUFBUSxHQUFHLFdBQVcsS0FBSyxPQUFPLFVBQVUsR0FBRzt3QkFDN0MsS0FBSyxXQUFXOzttQkFFckI7OztZQUdQLEVBQUUsUUFBUSxHQUFHLFlBQVksS0FBSyxPQUFPLFlBQVk7Z0JBQzdDLEtBQUssZ0JBQWdCOzs7O1FBSTdCLFlBQVksU0FBUyxJQUFJLEdBQUc7Ozs7O1lBS3hCLElBQUksSUFBSSxFQUFFO1lBQ1YsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEdBQUcsT0FBTyxLQUFLLElBQUk7Z0JBQ25DLE9BQU87O1lBRVgsSUFBSSxNQUFNLEVBQUU7O1lBRVosSUFBSSxLQUFLLFdBQVcsS0FBSyxVQUFVLEdBQUcsYUFBYSxRQUFRLEtBQUs7Z0JBQzVELE9BQU87O1lBRVgsSUFBSSxFQUFFLFFBQVEsS0FBSyxLQUFLLGdCQUFnQixDQUFDLEdBQUc7Ozs7Z0JBSXhDLElBQUksQ0FBQyxLQUFLLG1CQUFtQjs7OztvQkFJekIsS0FBSyxJQUFJLEtBQUssZ0JBQWdCO29CQUM5QixPQUFPOzs7Z0JBR1gsSUFBSSxLQUFLLGVBQWU7b0JBQ3BCLEtBQUssY0FBYzt1QkFDaEI7b0JBQ0gsS0FBSzs7O1lBR2IsSUFBSSxFQUFFLFFBQVEsS0FBSyxLQUFLLGlCQUFpQixDQUFDLEdBQUc7Ozs7Z0JBSXpDLElBQUksS0FBSyxnQkFBZ0I7b0JBQ3JCLEtBQUssZUFBZTs7OztRQUloQyxpQkFBaUIsVUFBVSxTQUFTO1lBQ2hDLElBQUksZUFBZSxFQUFFLFFBQVE7WUFDN0IsSUFBSSxZQUFZLEtBQUssR0FBRztZQUN4QixJQUFJLFlBQVksQ0FBQyxlQUFlLGFBQWE7WUFDN0MsSUFBSSxZQUFZO1lBQ2hCLElBQUksYUFBYSxlQUFlLFlBQVk7Z0JBQ3hDLElBQUksUUFBUTtvQkFDUixjQUFjLFlBQVk7b0JBQzFCLGlCQUFpQixZQUFZOzttQkFFOUI7Z0JBQ0gsSUFBSSxRQUFRO29CQUNSLGNBQWM7OztZQUd0QixJQUFJLFNBQVM7Z0JBQ1QsS0FBSyxHQUFHLFFBQVEsT0FBTztvQkFDbkIsVUFBVSxLQUFLO29CQUNmLE9BQU87O21CQUVSO2dCQUNILEtBQUssR0FBRyxJQUFJOzs7UUFHcEIsT0FBTyxZQUFZO1lBQ2YsSUFBSSxPQUFPOztZQUVYLElBQUksS0FBSztnQkFDTCxPQUFPOztZQUVYLElBQUksT0FBTyxLQUFLLFlBQVk7Z0JBQ3hCLEtBQUs7Ozs7WUFJVCxFQUFFLFFBQVEsT0FBTyxZQUFZLEtBQUs7WUFDbEMsSUFBSSxLQUFLO2dCQUNMLEVBQUUsUUFBUSxPQUFPLFdBQVcsS0FBSzs7WUFFckMsS0FBSyxJQUFJLEtBQUssZ0JBQWdCLFlBQVk7WUFDMUMsS0FBSyxHQUFHLFNBQVMsS0FBSzs7WUFFdEIsV0FBVyxZQUFZO2dCQUNuQixLQUFLLElBQUk7ZUFDVixLQUFLLGlCQUFpQjs7WUFFekIsU0FBUyxPQUFPLFVBQVU7WUFDMUIsU0FBUyxPQUFPLGlCQUFpQjs7WUFFakMsSUFBSSxTQUFTLE9BQU8sZ0JBQWdCO2dCQUNoQyxFQUFFLFFBQVEsWUFBWTs7WUFFMUIsT0FBTzs7UUFFWCxNQUFNLFlBQVk7WUFDZCxJQUFJLE9BQU87WUFDWCxJQUFJLEtBQUs7Z0JBQ0wsT0FBTzs7WUFFWCxLQUFLLElBQUksS0FBSyxnQkFBZ0IsU0FBUzs7WUFFdkMsRUFBRSxRQUFRLFNBQVM7WUFDbkIsS0FBSyxHQUFHLFlBQVksS0FBSyxXQUFXLEtBQUs7Ozs7WUFJekMsRUFBRSxlQUFlLFFBQVE7WUFDekIsS0FBSyxHQUFHLEtBQUssa0NBQWtDO1lBQy9DLFNBQVMsT0FBTyxVQUFVO1lBQzFCLFNBQVMsT0FBTyxpQkFBaUI7WUFDakMsSUFBSSxPQUFPLEtBQUssV0FBVztnQkFDdkIsS0FBSztZQUNULE9BQU87O1FBRVgsVUFBVSxZQUFZO1lBQ2xCLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxlQUFlLE1BQU0sT0FBTzs7OztJQUl6RCxTQUFTLGlCQUFpQjtRQUN0QixVQUFVO1FBQ1YsT0FBTztRQUNQLFNBQVM7UUFDVCxlQUFlLFlBQVk7O1FBRTNCLE1BQU07UUFDTixlQUFlO1FBQ2YsY0FBYztRQUNkLG9CQUFvQjtRQUNwQixtQkFBbUI7UUFDbkIsT0FBTztRQUNQLFdBQVc7UUFDWCxnQkFBZ0I7UUFDaEIsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixLQUFLO1FBQ0wsYUFBYSxDQUFDLElBQUk7UUFDbEIsWUFBWSxDQUFDO1FBQ2IsV0FBVztRQUNYLFNBQVMsWUFBWTs7UUFFckIsUUFBUSxZQUFZOztRQUVwQixtQkFBbUI7UUFDbkIsV0FBVztRQUNYLFdBQVc7UUFDWCxhQUFhO1FBQ2IsUUFBUSxZQUFZOztRQUVwQixTQUFTLFlBQVk7O1FBRXJCLFVBQVUsWUFBWTs7OztJQUkxQixTQUFTLFNBQVM7UUFDZCxRQUFRO1FBQ1IsUUFBUTtRQUNSLGVBQWU7O0dBRXBCO0FBQ0giLCJmaWxlIjoianMvanF1ZXJ5LWNvbmZpcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICoganF1ZXJ5LWNvbmZpcm0gdjEuOC4wIChodHRwOi8vY3JhZnRwaXAuZ2l0aHViLmlvL2pxdWVyeS1jb25maXJtLylcclxuICogQXV0aG9yOiBCb25pZmFjZSBQZXJlaXJhXHJcbiAqIFdlYnNpdGU6IHd3dy5jcmFmdHBpcC5jb21cclxuICogQ29udGFjdDogaGV5QGNyYWZ0cGlwLmNvbVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1IGpxdWVyeS1jb25maXJtXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL2NyYWZ0cGlwL2pxdWVyeS1jb25maXJtL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXHJcbiAqL1xyXG5cclxuaWYgKHR5cGVvZiBqUXVlcnkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2pxdWVyeS1jb25maXJtIHJlcXVpcmVzIGpRdWVyeScpO1xyXG59XHJcblxyXG52YXIgamNvbmZpcm0sIEpjb25maXJtO1xyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgJC5jb25maXJtID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqICBBbGlhcyBvZiBqY29uZmlybVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBqY29uZmlybShvcHRpb25zKTtcclxuICAgIH07XHJcbiAgICAkLmFsZXJ0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqICBBbGlhcyBvZiBqY29uZmlybVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9wdGlvbnMuY2FuY2VsQnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGpjb25maXJtKG9wdGlvbnMpO1xyXG4gICAgfTtcclxuICAgICQuZGlhbG9nID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqICBBbGlhcyBvZiBqY29uZmlybVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9wdGlvbnMuY2FuY2VsQnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgb3B0aW9ucy5jb25maXJtQnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgb3B0aW9ucy5jb25maXJtS2V5cyA9IFsxM107XHJcbiAgICAgICAgcmV0dXJuIGpjb25maXJtKG9wdGlvbnMpO1xyXG4gICAgfTtcclxuICAgIGpjb25maXJtID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGluaXRpYWwgZnVuY3Rpb24gZm9yIGNhbGxpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGpjb25maXJtLmRlZmF1bHRzKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE1lcmdlIGdsb2JhbCBkZWZhdWx0cyB3aXRoIHBsdWdpbiBkZWZhdWx0c1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgJC5leHRlbmQoamNvbmZpcm0ucGx1Z2luRGVmYXVsdHMsIGpjb25maXJtLmRlZmF1bHRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtZXJnZSBvcHRpb25zIHdpdGggcGx1Z2luIGRlZmF1bHRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIGpjb25maXJtLnBsdWdpbkRlZmF1bHRzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gbmV3IEpjb25maXJtKG9wdGlvbnMpO1xyXG4gICAgfTtcclxuICAgIEpjb25maXJtID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIEpjb25maXJtLFxyXG4gICAgICAgICAqIG9wdGlvbnMgPSB1c2VyIG9wdGlvbnMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5leHRlbmQodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfTtcclxuICAgIEpjb25maXJtLnByb3RvdHlwZSA9IHtcclxuICAgICAgICBfaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmQgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA5OTk5OSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkSFRNTCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYW5pbWF0aW9uczogWydhbmltLXNjYWxlJywgJ2FuaW0tdG9wJywgJ2FuaW0tYm90dG9tJywgJ2FuaW0tbGVmdCcsICdhbmltLXJpZ2h0JywgJ2FuaW0tem9vbScsICdhbmltLW9wYWNpdHknLCAnYW5pbS1ub25lJywgJ2FuaW0tcm90YXRlJywgJ2FuaW0tcm90YXRleCcsICdhbmltLXJvdGF0ZXknLCAnYW5pbS1zY2FsZXgnLCAnYW5pbS1zY2FsZXknXSxcclxuICAgICAgICBfYnVpbGRIVE1MOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENsZWFuaW5nIGFuaW1hdGlvbnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9ICdhbmltLScgKyB0aGlzLmFuaW1hdGlvbi50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gPT09ICdub25lJylcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3BlZWQgPSAwO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogQXBwZW5kIGh0bWwgdG8gYm9keS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuJGVsID0gJCh0aGlzLnRlbXBsYXRlKS5hcHBlbmRUbyh0aGlzLmNvbnRhaW5lcikuYWRkQ2xhc3ModGhpcy50aGVtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5qY29uZmlybS1ib3gtY29udGFpbmVyJykuYWRkQ2xhc3ModGhpcy5jb2x1bW5DbGFzcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkNTUyA9IHtcclxuICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zaXRpb24tZHVyYXRpb24nOiB0aGlzLmFuaW1hdGlvblNwZWVkIC8gMTAwMCArICdzJyxcclxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uLWR1cmF0aW9uJzogdGhpcy5hbmltYXRpb25TcGVlZCAvIDEwMDAgKyAncycsXHJcbiAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC4yNywgMS4xMiwgMC4zMiwgJyArIHRoaXMuYW5pbWF0aW9uQm91bmNlICsgJyknLFxyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJzogJ2N1YmljLWJlemllcigwLjI3LCAxLjEyLCAwLjMyLCAnICsgdGhpcy5hbmltYXRpb25Cb3VuY2UgKyAnKSdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5qY29uZmlybS1iZycpLmNzcyh0aGlzLkNTUyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGIgPSB0aGlzLiRlbC5maW5kKCcuamNvbmZpcm0tYm94JykuY3NzKHRoaXMuQ1NTKS5hZGRDbGFzcyh0aGlzLmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuJGJvZHkgPSB0aGlzLiRiOyAvLyBhbGlhc1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogQWRkIHJ0bCBjbGFzcyBpZiBydGwgb3B0aW9uIGhhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMucnRsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoXCJydGxcIik7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTZXR1cCB0aXRsZSBjb250ZW50c1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnREaXYgPSB0aGlzLiRlbC5maW5kKCdkaXYuY29udGVudCcpO1xyXG4gICAgICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy5jb250ZW50RGl2OyAvLyBhbGlhc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2V0dGluZ3MgdXAgYnV0dG9uc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy4kYnRuYyA9IHRoaXMuJGVsLmZpbmQoJy5idXR0b25zJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1CdXR0b24gJiYgdGhpcy5jb25maXJtQnV0dG9uLnRyaW0oKSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNvbmZpcm1CdXR0b24gPSAkKCc8YnV0dG9uIGNsYXNzPVwiYnRuXCI+JyArIHRoaXMuY29uZmlybUJ1dHRvbiArICc8L2J1dHRvbj4nKS5hcHBlbmRUbyh0aGlzLiRidG5jKS5hZGRDbGFzcyh0aGlzLmNvbmZpcm1CdXR0b25DbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbmNlbEJ1dHRvbiAmJiB0aGlzLmNhbmNlbEJ1dHRvbi50cmltKCkgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24gPSAkKCc8YnV0dG9uIGNsYXNzPVwiYnRuXCI+JyArIHRoaXMuY2FuY2VsQnV0dG9uICsgJzwvYnV0dG9uPicpLmFwcGVuZFRvKHRoaXMuJGJ0bmMpLmFkZENsYXNzKHRoaXMuY2FuY2VsQnV0dG9uQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlybUJ1dHRvbiAmJiAhdGhpcy5jYW5jZWxCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGJ0bmMucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maXJtQnV0dG9uICYmICF0aGlzLmNhbmNlbEJ1dHRvbiAmJiB0aGlzLmNsb3NlSWNvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2xvc2VCdXR0b24gPSB0aGlzLiRiLmZpbmQoJy5jbG9zZUljb24nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlSWNvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2xvc2VCdXR0b24gPSB0aGlzLiRiLmZpbmQoJy5jbG9zZUljb24nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRDb3VudERvd24oKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldFRpdGxlOiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSAodHlwZW9mIHN0cmluZyAhPT0gJ3VuZGVmaW5lZCcpID8gc3RyaW5nIDogdGhpcy50aXRsZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKCdkaXYudGl0bGUnKS5odG1sKCc8aSBjbGFzcz1cIicgKyB0aGlzLmljb24gKyAnXCI+PC9pPiAnICsgdGhpcy50aXRsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKCdkaXYudGl0bGUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Q29udGVudDogZnVuY3Rpb24gKHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IChzdHJpbmcpID8gc3RyaW5nIDogdGhpcy5jb250ZW50O1xyXG4gICAgICAgICAgICB2YXIgYW5pbWF0ZSA9IChzdHJpbmcpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2V0IGNvbnRlbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29udGVudCA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnREaXYucmVtb3ZlKCk7IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIG9wdGlvbiBmb3IgcHJvcGVydHkgY29udGVudDogcGFzc2VkIFRSVUUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5jb250ZW50ID09PSAnc3RyaW5nJykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQuc3Vic3RyKDAsIDQpLnRvTG93ZXJDYXNlKCkgPT09ICd1cmw6Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudERpdi5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRidG5jLmZpbmQoJ2J1dHRvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IHRoaXMuY29udGVudC5zdWJzdHJpbmcoNCwgdGhpcy5jb250ZW50Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5nZXQodXJsKS5kb25lKGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY29udGVudERpdi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmFsd2F5cyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCB4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGF0LmNvbnRlbnRMb2FkZWQgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbnRlbnRMb2FkZWQoZGF0YSwgc3RhdHVzLCB4aHIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC4kYnRuYy5maW5kKCdidXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREaWFsb2dDZW50ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RGl2Lmh0bWwodGhpcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29udGVudCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudERpdi5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGJ0bmMuZmluZCgnYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuY29udGVudCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvbWlzZSAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgY29udGVudCBmdW5jdGlvbiBtdXN0IHJldHVybiBqcXVlcnkgcHJvbWlzZS4nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb21pc2UuYWx3YXlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhlIG9iamVjdCByZXR1cm5lZCBpcyBub3QgYSBqcXVlcnkgcHJvbWlzZS4nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS5hbHdheXMoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LiRidG5jLmZpbmQoJ2J1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGlhbG9nQ2VudGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBvcHRpb24gZm9yIHByb3BlcnR5IGNvbnRlbnQsIHBhc3NlZDogJyArIHR5cGVvZiB0aGlzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldERpYWxvZ0NlbnRlcihhbmltYXRlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9zdGFydENvdW50RG93bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0ID0gdGhpcy5hdXRvQ2xvc2Uuc3BsaXQoJ3wnKTtcclxuICAgICAgICAgICAgaWYgKC9jYW5jZWwvLnRlc3Qob3B0WzBdKSAmJiB0aGlzLnR5cGUgPT09ICdhbGVydCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgvY29uZmlybXxjYW5jZWwvLnRlc3Qob3B0WzBdKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2QgPSAkKCc8c3BhbiBjbGFzcz1cImNvdW50ZG93blwiPicpLmFwcGVuZFRvKHRoaXNbJyQnICsgb3B0WzBdICsgJ0J1dHRvbiddKTtcclxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoYXQuJGNkLnBhcmVudCgpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZSA9IG9wdFsxXSAvIDEwMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGNkLmh0bWwoJyBbJyArICh0aW1lIC09IDEpICsgJ10nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGltZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LiRjZC5wYXJlbnQoKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoYXQuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBvcHRpb24gJyArIG9wdFswXSArICcsIG11c3QgYmUgY29uZmlybS9jYW5jZWwnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2JpbmRFdmVudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgYm94Q2xpY2tlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmpjb25maXJtLXNjcm9sbHBhbmUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIHByb3BhZ2F0ZWQgY2xpY2tzXHJcbiAgICAgICAgICAgICAgICBpZiAoIWJveENsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBiYWNrZ3JvdW5kIGNsaWNrZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5iYWNrZ3JvdW5kRGlzbWlzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC4kYi5hZGRDbGFzcygnaGlsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuJGIucmVtb3ZlQ2xhc3MoJ2hpbGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib3hDbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmpjb25maXJtLWJveCcpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBib3hDbGlja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy4kY29uZmlybUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY29uZmlybUJ1dHRvbi5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHRoYXQuY29uZmlybSh0aGF0LiRiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQWN0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3VuZGVmaW5lZCcgfHwgcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuJGNhbmNlbEJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2FuY2VsQnV0dG9uLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByID0gdGhhdC5jYW5jZWwodGhhdC4kYik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vbkFjdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgPT09ICd1bmRlZmluZWQnIHx8IHIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLiRjbG9zZUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2xvc2VCdXR0b24uY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRFbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2tleXVwLicgKyB0aGlzLl9yYW5kLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnJlYWN0T25LZXkoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS4nICsgdGhpcy5fcmFuZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zZXREaWFsb2dDZW50ZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlYWN0T25LZXk6IGZ1bmN0aW9uIGtleShlKSB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBwcmV2ZW50IGtleXVwIGV2ZW50IGlmIHRoZSBkaWFsb2cgaXMgbm90IGxhc3QhXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgYSA9ICQoJy5qY29uZmlybScpO1xyXG4gICAgICAgICAgICBpZiAoYS5lcShhLmxlbmd0aCAtIDEpWzBdICE9PSB0aGlzLiRlbFswXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG4gICAgICAgICAgICAvLyBEbyBub3QgcmVhY3QgaWYgRW50ZXIvU3BhY2UgaXMgcHJlc3NlZCBvbiBpbnB1dCBlbGVtZW50c1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50RGl2LmZpbmQoJzppbnB1dCcpLmlzKCc6Zm9jdXMnKSAmJiAvMTN8MzIvLnRlc3Qoa2V5KSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoa2V5LCB0aGlzLmNhbmNlbEtleXMpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIENhbmNlbCBrZXkgcHJlc3NlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJhY2tncm91bmREaXNtaXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBiYWNrZ3JvdW5kIGRpc21pc3MgaXMgZmFsc2UsIEdsb3cgdGhlIG1vZGFsLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5qY29uZmlybS1iZycpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLiRjYW5jZWxCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoa2V5LCB0aGlzLmNvbmZpcm1LZXlzKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBDb25maXJtIGtleSBwcmVzc2VkLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy4kY29uZmlybUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGNvbmZpcm1CdXR0b24uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0RGlhbG9nQ2VudGVyOiBmdW5jdGlvbiAoYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICB2YXIgYm94SGVpZ2h0ID0gdGhpcy4kYi5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICB2YXIgdG9wTWFyZ2luID0gKHdpbmRvd0hlaWdodCAtIGJveEhlaWdodCkgLyAyO1xyXG4gICAgICAgICAgICB2YXIgbWluTWFyZ2luID0gMTAwO1xyXG4gICAgICAgICAgICBpZiAoYm94SGVpZ2h0ID4gKHdpbmRvd0hlaWdodCAtIG1pbk1hcmdpbikpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IG1pbk1hcmdpbiAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBtaW5NYXJnaW4gLyAyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiB0b3BNYXJnaW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kYi5hbmltYXRlKHN0eWxlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuYW5pbWF0aW9uU3BlZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGIuY3NzKHN0eWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDbG9zZWQoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICB1bmJpbmQgdGhlIHdpbmRvdyByZXNpemUgJiBrZXl1cCBldmVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICQod2luZG93KS51bmJpbmQoJ3Jlc2l6ZS4nICsgdGhpcy5fcmFuZCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkRW5hYmxlZClcclxuICAgICAgICAgICAgICAgICQod2luZG93KS51bmJpbmQoJ2tleXVwLicgKyB0aGlzLl9yYW5kKTtcclxuXHJcbiAgICAgICAgICAgIHRoYXQuJGVsLmZpbmQoJy5qY29uZmlybS1iZycpLnJlbW92ZUNsYXNzKCdzZWVuJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGIuYWRkQ2xhc3ModGhpcy5hbmltYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25TcGVlZCArIDEwKTsgLy8gd2FpdCAxMCBtaWxpc2Vjb25kcyBtb3JlLCBlbnN1cmUgZXZlcnl0aGluZyBpcyBkb25lLlxyXG5cclxuICAgICAgICAgICAgamNvbmZpcm0ucmVjb3JkLmNsb3NlZCArPSAxO1xyXG4gICAgICAgICAgICBqY29uZmlybS5yZWNvcmQuY3VycmVudGx5T3BlbiAtPSAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGpjb25maXJtLnJlY29yZC5jdXJyZW50bHlPcGVuIDwgMSlcclxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnamNvbmZpcm0tbm9zY3JvbGwnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ2xvc2VkKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcuamNvbmZpcm0tYmcnKS5hZGRDbGFzcygnc2VlbicpO1xyXG5cclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdqY29uZmlybS1ub3Njcm9sbCcpO1xyXG4gICAgICAgICAgICB0aGlzLiRiLnJlbW92ZUNsYXNzKHRoaXMuYW5pbWF0aW9ucy5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQmx1ciB0aGUgZm9jdXNlZCBlbGVtZW50cywgcHJldmVudHMgcmUtZXhlY3V0aW9uIHdpdGggYnV0dG9uIHByZXNzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgJCgnYm9keSA6Zm9jdXMnKS50cmlnZ2VyKCdibHVyJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGIuZmluZCgnaW5wdXRbYXV0b2ZvY3VzXTp2aXNpYmxlOmZpcnN0JykuZm9jdXMoKTtcclxuICAgICAgICAgICAgamNvbmZpcm0ucmVjb3JkLm9wZW5lZCArPSAxO1xyXG4gICAgICAgICAgICBqY29uZmlybS5yZWNvcmQuY3VycmVudGx5T3BlbiArPSAxO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25PcGVuID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0Nsb3NlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuJGVsLmNzcygnZGlzcGxheScpID09PSAnJykgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBqY29uZmlybS5wbHVnaW5EZWZhdWx0cyA9IHtcclxuICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJqY29uZmlybVwiPjxkaXYgY2xhc3M9XCJqY29uZmlybS1iZ1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJqY29uZmlybS1zY3JvbGxwYW5lXCI+PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwiamNvbmZpcm0tYm94LWNvbnRhaW5lciBzcGFuNiBvZmZzZXQzXCI+PGRpdiBjbGFzcz1cImpjb25maXJtLWJveFwiPjxkaXYgY2xhc3M9XCJjbG9zZUljb25cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+PGRpdiBjbGFzcz1cImJ1dHRvbnNcIj48L2Rpdj48ZGl2IGNsYXNzPVwianF1ZXJ5LWNsZWFyXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgICB0aXRsZTogJ0hlbGxvJyxcclxuICAgICAgICBjb250ZW50OiAnQXJlIHlvdSBzdXJlIHRvIGNvbnRpbnVlPycsXHJcbiAgICAgICAgY29udGVudExvYWRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWNvbjogJycsXHJcbiAgICAgICAgY29uZmlybUJ1dHRvbjogJ09rYXknLFxyXG4gICAgICAgIGNhbmNlbEJ1dHRvbjogJ0NhbmNlbCcsXHJcbiAgICAgICAgY29uZmlybUJ1dHRvbkNsYXNzOiAnYnRuLWRlZmF1bHQnLFxyXG4gICAgICAgIGNhbmNlbEJ1dHRvbkNsYXNzOiAnYnRuLWRlZmF1bHQnLFxyXG4gICAgICAgIHRoZW1lOiAnd2hpdGUnLFxyXG4gICAgICAgIGFuaW1hdGlvbjogJ3NjYWxlJyxcclxuICAgICAgICBhbmltYXRpb25TcGVlZDogNDAwLFxyXG4gICAgICAgIGFuaW1hdGlvbkJvdW5jZTogMS41LFxyXG4gICAgICAgIGtleWJvYXJkRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgcnRsOiBmYWxzZSxcclxuICAgICAgICBjb25maXJtS2V5czogWzEzLCAzMl0sIC8vIEVOVEVSIG9yIFNQQUNFIGtleVxyXG4gICAgICAgIGNhbmNlbEtleXM6IFsyN10sIC8vIEVTQyBrZXlcclxuICAgICAgICBjb250YWluZXI6ICdib2R5JyxcclxuICAgICAgICBjb25maXJtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJhY2tncm91bmREaXNtaXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dG9DbG9zZTogZmFsc2UsXHJcbiAgICAgICAgY2xvc2VJY29uOiBudWxsLFxyXG4gICAgICAgIGNvbHVtbkNsYXNzOiAnY29sLW1kLTYgY29sLW1kLW9mZnNldC0zJyxcclxuICAgICAgICBvbk9wZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBqY29uZmlybS5yZWNvcmQgPSB7XHJcbiAgICAgICAgb3BlbmVkOiAwLFxyXG4gICAgICAgIGNsb3NlZDogMCxcclxuICAgICAgICBjdXJyZW50bHlPcGVuOiAwXHJcbiAgICB9O1xyXG59KShqUXVlcnkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
