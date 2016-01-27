define(['jquery'], function ($)
{
	var BitLazyLoading = function ()
	{
		var h = window.innerHeight || document.documentElement.clientHeight;
		$(window).on('discreteResize', function(){
			h = window.innerHeight || document.documentElement.clientHeight;
		});
		function elementInViewport(el)
		{
			var rect = el.getBoundingClientRect();
			rect.visible = rect.top < h && rect.top > -rect.height;
			return rect;
		}
		/* LAZY LOADING */

		function showImages(container, animate)
		{
			//Prendo tutti i tag noscript
			var outOfView = 0,
				cont = container !== undefined ? $(container) : $(document),
				animate = animate !== undefined ? animate : true;
			$("noscript", cont).each(function (index, value)
			{
				value = $(value);
				if (isMobile || !value.parents(".slideshow-content,.lightBox-hidden-content,#main-header").length || container !== undefined)
				{
					if (value.parents('.rowBackground').length)
					{
						if (isMobile || elementInViewport(value.parent()[0]).visible || container !== undefined)
						{
							var bg = value.attr("data-src");
							value.parents('.rowBackground').css(
							{
								'background-image': 'url(' + bg + ')'
							});
							value.remove();
						}
						else outOfView++;
					} // Verifico che non siano figli di un slideshow
					else
					{
						//Se l'elemento è nella viewport mostro il contenuto
						if (isMobile || elementInViewport(value.parent()[0]).visible || container !== undefined)
						{
							var content = value.attr("data-content");

							if (content === undefined || content == "")
							{
								var DOMtype = value.attr("data-DOMtype");
								DOMtype = DOMtype ? DOMtype : "img";
								content = document.createElement(DOMtype);
								content.setAttribute("src", value.attr("data-src"));
								content.removeAttribute('height');
								content.removeAttribute('width');
								content.style.display = "none";
								content = $(content);

								for (var i = 0, attrs = value.get(0).attributes, l = attrs.length; i < l; i++)
								{
									if(attrs.item(i).value)
									{
										if(attrs.item(i).name=="data-src")
										{}
										else if(attrs.item(i).name=="data-w")
											content.attr('width', attrs.item(i).value);
										else if(attrs.item(i).name=="data-h")
											content.attr('height', attrs.item(i).value);
										else
											content.attr(attrs.item(i).name, attrs.item(i).value);
									}
								}
								content.addClass(this.className);
								if(this.id !== "")
									content.attr('id',this.id);
							}
							if(DOMtype !== "iframe")
							{
								content.on('load', function(){
									var content = $(this),
										time = animate ? 250 : 0;
									value.replaceWith(content);

									content.off('load').fadeIn(time,function(){
										if(content.filter('.reel').not('.libraryLoaded').length && !isTablet)
										{
											require(["jquery","../libs/jquery.reel.min.js"],function()
											{
												content.one('loaded', function(e) {
													$(e.target).parent().find('.libraryLoaded').removeClass('libraryLoaded');
													initExternalLibrary();
												});
											});
										}
									});
								});
							}
							else
							{
								content.show();
								value.replaceWith(content);
							}

							if (!Modernizr.rgba) // IE8 fallback/polyfill
							{
								content = $(content);
								if (content.filter("img").length || content.has("img"))
									content.parents(".row").eq(0).css("overflow", "hidden");
							}
						}
						else
							outOfView++;
					}
				}
			});
		}
		return {
			showImages: showImages
		}
	}
	window._BitLL = new BitLazyLoading();
	return BitLazyLoading;
});
