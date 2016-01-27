define(['jquery', 'TweenMax', 'TweenMaxScrollTo', 'enquire', (Modernizr.touch ? 'touchPunch' : 'jQueryUI')],
	function($, TweenMax)
	{
		var Menu = function()
		{
			var	header,
				filteredItems = $(), // machines to re-show when filtering and moving to mobile mode
				init = function(option)
				{
					var header = $('#main-header').addClass('libraryLoaded'),
						triggerMenu = $('#hamburger-trigger'),
						wrapper = $('#wrapper'),
						menuContainer = $('#nav-container'),
						mainNav = $('#main-nav'),
						_pageContent = $('#page-content');

					var scrollToTop = function() {
						TweenMax.to(window, 0.5,
						{
							scrollTo: 0
						});
					}
					
					var closeMenu = function() {
						menuContainer.slideUp().removeClass('open').removeClass('subMenuOpen');
						wrapper.removeClass('menuOpen');
						mainNav.find('.open').removeClass('open').find('.toSlide').css('right','-100%');
					}
					
					var toggleMenu = function() {
						wrapper.toggleClass('menuOpen').find('#top-header').toggleClass('hidden');
						if(!menuContainer.is('.open'))
							menuContainer.slideDown(function(){menuContainer.addClass('open')});
						else 
							closeMenu();
					}
					
					var fakeNewPage = function(elem,container,toHide) {
						if(!$('.fakePageOpen').length) {
							$.each(toHide, function( index, value ) {
								value.addClass('toHide');
							});
							wrapper.addClass('fakePageOpen');
						}
						else
							destroyFakePage(elem,container,toHide);
						
						$('.destroyPage, .tab-confirm').unbind().on('click', function(event) {
							event.preventDefault();
							var valid = true;
							if($(this).is('.tab-confirm')) {
								var $form = $(this).closest('.form'),
									$activeTab = $form.find('.multi-contents:visible');
								if(!preValidateForm($activeTab))
									valid = false;
							}
							if(valid) {
								if(elem.is('.accordion-trigger'))
									elem.trigger('click');
								else if(elem.is('.multi-triggers')) {
									destroyFakePage(elem,container,toHide);
									elem.trigger('click');
								}
								$(pageContainer).scrollTop(0);
							}
							else {
								scrollToTarget($form.find('.error').first().closest('.block-form'), 800);
							}
						});
					}
					
					var destroyFakePage = function(elem,container,toShow) {
						$('.toHide').removeClass('toHide');
						$('.destroyPage').addClass('hidden');
						wrapper.removeClass('fakePageOpen');
					}
					
					var closeTabs  = function(elem) { 
						elem.find(".multi-triggers.selected").removeClass("selected");
						elem.next('.multi-contents').hide().removeClass('open');
					}
					
					var resizeTimer;
					$(window).on('resize', function()
					{
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function()
						{
							//
						}, 25);
					});
															
					if(!mobileSize) {
						mainNav.find('> ul > li').hover( function() {
							$(this).find('.nav-panel').show();
						}, function(){
							$(this).find('.nav-panel').hide();
						});	
					}
					
					triggerMenu.on("click", function(event) {
						event.preventDefault();
						event.stopPropagation();
						toggleMenu();
					});
					
					mainNav.on("click", ".main-voice > a", function(event) {
						if(mobileSize || tabletSize) {
							event.preventDefault();
							event.stopPropagation();
							var _this = $(this),
								_panel = _this.next('.toSlide');
							menuContainer.addClass('subMenuOpen');
							_panel.closest('li').addClass('open');
							TweenMax.to(_panel, 0.5,
							{
								right: 0
							});
						}
					})
					.on("click", ".back-menu", function(event) {
						event.preventDefault();
						event.stopPropagation();
						var _this = $(this),
							_panel = _this.closest('.toSlide');
						if($('.level-0.open').length) {
							var _panel = $('.level-0.open').removeClass('open').find('.toSlide'),
								container = _panel.closest('li');
						}
						else {
							var _panel = $('.nav-panel'),
								container = menuContainer;
							_panel.closest('li').removeClass('open');
						}
						TweenMax.to(_panel, 0.5,
						{
							right: "-100%"
						});
						container.removeClass('subMenuOpen');
					})
					.on("click", ".level-0 .trigger-mobMenu", function(event) {
						event.preventDefault();
						event.stopPropagation();
						var _this = $(this),
							_panel = _this.next('.toSlide');
						_panel.closest('li').addClass('subMenuOpen');
						_panel.closest('.level-0').addClass('open');
						TweenMax.to(_panel, 0.5,
						{
							right: 0
						});
					});
					
					/* HP-nav accordion */
					$('#HP-nav .accordion-trigger').on('click',function(event) {
						if(mobileSize || tabletSize) {
							var _this = $(this),
								_container = _this.closest('section'),
								_toHide =[_this.closest('article').siblings('article'), _this.closest('section').siblings('section:not("#back-container")')];
							fakeNewPage(_this,_container,_toHide);
						}
					});
					
					/* TABS */
					if(mobileSize || tabletSize)
						closeTabs($('.std-tabs')); // check all tabs also to mobile vesion simulated on desktop
					$('.std-tabs .multi-triggers')/*.not('.selected')*/.on('click',function(event) {
						var _this = $(this),
							_container = _this.closest('.tabs-container');
						if(mobileSize || tabletSize) {
							if(!_this.is('.selected')) {
								$(pageContainer).scrollTop(0);
								if(_container.is('.mob-accordion')) {
									var _toHide = [_this.siblings('.multi-triggers'), _this.closest('section.row.default').siblings('section:not("#back-container")'), _this.closest('.tabs-container').siblings(), _pageContent.find('#open-request > header')];
								fakeNewPage(_this,_container,_toHide);
								}
							}
						}
					});
			
				}
				return {
				init: init
			};
		};
		return Menu;
	});