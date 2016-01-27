/*
	FUNZIONAMENTO

	Cerca nel DOM gli elementi che richiedono il caricamento di un js aggiuntivo.
	Se trova l'elemento, incrementa il COUNTER e esegue la funzione require per js richiesto.
	Quando il JS è stato caricato viene inserita la callback nell'array, e richiamato il CONTROLLER.
	Nel CONTROLLER: se il COUNTER è a zero (ovvero tutti i js sono stati caricati),
	viene fatto ciclo sull'array ed eseguite le callback.
	*/

/* isMobile */
window.isMobile = false;
(function(a)
{
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.isMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

/* isTablet */
window.isTablet = false;
if (!isMobile)
{
	(function(a)
	{
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.isTablet = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
}

var counter = 1, // Conteggio dei require necessari
	editing = getElementsByClassName("ms-WPBody").length ? true : false,
	isOrigin = (document.location.hostname.indexOf("javastg") != -1) ? true : false,
	isAuth = location.pathname.match(/aspx/) !== null ? true : false,
    isLocal = (!isOrigin && (document.location.hostname.indexOf("www2") != -1 || location.href.indexOf('10.1.99.56') != -1)) ? true : false,	
	mobileSize = false, // boolean saying whether current window size fits mobile media query
	tabletSize = false, // boolean saying whether current window size fits 768 media query
	tabletLandSize = false,
	desktopSize = false,
	deviceSize = "",
	oldSize = "",
	pageScrolled = false,
	keyTimer = 0,
	refreshTime = typeof(refreshTime) != "undefined" ? refreshTime : 600000,
	$dateFormat = typeof(dateFormat) != "undefined" ? dateFormat : 'mm-dd-yy',
	getDeviceSize = function () {
		require(["jquery","enquire"], function() {
			enquire.register("screen and (max-width: 767px) ", {
				match : function() {
					mobileSize = true;
					deviceSize = 'mobileSize';
				},
				unmatch : function() {
					mobileSize = false;
				},
				setup : function(){} // Triggers an evaluation of the media query
			});
	
			enquire.register("screen and (min-width: 768px) and (max-width: 992px)", {
				match : function() {
						tabletSize = true;
						deviceSize = 'tabletSize';
					},
				unmatch : function()
					{
						tabletSize = false;
					},
				setup : function(){} // Triggers an evaluation of the media query
			});
	
			enquire.register("screen and (min-width: 1024px) and (max-width: 1200px)", {
				match : function() {
						tabletLandSize = true;
						deviceSize = 'tabletLandSize';
					},
				unmatch : function()
					{
						tabletLandSize = false;
					},
				setup : function(){} // Triggers an evaluation of the media query
			});
			
			enquire.register("screen and (min-width: 1200px)", {
				match : function() {
						desktopSize = true;
						deviceSize = 'desktopSize';
					},
				unmatch : function()
					{
						desktopSize = false;
					},
				setup : function(){} // Triggers an evaluation of the media query
			});
			oldSize = deviceSize;
			afterGetDevice();
		});
	},
	customScroll = function () {
		require(["mousewheel","mwheel","customScrollbar"], function() {
			$('.customScroll:visible').jScrollPane( {
				showArrows: false,
				autoReinitialise: true
			});
		});
	},
	destroyScroll = function () {
		require(["mousewheel","mwheel","customScrollbar"], function() {
			var apis = [];
			$('.customScroll:visible').not('.empty').each(
				function()
				{
					apis.push($(this).jScrollPane().data().jsp);
				}
			)
			if (apis.length) {
				$.each(
					apis,
					function(i) {
						this.destroy();
					}
				)
				apis = [];
			}
		});
	},
	scrollToTarget = function($target, time) {
		var $pos = parseInt($target.offset().top),
			$time = time || 500;
		pageContainer.animate({
			scrollTop: parseInt($pos)
		}, $time);
	},
	afterGetDevice = function () {
		$('.accordion-menu').each(function() {
			var $menu = $(this).closest('.accordion-menu');
			if($menu.is('.onlyMobile') && desktopSize)
				$menu.find('.accordion-content').show();
			if($menu.find('.accordion-trigger.selected').length) {
				if(mobileSize && $menu.is('.mobileAllClose') && !$menu.is('.openForced'))
					$menu.removeClass('open').find('.accordion-trigger.selected').removeClass('selected');	
				else
					$menu.addClass('open').find('.accordion-trigger.selected').next('.accordion-content').slideDown()/*.addClass('open')*/;
			}
		});
		// scroll to page top
		if(!pageScrolled)
			scrollToTarget(pageContainer, 10);
	},
	scrollToError = function ($form) {
		setTimeout(function() {
			$form = $('.form-container').first();
			var $error = $form.find('.error').not('label').first();
			if($form.find('.tabs').length) {
				// se tutte le tab sono chiuse, apro la prima contenente un errore
				if(!$form.find('.tabs .multi-triggers.selected').length) {
					$error.closest('.multi-contents').prev('.multi-triggers').trigger('click');
				}
				var $activeTab = $form.find('.multi-contents:visible');
				$error = $activeTab.find('.error').not('label').first();

				// se non trovo errori nella tab aperta, apro la prima che contiene un errore
				if(!$error.length && desktopSize) {
					$error = $form.find('.error').not('label').first();
					if($('.destroyPage:visible').length)
						$('.destroyPage').trigger('click');
					$error.closest('.multi-contents').prev('.multi-triggers').trigger('click');
				}
			}
			//console.log($error)
			// se l'errore è in un accordion, lo apro e lo rendo editabile
			if($error.length && !$error.closest('.accordion-menu.open').length/* && $error.closest('.accordion-content').not(':visible').length*/)
				$error.closest('.accordion-content').prev('.accordion-trigger').trigger('click');
			if($error.length) {
				if($form.is('.form-survey'))
					scrollToTarget($error.closest('.box-survey'), 200)
				else
					scrollToTarget($error.closest('.block-form'), 200)
			}
			// se l'errore è in un form editato, lo rendo editabile
			if($error.closest('.edited').length)
				$error.closest('.edited').find('.edit').trigger('click');
		}, 200)
	},
	createCookie = function(name,value,tot,units) {
		var expires;
		if (tot)
		{
			var date = new Date();
			switch (units) {
				case 'days':
					tot = tot*24*60*60*1000; 
					break;
				case 'hours':
					tot = tot*60*60*1000; 
					break;
				case 'minute':
					tot = tot*60*1000; 
					break;
			}
			date.setTime(date.getTime()+(tot));
			expires = "; expires="+date.toGMTString();
		}
		else
			expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	},
	readCookie = function(name, default_) {
		var nameEQ = name + "=",
			ca = document.cookie.split(';'),
			c,
			default_ = default_ || null;
		for (var i=0; i < ca.length; i++)
		{
			c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length,c.length);
		}
		return default_;
	};
	tabContentInit = function () {
		chatInit();
	},
	setDatePicker = function(target) {
		require(['jquery','jQueryUI'], function() {
			target.each(function() {
				$(this)/*.val('').attr('placeholder', $dateFormat)*/.datepicker({
					showOn: "button",
					buttonImage: "",
					buttonImageOnly: false,
					buttonText: "",
					autoSize: true,
					dateFormat: $dateFormat,
					beforeShow: function(input, inst) {
						if($(this).data('mindate'))
							$(this).datepicker('option', 'minDate', $(this).data('mindate')); 
					}
				});
				//console.log($(this).datepicker( "option", "dateFormat"))
				//$( ".selector" ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
			});
			/* FIX CALENDAR  */
			$(".startDate").datepicker('destroy').datepicker({
				//minDate: 0,
				dateFormat: $dateFormat,
				onSelect: function(selected) {
					$(this).closest('.block-form').parent('.block').find(".endDate").datepicker("option","minDate", selected)
				}
			});
			$(".endDate").datepicker('destroy').datepicker({
				//minDate: 0,
				dateFormat: $dateFormat,
				onSelect: function(selected) {
					$(this).closest('.block-form').parent('.block').find(".startDate").datepicker("option","maxDate", selected)
				}
			});
		});
	},
	preValidateForm = function($form) {
		var formErrors = 0;
		//console.log(formErrors)
		$form.find('input, select').each(function() {
			$(this).validate();		
			if(!$(this).valid()) {
				formErrors++;
				//return false
			}
		})
		//console.log(formErrors)
		if(formErrors == 0)
			return true;
		else {
			scrollToError($form);
			return false;
		}
	},
	initExternalLibrary = function()
	{
		function controller()
		{
			counter--;

			if (counter > 0)
				return false;

			var classes = document.body.className;
			document.body.className = classes.split("loading").toString().replace(",", "");

			//IF IE8 REDRAW :AFTER/:BEFORE
			window.refreshIE8before = function()
			{
				if (!Modernizr.input.placeholder)
				{
					var head = document.getElementsByTagName('head')[0],
						style = document.createElement('style');
					style.type = 'text/css';
					style.styleSheet.cssText = ':before,:after{content:none !important}';
					head.appendChild(style);
					setTimeout(function()
					{
						head.removeChild(style);
					}, 0);
				}
			};
		}

		/* CUSTOM SELECT */
		if (document.getElementsByTagName("select").length && !editing)
		{
			counter++;
			require(["customSelect"], function()
			{
				//if(!isMobile /*&& !isTablet*/)
					createSelect();
				controller();
			});
		}

		/* CASE MENU */
		if (document.getElementById("main-header") !== null)
		{
			counter++;

			require(['module/menu'], function(menu)
			{
				controller();
				createMenu(menu);
			});
		}

		/* CASE LIGHTBOX */
		if (getElementsByClassName("lightBox-trigger").length)
		{
			counter++;
			require(["module/lightbox"], function(LightBox)
			{
				createLightbox(LightBox);
				controller();
			});
		}
		
		/* CASE FORM */
		if (getElementsByClassName("form-container").length) {
            require(["module/formManager"], function(FormManager) {
                fillInForm();
                createFormManager(FormManager);
                controller();
            });
        }

		/* CASE MULTISELECTION */
		if (getElementsByClassName("multi-selection-element").length)
		{
			counter++;
			require(["module/multiselection"], function(Multiselection)
			{
				createMultiselection(Multiselection);
				controller();
			});
		}

		/* CASE SLIDESHOW */
		if ((temp=getElementsByClassName("slideshow-mask","*","libraryLoaded")).length)
		{
			counter++;
			(function(temp) {
				require(["module/slideshow"], function(Slideshow)
				{
					createSlideshow(Slideshow,temp);
					controller();
				});
			})(temp);
		}
		
		// CASE JQUERY-UI CALENDAR
		if (getElementsByClassName("datepicker").length)
		{
			counter++;
			require(["jquery"/*, "module/calendar"*/], function()
			{
				var target = $('.datepicker');
				setDatePicker(target);
				controller();
			});
		}

		
		/* BITLAZYLOADING */
		if (typeof(_LLBit) === 'undefined')
		{
			counter++;
			require(["module/bitLazyLoading"], function(BitLazyLoading)
			{
				controller();
				_BitLL.showImages();
				$(window).add("#s4-workspace").on("scroll", function()
				{
					_BitLL.showImages();
				});
			});
		}
		
		/* SET pageContainer to scroll */
		require(["jquery"], function() {
			/*if(isLocal || isOrigin) {
				pageContainer = $('body, html');
				pageWindow = $(window);
				pageContainerFix = 0;
			}
			else {
				pageContainer = $('#s4-workspace');
				pageWindow = $('#s4-workspace');
				pageContainerFix = pageContainer.scrollTop();
			}*/
			pageContainer = $('body, html');
			pageWindow = $(window);
			pageContainerFix = 0;
		});
		
		controller();
	};

initExternalLibrary();
//  ---------------------------------------------------------------------------
//  REQUIRE CALLBACKS (le più semplici vengono passate direttamente nel require)


//  SELECT
function createSelect()
{
	$("select").each(function() {
		var $select = $(this);
			//$val = $select.find('option:selected').length ? $select.find('option:selected').attr('value') : $select.find('option:first-child').attr('value');
		//$select.val($val);
		$select.not(".libraryLoaded, .hidden-select, .noCustom").addClass("libraryLoaded").customSelect();
	});
	
	$("select.teleserviceRequested").each(function () {
		var $this = $(this);
		if($this.val() != "")
			$(".injector").show();
		else
			$(".injector").hide();
		$this.on('change', function () {
			if ($this.val() != "")
				$(".injector").show();
			else
				$(".injector").hide();
		});
	});
}

//  MENU
function createMenu(menu)
{
	if (!$('#main-header').hasClass('libraryLoaded'))
	{
		var m = new menu();
		m.init();
	}
}

//  LIGHTBOX
function createLightbox(LightBox)
{
	var lightbox = new LightBox();
	lightbox.init();
}

// Form autocomplete
function fillInForm()
{
	var data = getQuerystring("data"),
		temp;
	data = decodeURIComponent(data).split("||");
	for (var i in data)
	{
		if (data[i].indexOf('|') == 0)
			data[i] = data[i].substring(1);
		temp = data[i].split("|");
		if (temp.length == 2)
			$('[name="' + temp[0] + '"]').val(temp[1]);
	}
}

//  FORM
function createForm(FormManager)
{
	if ($(".form").parents("section").not(".libraryLoaded").addClass("libraryLoaded").length > 0)
	{
		var elem = $(".form").parents("section"),
			option = {};
		if (elem.attr('data-obj') !== undefined)
			option = $.parseJSON(elem.attr('data-obj'));
		else
			option = $.parseJSON($(".special-offers-detail").find('*[data-obj]').eq(0).attr('data-obj'));

		var form = new FormManager();
		form.init(option);
	}
}

function validaform(formValidate)
{
	var form = new formValidate();
	form.init();
}


// NEW FORM MANAGER
function createFormManager(FormManager)
{
	var elems = getElementsByClassName("form-container"),
		formData;

	for (var elemItem = elems.length; elemItem--;)
	{
		var elem = $(elems[elemItem]),
			option = {};
		if (!elem.hasClass('libraryLoaded'))
		{
			elem.addClass('libraryLoaded');
			if (elem.attr('data-obj') !== undefined)
				option = $.parseJSON(elem.attr('data-obj'));
			else
				option = $.parseJSON($(".special-offers-detail").find('*[data-obj]').eq(0).attr('data-obj'));

			formData = option.vars !== undefined ? window[option.vars] : formVars;

			if (typeof(formData) != "undefined")
			{
				if (typeof(formData.validationFunctions) != "undefined")
					option.validationFunctions = formData.validationFunctions;

				if (typeof(formData.validationMessages) != "undefined")
					option.validationMessages = formData.validationMessages;

				if (typeof(formData.endpointUrlGold) != "undefined")
					option.endpointUrlGold = formData.endpointUrlGold;

				if (typeof(formData.endpointUrlProd) != "undefined")
					option.endpointUrlProd = formData.endpointUrlProd;

				if (typeof(formData.rules) != "undefined")
					option.rules = formData.rules;

				if (typeof(formData.formLabels) != "undefined")
					option.formLabels = formData.formLabels;

				if (typeof(formData.flowManagerUrl) != "undefined")
					option.flowManagerUrl = formData.flowManagerUrl;

				if (typeof(formData.submitCallback) != "undefined")
					option.submitCallback = formData.submitCallback;
			}
			var form = new FormManager();
			form.init(option);
		}
	}
}

//  SLIDESHOW

function createSlideshow(Slideshow,elems)
{
	//console.log(elems)
	/*var elems = getElementsByClassName("slideshow-mask");*/
	for (var elemItem = elems.length; elemItem--;)
	{
		var t = $(elems[elemItem]);
		if(!t.hasClass('libraryLoaded')) {
			t.addClass('libraryLoaded')
			if (t.hasClass("mobile-disabled") && isMobile)
				return false;
	
			var s = new Slideshow(),
				objFull = {},
				objQueryelementsContainer,
				objQueryBottom = t.find('.bottom-tape').length ?
				{
					consoleContainer: t.find('.bottom-tape')
				} : undefined;
	
			var objVideoSettings = t.find('.audioOn').length ?
			{
				audioOn: true,
				//controls: 1
			} :
			{};
			var objQuerydots = t.find('.dots').length ?
			{
				dots: t.find('.dots')
			} : undefined;
	
			var objQueryArrows = t.find('.bottom-tape .arrows').length ?
			{
				arrow: t.find('.bottom-tape .arrows')
			} : undefined;
	
			objQueryelementsContainer = t.find('.elemContainer').length ?
			{
				slideContainers: t.find('.elemContainer')
			} : undefined;
	
			var objDom = t.attr('data-obj') !== undefined ? JSON.parse(t.attr('data-obj')) : '',
				obj = {
					slideshowMask: t,
					stopOnHover: false
				};
			if (objDom.auto == true)
			{
				if (t.parents('.main_canvas').length) {
					objDom.continuous = true;
					objVideoSettings.controls = 0;
				}
				(function(s)
				{
					$(document).on('openMenuComplete', function()
					{
						s.stop(true);
					});
				})(s);
				(function(s)
				{
					$(document).on('closeMenuComplete', function()
					{
						s.restart(5000);
					});
				})(s);
			}
			var objInstance = {slideshowIstance : s};
	
			objFull = $.extend(obj, objDom, objQueryBottom, objQueryArrows, objQuerydots, objQueryelementsContainer, objVideoSettings,objInstance);
			s.init(objFull);
		}
	}
}

//  MULTISELECTION
function createMultiselection(Multiselection)
{
	var elem = $(".multi-selection-element").not('.libraryLoaded').addClass('libraryLoaded');
	if(!elem.length)
		elem = $(".multi-selection-element.longhistory");
	for (var elemItem = elem.length; elemItem--;)
	{
		var p = $(elem[elemItem]),
			objDom = p.attr('data-obj') !== undefined ? $.parseJSON(p.attr('data-obj')) : '';

		objDom.tabChangedCb = eval(objDom.tabChangedCb);
		var obj = new Multiselection();
		obj.init(objDom, elem[elemItem]);
		p.data("instance", obj);
	}
}

/* Fix per Safari Mobile */
(function(basePath)
{
	var ua = navigator.userAgent.match(/AppleWebKit\/(\d*)/),
		css = "";
	if (ua && ua[1] < 535)
	{
		document.body.className += " safariFix";
		css = "@font-face {font-family: 'safariFix';src: url('" + basePath + "safariFix.svg#safariFix') format('svg');font-weight: normal;font-style: normal;}";
	}
	if(!Modernizr.mediaqueries)
	{
		css += ".mobile-visible,.tablet-visible,.desktop-hidden{display: none !important;}";
	}
	var head = document.getElementsByTagName('head')[0],
		s = document.createElement('style');
	s.setAttribute('type', 'text/css');
	if (s.styleSheet) // IE
		s.styleSheet.cssText = css;
	else // the world
		s.appendChild(document.createTextNode(css));
	head.appendChild(s);
})('..Style%20Library/css/');
/* */


/* MAIN JS */
require(['jquery'], function($)
{
	// per gestire il caricamento di altre righe della tabella
	var loadmore = {
		nextIndex: 0,
		totalItem: 0
	};

	$(document).ready(function() {
		

		/* chiudo accordion e menu quando clicco al di fuori di essi */
		$(document).on('click', function(e){
			// fake select
			if($('.fakeSelect.open').length) {
				var container = $('.fakeSelect.open');
				if(!container.is(e.target) && container.has(e.target).length === 0)
					container.removeClass('open');
			}
			// close accordion menu
			if($('.accordion').length || $('.accordion-menu').length) {
				var $accordion = $('.accordion.open, .accordion-menu.open');
				if(desktopSize)
					$closable = $accordion.filter('.closable, .desktop-closable');
				else
					$closable = $accordion.filter('.closable, .mobile-closable');
				if($closable.length && !$closable.is(e.target) && $closable.has(e.target).length === 0)
					$closable.find('.accordion-trigger').trigger('click');
			}
			if($('.autoCompl-container').length) {
				var container = $('.autoCompl-container');
				if(!container.is(e.target) && container.has(e.target).length === 0)
					container.remove();
			}
		});

		
		/* check if custom checkbox are checked */
		$('input[type="checkbox"]').not('.preselected').prop( "checked", false);
		$('input[type="checkbox"]:checked').each(function() {
			$(this).next('label:not(.checked)').addClass('checked')
		});
		
		/* ACCORDION */
		$('.accordion .accordion-trigger').on("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			var $accordion = $(this).closest('.accordion');
			$(this).toggleClass('selected');
			$accordion.toggleClass('open').find('.accordion-content').slideToggle();
			if($accordion.is('.open') && $accordion.find('.slideshow-mask').length) {
				$accordion.find('.slideshow-mask.libraryLoaded').removeClass('libraryLoaded');
				require(["module/slideshow"], function(Slideshow) {
					createSlideshow(Slideshow,$accordion.find('.slideshow-mask'));
				});
				//initExternalLibrary();
			}
		});
	
		// initialize scrollbar
		//customScroll();
		
		/* window scroll */
		pageWindow.on("scroll", function() {
		   pageScrolled = true;
		});
		
		/* Custom radio/checkbox
        $('body').on("click", ".checkbox label > *, .radiobutton label > span", function(e) {
            changeButton($(this).parent('label'));
			 e.stopPropagation();
        });
		$('body').on("click", ".radiobutton label, .checkbox label", function(e) {
            changeButton($(this));
			 e.stopPropagation();
        }); */

		// Verifico che le check/radio sono siano già checked per qualche memoria del browser
        $.each($('.radiobutton label, .checkbox label'), function(index, value) {
            ($(this).siblings('input').is(":checked")) ? $(this).addClass("checked") : $(this).remove("checked");
        });
        /* end Custom Radio */

		// Get device size
		getDeviceSize();

		/* Refresh on resize */
		if(Modernizr.rgba) {
			var resizeTimer;
			$(window).bind('resize', function(e)
			{
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function(argument) {
					if(deviceSize != oldSize) {
						refreshPage(100);
						oldSize = deviceSize;
					}
				}, 200);
			}); 
		}
		
	});
	
	function jScrollPaneReInit() {
		destroyScroll();
		customScroll();
	}
	
	function fakeSelUpdateVal(sel, firstTime) {
		var txt = sel.text(),
			val = sel.data('value'),
			fakeSelect = sel.closest('.fakeSelect');
		fakeSelect.find('.voiceSelected').text(txt).data('value', val);
		fakeSelect.addClass('selected').siblings('.selected').removeClass('selected');
		//console.log(firstTime);
		if(fakeSelect.closest('li').is('#select-lang') && !firstTime) {
			$.ajax({
				url: urlCall + 'ChangeLanguage.aspx?lang=' + val,
				jsonp: "callback",
				dataType: "jsonp",
				success: function(response) {
					//console.log(response);
					location.reload(true);
				}
			});
		}
	}
	
	function refreshPage(time) {
		setTimeout(function(){
		   location.reload(true);
		   //refreshPage(time);
		}, time);
	}

});
