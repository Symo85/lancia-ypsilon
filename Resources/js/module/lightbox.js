define(['jquery'],

function($)
{

	var LightBox = function()
	{
		var html, //	jQuery object contenente tutta la struttura HTML del lightbox
			container, //	jQuery object del container (box centrale) del lightbox
			closeButton, //	bottone per chiudere la lightbox
			parameter, //	parametri di inizializzazione
			content,
			slideshow,
			slideshowContent,
			srcType,
			videoClass,
			opened = false,
			defaultParam = { //	valore di default dei parametri di inizializzazione
					width: 'auto',
					height: 'auto',
					position: "middle",
					url: null,
					title: "",
					triggerElement: undefined,
					HTMLContent: undefined,
					overwrite: false
				},
			scrollbar = {
				element: $("<div class='scrollbar'><div class='scrollbar-guide'></div><div class='scrollbar-slider'></div></div>")
			};

		//	Creazione struttura HTML base della lightbox

		function create()
		{
			if (!$('.lightBox').length)
			{
				html = $("<div>").addClass("lightBox");
				container = $("<div>").addClass("lightBox-wrapper loading");
				content = $("<div>").addClass("lightBox-content").append($("<div>").addClass("wrapper"));
				/*slideshow = $("<div>").addClass("slideshow-mask").attr('data-obj', '{"auto":false, "arrow":true}');
				slideshowContent = $("<ul>").addClass("slideshow-content");
				slideshow.append(slideshowContent).height(370);*/

				closeButton = $("<span>").addClass("lightBox-close").text("X");

				container/*.append($("<header>").append($("<span>").addClass("title base-title")).append(closeButton))*/.append(content).append(closeButton);

				html.append($("<div>").addClass("velina"));

				html.append(container);
			}
			else
			{
				html = $('.lightBox');
				container = $('.lightBox-wrapper', html);
				content = $('.lightBox-content',html);
				closeButton = $('.lightBox-close',html);
				container.addClass("loading");
			}

			$(".lightBox-trigger").not(".libraryLoaded").addClass("libraryLoaded").on("click",
			function(event)
			{
				if(!$(this).is('.disabled') && !$(this).is('.toValid')) {
					event.preventDefault();
					$trigger = $(this);
					var src = $trigger.attr("href"),
						prodCateg,
						prodName,
						objDom = $trigger.attr('data-obj') !== undefined ? $.parseJSON($trigger.attr('data-obj')) : {};
						checkSrc(src);
					
					if ($trigger.is('.lightbox-img')) {
						
						$this = $(this);
						var lbFooter = $("<div class='row lightBox-footer'></div>");
						var lbImg = $("<figure><img src='"+src+"'/></figure>");
						content.addClass('lightBox-img-container').children(".wrapper").html(lbImg).append(lbFooter);
						
						setup(objDom, this);
					}
					
					else if (src.length == 0 || src.indexOf("#") == 0 /*&& src.length == 1 || $trigger.is('.trigger-confirm')*/)
					{
						/*htmlContent = $trigger.nextAll(".lightBox-hidden-content").eq(0).clone().detach();*/
						if(src.length == 1)
							htmlContent = $trigger.nextAll(".lightBox-hidden-content").eq(0).clone().detach();
						else 
							htmlContent = $(".lightBox-hidden-content"+src).clone().detach();
						content.children(".wrapper").html(htmlContent.removeClass("lightBox-hidden-content"));
						//console.log(htmlContent)
						/*container.find(".title").text(htmlContent.find(".page-title").html());*/
						//container.find(".title").text($(this).attr('data-title'));
						setup(objDom, this);
					}
				
					else if ($trigger.closest('.gallery-container').length) {
						var galleryContainer = $trigger.closest('.gallery-container');
						var selected;
						if($trigger.is(".link-preview"))
							html.addClass('lightBox-preview')
						if($trigger.is(".second-trigger"))
							selected = $(this).parents(".gallery-element").find('.lightBox-trigger').not(".second-trigger").addClass("selected");
						else
							selected = $(this).addClass("selected");
	
						var galleryChildren = galleryContainer.find('.lightBox-trigger').not('.second-trigger');
	
						slideshow = $("<div>").addClass("slideshow-mask").attr('data-obj', '{"auto":false, "arrow":true, "startAt": '+galleryChildren.index(selected)+'}');
						slideshowContent = $("<ul>").addClass("slideshow-content");
						slideshow.append(slideshowContent);
						content.find('.wrapper').append(slideshow);
	
						galleryChildren.each(function(i) {
							var src = $(this).attr("href"),
								title = "",
								footerMsg = "";								
							if($(this).data("title")!=undefined)
								var title = $(this).attr('data-title');
							if($(this).data("text")!=undefined)
								var footerMsg = $(this).attr('data-text');
							checkSrc(src);
	
							if(srcType == "img" || $(this).is(".lightbox-img")){
								slideshowContent.append($("<li>").addClass("elemContainer v-center").append('<div class="elemContent"><header><h4 class="title">'+title+'</h4></header><img class="element" src="'+src+'"><footer><h4 class="title">'+footerMsg+'</h4></footer></div>'));
							}
	
							if(srcType == "video" || $(this).is(".lightbox-video")){
								slideshowContent.append($("<li>").addClass("elemContainer").append($("<div>").addClass("element").addClass(videoClass).append($("<a>").attr('href', src))));
							}
							
							if(srcType == "videoMp4") {
								htmlContent = 	'<video class="element" style="height: 100%; width: 100%" tabindex="0" preload controls>';
								htmlContent += 	'<source type="video/mp4" src="../Resources/video/test.mp4">';
								htmlContent +=	'<source type="video/webm" src="../Resources/video/test.webm">';
								slideshowContent.append($("<li>").addClass("elemContainer v-center").append($("<div>").addClass("element").addClass(videoClass).append(htmlContent)));			
							}
							
							if($(this).data("title")!=undefined)
								var title = $(this).attr('data-title');
	
							srcType = "";
						});
	
						setup(objDom, this);
					}
	
					else if (srcType == "video") {
						var vidId = ""
						//console.log(videoClass)
						if(videoClass == "YTVideo"){
							vidId = "//www.youtube.com/embed/"+src.replace(/(http:|https:)?\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w]*(?:['"][^<>]*>|<\/a>))[?=&+%\w-]*/ig, "$2"); // extracts the video ID from the anchor href
							htmlContent = $('<iframe width="560" height="315" src="//www.youtube.com/embed/'+vidId+'" frameborder="0" allowfullscreen></iframe>');
						}
						else if(videoClass == "vimeo"){
							vidId = "//player.vimeo.com/video/"+src.replace(/(http:|https:|)?\/\/vimeo\.com\/(.*)$/, "$2");
							htmlContent = $('<iframe width="560" height="315" src="'+vidId+'" frameborder="0" allowfullscreen></iframe>');
						}
						//console.log(vidId)
						htmlContent = $('<iframe width="560" height="315" src="'+vidId+'" frameborder="0" allowfullscreen></iframe>');
						content.children(".wrapper").html(htmlContent);
						//container.find(".title").text(htmlContent.find(".page-title").html());
						srcType = "";
	
						setup(objDom, this);
					}
					
					else if(objDom.iframe)
					{
						var htmlContent = document.createElement('iframe');
						//console.log(htmlContent)
						//console.log(src)
						htmlContent.setAttribute("src", src);
						htmlContent.setAttribute("frameborder", "0");
						container.addClass('iframe-container');
						content.children(".wrapper")/*.addClass('loading')*/.html(htmlContent);
						setup(objDom, this);
					}
					
					else
					{
						URLParam = parseUrl(src);
						//console.log(URLParam)
						$.ajax({
							type: "GET",
							url: URLParam.url,
							dataType: "html",
							success: function(data) {
								htmlContent = parseContent(URLParam.selector, data);
								//console.log(URLParam)
								//container.addClass('iframe-container');
								content.children(".wrapper").html(htmlContent);
								setup(objDom, this);
								//docReadyInit();
								//container.find(".title").text($(data).find(".page-title").text());
								/*if (hasOverflow(content))
									addScroll();*/
							}
						});
					}
	
					//console.log(objDom)
					function jsonCallback(e){
						setup(objDom, e);
					}
	
					return false;
				}
			});
		}

		function open()
		{
			//container.removeClass("loading");
			if (typeof parameter.callback == "function")
				parameter.callback();
			opened = true;
			if($trigger.is('.lightbox-img')) {
				content.find('img').bind('load', function() {
					setSizeAndPosition();
				});
			}
			else {
				//setTimeout(function()
				//	{
						//setSizeAndPosition();
						
					//}, 500);
			}
			$(window).on('resize', function()
			{
				if($('.lightbox-open').length) {
					setSizeAndPosition();
					//console.log('resize');
				}
			});		
		}

		function close()
		{
			$('body').css({'overflow-x':'hidden','overflow':'visible'}).removeClass('lightbox-open');
			$(document).off("keypress");
			$(parameter.triggerElement).removeClass("selected");
			container.hide().removeClass('iframe-container').addClass("loading").find('header .title').html("");
			content.children(".wrapper").empty().css("top", "0px");
			scrollbar.element.remove();
			content.find($('.slideshow-mask')).remove();
			html.removeClass('notClosable').remove();
			opened = false;
			/* BUG CHROME FIX */
			$(document).unbind('scroll');
			return false
		}

		function setSizeAndPosition()
		{
			var lbWidth = container.outerWidth();
			var lbHeight = container.outerHeight();
			//console.log(lbWidth)
			//console.log(lbWidth)
			if(!parameter.notClosable)
				var fix = parseInt($('.lightBox-close').outerHeight() / 2);
			else
				var fix = 0;
			
			//console.log(parameter)
			//console.log(parameter.width)
			//console.log(!isNaN(parameter.width))
			var padding = 15,
				marginLeft = parseInt(lbWidth / 2),
				marginTop = parseInt(lbHeight / 2 ) - fix,
				width = isNaN(parameter.width) ? 'auto' : parameter.width + "px",
				cssParam = {
					//width: parameter.width + "px",
					width: width,
					height: "auto",
					left: "50%",
					//maxWidth: "70%",
					//marginLeft: "-" + ((parameter.width + padding * 2) / 2) + "px",
					marginLeft: "-" + marginLeft + "px",
					//marginTop: "-" + ((lbHeight + padding * 2) / 2) + "px"
				};
			//console.log(width)
//			console.log('lbWidth: '+lbWidth)
//			console.log('lbHeight: '+lbHeight)
//			console.log('marginTop: '+marginTop)
//			console.log('marginLeft: '+marginLeft)
			
			if(isMobile)
			{
				parameter.position = "top";
				cssParam = {
						width: "auto",
						height: "auto",
						left: "2.5%",
						right: "2.5%"
					};
			}
			switch (parameter.position)
			{
				case "top":
					cssParam.top = "60px";
					cssParam.marginTop = "0px"
					break;
				case "middle":
					cssParam.top = "50%";
					cssParam.marginTop = "-" + marginTop + "px"
					break;
				case "bottom":
					cssParam.bottom = 0;
				//	break;
			}

			html.css("top", $(window).scrollTop() + "px");

			if (!isNaN(parameter.height))
				content.css("height", parameter.height + "px");
			else
				content.css(
				{
					maxHeight: $(window).height() + "px"
				});

			container.css(cssParam);
/*			if (hasOverflow(content))
				addScroll();*/
			html.css("visibility", "visible");
			
			//setTimeout(function(){
				container.show().removeClass("loading");
			//}, 500);		
		}

		function addListener()
		{
			//	Add event listener
			html.one("click", '.lightBox-close, .btn-close', close);
			//content.children(".wrapper").empty();
			$(document).on("keypress", function(event)
			{
				if (event.keyCode == "27" && !parameter.notClosable)
					closeButton.trigger("click");
			});

			$(html).find(".velina").on("click", function() {
				if(!parameter.notClosable)
					closeButton.trigger("click");
			});
		}

		function fill()
		{
			if (parameter.triggerElement != undefined)
			{
				open();
				/*if (hasOverflow(content))
					addScroll();*/
				//initExternalLibrary();
				if ((temp=getElementsByClassName("slideshow-mask","*","libraryLoaded")).length) {
					(function(temp) {
						require(["module/slideshow"], function(Slideshow)
						{
							createSlideshow(Slideshow,temp);
						});
					})(temp);
					//console.log(temp)
				}
				$(document).trigger("lb-created");
			}
		}

		function parseContent(selector, html)
		{
			var loaded = $(html);

			if (selector != undefined && selector != "" && selector != null)
				loaded = loaded.find(selector);
			else
			{
				loaded = loaded.find("section");
				loaded.find(".page-title").remove();
			}

			if (loaded.find(".default").length > 0)
			{
				loaded.find(".default").removeClass("default");
				loaded.find(".block").removeClass();
			}

			return loaded;
		}

		//	Parsing della URL

		function parseUrl(url)
		{
			var newUrl = {
				selector: "",
				url: ""
			};

			var split = url.split("#");

			if (split.length > 1)
			{
				newUrl.url = split[0];
				newUrl.selector = "#" + split[1];
			}
			else if (url.indexOf("mainContentId") != -1)
			{
				newUrl.url = url;
				var regex = new RegExp("[\\?&]" + "mainContentId" + "=([^&#]*)"),
					qs = regex.exec("/newsletter/index.html?mainContentId=form");
				newUrl.selector = "#" + qs[1];
			}
			else
				newUrl.url = url;

			return newUrl;
		}


		//	PUBLIC METHODS

		function checkSrc(src){
			//console.log(src);
			if((/\.(gif|jpg|jpeg|tiff|png)/i).test(src))
				srcType = "img";
			else if((/\.(mp4)/i).test(src)) {
				srcType = "videoMp4";
				videoClass = "videoMp4";
			}
			else if((/(http|https)?\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w]*(?:['"][^<>]*>|<\/a>))[?=&+%\w-]*/ig).test(src) || (/^.+vimeo.com\/(.*\/)?([^#\?]*)/).test(src))
				srcType = "video";
				if((/(http|https)?\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w]*(?:['"][^<>]*>|<\/a>))[?=&+%\w-]*/ig).test(src))
					videoClass = "YTVideo";
				else if((/^.+vimeo.com\/(.*\/)?([^#\?]*)/).test(src))
					videoClass = "vimeo";
			//console.log(srcType)
		}

		function init()
		{
			create();
		}

		function setup(param, trigger)
		{
			parameter = $.extend(
			{}, defaultParam, param);
			parameter.width = parseInt(parameter.width);
			parameter.height = parseInt(parameter.height);
			parameter.callback = eval(parameter.callback);
			if(parameter.notClosable == "true") {
				html.addClass('notClosable');
			}
			
			if (!opened)
			{
				//setSizeAndPosition();
				$("body").css("overflow", "hidden").addClass('lightbox-open').append(html);
				parameter.triggerElement = trigger || undefined;
				addListener();
				fill();
				/* BUG CHROME FIX */
				$(document).bind('scroll', function() {
					$(this).scrollTop(0);
				})
			}
			else
			{
				if (parameter.overwrite)
					content.children(".wrapper").empty().append(parameter.HTMLContent);
				else
					content.children(".wrapper").append(parameter.HTMLContent);
			}
		}

		return {
			init: init,
			open: setup
		};
	};

	return LightBox;
});
