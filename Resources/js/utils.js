/* isMobile */
window.isMobile = false;
(function(a) {
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.isMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

/* isTablet */
window.isTablet = false;
(function(a) {
	if (/(android|bb\d+|meego).+android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.isTablet = true;
})(navigator.userAgent || navigator.vendor || window.opera);

window.marketcode = 1000;

function getElementsByClassName(className, tag)
{
	var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)"),
		tag = tag || "*",
		elm = document,
		elements = elm.getElementsByTagName(tag),
		returnElements = [],
		current,
		length = elements.length;
	for (var i = 0; i < length; i++)
	{
		current = elements[i];
		if (testClass.test(current.className))
			returnElements.push(current);
	}
	return returnElements;
}

function getElementsByAttribute(attrName)
{
	var arr_elms = document.body.getElementsByTagName("*"),
		elms_len = arr_elms.length,
		returnElements = [];

	for (var i = 0; i < elms_len; i++)
	{
		if (arr_elms[i].getAttribute(attrName) != null)
		{
			returnElements.push(arr_elms[i]);
			return returnElements;
		}
	}
	return returnElements;
}

function getQuerystring(key, default_) {
	if (default_ == null) default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)", 'i'),
		qs = regex.exec(window.location.href);
	if (qs == null)
		return default_;
	return decodeURIComponent(qs[1]);
}

function is_int(input) {
	return (typeof((input) == 'number') && (Math.floor(input) == input));
}

if (typeof(console) === 'undefined') {
	var console = {};
	console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

function scrollPage(element) {
	if(element === undefined) return;
	var where = isNaN(element) ? ($(element).offset().top-20) : element,
		time = 0.6 + (Math.abs(where - $(window).scrollTop()) / 5000);

	//Se il sito usa le Tweenmax
	if (typeof TweenMax != "undefined") {
		TweenMax.to(window, time, {
			scrollTo: {
				y: where
			},
			ease: Linear.easeNone
		});
	}
	else
		$("html").animate({scrollTop:where},
					(time < 300) ? 400 : time);
}

function getTransitionEndName()
{
	if ('transition' in document.body.style)
		return 'transitionEnd';
	prop="transition";
	var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
		prop_ = prop.charAt(0).toUpperCase() + prop.substr(1),
		eventNames = {
				//'transition': 'transitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'WebkitTransition': 'webkitTransitionEnd',
				'msTransition': 'MSTransitionEnd'
			},
		vendorProp;

	for (var i = prefixes.length; i--; )
	{
		vendorProp = prefixes[i] + "transition";
		if (vendorProp in document.body.style)
			return eventNames[vendorProp];
	}
	return null;
}

function bitMQ()
{
	if(!isTablet && !isMobile)
	{
		var mq = $('<div class="mq desktop-visible"></div><div class="mq tablet-visible"></div><div class="mq mobile-visible"></div>').appendTo('body'),
			device = mq.filter(':visible').attr('class').replace('mq ','').replace('-visible','');
		window.isMQDesktop = false;
		window.isMQTablet = false;
		window.isMQMobile = false;
		window['isMQ'+device.charAt(0).toUpperCase() + device.substring(1)] = true;
		$(window).on('resize',function () {
			var device = mq.filter(':visible').attr('class').replace('mq ','').replace('-visible','');
			window.isMQDesktop = false;
			window.isMQTablet = false;
			window.isMQMobile = false;
			window['isMQ'+device.charAt(0).toUpperCase() + device.substring(1)] = true;
		});
	}
}

function moveSlider(params)
{
	// params = {slider, activeel, adjustment, size}
	if (params === undefined)
		params = {};
	if(params.slider !== undefined)
	{
		if (params.adjustment === undefined)
			params.adjustment = 0;

		params.slider.data({
				activeel: params.activeel,
				adjustment: params.adjustment
			});
	}
	else
		params.slider = $('.sliderX').filter(':visible');

	params.slider.each(function (argument)
		{
			var _this = $(this);
			if(_this.data('activeel')!==undefined)
			{
				if(_this.hasClass('sliderY'))
				{
					_this.css(
							{
								'top': (_this.data('activeel').position().top - _this.data('adjustment'))/*,
								'height': ((params.size === undefined) ? (_this.data('activeel').outerHeight() + _this.data('adjustment')) : params.size)*/
							});
				}
				else
					_this.css(
							{
								'left': (_this.data('activeel').position().left - _this.data('adjustment')),
								'width': ((params.size === undefined) ? (_this.data('activeel').outerWidth() + _this.data('adjustment')) : params.size)
							});
				//console.log(_this.hasClass('sliderY'));
			}
		});
}
