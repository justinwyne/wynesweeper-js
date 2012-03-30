(function($) {

    var methods = {
        init: function(options) {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('tooltip'),
                    tooltip = $('<div />', {
                        text: $this.attr('title')
                    });

                $this.counter = 0;
                $this.tooltip("_reposition");
                $this.tooltip("_reposition", 5);
                $this.html($this.counter);

                // If the plugin hasn't been initialized yet
                if (!data) {
/*
                     Do more setup stuff here
                   */

                    $(this).data('tooltip', {
                        target: $this,
                        tooltip: tooltip
                    });

                }
            });
        },
        destroy: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('tooltip');

                // Namespacing FTW
                $(window).unbind('.tooltip');
                data.tooltip.remove();
                $this.removeData('tooltip');

            })

        },
        _reposition: function( val ) {
            if ( val != null )
                this.counter += val;
            else
                this.counter++;
        },
        show: function() { // ... 
        },
        hide: function() { // ... 
        },
        update: function(content) { // ...
        }
    };

    $.fn.tooltip = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };

})(jQuery);

$(document).ready(function() {
    $('a').tooltip();
});
