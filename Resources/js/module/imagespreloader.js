define(['jquery'],

	function($)
	{
		var ImagePreloader = function ()
		{
			function preload(list, target, loaderElement, avoidTimeout)
			{
				if (!Array.prototype.indexOf)
				{
					Array.prototype.indexOf = function(obj, start)
					{
						for (var i = (start || 0), j = this.length; i < j; i++)
						{
							if (this[i] === obj)
							{
								return i;
							}
						}
						return -1;
					};
				}
				var loader = loaderElement,
				tot = list.length,
				counter = 0,
				timer=null;
				if(tot==0 || (tot==1 && (list.indexOf("")!=-1 || list.indexOf(undefined)!=-1 || list.indexOf(null)!=-1)))
				{
					loader == undefined ? null : loader.removeClass('loading');
					var event = jQuery.Event('allImagesLoaded');
					event.sources = list;
					target == null && target == undefined ? null : target.trigger(event).off('allImagesLoaded');
					return list;
				}
				avoidTimeout== null ||avoidTimeout==undefined?avoidTimeout=false:null;
				loader == undefined ? null : loader.addClass('loading');

				// setNewSrc = false,
				timer =	setTimeout(function()
				{
					clearTimeout(timer);
					if(counter!=tot && avoidTimeout==false)
					{
						loader == undefined ? null : loader.removeClass('loading');

						var event = jQuery.Event('allImagesLoaded');
						event.sources = list;
						target == null && target == undefined ? null : target.trigger(event).off('allImagesLoaded');
					}
				},1000*tot);

				if(list.jquery)
				{
					setNewSrc = true;
					var listBk = [];
					list.each(function()
					{
						listBk.push(this.src);
					});
					list = listBk;
				}

				var cache = [];

				for(path in list)
				{
					var newPath = list[path]+'?'+Math.random()*999999;
					list[path] = newPath;
					jQuery('<img/>')
					.css( {'width':'auto'})
					.attr('src', newPath)
					.load(function()
					{
						cache.push(jQuery(this));
						counter++;
						jQuery(this).width();
						jQuery(this).height();
						if(counter==tot && timer!=undefined)
						{
							clearTimeout(timer);
							timer = undefined;
							loader == undefined ? null : loader.removeClass('loading');
								//console.log('all images loaded');
								var event = jQuery.Event('allImagesLoaded');
								event.sources = list;
								target == null && target == undefined ? null : target.trigger(event).off('allImagesLoaded');
							}
						});
				}
				return list;
			}

			return {
				preload : preload
			}
		}
		return ImagePreloader;
	});