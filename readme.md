jquery.yql.js
=============
Perform cross-domain $.get requests by wrapping within YQL
==========================================================

Acts as a wrapper to $.ajax() and its shortcuts, such as $.get().

Sits silently until it sees "yql" added to the dataType option of your AJAX transaction.

When activated (add "yql" to dataType), returns xml data by default, with text, html and json as options. To return json, for example, set dataType to "json yql".

Only the success callback will work, due to the underlying JSONP transport. Complete and error callbacks are ignored.

1. Download the .js file into your web app's folder
2. Add a reference to the .js in the page from which you wish to use it, typically by use of a `<script>` tag positioned in the `<head>` of document immediately before the `</head>`.
3. Add "yql" to the dataType option for any call where you wish to make use of the YQL wrapper.

Example, making use of the free www.webservicex.net:-

	<script type="text/javascript" src="scripts/jquery.min.js"></script>
	<script type="text/javascript" src="scripts/jquery.yql.js">
		function showResponse(xml) {
			var $list = $("ul#list");
			$("Stock", xml).children().each(function () {
				$("<li />").html("<b>" + this.tagName + "</b>: " + this.textContent).appendTo($list);
			});
		}
		$(document).ready(function() {
			$.get("http://www.webservicex.net/stockquote.asmx/GetQuote", { symbol: "IBM" }, showResponse, "xml yql");
		});
	</script>


Note that this example requires a `<ul id="list"/>` in the body of page.

This file will be enhanced soon.