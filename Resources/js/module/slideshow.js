define([
		'jquery',
		'TweenMax'
	],

	function($, TweenMax)
	{
		/* SLIDESHOW @CSS CLASS cover-slideshow */
		var Slideshow = function()
		{
			var slideshowMask = null,
				slideshowContainer = null,
				slideContainers = null,
				slideContents = null,
				tot = null,
				maxDotsToShow = 10,
				perPage = null,
				auto = null,
				continuous = null,
				position = null,
				delay = null,
				goReversed = null,
				_this = null,
				muteButton = null,
				goingAutoTimer = null,
				isStopped = false,
				controls = null,
				arrows = null,
				slidingType = null,
				video = {
					exists: 0,
					isHtml5: true,
					slideContents: null,
					isPlaying: false,
					autoplay: false
				},
				YTVideo = {
					exists: 0,
					playerFactory: null,
					activePlayer: null,
					slideContents: null,
					isPlaying: false,
					autoplay: false
				},
				vimeo = {
					isPlaying: false,
					obj: null,
					slideContents: null,
					exists: 0,
					player: null,
					autoplay: false
				},
				animations = {
					exists: 0,
					list: [],
					isPlaying: false
				},
				moveReversed = false,
				direction = null,
				isHover = false,
				stopOnHover = false,
				enabledMove = {
					immediate: false,
					global: false,
					isChanged: true
				},
				userOptions = {},
				clickEvent = 'click',
				//initialize var based on default value or user userOptions
				init = function(options)
				{
					userOptions = options || userOptions;
					slideshowMask = userOptions.slideshowMask.addClass('libraryLoaded');
					slideshowContainer = userOptions.slideshowContainer || slideshowMask.children('.slideshow-content').eq(0);

					slideContainers = userOptions.slideContainers || slideshowContainer.children().addClass('elemContainer');

					if((slideContents = userOptions.slideContents) === undefined)
					{
						slideContents = $();
						slideContainers.each(function(){
							var el = $(this).find('> video, > .YTVideo, > .vimeo, > img, > .animation, > .element');
							if(el.length)
								slideContents = slideContents.add(el);
							else
								slideContents = slideContents.add($(this));
						});
					}
					tot = 0;
					auto = userOptions.auto || false; //default true if there is more than one item
					//auto = slideshowMask.parent().is('.main_canvas') ? true : false;
					//console.log(slideshowMask.parent().is('.main_canvas'))
					continuous = userOptions.continuous || false;
					continuous = false;
					position = userOptions.startAt || 0;
					delay = userOptions.delay || 6000; //default delay of sliding is 5s
					goReversed = userOptions.goReversed || false; //return one by one in reversed order
					slidingType = userOptions.slidingType || null;
					stopOnHover = userOptions.stopOnHover || false;
					swipeEnabled = (userOptions.swipe !== undefined ? userOptions.swipe : (isMobile || isTablet !== undefined ? (isMobile || isTablet) : false));
					_this = userOptions.slideshowIstance;
					//isLightBox = slideshowMask.parents().is('.lightBox') ? true : false,
					slideshowMask.addClass('slideshow-loading').data('bitSlideshow',_this);
					slideContainers.addClass('lazyLoading');
					slideshowMask.on('afterShow',function(){
						var pos,
							isMonoPage = slideshowContainer.css('white-space');
						if(slideContainers.length < slideContents.length || isMonoPage == "normal")
							pos = slideContainers.last().position().left + slideContents.last().position().left;
						else
							pos = Math.round(slideContainers.eq(slideContainers.length > 1 ? 1 : 0).position().left)*(slideContainers.length-1);
						pos = Math.round(pos)/slideshowMask.width();
						var newTot = Math.round(pos);
						if(pos % 1 < 0.5) newTot++;
						/*console.log('slideContainers', slideContainers)
						console.log("slideContents left",slideContents.last().position().left)
						console.log("slideContainers left",slideContainers.last().position().left)
						console.log("slideshowMask width", slideshowMask.width())
						console.log("newTot",newTot, tot)*/
						if (newTot !== tot)
						{
							/*console.log('changed','oldTot',tot,'newTot',newTot)*/
							position = Math.min(userOptions.startAt,newTot) || 0;
							if(position==0)
								slideshowContainer.css('left',0);
							tot = isNaN(newTot) ? 1 : newTot;
							perPage = Math.ceil(slideContainers.length/tot);
							setup();
						}
					});
					var resizeTimeout;
					$(window).on("resize",function(){
						//console.log('resize')
						clearTimeout(resizeTimeout);
						resizeTimeout = setTimeout(function(){
							//console.log('resizeDone')
							slideshowMask.trigger('afterShow');
						},200);
					}).trigger('resize');
					checkVideo();
				},

				setup = function()
				{
					//lazyLoading(0,1);
					createControls();
					addEventListener();
					goTo(0);
					slideshowMask.removeClass('slideshow-loading');

				},

				lazyLoading = function(pageStart,pageEnd)
				{
					//console.log(slideContainers.filter('.lazyLoading').length)
					if(!slideContainers.filter('.lazyLoading').length) return;
					//console.log('lazyLoading')
					var sliced = sliceSlide(slideContainers, pageStart).filter('.lazyLoading').removeClass('lazyLoading');
					_BitLL.showImages(sliced);
				},
				sliceSlide = function(list,paramStart,paramEnd,paramFilter)
				{
					var start = (position+(paramStart || 0))*perPage,
						end = (position+(paramEnd || paramStart || 0)+1)*perPage,
						sliced = list.slice(start,end);
					if(paramFilter)
						sliced = sliced.filter(paramFilter);
					return sliced;
				},
				createControls = function(type)
				{
					if(controls ==null)
					{
						if (userOptions.consoleContainer instanceof jQuery || typeof(userOptions.consoleContainer) === "string")
						{
							controls = userOptions.consoleContainer;
						}
						else if (userOptions.consoleContainer !== false) // Se manca e non è esplicitamente false lo costruisco
						{
							html = '<div class="bottom-tape"><div><ul class="slideshow-console">';
							html += '</ul></div></div>';

							controls = $(html).appendTo(slideshowMask);

							if(userOptions.pagination == "numPagination") {
								slideshowMask.find(".bottom-tape").addClass("numPagination");
							}

						}
					}
					controls.hide();
					var dots = "";
					for (var i = tot; i--;)
						dots += i != (tot - 1) ? '<li><span>'+(tot-i)+'</span></li>' : '<li class="selected"><span>'+(tot-i)+'</span></li>';

					controls.find('ul').html(dots);
					//console.log(tot)
					//console.log(maxDotsToShow)
					if(tot>maxDotsToShow){
						slideshowMask.find(".bottom-tape").addClass("numPagination");
						var cloned_dot = slideshowMask.find(".bottom-tape").find('li:last-child').clone().addClass('cloned-dot');
						//console.log('cloned_dot = ', cloned_dot);
						$('.slideshow-console').append(cloned_dot);
					}
					if(tot>1)
						controls.fadeIn();

					if(arrows == null)
					{
						//se è esplicitamente true allora le costruisco
						if(userOptions.arrow === true)
						{
							//console.log('#############',$(controls))
							$(controls).find("ul").before('<div class="arrows arrow-left a-left"></div>');
							$(controls).find("ul").after('<div class="arrows arrow-right a-right"></div>');
							arrows = $(controls).find(".arrows");
						}
						//se non è false, undefined, null o ""
						else if(userOptions.arrow)
							arrows = $(userOptions.arrow);
					}
					checkArrows();
				},

				checkVideo = function()
				{
					video.autoplay = YTVideo.autoplay = vimeo.autoplay = (isMobile || isTablet) ? true : (userOptions.autoPlayVideo || false);

					if ((video.exists = slideContents.filter('video').length)) //checks and sets video.exists variable if videos exist in slideshow
					{
						createMuteButton(userOptions.audioOn ? '' : 'noVol');
						initVideo();
					}

					if ((YTVideo.exists = slideContents.filter('.YTVideo').length)) //checks and sets YTVideo.exists variable if any anchors liniing Youtube videos exist in slideshow
					{
						createMuteButton(userOptions.audioOn ? '' : 'noVol');
						initYTVideo();
					}

					if ((vimeo.exists = slideContents.filter('.vimeo').length)) //checks and sets YTVideo.exists variable if any anchors liniing Youtube videos exist in slideshow
					{
						createMuteButton(userOptions.audioOn ? '' : 'noVol');
						initVimeo();
					}

					if ((animations.exists = slideContents.filter('.animation').length)) //checks and sets video.exists variable if videos exist in slideshow
						initAnimations();
				},

				addEventListener = function()
				{
					if(controls!==null)
						controls.off('.bitSlideshow');
					if(arrows !== null)
						arrows.off('.bitSlideshow');
					slideshowContainer.off('.bitSlideshow');
					slideshowMask.off('.bitSlideshow');
					//console.log('addEventListener',controls)
					if (controls !== null)
					{
						controls.on('click.bitSlideshow', 'li', function(e)
						{
							e.preventDefault();
							if (!$(this).hasClass('selected'))
							{
								position = $(this).index();
								goTo();
							}
						});
						controls.on('change.bitSlideshow', function(e) {
							position = $(this).find("option:selected").index();
							goTo();
						});
					}
					if (arrows !== null)
					{
						arrows.on('click.bitSlideshow',
							function(e)
							{
								//console.log(e)
								e.preventDefault();
								if ($(this).hasClass('arrow-right'))
								{
									position = position + 1 >= tot ? 0 : position + 1;
									direction = "forward";
								}
								else
								{
									position = position - 1 < 0 ? tot - 1 : position - 1;
									direction = "backward";
								}
								goTo();
							});
					}
					slideshowContainer.on('stopSlideshow.bitSlideshow',
						function()
						{
							stop();
						})
						.on('startSlideshow.bitSlideshow',
							function()
							{
								restart();
							});

					if (auto && stopOnHover)
					{
						var startTime = 0;
						slideshowMask
							.on('mouseenter.bitSlideshow',
								function()
								{
									startTime = new Date().getTime();
									//console.log('hoverStop');
									isHover = true;
									stop(true);
								})
							.on('mouseleave.bitSlideshow',
								function()
								{
									var endTime = new Date().getTime() - startTime;
									//console.log('hoverRestart',delay-endTime);
									isHover = false;
									if (endTime > delay)
										restart(2000);
									else
										restart(delay - endTime);
								});
					}
					if(swipeEnabled && tot>1)
						slideshowContainer.on('mousedown.bitSlideshow touchstart.bitSlideshow',function(e){

							if(!$(e.target).is('a,.playButton'))
							{
								//e.preventDefault();
								e.stopPropagation();
								//e.stopImmediatePropagation();


								enabledMove.immediate = true;
								enabledMove.global = false;
								enabledMove.x = e.pageX || e.originalEvent.targetTouches[0].pageX;
								enabledMove.y = e.pageY || e.originalEvent.targetTouches[0].pageY;
								enabledMove.isChanged = false;
								enabledMove.delta = 0;
								//return false;
							}
						}).on('mousemove.bitSlideshow touchmove.bitSlideshow',function(e){
							if(enabledMove.immediate){
								var innerMove = {x: (e.pageX || e.originalEvent.targetTouches[0].pageX), y: (e.pageY || e.originalEvent.targetTouches[0].pageY)},
									containerOffset = slideshowContainer.offsetParent().offset(),
									xDiff = Math.abs(enabledMove.x - innerMove.x),
									yDiff = Math.abs(enabledMove.y - innerMove.y) ;

								enabledMove.isVertical = false;
								if(yDiff > xDiff)
								{
									enabledMove.isVertical = true;
									return;
								}

								e.preventDefault();
								e.stopPropagation();
								e.stopImmediatePropagation();

								if(xDiff> 10 && !enabledMove.global)
								{
									enabledMove.global = true;
									enabledMove.delta = 0;
								}
								else if(enabledMove.global)
								{
									stop(true);
									var delta = (enabledMove.x-innerMove.x), pos = continuous ? position+1 : position;
									if(delta>0) direction = 'forward'; else direction = 'backward';
									enabledMove.delta = delta*100/slideshowContainer.width();
									slideshowContainer.css('left',-((100*pos)+enabledMove.delta)+'%');

								}
							}
							return false;
						}).on('mouseout.bitSlideshow',function(e){

							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
							enabledMove.immediate = false;
							goTo();
						}).on('mouseup.bitSlideshow touchend.bitSlideshow',function(e){
							if(enabledMove.immediate){
								e.preventDefault();
								e.stopPropagation();
								e.stopImmediatePropagation();
								enabledMove.immediate = false;
								if(Math.abs(enabledMove.delta)>20)
								{
									if(direction == 'forward')
										position++;
									else if(direction == 'backward')
										position--;
									enabledMove.isChanged =true;
									if(!continuous)
									{
										if(position < 0)
										{
											position=0;
											enabledMove.isChanged=false;
										}
										if(position >= tot)
										{
											position=tot-1;
											enabledMove.isChanged=false;
										}
									}
									goTo();
									return false;
								}
								else if(enabledMove.global)
								{
									goTo();
									return false;
								}

								/*setTimeout(function(){enabledMove.global = false;},250);*/

								var tgt = $(e.target).closest('a').not('.YTVideo, .vimeo');

								setTimeout(function(){
									enabledMove.global = false;
									if(tgt.length && !enabledMove.isVertical && !tgt.closest('.YTVideo').length && !tgt.closest('.vimeo').length)
									{
										if(tgt.attr('target') == "_blank")
											window.open(tgt.attr('href'));
										else
											location.href = tgt.attr('href');
									}
										
								},250);

								return false;
							}
						});
				},
				checkArrows = function()
				{
					//console.log("arrows",arrows)
					if (arrows !== null && !continuous)
					{
						position > 0 ? arrows.first().css('visibility', 'visible') : arrows.first().css('visibility', 'hidden');
						position === tot - 1 ? arrows.last().css('visibility', 'hidden') : arrows.last().css('visibility', 'visible');
					}
					else if (arrows !== null && continuous)
					{
						arrows.css('visibility', 'visible');
					}
				},
				goTo = function(customDelay)
				{
					//console.log('goTo')
					if(!isMobile && slideshowContainer.parents('.lightBox').length) {
						slideImg = slideContainers.eq(position).find('img');
						//slideImg.hide();
					}
					//lazyLoading(0,1);
					if (YTVideo.isPlaying)
						pauseYTvideo();
					else
					if (vimeo.isPlaying !== false)
						pauseVimeo();
					else
					if (video.isPlaying !== false)
						pauseVideo();
					else if (animations.isPlaying)
						pauseAnimation();
					stop(false);
					start(true, customDelay);
				},

				goToAutomatically = function(time)
				{
					//console.log('goToAutomatically');
					var newDelay = time !== undefined ? time : delay;
					clearTimeout(goingAutoTimer);
					goingAutoTimer = setTimeout(
						function()
						{
							start();
						},
						newDelay);
				},

				start = function(goDirectly, customDelay)
				{
					//console.log('start',position);
					if (muteButton != null) muteButton.hide();
					if (goDirectly === undefined)
						goDirectly = false;

					if (tot > 1)
					{
						if (auto && !isStopped && !goDirectly)
						{
							if (!moveReversed)
							{
								if (++position >= tot)
								{
									position = 0;
									if (continuous)
										slideshowContainer.css('left', 0);
								}
							}
							else if (--position < 0)
							{
								position = 0;
							}
							checkMoveReversed();
						}
						if (continuous)
							if ((direction == "forward" || direction === null) && position === 0)
								slideshowContainer.css('left', 0);
							else if (direction == "backward" && position == tot - 1)
								position = -1;
						checkArrows();

						//lazyLoading(1,2);

						if (slidingType === null)
						{
							var delta = -position * 100;
							delta = continuous ? delta - 100 : delta;
							if (controls !== null) controls.find('li').removeClass('selected').eq(position).addClass('selected');
							slideshowContainer.trigger('slideshowStart', [_this]);							
							if(slideshowMask.parent().is('.main_canvas'))
								customDelay = 0.8;
							if(slideshowMask.is('.no-animations') /*|| slideshowMask.is('.slideshow-hp') || slideshowMask.closest('.model-claim-canvas').length*/) {
								slideshowContainer.css('left',delta + '%');
								slideContainers.removeClass('selected').eq(position).addClass('selected');
								if (slideContainers.eq(position).hasClass("elem-video") && !video.autoplay)
									slideContainers.eq(position).find(".playButton").show();
								if (enabledMove.isChanged) afterAnimation();
							}
							else {
								TweenMax.to(slideshowContainer, customDelay !== undefined ? customDelay : 0.5,
								{
									css:
									{
										left: delta + '%'
									},
									onComplete: function()
									{
										slideContainers.removeClass('selected').eq(position).addClass('selected');
										if (slideContainers.eq(position).hasClass("elem-video") && !video.autoplay)
											slideContainers.eq(position).find(".playButton").show();
										if (enabledMove.isChanged) afterAnimation();
									}
								});
							}
						}
						else
							animationTypes[slidingType](_this);
					}
					else
					if (auto && !isStopped && tot === 1)
					{
						afterAnimation();
					}

					return _this;
				},

				stop = function(val)
				{
					//console.log('Stop ', val);
					var _this = this;
					isStopped = val === undefined ? true : val;
					clearTimeout(goingAutoTimer);
					return _this;
				},

				restart = function(afterSomeSeconds)
				{
					//console.log('Restart', afterSomeSeconds);
					if (!isHover)
					{					
						var _this = this;
						afterSomeSeconds = afterSomeSeconds === undefined ? 0 : afterSomeSeconds;
						stop(false);
						if (auto && !(animations.isPlaying || video.isPlaying || YTVideo.isPlaying || vimeo.isPlaying))
							goToAutomatically(afterSomeSeconds);					
					}
				},

				afterAnimation = function()
				{
					//console.log('afterAnimationr')
					if(!isMobile && slideshowContainer.parents('.lightBox').length) {
						var wrapper = slideshowContainer.closest('.lightBox-wrapper');
						slideImg = slideContainers.eq(position).find('img');
						if(slideImg.parent().is('.vimeo'))
							imgHeight = 480;
						else
							imgHeight = slideImg.outerHeight();
						imgWidth = slideImg.outerWidth();
						/*console.log(slideImg)
						console.log('height: '+ imgHeight + ', width: '+imgWidth)*/
						slideshowContainer.closest('.lightBox-content')
							.css({	//'height' : slideImg.outerHeight(true)+'px',
									'height' : imgHeight+slideImg.next('.download-bar').outerHeight()+'px'
									}
						);
						wrapper.css({
										'width' : imgWidth+'px'
									}
						);
						// lasciare separati i due wrapper.css, devono essere sequenziali
						wrapper.css({	'margin-top': wrapper.outerHeight()/2*-1,
										'margin-left': wrapper.outerWidth()/2*-1
									}
						);

						/*wrapper.css({	'height' : 'auto',
									//'width' : slideImg.outerWidth(true)+'px',
									'top': '50%',
									'left' : '50%'
								}
						);
						slideshowContainer.closest('.lightBox-content').animate({
							height: slideImg.outerHeight(true)+slideImg.next('.download-bar').outerHeight()+'px'
						}, 100);
						wrapper.animate({
							width: slideImg.outerWidth(true)+'px'
						}, 100, function() {
							wrapper.animate({
								marginTop: wrapper.outerHeight()/2*-1,
								marginLeft: wrapper.outerWidth()/2*-1
							});
						});*/
						slideImg.fadeIn();
					}

					slideshowContainer.trigger('slideshowEnd', [_this]);
					if (continuous && direction == "backward" && position === -1)
					{
						position = tot - 1;
						slideshowContainer.css('left', -tot * 100 + '%');
					}

					removeAnimation();

					if (YTVideo.isPlaying)
						removeYTVideo();
					else
					if (vimeo.isPlaying)
						removeVimeo();

					var sliced = sliceSlide(slideContents);
					if (sliced.filter('video').length)
						playVideo();
					else
					if (sliced.filter('.animation').length)
					{
						muteButton !== null ? muteButton.hide() : null;
						playAnimation();
					}
					else
					if (sliced.filter('.YTVideo').length)
					{
						sliced.filter('.YTVideo').each(function(){
							playYTVideo($(this).hasClass('autoplay'),$(this));
						});
					}
					else
					if (sliced.filter('.vimeo').length)
						playVimeo(slideContents.eq(position).hasClass('autoplay'));
					else
					if (auto && !isStopped)
					{
						if (muteButton !== null) muteButton.hide();
						goToAutomatically();
					}
				},

				checkMoveReversed = function()
				{
					var _this = this;
					if (goReversed)
					{
						if (!(position + 1 >= tot) && !moveReversed)
						{
							//console.log('Normal direction');
							moveReversed = false;
						}
						else if (position - 1 < 0)
						{
							//console.log('Restart normal direction');
							moveReversed = false;
						}
						else
						{
							//console.log('Start reversed direction');
							moveReversed = true;
						}
					}
					return _this;
				},

				initVideo = function()
				{
					//console.log('initVideo');
					if (!document.createElement('video').canPlayType) // it tests whether browser supports HTML5 video
					{
						video.isHtml5 = false;
						video.slideContents = slideContents.find('object') || slideContents.find('embed');

						window.endCallback = function()
						{
							slideshowContainer.trigger('flashVideoEnd');
							return false;
						};

						window.getFlashMovieObject = function(movieName)
						{
							if (window.document[movieName])
								return window.document[movieName];
							if (navigator.appName.indexOf("Microsoft Internet") == -1)
								if (document.embeds && document.embeds[movieName]) return document.embeds[movieName];
							return document.getElementById(movieName);
						};

						window.playMyVideoInFlash = function(idParam)
						{
							var flashMovie = getFlashMovieObject(idParam);
							flashMovie.playMyVideo();
							//console.log('playMyVideoInFlash');
						};
						window.pauseMyVideoInFlash = function(idParam)
						{
							var flashMovie = getFlashMovieObject(idParam);
							flashMovie.pauseMyVideo();
							//console.log('pauseMyVideoInFlash');
						};

						window.muteMyVideoInFlash = function(idParam)
						{
							var flashMovie = getFlashMovieObject(idParam);
							try
							{
								flashMovie.audioOff();
							}
							catch (e)
							{}
							//console.log('muteMyVideoInFlash');
						};

						window.unMuteMyVideoInFlash = function(idParam)
						{
							var flashMovie = getFlashMovieObject(idParam);
							flashMovie.audioOn();
							//console.log('unmuteMyVideoInFlash');
						};

						window.endCallback = function()
						{
							//console.log('endCallbackFlash');
							slideshowContainer.trigger('flashVideoEnd');
						};

						window.clickFromFlash = function(cb)
						{
							eval('cb')();
						};

						window.flashReady = function()
						{
							slideshowContainer.trigger('flashReady');
						};
					}
					else
						video.slideContents = slideContents.filter('video');
					if (!video.autoplay)
					{
						video.slideContents.each(
							function()
							{
								$('<div class="playButton"></div>')
									.insertAfter($(this))
									.on(clickEvent,
										function(e)
										{
											if (video.isPlaying) {
												pauseVideo();
												$(".playButton").show()
											}
											else if (!enabledMove.global)
											{
												playVideo(true);
												$(this).hide();
											}
										});
							});
					}
					video.slideContents.each(
						function()
						{
							$('<div class="transparentCover"></div>').insertAfter($(this));
						});

					muteVideo(muteButton.hasClass('noVol'));
					//console.log('qui')
					if (slideContents.eq(0).is('video') && video.autoplay)
						playVideo();
				},

				pauseVideo = function()
				{
					//console.log(YTVideo.isPlaying);
					if (YTVideo.isPlaying)
						pauseYTvideo();
					else
					if (vimeo.isPlaying !== false)
						pauseVimeo();
					else
					if (video.isPlaying !== false)
						pauseHtmlVideo();
				},
				playVideo = function(forcePlay)
				{
					//console.log('playVideo')
					if (muteButton !== null)
						muteButton.show();
					if (video.isHtml5 && (forcePlay || video.autoplay))
					{
						video.isPlaying = true;
						video.position = position;
						stop(true);
						//console.log('playVideo Html5');
						slideContents.eq(position).off();
						slideContents.eq(position).on('ended',
							function()
							{
								//console.log('endVideo Html5');
								video.isPlaying = false;
								restart();
								$('.playButton').show();
							}).get(0).play();
						slideContents.eq(position).get(0).play();
					}
					else
					if (forcePlay || video.autoplay)
					{
						video.isPlaying = true;
						video.position = position;
						stop(true);
						//console.log('playVideo Flash');
						var flashElement = slideContents.eq(position).find('object') || slideContents.eq(position).find('embed');
						slideshowContainer.one('flashVideoEnd',

							function()
							{
								muteMyVideoInFlash(flashElement.attr('id'));
								muteButton.addClass('noVol');
								video.isPlaying = false;
								restart();
								$('.playButton').show();
							});
						playMyVideoInFlash(flashElement.attr('id'));
					}
					else
						restart(delay);
				},

				createMuteButton = function(audioOn)
				{
					if (muteButton === null)
					{
						muteButton = $('<div/>')
							.appendTo(slideshowMask)
							.hide()
							.addClass('mute ' + audioOn)
							.on(clickEvent,
								function()
								{
									$(this).toggleClass('noVol');
									muteVideo($(this).hasClass('noVol'));
								});
					}
				},

				muteVideo = function(isMuted)
				{
					if (YTVideo.exists && YTVideo.activePlayer !== null)
						isMuted ? YTVideo.activePlayer.mute() : YTVideo.activePlayer.unMute();
					else
					if (vimeo.exists && vimeo.player !== null)
						if (isMuted)
						{
							vimeo.player.api('getVolume', function(value)
							{
								vimeo.volume = value;
								vimeo.player.api('setVolume', 0);
							});
						}
						else
						{
							vimeo.player.api('setVolume', vimeo.volume === undefined ? 1 : vimeo.volume);
						}
					else
					if (video.exists && video.isHtml5)
						video.slideContents.prop('muted', isMuted ? true : false);
					else
					if (video.exists && !video.isHtml5)
					{
						video.slideContents.each(
							function()
							{
								isMuted ? muteMyVideoInFlash($(this).attr('id')) : unMuteMyVideoInFlash($(this).attr('id'));
							});
					}
				},

				pauseHtmlVideo = function()

				{
					//console.log('pauseHtmlVideo');
					if (muteButton !== null) muteButton.hide();
					if (video.isHtml5)
					{
						slideContents.eq(video.position).get(0).pause();
						//slideContents.eq(video.position).get(0).currentTime = 0;
					}
					else
					{
						var flashElement = slideContents.eq(video.position).find('object') || slideContents.eq(video.position).find('embed');
						pauseMyVideoInFlash(flashElement.attr('id'));
					}
					slideContents.eq(video.position).find('.playButton').show();
					video.isPlaying = false;
				},

				initYTVideo = function()
				{
					//console.log('initYTVideo');
					YTVideo.slideContents = slideContents.filter(".YTVideo");

					YTVideo.playerVars = { //Youtube Player variables
						controls:  userOptions.controls,
						autoplay: 1,
						fs: 1,
						iv_load_policy: 3,
						modestbranding: 1,
						rel: 0,
						showinfo: 0,
						wmode: "opaque"
					};
					//Add Html5 userOptions only if it can support it
					if (document.createElement('video').canPlayType)
						YTVideo.playerVars.html5 = 1;

					var onYTAPIGlobalReady = function(){};

					if (typeof(window['onYouTubeIframeAPIReady']) === "function")
				    	onYTAPIGlobalReady = window['onYouTubeIframeAPIReady'];

					var onYTAPILocalReady = function()
					{
						//console.log('onYouTubeIframeAPIReady');
						YTVideo.playerFactory = YT;
						YTVideo.slideContents.each(
							function()
							{
								var _this = $(this),
									anchor = $(this).find('a'),
									vidId = anchor.attr('href').replace(/(http:|https:)?\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w]*(?:['"][^<>]*>|<\/a>))[?=&+%\w-]*/ig, "$2"); // extracts the video ID from the anchor href
								$('<div class="transparentCover"></div>').insertAfter(anchor);
								$('<div class="playButton"></div>')
									.insertAfter(anchor)
									.on(clickEvent,
										function(e)
										{
											if (!enabledMove.global)
											{
												playYTVideo(true,_this);
												$(this).hide();
											}
										});
								if (anchor.attr('data-cover') !== undefined)
									anchor.replaceWith('<img class="imgToContainer" data-youtubeId="' + vidId + '" src="' + anchor.attr('data-cover') + '" />');
								else
									anchor.replaceWith('<img class="imgToContainer" data-youtubeId="' + vidId + '" src="http://i2.ytimg.com/vi/' + vidId + '/0.jpg" />');
								//anchor.attr('data-youtubeId', vidId);
							}).removeClass('loading');

						if (slideContents.eq(position).hasClass('YTVideo') && YTVideo.autoplay) // if we're looking at a YT video slide, its library has been loaded and we may show it.
							slideContents.eq(position).find('.playButton').trigger('click');
					};

					if (!window['YT'])
					{
						if(!$('.ytScriptLoaded').length)
						{
							var tag = document.createElement('script');
							tag.src = "https://www.youtube.com/iframe_api";
							tag.className = "ytScriptLoaded";
							var firstScriptTag = document.getElementsByTagName('script')[0];
							firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
						}
						window['onYouTubeIframeAPIReady'] = (function(oldCb, newCb)
							{
								return function()
								{
									oldCb();
									newCb();
								}
							})
						(onYTAPIGlobalReady, onYTAPILocalReady);
					}
					else
						onYTAPILocalReady();
				},

				playYTVideo = function(forcePlay,element)
				{
					//var element = slideContents.eq(position);
					//console.log('playYTVideo',element);
					if (YTVideo.playerFactory !== null && (forcePlay || YTVideo.autoplay) && !element.hasClass('loading'))
					{
						stop(true);
						if (muteButton !== null) muteButton.show();
						var currentElement = element.find("[data-youtubeId]"),
							vidId = currentElement.attr('data-youtubeId');

						element.find('.playButton').hide();
						if (document.createElement('video').canPlayType)
							element.addClass('loading');
						if (document.createElement('video').canPlayType) element.addClass('loading');
						if (YTVideo.activePlayer !== null && YTVideo.position !== undefined)
						{
							YTVideo.activePlayer.destroy();
						}
						YTVideo.position = slideContents.index(element);
						YTVideo.activePlayer = new YTVideo.playerFactory.Player(currentElement.get(0),
						{
							height: '100%',
							events:
							{
								onReady: function(event)
								{
									//console.log('onYTPlayerReady');
									YTVideo.isPlaying = true;
									var $video = YTVideo;
									var element = slideContents.eq(YTVideo.position).addClass('playing').removeClass('loading');
									muteVideo(muteButton.hasClass('noVol'));
									if (YTVideo.position == slideContents.index(element))
									{
										if(!(isMobile || isTablet)) YTVideo.activePlayer.playVideo();
									}
									else removeYTVideo();
								},
								onStateChange: function(event)
								{
									//console.log('onPlayerStateChange')
									if (event.data == YTVideo.playerFactory.PlayerState.ENDED)
									{
										removeYTVideo();
										restart();
									}
								}
							},
							playerVars: YTVideo.playerVars,
							videoId: vidId
						});
					}
					else
					{
						//console.log("restart playYTvideo");
						restart(delay);
					}
				},
				pauseYTvideo = function()
				{
					//console.log('pauseYTvideo')
					YTVideo.activePlayer.pauseVideo();
					slideContents.eq(YTVideo.position).find('.playButton').show();
				},
				removeYTVideo = function()
				{
					//console.log('removeYTVideo');
					if (YTVideo.isPlaying)
					{
						slideContents.eq(YTVideo.position).removeClass('playing').find('.playButton').show();
						YTVideo.activePlayer.stopVideo();
						YTVideo.activePlayer.destroy();
						YTVideo.activePlayer = null;
						YTVideo.isPlaying = false;
					}
				},

				initVimeo = function()
				{
					//console.log('initVimeo');
					require(['frogaLoop'],
						function()
						{
							if (slideContents.eq(position).hasClass('vimeo') && vimeo.autoplay) // if we're looking at a vimeo slide, its library has been loaded and we may show it.
								playVimeo();
						});

					vimeo.slideContents = slideContents.filter(".vimeo");

					vimeo.slideContents.each(
						function()
						{
							var _this = $(this),
								anchor = _this.find('a'),
								vidId = anchor.attr('href').replace(/(http:|https:)?\/\/vimeo\.com\/(.*)$/, "$2"); // extracts the video ID from the anchor href
							if (!vimeo.autoplay)
							{
								var img = $('<img class="imgToContainer" data-vimeoId="' + vidId + '" src="" />');
								if (anchor.attr('data-cover') !== undefined)
									img.attr({"src": anchor.attr('data-cover')});
								else
								{
									$.ajax("http://vimeo.com/api/v2/video/" + vidId + ".json",
									{
										dataType: "jsonp",
										success: function(data)
										{
											img.attr(
											{
												"src": data[0].thumbnail_large
											});
										},
										error: function()
										{
											// TODO: gestire errori
											/* lightbox.open(
												{
													width: 300,
													height: 250,
													position: "middle",
													title: labels.error,
													overwrite: true,
													HTMLContent: labels.connectionError
												}); */
										},
										timeout: 30000
									});
								}
								$('<div class="transparentCover"></div>').insertAfter(anchor);
								$('<div class="playButton"></div>')
									.insertAfter(anchor)
									.on(clickEvent,
										function(e)
										{
											if (!enabledMove.global)
											{
												playVimeo(true);
												$(this).hide();
											}
										});
								// TODO: NON mostrare i suggerimenti alla fine
								// TODO: il video, quando arriva in fondo, si ferma (e si passa alla slide sucessiva). Valutare cosa fare quando c'è solo una slide con un video.
								anchor.replaceWith(img);
							}
							else
								anchor.attr('data-vimeoId', vidId);
						}).removeClass('loading');

					/*if (slideContents.eq(position).hasClass('vimeo') && vimeo.autoplay) // if we're looking at a vimeo slide, its library has been loaded and we may show it.
				playVimeo();*/
				},

				playVimeo = function(forcePlay)
				{
					//console.log('playVimeo')
					if ((typeof($f) != "undefined") && (forcePlay || vimeo.autoplay))
					{
						stop(true);
						var currentElement = slideContents.eq(position).removeClass('loading').addClass('playing').find("[data-vimeoId]"),
							iframe = $('<iframe src="http://player.vimeo.com/video/' + currentElement.attr('data-vimeoId') + '?portrait=0&color=333&byline=0&title=0&api=1" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').get(0);

						if (muteButton !== null) muteButton.show();

						if (vimeo.player !== null && vimeo.position !== undefined)
						{
							$(vimeo.player.element).replacewith(vimeo.obj);
							vimeo.player = null;
							slideContents.eq(vimeo.position).addClass('loading'); // TODO: verificare se i loading vanno e vengono nel modo giusto
						}

						slideContents.eq(position).find('.playButton').hide();
						vimeo.obj = currentElement.replaceWith(iframe).get(0);
						vimeo.player = $f(iframe);
						vimeo.player.addEvent('ready',
							function()
							{
								vimeo.player.addEvent('finish',
									function()
									{
										setTimeout(
											function()
											{
												vimeo.player.api('unload');
												removeVimeo();
											},
											50);
									});
								vimeo.position = position;
								vimeo.isPlaying = true;
								muteVideo(muteButton.hasClass('noVol'));
								//if (vimeo.position == position)
								if(!(isMobile || isTablet))
									vimeo.player.api('play');
								//else removeYTVideo();
								// TODO: Occhio a che fine fa il pulsante play
							});
					}
					else
					{
						//console.log("restart playVimeo");
						restart(delay);
					}
				},

				pauseVimeo = function()
				{
					vimeo.player.api('pause');
					slideContents.eq(vimeo.position).find('.playButton').show();
				},

				removeVimeo = function()
				{
					//console.log('removeVimeo')
					if (vimeo.isPlaying)
					{
						slideContents.eq(vimeo.position).removeClass('playing').find('.playButton').show();
						vimeo.player.api('pause');
						$(vimeo.player.element).replaceWith(vimeo.obj);
						vimeo.player = null;
						vimeo.isPlaying = false;
					}
					restart();
				},

				initAnimations = function()
				{
					//console.log('initAnimations')
					slideContents.filter('.animation').each(
						function()
						{
							var tl = new TimelineMax(
							{
								onComplete: function(_thisTl)
								{
									slideshowContainer.trigger('endAnim');
								},
								paused: true
							});
							var myAnim = eval($(this).attr('id'));
							tl.add(myAnim($(this)));
							animations.list[slideContents.index($(this))] = {
								position: slideContents.index($(this)),
								timeline: tl
							};
						});
					slideshowContainer.on('endAnim', function(e, tl)
					{
						//console.log('endAnim')
						pauseAnimation();
						restart(1000);
					});
					if (slideContents.eq(0).hasClass('animation') && !continuous) playAnimation();
				},

				playAnimation = function()
				{
					//console.log('playAnimation')
					stop(true);
					animations.position = position;
					animations.isPlaying = true;
					animations.list[animations.position].timeline.play();
				},
				pauseAnimation = function()
				{
					//console.log('pauseAnimation')
					animations.list[animations.position].timeline.pause();
					animations.isPlaying = false;
				},
				removeAnimation = function()
				{
					//console.log('removeAnimation')
					if (animations.position !== undefined)
					{
						animations.list[animations.position].timeline.progress(0).pause();
						animations.isPlaying = false;
						animations.position = undefined;
					}
				};
			return {
				init: init,
				stop: stop,
				restart: restart,
				getTotal: function()
				{
					return tot;
				},
				getPosition: function()
				{
					return position;
				},
				goTo: function(_position, _customDelay)
				{
					position = _position;
					goTo(_customDelay);
				},
				getContainer: function()
				{
					return slideshowContainer;
				},
				getElements: function()
				{
					return slideContents;
				},
				muteVideo: muteVideo,
				pauseVideo : function()
				{
					return pauseVideo();
				}
			};
		};
		return Slideshow;
	});
