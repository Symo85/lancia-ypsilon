define(['jquery', 'TweenMax', 'TweenMaxScrollTo', 'History'],
function($, TweenMax)
{
	return menuUtils = function()
	{
		/* parameters must contain
		* {
		*	menu,	// must be a jQuery object containing anchors to be loaded, the current one being marked as class="selected"
		* }
		*/
		var canScroll = false,
			urlToGo,
			doc = $(document),
			selectedIndex,
			elementToScroll = null,
			secondnav = {
				el: $('.second-nav')
			},
			secondnav = {
				el: secondnav.el,
				height: secondnav.el.outerHeight(true),
				offsetTop: secondnav.el.offset().top,
				placeholder: null,
				placeholderSelected: null,
				title: secondnav.el.find('h3'),
				titleOffset: secondnav.el.find('h3').offset().left
			},
			mainheader = {
				el: $('#mainheader')
			},
			mainheader = {
				el: mainheader.el,
				height: mainheader.el.outerHeight(true),
				placeholder: mainheader.el.next(),
				logoOffset: (mainheader.el.find('hgroup').offset().left + mainheader.el.find('hgroup').width())
			},
			scrollDone = $.Deferred(),
			menuDone = $.Deferred(),
			menuSliderTimer = null,
			isHumanScrolling = true,
			isStage = location.hostname.match(/^www2/) !== null ? true : false,
			stripes = $(),
			init = function(parameters)
			{
				if (secondnav.el.hasClass('libraryLoaded') || secondnav.el.hasClass('simple') || isAuth) return false;

				/* FIX URLS DIFFERENCES */
				for (var i = parameters.menu.length; i--;)
				{
					var _this = parameters.menu.eq(i),
						_thisHref = _this.attr('href');
					_thisHref.match(/\/$/) === null ? _this.attr('href', _thisHref + '/') : null;
				}

				if (Modernizr.history && location.pathname.match(/\/$/) === null)
					History.replaceState(null, null, location.pathname + '/');

				var localRootURL = parameters.menu.get(0).href,
					locationHref = location.pathname.match(/\/$/) === null ? location.href + '/' : location.href;
				// Replaces the URL with the base URL + hash and redirects IE there.
				if (!Modernizr.history && location.href !== localRootURL && location.hash === "") // If this is not the local rootpage and history isn't supported (IE), we land on (local) root page with hash
					location.href = localRootURL + "#" + locationHref.replace(localRootURL, '').replace(location.hash, '').replace('index.htm', ''); // http://www.domain.com/directory/sub/index.html#blahblahblah -> directory/sub/

				/* FIX HTML */
				$('body').addClass("loading ajaxLoading");
				secondnav.el.addClass('libraryLoaded');
				if(!isStage)secondnav.el.unwrap();
				$('form > div > [data-index]').unwrap();
				secondnav.placeholder = $('<div class="placeholder-secondnav"></div>').insertBefore(secondnav.el).height(0);
				secondnav.placeholderSelected = $('<div class="placeholder-selected"></div>').appendTo(secondnav.el.find('.row ul').css('position', 'relative')).hide();
				//Do we need it anymore?
				/*if (!parameters.menu.eq(0).is('a'))
				{
					selectedIndex = selectedMenuItem.index();
					parameters.menu = parameters.menu.children();
				}*/

				var selectedMenuItem = parameters.menu.filter('.selected').attr('data-title',document.title);

				/* FIX ACN DEPLOY */
				/*if (selectedMenuItem.first().attr('href') == '#')
				{
					var s1 = $('.second-nav').first().find('a').eq(1).attr('href'),
						s2 = $('.second-nav').first().find('a').eq(2).attr('href'),
						s1A = s1.split('/'),
						s2A = s2.split('/'),
						s3 = "",
						i = 0;
					while (s1A[i] == s2A[i])
					{
						s3 += s1A[i] + '/';
						i++;
					}
					selectedMenuItem.first().attr('href', s3);
				}*/
				/*if (selectedMenuItem.length != 1)
				{
					var urlToCheck = (location.pathname.match(/\/$/) === null ? location.pathname + '/' : location.pathname),
						el = 0;
					selectedMenuItem.removeClass('selected').each(function()
					{
						var anchorUrl = $(this).attr('href'); *//*.match(/\/$/) == null ? $(this).attr('href',$(this).attr('href') + '/') : $(this).attr('href');*/
				/*		if (anchorUrl == urlToCheck)
						{
							el = $(this);
							return false;
						}

					});
					if (el.length)
					{
						selectedMenuItem = el.addClass('selected');
					}
					else
					{
						selectedMenuItem = parameters.menu.first().addClass('selected');
					}

				}*/
				/* END FIX ACN DEPLOY */

				var toBeAddedStripes = new Array(), // will be used to temporary contain the Ajax-loaded stripes.
					totalStripes = 1;

				//Do we need this condition anymore?
				//selectedIndex = selectedIndex !== undefined ? selectedIndex : parameters.menu.index(selectedMenuItem);

				selectedIndex = parameters.menu.index(selectedMenuItem);

				if (location.hash !== "" && location.hash !== "#./" && location.hash !== "#")
					urlToGo = location.href.replace("./", "").replace("#", "");

				var currentPageStripeIndex = selectedIndex,
					currentPageStripe = secondnav.el.nextUntil('footer.row.black', '.row').attr('data-index', currentPageStripeIndex);

				if (!currentPageStripe.length)
				{
					currentPageStripe = $('<div>').attr('data-index', 0).insertAfter(parameters.menu.parents('nav'));
					currentPageStripeIndex = selectedIndex = 0;
				}

				doc.one('AjaxLoadEnd', function()
				{
					var i = -1;
					while (++i < currentPageStripeIndex)
						currentPageStripe.eq(0).before(toBeAddedStripes[i]);

					i = totalStripes;
					while (--i > currentPageStripeIndex)
						currentPageStripe.eq(currentPageStripe.length - 1).after(toBeAddedStripes[i]);

					/* CREATE JQuery Obj of Stripes added */
					stripes = stripes.add(currentPageStripe);
					for (i = toBeAddedStripes.length; i--;)
					{
						stripes = stripes.add(toBeAddedStripes[i]);
					}
					/* CHECK NEW FUNCTIONALITY */
					$('body').removeClass("ajaxLoading");
					initExternalLibrary();
					$(document).trigger("loadingViewportImages");

					if (selectedIndex != 0)
					{
						mainheader.el.triggerHandler('slideUpMenu',
						{
							time: 0
						});
						mainheader.height = mainheader.el.outerHeight(true);
						elementToScroll = currentPageStripe;
						var ObjectTop = elementToScroll.offset().top;
						moveNavSlider(0, selectedIndex, selectedMenuItem);
						scrollTo(ObjectTop);
					}

					canScroll = true;
					// check if there is some pending scrollTo
					if (urlToGo !== undefined)
					{
						mainheader.el.triggerHandler('slideUpMenu',
						{
							time: 0
						});
						mainheader.height = mainheader.el.outerHeight(true);
						elementToScroll = stripes.filter('[data-index="' + findStripeIndex(urlToGo) + '"]');
						var ObjectTop = elementToScroll.offset().top;
						scrollTo(ObjectTop);
					}
				});

				parameters.menu.on("click machineClick", function(event)
				{
					var selectedEl = $(this);
					event.preventDefault();

					if (event.type == "machineClick")
						canScroll = false;
					else
					{
						canScroll = true;
					}
					History.pushState(null, Modernizr.history ? $(this).attr('data-title') : null, this.href);
					$(document).trigger("pushState");
					/*if($(this).hasClass('selected')){
						var index = findStripeIndex(this.href);
						elementToScroll = stripes.filter('[data-index="' + index + '"]');
						ObjectTop = elementToScroll.offset().top;
						scrollTo(ObjectTop);
					}*/
				});
				stickSecondNav();

				$(window).on('scroll', function()
				{
					clearTimeout(menuSliderTimer);
					if (isHumanScrolling)
					{
						menuSliderTimer = setTimeout(function()
						{
							checkScrollerPosition();
						}, (menuDone.state() == "resolved") ? 200 : 1000);
					}
					if (mainheader.el.offset().top + mainheader.el.height() >= secondnav.offsetTop)
						scrollDone.resolve();
					else
					{
						secondnav.placeholder.height(0);
						secondnav.el.removeClass('compact');
						scrollDone = $.Deferred();
						stickSecondNav();
					}
					/*elementToScroll = stripes.filter('[data-index="' + findStripeIndex(secondnav.el.find('a.selected').attr('href')) + '"]');
					var ObjectTop = elementToScroll.offset().top;
					scrollTo(ObjectTop,0);*/
				})
					.on("resize", function()
				{
					parameters.menu.find("selected").removeClass("selected");
					parameters.menu.eq(0).addClass("selected");
					checkScrollerPosition();
				});

				doc.on('slideUpMenuComplete', function()
				{
					menuDone.resolve();
				})
					.on('slideDownMenuComplete', function()
				{
					menuDone = $.Deferred();
					stickSecondNav();
				});

				parameters.menu.not(":eq(" + selectedIndex + ")").each(function()
				{
					var index = parameters.menu.index($(this));
					jQuery.ajax(
					{
						url: isStage ? this.href : this.href + "?wpzone=ContentZone", // TODO: remove comment when in production: it only receives the needed part (see next comment)
						dataType: "html",
						success: function(data)
						{
							var title = $.trim(data.toString().substring(data.toString().indexOf("<title", 0) + 7, data.toString().indexOf("</title", 0)));
							parameters.menu.eq(index).attr('data-title',title);
							if (isStage)
								toBeAddedStripes[index] = $(data).find("[data-index]").attr('data-index', index); // NOTE: STAGE VERSION
							else
								toBeAddedStripes[index] = $(data).find(".row").not('.row .row').not('footer').attr('data-index', index); // NOTE: PROD VERSION
							if (!toBeAddedStripes[index].length) toBeAddedStripes[index] = $('<div>').attr('data-index', index);
							if (++totalStripes == parameters.menu.length) doc.trigger('AjaxLoadEnd');
						},
						error: function()
						{
							parameters.menu.eq(index).addClass('notWorking').off().on('click', function()
							{
								return false;
							});
							if (++totalStripes == parameters.menu.length) doc.trigger('AjaxLoadEnd');
						},
						timeout: 30000
					});
				});

				History.Adapter.bind(window, Modernizr.history ? 'statechange' : 'hashchange', // pops the previously pushed url and scrolls to the related stripe

				function()
				{
					var url = location.href.replace("./", "").replace("#", ""),
						ObjectTop;
					if (canScroll) // if all ajax is loaded scrollTo
					{
						var index = findStripeIndex(url);
						if (!mainheader.el.hasClass('compact'))
						{
							mainheader.el.triggerHandler('slideUpMenu',
							{
								time: 0
							});
							mainheader.height = mainheader.el.outerHeight(true);
						}
						if (index)
						{
							elementToScroll = stripes.filter('[data-index="' + index + '"]');
							ObjectTop = elementToScroll.offset().top;
						}
						else
						{
							elementToScroll = mainheader.placeholder;
							ObjectTop = 0;
						}
						scrollTo(ObjectTop); // TODO: This is automatically performed immediately by HTML5 history. It does when the only change is scrolling
						moveNavSlider(parameters.menu.index(parameters.menu.filter('.selected').removeClass('selected')), index, parameters.menu.eq(index).addClass("selected"));
					}
					else
					{ // else save where to scroll after all ajax loaded
						urlToGo = url;
					}
				});

				/* Return the index of the slides linked to the requested URL: returns null if the URL not found. */
				var findStripeIndex = function(url)
				{
					var index = parameters.menu.length,
						found = false,
						itemUrl;
					url = url.replace(/\?(.*$)/, ''); // removes GET parameters
					if (url.charAt(url.length - 1) != "/") url += "/";
					while (!found && index--)
					{
						itemUrl = url.charAt(parameters.menu.get(index).href.length - 1) != "/" ? parameters.menu.get(index).href + "/" : parameters.menu.get(index).href;
						found = (itemUrl == url);
					}
					if (found) return index;
					return null;
				},

					moveNavSlider = function(oldIndex, newIndex, targetElement)
					{
						checkMenuTitlePosition(oldIndex, newIndex);
						if ($.trim(targetElement.text()) == "") newIndex = 0;
						targetElement = targetElement.parent();
						var first = { left: targetElement.position().left },
							second = { right: targetElement.parent().width() - (targetElement.position().left + targetElement.outerWidth(true)) };
						if (newIndex != 0)
						{
							if (oldIndex != 0)
							{
								if (oldIndex < newIndex)
								{
									var temp = second;
									second = first;
									first = temp;
								}
								TweenMax.to(secondnav.placeholderSelected.show(), 0.15,
								{
									css: first,
									ease: Power2.easeInOut,
									onComplete: function()
									{
										TweenMax.to(secondnav.placeholderSelected, 0.15,
										{
											css: second,
											ease: Power2.easeInOut
										});
									}
								});
							}
							else
								secondnav.placeholderSelected.css(
								{
									left: targetElement.position().left,
									right: targetElement.parent().width() - (targetElement.position().left + targetElement.outerWidth(true))
								}).show(200);
						}
						else
							secondnav.placeholderSelected.slideUp(200);
					},

					checkScrollerPosition = function()
					{
						var currentIndex = parameters.menu.index(parameters.menu.filter('.selected')),
							newIndex = currentIndex,
							secondNavBottom = secondnav.el.offset().top + secondnav.el.height();
						if (!stripes.length) return false;
						if (secondNavBottom > stripes.filter('[data-index="' + currentIndex + '"]').offset().top) // if menu bottom is lower than currently selected (in menu) slide
						{
							if ((newIndex++ < parameters.menu.length) && (secondNavBottom > stripes.filter('[data-index="' + newIndex + '"]').offset().top)) // It may be one of the next slides (after the beginning of the next one)
							{
								do
									newIndex++;
								while ((newIndex < parameters.menu.length) && (secondNavBottom > stripes.filter('[data-index="' + newIndex + '"]').offset().top));
								moveNavSlider(currentIndex, --newIndex, parameters.menu.removeClass("selected").eq(newIndex).addClass("selected").trigger('machineClick'));
							}
						}
						else // otherwise, it must be one of the previous
						{
							if (currentIndex)
							{
								do
									newIndex--;
								while (newIndex && (secondNavBottom <= stripes.filter('[data-index="' + newIndex + '"]').offset().top));
								moveNavSlider(currentIndex, newIndex, parameters.menu.removeClass("selected").eq(newIndex).addClass("selected").trigger('machineClick'));
							}
						}
					};
			},

			stickSecondNav = function()
			{
				$.when(scrollDone, menuDone).done(function()
				{
					secondnav.placeholder.height(secondnav.height);
					TweenMax.fromTo(secondnav.el.addClass('compact'),
						0.3,
					{
						css:
						{
							height: 0
						}
					},
					{
						css:
						{
							height: secondnav.height
						}
					});
				});
			},

			checkMenuTitlePosition = function(oldIndex, newIndex)
			{
				if (oldIndex === 0 && newIndex !== 0)
					secondnav.title.animate(
					{
						left: mainheader.logoOffset - secondnav.titleOffset
					}, 150).find('a').addClass('arrow-up-black');
				else if (oldIndex !== 0 && newIndex === 0)
				{
					secondnav.title.delay(600).animate(
					{
						left: 0
					},
					150).find('a').removeClass('arrow-up-black');
				}
			},

			scrollTo = function(where, time)
			{
				/* where is the vertical position to be scrolled to.
				time is total transition time.
				If time is undefined or <= 0, an immediate set is performed
				*/
				isHumanScrolling = false;
				if (time === undefined)
					time = 0.6 + (Math.abs(where - doc.scrollTop()) / 5000);
				var speed = Math.abs(where - doc.scrollTop()) / time;
				if (where !== undefined && !isNaN(where))
				{
					if (!isNaN(time) && time > 0)
					{
						TweenMax.to(window, time,
						{
							scrollTo:
							{
								y: where - (where ? mainheader.height + secondnav.height : 0)
							},
							ease: Linear.easeNone,
							onComplete: function()
							{ // TODO: da rivedere: questo elementToScroll "arriva dal nulla"; sarebbe meglio passarlo direttamente come parametro
								if (elementToScroll !== null && Math.abs((elementToScroll.offset().top - mainheader.height - secondnav.height) - doc.scrollTop()) > 5)
								{
									scrollTo(elementToScroll.offset().top, Math.abs(elementToScroll.offset().top - doc.scrollTop()) / speed);
									//elementToScroll = null;
								}
								else
								{
									if (!$(window).scrollTop())
										isHumanScrolling = true;
									else
										TweenMax.delayedCall(0.001, function()
										{
											isHumanScrolling = true;
										});
								}

							}
						});
					}
					else
					{
						TweenMax.set(window,
						{
							scrollTo:
							{
								y: where - (where ? mainheader.height + secondnav.height : 0)
							},
							onComplete: function()
							{
								if (elementToScroll !== null && (elementToScroll.offset().top - mainheader.height - secondnav.height) != doc.scrollTop())
								{
									scrollTo(elementToScroll.offset().top);
									elementToScroll = null;
								}
								else
								{
									isHumanScrolling = true;
								}
							}
						});
					}
				}
			};

		return {
			init: init
		};
	};
});