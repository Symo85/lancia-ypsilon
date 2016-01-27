define(['jquery', 'Validate', 'TweenMax', 'TweenMaxScrollTo'],
	function($) {
		jQuery.validator.addMethod("onlyChar",
			function(value, element) {
				var path = /[0-9]/,
					res = path.exec(value);

				if (res == null || res == undefined)
					return true;
				return false;
			});
		jQuery.validator.addMethod("noSpecialChars",
			function(value, element) {
				var path = /^[^|!¡?¿"“£$€¥%&()=^*[\]\/+{}§°#@_:;<>\\]+$/,
					res = path.exec(value);

				if (res == null || res == undefined)
					return false;
				return true;
			});
		jQuery.validator.addMethod("anyDate",
			function(value, element) {
        		return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);
			});
		jQuery.validator.addMethod('decimal', function(value, element) {
			return this.optional(element) || /^[0-9,]+(\.\d{0,3})?$/.test(value); 
		});
		jQuery.validator.addMethod("isChecked",
			function(value, element) {
				if (agce_cv == 'cv' && !$(element).closest('.elemForm').is('.checked'))
					return false;
				return true;
			});
		
		/*$('.send[onclick]').addClass('notSend').each(function(){
			$(this).data('onclick', this.onclick);
			this.onclick = function(event) {
				if($(this).is('.notSend')) {
					return false;
				}
				$(this).addClass('notSend').data('onclick').call(this, event || window.event);
			};
		});*/
		
		// default messages
		//$.validator.messages.required = 'Campo necessario';

		return FormManager = function() {
			var formData = {
				type: "",
				obj: null,
				submitted: false
			},
				endpointUrl = null,
				formLabels = {},
				flowManagerObj = undefined,
				successObj = null,
				successObjParentSelector = null,
				btnName = "";

			// END REGOLE GENERALI

			function init(option) {
				if (option.validationFunctions !== undefined)
					for (var index in option.validationFunctions)
						jQuery.validator.addMethod(index, option.validationFunctions[index]);

				formData.type = option.type;

				successObjParentSelector = option.successObjParentSelector;
				formLabels = option.formLabels;

				formData.obj = $("." + formData.type + " .form-container").length ? $("." + formData.type + " .form-container") : $("." + formData.type + ".form-container");

				endpointUrl = formData.obj.find("input[name='form_url_endpoint']").val();
				if (endpointUrl === undefined || endpointUrl == "#" || endpointUrl == "")
					endpointUrl = ((isLocal || isOrigin || isAuth) ? option.endpointUrlGold : option.endpointUrlProd);
				if(formLabels != undefined) //samanta
					formLabels.endpointUrl = endpointUrl;

				formData.obj.addClass("myForm").validate({
					ignore: "not:hidden, .validation-disabled, .usage-container.hidden *, .user-agce .CV_ONLY *, .user-cv .AGCE_ONLY *",
					rules: option.rules || {},
					messages: option.validationMessages,
					errorPlacement: function(error, element) {
						if (element.is("input:radio") || element.is("input:checkbox"))
							element.parents('.elemForm').after(error);
						else
							error.appendTo(element.parent());
						//console.log(element.parent())
					},
					invalidHandler: function(form, validator) {
						var errors = validator.numberOfInvalids(),
							form = $form;
						//console.log($form)
						//$form.find('.send').addClass('notSend');
						scrollToError($form);
						return false;
					},
					submitHandler: function(form) {
						form = $form;
						if(form.find('.send').is('.openIframe')) {
							(window.addEventListener && window.addEventListener('message', receiveMessage, false) // FF,SA,CH,OP,IE9+
      						|| window.attachEvent && window.attachEvent('onmessage', receiveMessage));
							$('#fClone').remove();
							var $container = /*isSharepoint() ? $($("form")[0]) : */$("#wrapper"),
								newForm = $("<form id='fClone' method='post' target='my_frame' action='http://javastg.bitmama.it/temp_/testQPS.php'></form>");
							form.find('.block-form').each(function() {
								newForm.append($(this).clone());
							});
							newForm.hide().append("<input type='submit' />");
							$container.hide().after(newForm);
							$('iframe').show();
							newForm.submit();
						}
						else {
							if(form.find('.send').is('.submitCallback')) {
								submitCallback();
							}
							else {
								if(isOrigin || isLocal) {
									alert('submit');
								}
								else {
									form.find(':disabled').removeAttr('disabled').addClass('toDisable');
									$("#aspnetForm").submit();
									form.find('.toDisable').attr('disabled', 'disabled').removeClass('.toDisable');
								}
									
							}
						}
					}
				});
				
				function receiveMessage(event) {
					console.log(event.data)
					/*if(event.origin == "http://javastg.bitmama.it")
				  		console.log(event.data)*/
					if(event.data == 'refresh') {
						location.href = "thd_select-sub-category.html";
					}
				}
				
				function reAbilityFields(target) {
					target.attr('disabled', 'disabled').removeClass('.toDisable');
				}

				formData.obj.on("paste drop", ".noPaste",
					function(e) {
						e.preventDefault();
					});

				if (option.flowManagerUrl === undefined) {
					formData.obj.on("click", ".resetForm:not('.disabled')", function(event) {
						resetForm(event);
					});
					formData.obj.on('click', ".send:not('.disabled')", function(e) {
						e.preventDefault();
						btnName = $(this).attr("id");
						// Aggiungo il campo hidden con il botton premuto
						if($("input[type='hidden'][name='clickedButton']").length == 0)
							$("#aspnetForm").append($("<input type='hidden' name='clickedButton'>"));
						$("input[type='hidden'][name='clickedButton']").val(btnName);
						formData.obj.submit();
						return false;
					});
					if (!formData.obj.find(".sendThis").length)
						formData.obj.find("input, select, textarea").addClass("sendThis");
				}
			}

			function resetForm(event) {
				event.preventDefault();

				if (formData.submitted)
					return false;

				formData.obj.find(".form input, .form textarea").each(
					function(index, value) {
						$(this).val("");
					});
				formData.obj.find('select').each(
					function(index, value) {
						$(this).val($(this).prop('defaultSelected'));
					});
				formData.obj.find("input:radio").attr("checked", false);
				return false;
			}

			/*
			* PUBLIC METHOD
			*/

			function disableForm() {
				formData.obj.find(".send, .resetForm").addClass("disabled"); //.off("click");
				formData.obj.find("select, input, textarea").attr("disabled", true);
				formData.obj.find(".customStyleSelectBox").addClass("disabled");
			}

			function enableForm() {
				formData.obj.find(".send").removeClass("disabled");
				formData.obj.find(".resetForm").removeClass("disabled")
				formData.obj.find("select, input, textarea").attr("disabled", false);
				formData.obj.find(".customStyleSelectBox").removeClass("disabled");
			}

			function isSharepoint() {
				if ($("body").children('form').length > 0 || $("body").find("#aspnetForm").length > 0)
					return true;
				else
					return false;
			}


			// END PUBLIC METHOD

			return {
				init: init,
				disableForm: disableForm,
				enableForm: enableForm
			};
		};
	});
