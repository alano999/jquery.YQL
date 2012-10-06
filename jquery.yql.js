/**
* Perform cross-domain $.get requests by wrapping within YQL
* Modified by Alan Oliver 6 October 2012
* Only works if " yql" is added to dataType
* Supports dataTypes of xml (default), json, html
*
* Based upon, and with full acknowledgements to...
* ---
* jQuery.ajax mid - CROSS DOMAIN AJAX 
* ---
* @author James Padolsey (http://james.padolsey.com)
* @version 0.11
* @updated 12-JAN-10
* ---
* @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
*/

jQuery.ajax = (function (_ajax) {

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    String.prototype.decodeHtml = function () {
        return $('<span />', { html: this.toString() }).text();
    };

    return function (o) {

        var url = o.url,
            dataType = o.dataType;

        if (/get/i.test(o.type) && /yql/i.test(dataType) && isExternal(url)) {

            // Manipulate options so that JSONP-x request is made to YQL
            // XML formatted response within JSON

            o.url = YQL;
            o.dataType = 'jsonp';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // success === complete, no error, no complete
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            if (o.error) delete o.error;

            o.success = (function (_success) {
                return function (data) {

                    if (_success) {
                        // Fake XHR callback.
                        var response = '';
                        try {
                            // Extract response from YQL's wrapper
                            response = data.results[0].match(/^.*?\<p\>(.*)\<\/p\>.*?$/im)[1].decodeHtml();
                        } catch (e) {
                            // Silent exception handling
                        }
                        dataType = dataType.replace('yql', '').trim() || 'xml';
                        // Convert to requested dataType (default is xml
                        if (dataType === 'xml') response = $.parseXML(response);
                        else if (dataType === 'html') response = $.parseHTML(response);
                        else if (dataType === 'json') response = $.parseJSON(response);
                        _success.call(this, response, 'success');
                    }
                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);