define(['jquery', 'TweenMax', 'enquire'], function($) {
	var Multiselection = function() {

		// COSTANT
		var DOM_IDENTIFIER = {
			CONTAINER: ".multi-selection-element" //Identificatore del contenitore della multiselection
		}

		// VARIABLE
		var currIndex = 0,
			element = null,
			tabTriggers,
			tabContents,
			descendants,
			firstTime = true,
			option = {
				autoScroll: true,
				type: "",
				mobileAllClose: false,
				allClose: false
			};

		/*
		* MULTISELECT: tab verticali o orizzontali
		* ACCORDION: generico accordion
		* MULTISELECT-STEP: come multiselect solo che le tab sono bloccate e vengono sbloccate man mano che avanzi con gli step
		* VERTICAL-ACCORDION: come accordion, solo che la label sono affiancate verticalmente
		*
		* NOTE:
		*	- (MOBILE - DESKTOP) se trova una ancora senza nessuna classe apre il tab/accordion
		*	- (MOBILE - DESKTOP) se trova la classe load-content, carica il contenuto via AJAX e poi apre il tab/accordion
		*	- (MOBILE) se trovo la classe mobile-blank apre il link dell'ancora in _self
		*/

		// Inizializzazione in base al tipo di multiselection indicata.
		

		function init(_option, elem) {

			// DEBUG
			//isMobile = isTablet = true;
			$.extend(true, option, _option);
			element = $(elem);
			
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
						deviceSize = 'deskTopSize';
					},
				unmatch : function()
					{
						desktopSize = false;
					},
				setup : function(){} // Triggers an evaluation of the media query
			});
			oldSize = deviceSize;
			
			// su mobile i tab diventano accordion
			if ((mobileSize || (isTablet && !tabletLandSize)) && option.type == "MULTISELECT")
				option.type = "ACCORDION";
			//alert(option.type)
			
			if ( (option.desktopdisable == true) && (!isMobile && !isTablet) )
				return false;
			//console.log(option.type)
			switch (option.type) {
				case "MULTISELECT":
				case "MULTISELECT-STEP":
					initMulti();
					break;
				case "IMAGESELECT":
					initImgSelect();
					break;
				case "ACCORDION":
				case "VERTICAL-ACCORDION":
					initAccordion();
					break;
				default:
					//console.log("Manca il type");
			}
		}

		// Inizializzazione MULTISELECTION

		function initMulti() {
			tabTriggers = option.tabTriggers == undefined ? element.find('dt, .multi-triggers') : $(option.tabTriggers, element);
			tabContents = option.tabContents == undefined ? element.find('dd, .multi-contents') : $(option.tabContents, element);
			descendants = option.tabTriggers == undefined ? 'dt, .multi-triggers' : option.tabTriggers;
			// A quelli che hanno un ancora nel titolo aggiungo la classe "load-content"
			tabTriggers.find("a").parent().addClass("load-content");
			tabContents.hide();

			tabTriggers.css({'cursor': 'pointer'})
			
			// Aggiungo la classe inactive a tutti tranne il primo
			if (option.type == "MULTISELECT-STEP") {
				tabTriggers.not(":eq(0)").addClass('inactive');
				tabTriggers.eq(0).removeClass('inactive').addClass("selected");
			}

			element.on("click", descendants, function(event) {
				event.stopPropagation();
				event.preventDefault();
				currIndex = tabTriggers.index(this);
				if ($(this).hasClass("inactive"))
					return false;
				/* MULTISELECT STEP	*/
				// Se hanno la classe inactive non si attiva il contenuto della TAB
				if (option.type == "MULTISELECT-STEP") {
					tabTriggers.filter(".selected").addClass('active');
					tabTriggers.filter(":gt(" + currIndex + ")").removeClass("active").addClass('inactive');
				}
				/* END MULTISELECT STEP */

				tabTriggers.removeClass("selected");
				tabContents.hide();
				$(this).addClass("selected");
				content = tabContents.eq(currIndex);

				if (isMobile && $(this).find("a.mobile-blank").length > 0) {
					//Apro il link dell'ancora, se sono su mobile
					document.location.href = $(this).find("a.mobile-blank").attr("href");
				}
				// Carico il contenuto via AJAX
				else if ($(this).find("a.load-content").length > 0 && !content.hasClass("isLoaded"))
				{
					content.show().text("Loading....").load($(this).find("a").attr("href"), function() {
						$(this).addClass("isLoaded");
					});
				}
				else
					content.show(); // Mostro il contenuto									
				if(/*!firstTime && firstTime == false && */option.autoScroll) {
					pageContainer.animate({
						scrollTop: parseInt($(this).offset().top)
					}, 700);
				}
				
				tabContentInit(); // inizializzo il contenuto della tab
				
				destroyScroll(); customScroll();
				return false;
			});

			element.on('click','.close', function(event) {
				event.stopPropagation();
				event.preventDefault();
				var closedTrigger = tabTriggers.filter('.selected').removeClass("selected");
				tabContents.hide();
			});

			//if (tabTriggers.filter(".selected").length > 0)
				tabTriggers.filter(".selected").trigger('click');
				
			// apro tutte le tabs se scelto da options
			if (!isMobile && option.allOpen) {
				tabTriggers.addClass('selected');
				tabContents.show();
			}

			return false;
		}

		// Inizializzazione ACCORDION

		function initAccordion() {
			tabTriggers = option.tabTriggers == undefined ? element.find('dt, .multi-triggers') : $(option.tabTriggers, element);
			tabContents = option.tabContents == undefined ? element.find('dd, .multi-contents') : $(option.tabContents, element);
			descendants = option.tabTriggers == undefined ? 'dt, .multi-triggers' : option.tabTriggers;

			if (option.type == "VERTICAL-ACCORDION" && !isMobile)
				initVAccordion();
			else
				eraseVAccordion();

			// Nasconde tutti contenuti
			tabContents.hide();

			// Registro l'evento click sui titoli delle tab/accordion
			element.on("click", descendants, function(event) {
				event.stopPropagation();
				event.preventDefault();

				if ($(this).hasClass("inactive"))
					return false;

				var _this = $(this),
					currIndex = tabTriggers.index(this),
					content = tabContents.eq(currIndex);

				if (content.hasClass("open")) {
					content.removeClass('open').hide();
					//element.find(".selected").addClass("readytoopen");
					tabTriggers.filter(".selected").removeClass("selected");
					//element.find(".selected").removeClass("selected");
					return false;
				}
				tabTriggers.filter(".selected").removeClass("selected");
				//element.find(".selected").removeClass("selected");
				element.find(".demo").removeClass("demo");
				_this.addClass("selected");
				//_this.removeClass("readytoopen");
				tabContents.filter(".open").removeClass("open").hide();

				if (isMobile && $(this).find("a.mobile-blank").length > 0) {
					//Apro il link dell'ancora, se sono su mobile
					document.location.href = $(this).find("a.mobile-blank").attr("href");
				} else if ($(this).find("a.load-content").length > 0 && !content.hasClass("isLoaded")) {
					content.show().text("Loading....").load($(this).find("a").attr("href"), function() {
						$(this).addClass("isLoaded").addClass("open");
					});
				} else
					content.addClass("open").show();
				
				// autoscroll
				pageContainer.animate({
					scrollTop: parseInt($(this).offset().top)
				}, 700);

				tabContentInit(); // inizializzo il contenuto della tab
				destroyScroll(); customScroll();
				firstTime = false;
				return false;

			});

			// MOBILE: se li voglio tutti chiusi, tolgo la classe selected in modo che non si apra
			if (option.mobileAllClose && isMobile)
				tabTriggers.filter(".selected").removeClass('selected');

			if (tabTriggers.filter(".selected").length > 0) {
				//if(element.is('.accordion')) {
					firstTime = true;
					tabTriggers.filter(".selected").trigger('click');
				//}
			}
		}

		function eraseVAccordion() {
			element.removeClass('v-accordion');
			tabTriggers.removeClass('block');
			tabContents.children('.row').children('.block').removeClass('block');
		}

		function initVAccordion() {
			var elem_number = tabContents.length;
			var className = "";
			if ((24 % elem_number) == 0)
				className = "d" + (24 / elem_number);
			else
				className = "p" + (100 / elem_number);
			tabTriggers.addClass(className + " t24");

			$.each(tabContents, function(index, value) {
				var block = $(this).find(".block");
				block.addClass(className + " t24");
				if (index > 0) {
					if ((24 % elem_number) == 0) {
						var delta = (24 / elem_number) * index;
						block.addClass("od" + delta + " ot0");
					} else {
						var delta = (100 / elem_number) * index;
						block.css("margin-left", delta + "%");
					}
				}
			});
		}

		/*
		*	PUBLIC FUNCTION
		*/

		function nextStep() {
			if (option.type == "MULTISELECT-STEP") {
				//console.log("currIndex " + currIndex);

				tabTriggers.eq(currIndex).addClass("active");
				var index = currIndex + 1;
				//console.log("index " + index);

				//console.log("currIndex " + currIndex);
				tabTriggers.eq(index).removeClass('inactive').trigger("click");
			}
		}

		// END PUBLIC FUNCTION

		/* metodi esposti sull'istanza dell'oggetto */
		return {
			init: init,
			nextStep: nextStep
		};
	};
	return Multiselection;
});
