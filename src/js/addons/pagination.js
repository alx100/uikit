/*
 * Based on simplePagination - Copyright (c) 2012 Flavius Matis - http://flaviusmatis.github.com/simplePagination.js/ (MIT)
 */
(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-pagination", ["uikit"], function(){
            return jQuery.UIkit.pagination || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    "use strict";

    var Pagination = function(element, options) {

        var $element = $(element), $this = this;

        if ($element.data("pagination")) return;

        this.element       = $element;
        this.options       = $.extend({}, Pagination.defaults, options);
        this.pages         = this.options.pages ?  this.options.pages : Math.ceil(this.options.items / this.options.itemsOnPage) ? Math.ceil(this.options.items / this.options.itemsOnPage) : 1;
        this.currentPage   = this.options.currentPage - 1;
        this.halfDisplayed = this.options.displayedPages / 2;

        $element.data("pagination", this).on("click", "a[data-page]", function(e){

            e.preventDefault();

            var page = $(this).data("page");

            $this.selectPage(page);
            $this.options.onSelectPage.apply($this, [page]);
            $this.element.trigger('uk-select-page', [page, $this]);
        });

        this._render();
    };


    $.extend(Pagination.prototype, {

        _getInterval: function() {

            return {
                start: Math.ceil(this.currentPage > this.halfDisplayed ? Math.max(Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.options.displayedPages)), 0) : 0),
                end  : Math.ceil(this.currentPage > this.halfDisplayed ? Math.min(this.currentPage + this.halfDisplayed, this.pages) : Math.min(this.options.displayedPages, this.pages))
            };
        },

        render: function(pages) {
            this.pages = pages ? pages : this.pages;
            this._render();
        },

        selectPage: function(pageIndex) {
            this.currentPage = pageIndex;
            this._render();
        },

        _render: function() {

            var o = this.options, interval = this._getInterval(), i;

            this.element.empty();

            // Generate Prev link
            if (o.lblPrev) this._append(o.currentPage - 1, {text: o.lblPrev});

            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {

                var end = Math.min(o.edges, interval.start);

                for (i = 0; i < end; i++) this._append(i);

                if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                    this.element.append('<li><span>...</span></li>');
                } else if (interval.start - o.edges == 1) {
                    this._append(o.edges);
                }
            }

            // Generate interval links
            for (i = interval.start; i < interval.end; i++) this._append(i);

            // Generate end edges
            if (interval.end < this.pages && o.edges > 0) {

                if (this.pages - o.edges > interval.end && (this.pages - o.edges - interval.end != 1)) {
                    this.element.append('<li><span>...</span></li>');
                } else if (this.pages - o.edges - interval.end == 1) {
                    this._append(interval.end++);
                }

                var begin = Math.max(this.pages - o.edges, interval.end);

                for (i = begin; i < this.pages; i++) this._append(i);
            }

            // Generate Next link (unless option is set for at front)
            if (o.lblNext) this._append(o.currentPage + 1, {text: o.lblNext});
        },

        _append: function(pageIndex, opts) {

            var $this = this, item, link, options;

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < this.pages ? pageIndex : this.pages - 1);
            options   = $.extend({ text: pageIndex + 1 }, opts);

            item = (pageIndex == this.currentPage) ? '<li class="uk-active"><span>' + (options.text) + '</span></li>'
                                                   : '<li><a href="#page-'+(pageIndex+1)+'" data-page="'+pageIndex+'">'+options.text+'</a></li>';

            this.element.append(item);
        }
    });

    Pagination.defaults = {
        items          : 1,
        itemsOnPage    : 1,
        pages          : 0,
        displayedPages : 3,
        edges          : 3,
        currentPage    : 1,
        lblPrev        : false,
        lblNext        : false,
        onSelectPage   : function() {}
    };

    UI["pagination"] = Pagination;

    // init code
    $(document).on("uk-domready", function(e) {

        $("[data-uk-pagination]").each(function(){
            var ele = $(this);

            if (!ele.data("pagination")) {
                var obj = new Pagination(ele, UI.Utils.options(ele.attr("data-uk-pagination")));
            }
        });
    });

    return Pagination;
});