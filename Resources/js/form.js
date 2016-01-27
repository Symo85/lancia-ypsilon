define(['jquery'],
	function($)
	{
	var _rules = {
		name : "required",
		surname : "required",
		password : "required",
		email : {
			required : true,
			email : true
		},
		phone : {
			required : true,
			digits : true,
			minlength : 7,
			maxlength : 10,
			cellFormat : true
		},
		confirmEmail : {
			"required" : true,
			"equalTo" : "#email"
		},
		confirmPassword : {
			"required" : true,
			"equalTo" : "#password"
		},
		privacy : "required",
		question : "required",
		search : "required",
		check : "required",
		interest : "required",
		category : "required",
		zipCode : "required",
		country : "required",
		inputphone:"required",
		city:"required",
		street:"required",
		state:"required",
		formConditions:"required",
		oggetto1 : "required",
		oggetto2 : "required",
	};
	
	var _messages = {
		name : 'Il campo "Nome" deve essere compilato',
		surname : 'Il campo "Cognome" deve essere compilato',
		email : 'Il campo "Email" deve essere compilato',
		password : 'Il campo "Password" deve essere compilato',
		phone : {
			required : 'Il campo "Cellulare" deve essere compilato',
			digits : 'Inserire solo cifre',
			maxlength : 'Inserire al massimo 10 cifre',
			minlength : 'Numero di cifre non sufficiente',
			cellFormat : 'Formato del numero non valido',
		},
		privacy : 'Scegliere ACCONSENTO oppure NON ACCONSENTO',
		confirmEmail : 'Il campo "Conferma email" deve coincidere con il campo "Email"',
		confirmPassword : 'Il campo "Conferma password" deve coincidere con il campo "Password"',
		country : 'Selezionare il paese',
		zipCode : 'Il campo Zip deve essere compilato',
		city : 'Inserire la città',
		state: 'Inserire lo Stato',
		formConditions : 'Acconsentire alle condizioni',
		question : 'Choose a question',
		answer : 'Il campo "Answer" deve essere compilato'
	};
	
	$(document).ready(function() {
	
		initForm();
	
	});
	
	function initForm() {
		
		$('.form').addClass('myForm');
		//Add event su invia
		$(".form .submit, .form .send").on("click", function(e) {
			e.preventDefault();
			
			//Validazione del form
			var valid = $(this).parents('.form').validate({
				rules : _rules,
				messages : _messages,
				errorPlacement: function(error, element) {
					var el = element;
					if (element.attr("type") == "checkbox" )
						error.insertAfter(element.next("label"));
					else if (el.is('.select-to-validate')) {
						error.insertAfter(el.next(".customSelect")); 
					}
					else
						error.insertAfter(element);
					}
			}).form();
	
			/*if ($(".main-form").validate()) {
				if($("input").hasClass("error")){
					var p= $('input.error').prev();
					p.addClass("error");
				}
				else p.css("color","#000");
			}*/
	
			/*//Validazione della privacy per sistemare correttamente la label di errore
			if (!$(".main-form").validate().element("input")) {
				$("label.error").css("margin-top", "200px");
	
			} else
				$("label").css("color", "#fff");*/
	
		});
	
		/*$(".footer-form input[type='submit']").on("click", function(e) {
			e.preventDefault();
			//Validazione del form
			console.log('click')
			var valid = $(".footer-form").validate({
				rules : _rules,
				messages : _messages
			}).form();
	
		});
	
		$(".phone-form input[type='submit']").on("click", function(e) {
			e.preventDefault();
	
			//Validazione del form
			var valid = $(".phone-form").validate({
				rules : _rules,
				messages : _messages
			}).form();
	
		});
	
		$(".form-specoff input[type='submit']").on("click", function(e) {
			e.preventDefault();
	
			//Validazione del form
			var valid = $(".form-specoff").validate({
				rules : _rules,
				messages : _messages
			}).form();
	
		});*/
	
	}
	
	/*//Aggiungo un metodo per il controllo del telefono
	jQuery.validator.addMethod("phone", function(phone_number, element) {
		phone_number = phone_number.replace(/\s+/g, "");
		return this.optional(element) || phone_number.length > 8 && !isNaN(phone_number)
	}, "Please specify a valid phone number");
	
	//Aggiungo un metodo per il controllo del prefisso
	function verifyPhone(number) {
		if (number.indexOf("00") == 0)
			return false;
	
		return number = "0039" + number;
	}
	
	//Aggiungo un metodo per il controllo del formato
	jQuery.validator.addMethod("cellFormat", function(value, element) {
		if (value.indexOf("3") == 0)
			return true
		else
			return false;
	}, "Please specify the correct domain for your documents");
	
	//Aggiungo un metodo per il controllo del placeholder in < IE9
	jQuery.validator.addMethod("placeholder", function(value, element) {
	
		return $(element).attr("value") != $(element).attr("placeholder")
	}, "");*/
	
	/*function getParameter(parameter) {
		fullQString = window.location.search.substring(1);
		paramArray = fullQString.split("&");
	
		found = false;
		for ( i = 0; i < paramArray.length; i++) {
			currentParameter = paramArray[i].split("=");
			if (currentParameter[0] == parameter) {
				return currentParameter[1];
			}
		}
		return false;
		//Not found
	}*/
});