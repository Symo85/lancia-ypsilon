define(['jquery'],

	function ($)
	{
		var Gallery = function() {

			var galleryContainer,	//Nodo contenitore della struttura della GALLERY
				closeButton,		//Bottone per chiudere la gallery
				arrowLeft,			//Freccia a sinistra
				arrowRight,			//Freccia a destra
				thumbs,				//Nodo duplicato direttamente dal DOM che contine le thumb per la gallery esplosa
				mainSlideShowInstance,	//Istanza della classe Slideshow per lo slideshow in alto
				thumbSlideShowInstance,	//Istanza della classe Slideshow per lo slideshow delle thumb
				galleryThumbElements,	//Array delle thumb della gallery
				thumbElements = undefined,	//Array delle thumb fuori dalla gallery
				loading = null,
				position = 0,
				detached = null,
				preloader = null,
				sectionParent,			//Section che continere le thumb su cui ho cliccato
				clickedElement = null,
				hasBgSize = true;

			//variabili nuove per estendere la gallery con più gallery
			var thumbsARRAY = [],
				sectionParentARRAY = [],
				galleryThumbElementsARRAY = [],
				galleryIndex,						//Quale delle N gallerie è quella su cui ho cliccato
				thumbSlideShowInstanceARRAY = [],
				mainSlideShowInstanceARRAY = [],
				positionNEW = [],
				thumbsNEW,
				thumbsHeight,
				animationRunning = false,
				audioOn = false,
				autoPlayVideo = false;

			function init() {


				//	Carico la libreria del preloader
				require(["module/imagespreloader"], function (ImagePreloader) {
						preloader = new ImagePreloader();
				});

				//	Se la proprietà CSS3 'background-size' non è supportata
				//	carico la libreria per la fallback
				if($("html").hasClass("no-backgroundsize")){
					require(["libs/jquery.backgroundSize"], function () {
						hasBgSize = false;
					});
				}

				//	Workaround perchè altrimenti nell'oggetto gli elementi erano ordinati in senso inverso.
				if($(".gallery-element" ).parents('.slideshow-content').length)
				{
					$(".gallery-element" ).closest('section').each(function(){
						$(this).replaceWith($(this).find('article').addClass('row elemContainer'));
					});
				}
				$(".gallery-element" ).parents("section.row").addClass("g-index");
				sectionParentARRAY = $(".g-index").removeClass(".g-index");
				sectionParentARRAY.each(function(index, value){
					thumbsARRAY.push($(value).clone().detach());
					galleryThumbElementsARRAY.push(thumbsARRAY[index].find(".gallery-element"));
					positionNEW.push(0);
				});
				//	FINE EXTEDEND

				//	Registro l'evento click sugli elementi della gallery
				$(".gallery-element").on("click", function(event) {
					event.preventDefault();

					if(animationRunning)
						return false;

					animationRunning = true;
					clickedElement = this;
					/*var parent = $(this).parents('.slideshow-mask').length ? $(this).parents('.slideshow-mask') : $(this).parents('section.row');*/
					var parent = $(this).parents('section.row');
					autoPlayVideo = parent.find('.autoplay').length ? true : false;
					audioOn = parent.find('.audioOn').length ? true : false;
					galleryIndex = sectionParentARRAY.index(parent);
					positionNEW[galleryIndex] = parent.find(".gallery-element").index($(this));


					//Per EXTEDNED lo faccio già nell'each qui sopra
					if(thumbElements == undefined)
						thumbElements = parent.find(".gallery-element");


					if(!detached)
						createSkelton();
					else
						attachGallery();

					$("body").css("overflow", "hidden");

					return false;
				});

			}

			//	Se la gallery è già stata creata, ne faccio semplicemente il riattach.
			function attachGallery() {
				if(isCorporate) $('#mainheader').animate({marginTop: '-85'},500);
				detached.insertAfter(sectionParentARRAY[galleryIndex]);
					detached.slideDown(700, function(){
						switchGallery();
						scrollPages(galleryContainer);
						$(galleryContainer).find(".thumb-slideShow header a").removeClass("selected").eq(galleryIndex).addClass("selected");
					});
				$(document).on("keydown", keyPressCb);
			}

			function createSkelton()
			{
				if(isCorporate) $('#mainheader').animate({marginTop: '-85'},500);
				$("body").css("overflow", "hidden");
				galleryContainer = $("<div class='gallery-container'>").width("100%").height($(window).height());
				loading = $("<div>").addClass("loading").width("100%").height("100%");
				closeButton = $('<div class="gallery-close"></div>');

				//	Creo le frecce separatamente per comodità di gestione
				//	Le frecce non vengono gestite dallo slideshow ma QUI
				arrowLeft = $('<div class="gallery-arrows arrow-left-white"></div>');
				arrowRight = $('<div class="gallery-arrows arrow-right-white"></div>');

				galleryContainer.append(closeButton);
				galleryContainer.append(arrowLeft);
				galleryContainer.append(arrowRight);
				galleryContainer.append(loading);

				galleryContainer.insertAfter(sectionParentARRAY[galleryIndex]);

				scrollPages(galleryContainer, function()
				{
					animationController("afterScroll");
				});
			}

			function createGallery() {

				//	EXTEND
				//	galleryContainer.insertAfter(sectionParentARRAY[galleryIndex]);
				//	FINE EXTEND

				//	EXTEND
				sectionParentARRAY.each(function(index, value){

					var elements = thumbsARRAY[index].find("a");
					var mainSlideShow = buildSlideshow(elements);
					var title;
					//Cambio la classe w6 per avere tutti i contenuti su una riga

					if(index == 0)
					{
						thumbsNEW = thumbsARRAY[index];
						thumbsARRAY[index].addClass("thumb-slideShow black").find(".w6").removeClass("w6").addClass("w3");
						thumbsARRAY[index].find("header h3").contents().unwrap().wrap('<a/>');
						if($(thumbsARRAY[index]).find(".slideshow-mask").length > 0)
						{
							thumbsARRAY[index].find(".slideshow-content").removeClass("libraryLoaded");
							thumbsARRAY[index].find(".bottom-tape").remove();
						}
						else
						{
							var slideShowContainer = '<div class="slideshow-mask" data-obj=\'{"auto":false, "arrow":false}\'><div class="slideshow-content"><article class="row elemContainer selected">';
							slideShowContainer += $(thumbsARRAY[index]).find("article").html();
							slideShowContainer += "</article></div></div>";
							$(thumbsNEW).find("article").remove();
							$(thumbsNEW).append(slideShowContainer);
							thumbsARRAY[index] = $(thumbsNEW).find(".slideshow-mask").eq(index);
							galleryThumbElementsARRAY[index] = $(thumbsNEW).find(".slideshow-mask").eq(index).find(".gallery-element");
						}
					}
					else
					{
						thumbsARRAY[index].find(".w6").removeClass("w6").addClass("w3");
						title = $(thumbsARRAY[index]).find("h3").text();
						if($(thumbsARRAY[index]).find(".slideshow-mask").length > 0)
							$(thumbsNEW).append($(thumbsARRAY[index]).find(".slideshow-mask"));
						else if($(thumbsARRAY[index]).find("article"))
						{
							var slideShowContainer = '<div class="slideshow-mask" data-obj=\'{"auto":false, "arrow":false}\'><div class="slideshow-content"><article class="row elemContainer selected">';
							slideShowContainer += $(thumbsARRAY[index]).find("article").html();
							slideShowContainer += "</article></div></div>";
							$(thumbsNEW).append(slideShowContainer);
							thumbsARRAY[index] = $(thumbsNEW).find(".slideshow-mask").eq(index);
							galleryThumbElementsARRAY[index] = $(thumbsNEW).find(".slideshow-mask").eq(index).find(".gallery-element");
						}
						$(thumbsNEW).find("header").append($("<a>").append(title));
					}

					//La appendo dopo il contenitore dell'elemento su cui ho cliccato
					galleryContainer.append(mainSlideShow);

					//Appendo il clone ma devo re inizializzare lo slideshow TODO
				});
				thumbsNEW.css("bottom", "-300px");
				thumbsNEW.find("header a").not(":last-child").addClass("right-pipe");
				galleryContainer.append(thumbsNEW);
				$(thumbsNEW).find(".slideshow-mask").hide().eq(galleryIndex).show();
				$(galleryContainer).find(".main-slideShow").eq(galleryIndex).show();
				//	FINE EXTEND


				initSlideShow("thumbs");
				$(galleryContainer).find(".thumb-slideShow header a").removeClass("selected").eq(galleryIndex).addClass("selected");
				$(".thumb-slideShow").on("click", ".gallery-element", function(event) {
					event.preventDefault();

					//	EXTEND
					positionNEW[galleryIndex] = galleryThumbElementsARRAY[galleryIndex].index($(this));
					//	FINE EXTEND

					/*position = galleryThumbElements.index($(this));*/
					goTo();

					return false;
				});

				// Click sulle etichette dell'header per cambiare gallery
				$(galleryContainer).on("click", ".thumb-slideShow header a", function(event){
					event.preventDefault();
					$(this).parent().find(".selected").removeClass("selected");
					$(this).addClass("selected");
					galleryIndex = $(galleryContainer).find(".thumb-slideShow header a").index($(this));

					switchGallery();
					return false;
				});

				//	Close Button
				$(closeButton).on("click", function(event){
					animationRunning = true;
					for(var i = mainSlideShowInstanceARRAY.length; i--;)
						mainSlideShowInstanceARRAY[i].muteVideo(true);
					$(thumbsNEW).animate({
						bottom : "-200"
					}, 500, function(){ $(thumbsNEW).css("bottom", "- " + thumbsHeight); });
					$(galleryContainer).find(".slideshow-mask").eq(galleryIndex).fadeOut(700, function(){

						galleryContainer.slideUp(1000, function(){
							scrollPages(sectionParentARRAY[galleryIndex], function(){
								if(isCorporate) $('#mainheader').animate({marginTop: '0'},500);
								detached = $(".gallery-container").detach();
								$('body').css({'overflow-x':'hidden','overflow':'visible'});
								$(document).off("keydown");
								animationRunning = false;
							});
						});
					});

				});

				arrowRight.on("click", function () {
					positionNEW[galleryIndex]++;
					if(positionNEW[galleryIndex] >= galleryThumbElementsARRAY[galleryIndex].length)
						positionNEW[galleryIndex] = 0;
					goTo();
				});

				arrowLeft.on("click", function () {
					positionNEW[galleryIndex]--;
					if(positionNEW[galleryIndex] < 0 )
						positionNEW[galleryIndex] = galleryThumbElementsARRAY[galleryIndex].length-1;
					goTo();
				});

				// keydown perchè si IE8 keypress non funziona
				$(document).on("keydown", keyPressCb);
				$(window).on("resize", onResize);

				/*thumbs.css("bottom", "-" + thumbs.height() + "px");*/

			}

			function switchGallery() {
				goTo();
				$(thumbsNEW).find(".slideshow-mask").hide().eq(galleryIndex).show();
				thumbsNEW.animate({bottom : "-" + thumbsHeight}, 700);
				$(galleryContainer).find(".main-slideShow").hide().eq(galleryIndex).fadeIn(1000);
			}

			function animationController(type)
			{
				switch (type)
				{
					case "afterScroll":
						createGallery();
					break;
					case "thumbsInit":
						initSlideShow("mainSlideShow");
					break;
					case "mainSlideShowInit":
						thumbsHeight = thumbsNEW.height() - 42;
						thumbsNEW.animate({ bottom: "-" + thumbsHeight + "px"}); //Meno altezza dell'header
						$(".no-csstransitions .gallery-container > .thumb-slideShow").on("mouseenter mouseleave", function(event){
							if(event.type == "mouseenter")
								$(this).animate({ bottom : "43px"});
							else if (event.type == "mouseleave")
								$(this).animate({ bottom : "-" + thumbsHeight});
						});
						goTo();
						animationRunning = false;
					break;
				}
			}

			function onResize (event)
			{
				galleryContainer.height($(window).height());
			}

			function keyPressCb(event) {
				if(event.keyCode == "37")
				{
					event.preventDefault();
					arrowLeft.trigger("click");
					return false;
				}
				else if(event.keyCode == "39")
				{
					event.preventDefault();
					arrowRight.trigger("click");
					return false;
				}
				else if(event.keyCode == "27")
				{
					event.preventDefault();
					closeButton.trigger("click");
					return false;
				}
			}

			//Elaboro il noscript per renderlo visibile e poi
			function goTo() {
				var element = $(".main-slideShow").eq(galleryIndex).find(".elemContainer").eq(positionNEW[galleryIndex]);

				if(!element.hasClass("libraryLoaded"))
				{
					if(!element.hasClass("YTVideo"))
					{
						element.on("allImagesLoaded",showContent);
						preloader.preload([element.attr("data-src")], element, element, true);
					}
				}

				galleryThumbElementsARRAY[galleryIndex].filter(".selected").removeClass("selected");
				galleryThumbElementsARRAY[galleryIndex].eq(positionNEW[galleryIndex]).addClass("selected");
				mainSlideShowInstanceARRAY[galleryIndex].goTo(positionNEW[galleryIndex]);
				thumbSlideShowInstanceARRAY[galleryIndex].goTo(Math.floor(positionNEW[galleryIndex]/8));
				loading.fadeOut(700);
			}

			function showContent(event)
			{
				var path = "url("+ event.sources[0] +")";
				$(event.target).attr("data-src","").addClass("libraryLoaded");
				$(event.target).css("background-image", path);
				if(!hasBgSize)
					$(event.target).css("background-size", "contain");
				$(event.target).addClass("libraryLoaded");
			}

			function initSlideShow(type){

				if(type == "thumbs")
				{
					require(["module/slideshow"], function (Slideshow) {

						$(thumbsARRAY).each(function(index, value){
							var option = {
								auto: false,
								arrow: false,
								container : $(".thumb-slideShow .slideshow-mask").eq(index).find(".slideshow-content"),
								elements: $(".thumb-slideShow .slideshow-mask").eq(index).find(".elemContainer"),
							};
							var slideshow = new Slideshow();
							slideshow.init(option);
							thumbSlideShowInstanceARRAY.push(slideshow);
						});

						animationController(type+"Init");
					});
				}
				else if (type == "mainSlideShow")
				{
					require(["module/slideshow"], function (Slideshow) {

						sectionParentARRAY.each(function(index, value){
							var option = {
								auto: false,
								arrow: false,
								container : $(".main-slideShow").eq(index).find(".slideshow-content"),
								elements: $(".main-slideShow").eq(index).find(".elemContainer"),
								audioOn: audioOn,
								autoPlayVideo: autoPlayVideo
							};
							var slideshow = new Slideshow();
							slideshow.init(option);
							mainSlideShowInstanceARRAY.push(slideshow);
						});
						animationController(type+"Init");
					});
				}
			}

			function buildSlideshow(elements) {

				var slideShowContainer = '<div class="slideshow-mask main-slideShow" data-obj=\'{"auto":false, "arrow":true}\'><div class="slideshow-content">';

				$(elements).each(function(index, value) {
					var element;

					if(!$(value).parent().hasClass("play-button"))
						slideShowContainer += "<section class='elemContainer' data-src='"+ $(value).attr("href") +"'></section>";
					else
						slideShowContainer += "<section class='elemContainer YTVideo'><a href='"+ $(value).attr("href") +"'></a></section>";
				});

				slideShowContainer += '</div></div>';

				return $(slideShowContainer).hide();
			}

			function scrollPages(element, callback)
			{

				var curScroll =
				{
					x : 0,
					y : $(window).scrollTop()
				};
				TweenLite.to(curScroll, 1,
					{
						y : $(element).offset().top - 45,
						onUpdate : function()
						{
							window.scrollTo(curScroll.x, curScroll.y);
						},
						onComplete: function() {
							if(typeof(callback) == "function") callback();
						},
						ease : Expo.easeOut
					});
			}

			return {
				init: init
			};
		};

		return Gallery;
	});
