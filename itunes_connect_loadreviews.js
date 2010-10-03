(function(){
    var loadjquery = function(callback){
        var jquery_script_tag = document.createElement('script');
        jquery_script_tag.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js";
        document.body.appendChild(jquery_script_tag);
        setTimeout(callback, 1000);
    };
    var loadreview = function(options, hostname, action, referer, fieldname, chain){
        if (options.size() < 1) {
            return false;
        }
        var one = options.eq(0);
        var other = options.slice(1);
        var country_name = one.html();
        var param = {};
        param[fieldname] = one.attr('value');
        var uri = 'https://' + hostname + action;
        jQuery.ajax({
            data: param,
            success: function(html, type){
                var reviews_html = html.substring(html.indexOf('<center>') + 8, html.indexOf('</center>'));
                jQuery('div#reviews_backet').after('<div id="review"' + one.attr('value') + '><h3>' + country_name + '</h3>' + reviews_html + '</div>');
                var new_action = 'https://' + hostname + jQuery(html).find('form#mainForm').attr('action');
                chain(other, hostname, new_action, uri, fieldname, chain);},
            url: action,
            xhr: function(xhr){xhr.setRequestHeader('Referer', referer);},
        });
    };
    var loadreviews = function(loadreview){
        var action = jQuery('form#mainForm').attr('action');
        var selections = jQuery('div.app-reviews fieldset ul li').filter(':has(label:contains("Country :"))').children('div select').eq(0).contents();
        var fieldname = selections.attr('name');
        jQuery('div.app-reviews').after('<div id="reviews_backet"></div>');
        loadreview(selections.contents().slice(1), location.hostname, action, location.href, fieldname, loadreview);
    };
    loadjquery(function(){loadreviews(loadreview)});
})();
