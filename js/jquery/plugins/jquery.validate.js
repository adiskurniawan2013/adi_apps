/*
 * Inline Form Validation Engine 1.6.4, jQuery plugin
 * 
 * Copyright(c) 2009, Cedric Dugas
 * http://www.position-relative.net
 *	
 * Form validation engine allowing custom regex rules to be added.
 * Thanks to Francois Duquette and Teddy Limousin 
 * and everyone helping me find bugs on the forum
 * Licenced under the MIT Licence
 */
 
(function($) {
	
	$.fn.validationEngine = function(settings) {
		
	if($.validationEngineLanguage){				// IS THERE A LANGUAGE LOCALISATION ?
		allRules = $.validationEngineLanguage.allRules;
	}else{
		$.validationEngine.debug("Validation engine rules are not loaded check your external file");
	}
 	settings = jQuery.extend({
		allrules:allRules,
		validationEventTriggers:"focusout",					
		inlineValidation: true,	
		returnIsValid:false,
		liveEvent:true,
		timerCollapse:2500,
		clsError:'verror',
		clsSuccess:'vsuccess',
		unbindEngine:true,
		ajaxSubmit: false,
		scroll:true,
		promptPosition: "topLeft",	// OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
		success : false,
		beforeSuccess :  function() {},
		failure : function() {}
	}, settings);	
	$.validationEngine.settings = settings;
	$.validationEngine.ajaxValidArray = new Array();	// ARRAY FOR AJAX: VALIDATION MEMORY 
	
	if(settings.inlineValidation == true){ 		// Validating Inline ?
		if(!settings.returnIsValid){					// NEEDED FOR THE SETTING returnIsValid
			allowReturnIsvalid = false;
			if(settings.liveEvent){						// LIVE event, vast performance improvement over BIND
				$(this).find("[class*=validate][type!=checkbox]").blur(function(caller){  _inlinEvent(this, 'blur');})
				$(this).find("[class*=validate][type!=checkbox]").focus(function(caller){  _inlinEvent(this, 'focus');})
				$(this).find("[class*=validate][type=checkbox]").live("click", function(caller){ _inlinEvent(this, 'click'); })
			}else{
				$(this).find("[class*=validate]").not("[type=checkbox]").bind(settings.validationEventTriggers, function(caller){ _inlinEvent(this); })
				$(this).find("[class*=validate][type=checkbox]").bind("click", function(caller){ _inlinEvent(this); })
			}
			firstvalid = false;
		}
			function _inlinEvent(caller, act){
				$.validationEngine.settings = settings;
				if($.validationEngine.intercept == false || !$.validationEngine.intercept){		// STOP INLINE VALIDATION THIS TIME ONLY
					$.validationEngine.onSubmitValid=false;
					$.validationEngine.loadValidation(caller, act); 
				}else{
					$.validationEngine.intercept = false;
				}
			}
	}
	if (settings.returnIsValid){		// Do validation and return true or false, it bypass everything;
		if ($.validationEngine.submitValidation(this,settings)){
			return false;
		}else{
			return true;
		}
	}
	$(this).bind("submit", function(caller){   // ON FORM SUBMIT, CONTROL AJAX FUNCTION IF SPECIFIED ON DOCUMENT READY
		$.validationEngine.onSubmitValid = true;
		$.validationEngine.settings = settings;
		if($.validationEngine.submitValidation(this,settings) == false){
			if($.validationEngine.submitForm(this,settings) == true) {return false;}
		}else{
			settings.failure && settings.failure(); 
			return false;
		}		
	})
	$(".formError").live("click",function(){	 // REMOVE BOX ON CLICK
		$(this).fadeOut(150,function(){
			$(this).remove();
		}) 
	})
};	
$.validationEngine = {
	defaultSetting : function(caller) {		// NOT GENERALLY USED, NEEDED FOR THE API, DO NOT TOUCH
		if($.validationEngineLanguage){				
			allRules = $.validationEngineLanguage.allRules;
		}else{
			$.validationEngine.debug("Validation engine rules are not loaded check your external file");
		}	
		settings = {
			allrules:allRules,
			validationEventTriggers:"blur",					
			inlineValidation: true,	
			returnIsValid:false,
			scroll:true,
			unbindEngine:true,
			ajaxSubmit: false,
			promptPosition: "topRight",	// OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
			success : false,
			failure : function() {}
		}	
		$.validationEngine.settings = settings;
	},
	loadValidation : function(caller, act) {		// GET VALIDATIONS TO BE EXECUTED
		if(!$.validationEngine.settings){
			$.validationEngine.defaultSetting()
		}
		/*
		rulesParsing = $(caller).attr('class');
		rulesRegExp = /\[(.*)\]/;
		getRules = rulesRegExp.exec(rulesParsing);
		str = getRules[1];
		pattern = /\[|,|\]/;
		result= str.split(pattern);*/
		list = ['optional','required','custom','exemptString','ajax','length','maxCheckbox','minCheckbox','confirm','funcCall'];
		result = {};
		jQuery.each(list,function(i,val){
			if(val == 'length' && caller.tagName == 'SELECT') {}
			else if($(caller).attr(val))
			{
				result[val] = ($(caller).attr(val).split(','));
			}
		});
		var validateCalll = $.validationEngine.validateCall(caller,result, act)
		return validateCalll;
	},
	validateCall : function(caller,rules, act) {	// EXECUTE VALIDATION REQUIRED BY THE USER FOR THIS FIELD
		var promptText ="";
		
		if(!$(caller).attr("id")) { $.validationEngine.debug("This field have no ID attribut( name & class displayed): "+$(caller).attr("name")+" "+$(caller).attr("class")) }

		caller = caller;
		ajaxValidate = false;
		var callerName = $(caller).attr("name");
		$.validationEngine.isError = false;
		$.validationEngine.showTriangle = true;
		callerType = $(caller).attr("type");
		for(rule in rules)
		{
			vals = rules[rule];
			switch (rule)
			{
				case "optional": 
					if(!$(caller).val()){
						$.validationEngine.closePrompt(caller);
						return $.validationEngine.isError;
					}
				break;
				case "required": 
					_required(caller,vals,rule);
				break;
				case "custom": 
					 _customRegex(caller,vals,rule);
				break;
				case "exemptString": 
					 _exemptString(caller,vals,rule);
				break;
				case "ajax": 
					if(!$.validationEngine.onSubmitValid && act != 'focus'){
						_ajax(caller,vals,rule);
						act = 'ajax';
					};
				break;
				case "length": 
					 _length(caller,vals,rule);
				break;
				case "maxCheckbox": 
					_maxCheckbox(caller,vals,rule);
				 	groupname = $(caller).attr("name");
				 	caller = $("input[name='"+groupname+"']");
				break;
				case "minCheckbox": 
					_minCheckbox(caller,vals,rule);
					groupname = $(caller).attr("name");
				 	caller = $("input[name='"+groupname+"']");
				break;
				case "confirm": 
					 _confirm(caller,vals,rule);
				break;
				case "funcCall": 
			     	_funcCall(caller,vals,rule);
				break;
				default :;
			};
		}
		radioHack();
		if ($.validationEngine.isError == true){
			linkTofield = $.validationEngine.linkTofield(caller);
			($("div."+linkTofield).size() ==0) ? $.validationEngine.buildPrompt(caller,promptText,"error", null, act)	: $.validationEngine.updatePromptText(caller,promptText, null,null, act);
		}else{ $.validationEngine.closePrompt(caller);}			
		/* UNFORTUNATE RADIO AND CHECKBOX GROUP HACKS */
		/* As my validation is looping input with id's we need a hack for my validation to understand to group these inputs */
		function radioHack(){
	      if($("input[name='"+callerName+"']").size()> 1 && (callerType == "radio" || callerType == "checkbox")) {        // Hack for radio/checkbox group button, the validation go the first radio/checkbox of the group
	          caller = $("input[name='"+callerName+"'][type!=hidden]:first");     
	          $.validationEngine.showTriangle = false;
	      }      
	    }
		/* VALIDATION FUNCTIONS */
		function _required(caller,rule, key){   // VALIDATE BLANK FIELD
			callerType = $(caller).attr("type");
			if (callerType == "text" || callerType == "password" || callerType == "textarea"){
								
				if(!$(caller).val()){
					$.validationEngine.isError = true;
					promptText += $.validationEngine.settings.allrules[key].alertText+"<br />";
				}	
			}	
			if (callerType == "radio" || callerType == "checkbox" ){
				callerName = $(caller).attr("name");
		
				if($("input[name='"+callerName+"']:checked").size() == 0) {
					$.validationEngine.isError = true;
					if($("input[name='"+callerName+"']").size() ==1) {
						promptText += $.validationEngine.settings.allrules[key].alertTextCheckboxe+"<br />"; 
					}else{
						 promptText += $.validationEngine.settings.allrules[key].alertTextCheckboxMultiple+"<br />";
					}	
				}
			}	
			if (callerType == "select-one") { // added by paul@kinetek.net for select boxes, Thank you		
				if(!$(caller).val()) {
					$.validationEngine.isError = true;
					promptText += $.validationEngine.settings.allrules[key].alertText+"<br />";
				}
			}
			if (callerType == "select-multiple") { // added by paul@kinetek.net for select boxes, Thank you	
				if(!$(caller).find("option:selected").val()) {
					$.validationEngine.isError = true;
					promptText += $.validationEngine.settings.allrules[key].alertText+"<br />";
				}
			}
		}
		function _customRegex(caller,rule, key){		 // VALIDATE REGEX RULES
			customRule = rule[0];
			pattern = eval($.validationEngine.settings.allrules[customRule].regex);
			
			if(!pattern.test($(caller).attr('value'))){
				$.validationEngine.isError = true;
				promptText += $.validationEngine.settings.allrules[customRule].alertText+"<br />";
			}
		}
		function _exemptString(caller,rule, key){		 // VALIDATE REGEX RULES
			customString = rule[0];
			if(customString == $(caller).attr('value')){
				$.validationEngine.isError = true;
				promptText += $.validationEngine.settings.allrules['required'].alertText+"<br />";
			}
		}
		
		function _funcCall(caller,rule, key){  		// VALIDATE CUSTOM FUNCTIONS OUTSIDE OF THE ENGINE SCOPE
			customRule = rule[0];
			funce = $.validationEngine.settings.allrules[customRule].nname;
			
			var fn = window[funce];
			if (typeof(fn) === 'function'){
				var fn_result = fn();
				$.validationEngine.isError = fn_result;
				promptText += $.validationEngine.settings.allrules[customRule].alertText+"<br />";
			}
		}
		function _ajax(caller,rule, key){				 // VALIDATE AJAX RULES
			
			customAjaxRule = rule[0];
			postfile = ($.validationEngine.settings.allrules[customAjaxRule].file ? $.validationEngine.settings.allrules[customAjaxRule].file : 'validate.json');
			fieldValue = $(caller).val();
			ajaxCaller = caller;
			fieldId = $(caller).attr("id");
			ajaxValidate = true;
			ajaxisError = $.validationEngine.isError;
			
			if($.validationEngine.settings.allrules[customAjaxRule].extraData){
				extraData = $.validationEngine.settings.allrules[customAjaxRule].extraData;
			}else{
				extraData = "";
			}
			/* AJAX VALIDATION HAS ITS OWN UPDATE AND BUILD UNLIKE OTHER RULES */	
			if(!ajaxisError){
				$.ajax({
				   	type: "POST",
				   	url: postfile,
				   	async: true,
				   	data: "validateValue="+fieldValue+"&validateId="+fieldId+"&validateError="+customAjaxRule+extraData,
				   	beforeSend: function(){		// BUILD A LOADING PROMPT IF LOAD TEXT EXIST		   			
				   		if($.validationEngine.settings.allrules[customAjaxRule].alertTextLoad){
				   		
				   			if(!$("div."+fieldId+"formError")[0]){				   				
	 			 				return $.validationEngine.buildPrompt(ajaxCaller,$.validationEngine.settings.allrules[customAjaxRule].alertTextLoad,"load",null,'loading');
	 			 			}else{
	 			 				$.validationEngine.updatePromptText(ajaxCaller,$.validationEngine.settings.allrules[customAjaxRule].alertTextLoad,"load",null,'loading');
	 			 			}
			   			}
			  	 	},
			  	 	error: function(data,transport){ $.validationEngine.debug("error in the ajax: "+data.status+" "+transport) },
					success: function(data){					// GET SUCCESS DATA RETURN JSON
						data = eval( "("+data+")");				// GET JSON DATA FROM PHP AND PARSE IT
						if(data.validate)
						{
							ajaxisError = data.validate[2];
							customAjaxRule = data.validate[1];
							ajaxCaller = $("#"+data.validate[0])[0];
							fieldId = ajaxCaller;
							ajaxErrorLength = $.validationEngine.ajaxValidArray.length;
							existInarray = false;
							
				 			 if(!ajaxisError){			// DATA false UPDATE PROMPT WITH ERROR;
				 			 	
				 			 	_checkInArray(false)				// Check if ajax validation alreay used on this field
				 			 	
				 			 	if(!existInarray){		 			// Add ajax error to stop submit		 		
					 			 	$.validationEngine.ajaxValidArray[ajaxErrorLength] =  new Array(2);
					 			 	$.validationEngine.ajaxValidArray[ajaxErrorLength][0] = fieldId;
					 			 	$.validationEngine.ajaxValidArray[ajaxErrorLength][1] = false;
					 			 	existInarray = false;
				 			 	}
					
				 			 	$.validationEngine.ajaxValid = false;
								promptText += $.validationEngine.settings.allrules[customAjaxRule].alertText+"<br />";
								$.validationEngine.updatePromptText(ajaxCaller,promptText,"",true, 'ajax');				
							 }else{	 
							 	_checkInArray(true);
							 	$.validationEngine.ajaxValid = true; 			
							 	if(!customAjaxRule)	{$.validationEngine.debug("wrong ajax response, are you on a server or in xampp? if not delete de ajax[ajaxUser] validating rule from your form ")}		   
		 			 			if($.validationEngine.settings.allrules[customAjaxRule].alertTextOk){	// NO OK TEXT MEAN CLOSE PROMPT
		 			 				$.validationEngine.updatePromptText(ajaxCaller,$.validationEngine.settings.allrules[customAjaxRule].alertTextOk,"pass",true,'ajax');
	 			 				}else{
					 			 	ajaxValidate = false;		 	
					 			 	$.validationEngine.closePrompt(ajaxCaller);
	 			 				}		
				 			 }
						}else{
							ajaxValidate = false;		 	
							$.validationEngine.closePrompt(ajaxCaller);
		 				}
			 			function  _checkInArray(validate){
			 				for(x=0;x<ajaxErrorLength;x++){
			 			 		if($.validationEngine.ajaxValidArray[x][0] == fieldId){
			 			 			$.validationEngine.ajaxValidArray[x][1] = validate;
			 			 			existInarray = true;
			 			 		
			 			 		}
			 			 	}
			 			}
			 		}				
				});
			}
		}
		function _confirm(caller,rule, key){		 // VALIDATE FIELD MATCH
			confirmField = rule[0];
			
			if($(caller).attr('value') != $("#"+confirmField).attr('value')){
				$.validationEngine.isError = true;
				promptText += $.validationEngine.settings.allrules["confirm"].alertText+"<br />";
			}
		}
		function _length(caller,rule, key){    	  // VALIDATE LENGTH
		
			startLength = eval(rule[0]);
			endLength = eval(rule[1]);
			feildLength = $(caller).attr('value').length;

			if(feildLength<startLength || feildLength>endLength){
				$.validationEngine.isError = true;
				promptText += $.validationEngine.settings.allrules["length"].alertText+startLength+$.validationEngine.settings.allrules["length"].alertText2+endLength+$.validationEngine.settings.allrules["length"].alertText3+"<br />"
			}
		}
		function _maxCheckbox(caller,rule, key){  	  // VALIDATE CHECKBOX NUMBER
		
			nbCheck = eval(rule[0]);
			groupname = $(caller).attr("name");
			groupSize = $("input[name='"+groupname+"']:checked").size();
			if(groupSize > nbCheck){	
				$.validationEngine.showTriangle = false;
				$.validationEngine.isError = true;
				promptText += $.validationEngine.settings.allrules["maxCheckbox"].alertText+"<br />";
			}
		}
		function _minCheckbox(caller,rule, key){  	  // VALIDATE CHECKBOX NUMBER
		
			nbCheck = eval(rule[0]);
			groupname = $(caller).attr("name");
			groupSize = $("input[name='"+groupname+"']:checked").size();
			if(groupSize < nbCheck){	
			
				$.validationEngine.isError = true;
				$.validationEngine.showTriangle = false;
				promptText += $.validationEngine.settings.allrules["minCheckbox"].alertText+" "+nbCheck+" "+$.validationEngine.settings.allrules["minCheckbox"].alertText2+"<br />";
			}
		}
		return($.validationEngine.isError) ? $.validationEngine.isError : false;
	},
	submitForm : function(caller){
		if($.validationEngine.settings.ajaxSubmit){		
			if($.validationEngine.settings.ajaxSubmitExtraData){
				extraData = $.validationEngine.settings.ajaxSubmitExtraData;
			}else{
				extraData = "";
			}
			$.ajax({
			   	type: "POST",
			   	url: $.validationEngine.settings.ajaxSubmitFile,
			   	async: true,
			   	data: $(caller).serialize()+"&"+extraData,
			   	error: function(data,transport){ $.validationEngine.debug("error in the ajax: "+data.status+" "+transport) },
			   	success: function(data){
			   		if(data == "true"){			// EVERYTING IS FINE, SHOW SUCCESS MESSAGE
			   			$(caller).css("opacity",1)
			   			$(caller).animate({opacity: 0, height: 0}, function(){
			   				$(caller).css("display","none");
			   				$(caller).before("<div class='ajaxSubmit'>"+$.validationEngine.settings.ajaxSubmitMessage+"</div>");
			   				$.validationEngine.closePrompt(".formError",true); 	
			   				$(".ajaxSubmit").show("slow");
			   				if ($.validationEngine.settings.success){	// AJAX SUCCESS, STOP THE LOCATION UPDATE
								$.validationEngine.settings.success && $.validationEngine.settings.success(); 
								return false;
							}
			   			})
		   			}else{						// HOUSTON WE GOT A PROBLEM (SOMETING IS NOT VALIDATING)
			   			data = eval( "("+data+")");	
			   			if(!data.jsonValidateReturn){
			   				 $.validationEngine.debug("you are not going into the success fonction and jsonValidateReturn return nothing");
			   			}
			   			errorNumber = data.jsonValidateReturn.length	
			   			for(index=0; index<errorNumber; index++){	
			   				fieldId = data.jsonValidateReturn[index][0];
			   				promptError = data.jsonValidateReturn[index][1];
			   				type = data.jsonValidateReturn[index][2];
			   				$.validationEngine.buildPrompt(fieldId,promptError,type,null,'submit');
		   				}
	   				}
   				}
			})	
			return true;
		}
		// LOOK FOR BEFORE SUCCESS METHOD		
			if(!$.validationEngine.settings.beforeSuccess()){
				if ($.validationEngine.settings.success){	// AJAX SUCCESS, STOP THE LOCATION UPDATE
					if($.validationEngine.settings.unbindEngine){ $(caller).unbind("submit") }
					$.validationEngine.settings.success && $.validationEngine.settings.success(); 
					return true;
				}
			}else{
				return true;
			} 
		return false;
	},
	buildPrompt : function(caller,promptText,type,ajaxed, act) {			// ERROR PROMPT CREATION AND DISPLAY WHEN AN ERROR OCCUR
		if(!$.validationEngine.settings){
			$.validationEngine.defaultSetting()
		}
		clsError = ($(caller).attr('verror') ? $(caller).attr('verror') : $.validationEngine.settings.clsError);
		clsSuccess = ($(caller).attr('vsuccess') ? $(caller).attr('vsuccess') : $.validationEngine.settings.clsSuccess);
		deleteItself = "." + $(caller).attr("id") + "formError";
	
		if($(deleteItself)[0]){
			$(deleteItself).stop();
			$(deleteItself).remove();
		}
		var divFormError = document.createElement('div');
		var formErrorContent = document.createElement('div');
		linkTofield = $.validationEngine.linkTofield(caller)
		$(divFormError).addClass("formError")
		
		if(jQuery('#icon_'+jQuery(caller).attr("id")).get(0))
		{
			caller = jQuery('#icon_'+$(caller).attr("id")).get(0);
		}
		
		if(type == "pass"){ $(divFormError).addClass("greenPopup") }
		if(type == "load"){ $(divFormError).addClass("blackPopup") }
		if(ajaxed){ $(divFormError).addClass("ajaxed") }
		
		$(divFormError).addClass(linkTofield);
		$(formErrorContent).addClass("formErrorContent");
		
		$("body").append(divFormError);
		$(divFormError).append(formErrorContent);
			
		if($.validationEngine.showTriangle != false){		// NO TRIANGLE ON MAX CHECKBOX AND RADIO
			var arrow = document.createElement('div');
			$(arrow).addClass("formErrorArrow");
			$(divFormError).append(arrow);
			if($.validationEngine.settings.promptPosition == "bottomLeft" || $.validationEngine.settings.promptPosition == "bottomRight"){
			$(arrow).addClass("formErrorArrowBottom")
			$(arrow).html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
		}
			if($.validationEngine.settings.promptPosition == "topLeft" || $.validationEngine.settings.promptPosition == "topRight"){
				$(divFormError).append(arrow);
				$(arrow).html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
			}
		}
		$(formErrorContent).html(promptText)
	
		callerTopPosition = $(caller).offset().top;
		callerleftPosition = $(caller).offset().left;
		callerWidth =  $(caller).width();
		inputHeight = $(divFormError).height();
	
		/* POSITIONNING */
		if($.validationEngine.settings.promptPosition == "topRight"){callerleftPosition +=  callerWidth -30; callerTopPosition += -inputHeight -10; }
		if($.validationEngine.settings.promptPosition == "topLeft"){ callerTopPosition += -inputHeight -10; }
		
		if($.validationEngine.settings.promptPosition == "centerRight"){ callerleftPosition +=  callerWidth +13; }
		
		if($.validationEngine.settings.promptPosition == "bottomLeft"){
			callerHeight =  $(caller).height();
			callerleftPosition = callerleftPosition;
			callerTopPosition = callerTopPosition + callerHeight + 15;
		}
		if($.validationEngine.settings.promptPosition == "bottomRight"){
			callerHeight =  $(caller).height();
			callerleftPosition +=  callerWidth -30;
			callerTopPosition +=  callerHeight + 15;
		}
		$(divFormError).css({
			top:callerTopPosition,
			left:callerleftPosition,
			opacity:0
		})
		
		if(act!='focus' && act!='loading')
		{
			if( jQuery(caller).attr('type') != 'checkbox' )	{
				jQuery(caller).addClass(clsError).removeClass(clsSuccess);
				time = $.validationEngine.settings.timerCollapse;
			} else {
				jQuery(caller).parent().addClass($.validationEngine.settings.clsError).removeClass(clsSuccess);
				time = 5000;
			}
			
			return $(divFormError)
				.css('display', 'block')
				.stop()
				.fadeTo('fast', 0.87, function(){ 
					$(divFormError).fadeOut(time);
				});
		}
		else 
		{
			return $(divFormError).css('display', 'block').stop().fadeTo('fast', 0.87);
		}
	},
	updatePromptText : function(caller,promptText,type,ajaxed, act) {	// UPDATE TEXT ERROR IF AN ERROR IS ALREADY DISPLAYED

		clsError = ($(caller).attr('verror') ? $(caller).attr('verror') : $.validationEngine.settings.clsError);
		clsSuccess = ($(caller).attr('vsuccess') ? $(caller).attr('vsuccess') : $.validationEngine.settings.clsSuccess);
		
		linkTofield = $.validationEngine.linkTofield(caller);
		var updateThisPrompt =  "."+linkTofield;
		
		if(jQuery('#icon_'+jQuery(caller).attr("id"))[0])
		{
			caller = jQuery('#icon_'+$(caller).attr("id"))[0];
		}
		
		if(type == "pass") { $(updateThisPrompt).addClass("greenPopup") }else{ $(updateThisPrompt).removeClass("greenPopup")};
		if(type == "load") { $(updateThisPrompt).addClass("blackPopup") }else{ $(updateThisPrompt).removeClass("blackPopup")};
		if(ajaxed) { $(updateThisPrompt).addClass("ajaxed") }else{ $(updateThisPrompt).removeClass("ajaxed")};
	
		$(updateThisPrompt).find(".formErrorContent").html(promptText);
		callerTopPosition  = $(caller).offset().top;
		inputHeight = $(updateThisPrompt).height();
		
		if($.validationEngine.settings.promptPosition == "bottomLeft" || $.validationEngine.settings.promptPosition == "bottomRight"){
			callerHeight =  $(caller).height();
			callerTopPosition =  callerTopPosition + callerHeight + 15;
		}
		if($.validationEngine.settings.promptPosition == "centerRight"){  callerleftPosition +=  callerWidth +13;}
		if($.validationEngine.settings.promptPosition == "topLeft" || $.validationEngine.settings.promptPosition == "topRight"){
			callerTopPosition = callerTopPosition  -inputHeight -10;
		}

		if(act!='focus' && act!='loading')
		{
			if( jQuery(caller).attr('type') != 'checkbox' )	{
				time = $.validationEngine.settings.timerCollapse;
			} else {
				time = 5000;
			}

			if(type != "pass") jQuery(caller).addClass(clsError).removeClass(clsSuccess);
			else jQuery(caller).removeClass(clsError).addClass(clsSuccess);
			
			$(updateThisPrompt).css('display', 'block')
				.stop()
				.animate({ top:callerTopPosition})
				.fadeTo(0, 0.87, function(){
					if(act!='focus')$(updateThisPrompt).fadeOut(time)
				});
		}
		else
		{
			$(updateThisPrompt)
				.css('display', 'block')
				.stop()
				.animate({ top:callerTopPosition})
				.fadeTo(0, 0.87);
		}
		
	},
	linkTofield : function(caller){
		linkTofield = $(caller).attr("id") + "formError";
		linkTofield = linkTofield.replace(/\[/g,""); 
		linkTofield = linkTofield.replace(/\]/g,"");
		return linkTofield;
	},
	closePrompt : function(caller,outside) {						// CLOSE PROMPT WHEN ERROR CORRECTED
		
		if(!$.validationEngine.settings){
			$.validationEngine.defaultSetting()
		}
		if( jQuery(caller).attr('type') != 'checkbox' )	{
			jQuery(caller).removeClass($.validationEngine.settings.clsError).addClass($.validationEngine.settings.clsSuccess);
		} else {
			jQuery(caller).parent().removeClass($.validationEngine.settings.clsError).addClass($.validationEngine.settings.clsSuccess);
		}
		if(outside){
			$(caller).fadeTo("fast",0,function(){
				$(caller).remove();
			});
			return false;
		}
		if(typeof(ajaxValidate)=='undefined'){ajaxValidate = false}
		if(!ajaxValidate){
			linkTofield = $.validationEngine.linkTofield(caller);
			closingPrompt = "."+linkTofield;
			$(closingPrompt).fadeTo("fast",0,function(){
				$(closingPrompt).remove();
			});
		}
	},
	debug : function(error) {
		/*
		if(!$("#debugMode")[0]){
			$("body").append("<div id='debugMode'><div class='debugError'><strong>This is a debug mode, you got a problem with your form, it will try to help you, refresh when you think you nailed down the problem</strong></div></div>");
		}
		$(".debugError").append("<div class='debugerror'>"+error+"</div>");
		*/
	},			
	submitValidation : function(caller) {					// FORM SUBMIT VALIDATION LOOPING INLINE VALIDATION
		var stopForm = false;
		$.validationEngine.ajaxValid = true;
		$(caller).find(".formError").remove();
		var toValidateSize = $(caller).find("[class*=validate]").size();
		
		$(caller).find("[class*=validate]").each(function(){
			linkTofield = $.validationEngine.linkTofield(this);
			
			if(!$("."+linkTofield).hasClass("ajaxed")){	// DO NOT UPDATE ALREADY AJAXED FIELDS (only happen if no normal errors, don't worry)
				var validationPass = $.validationEngine.loadValidation(this);
				return(validationPass) ? stopForm = true : "";					
			};
		});
		ajaxErrorLength = $.validationEngine.ajaxValidArray.length;		// LOOK IF SOME AJAX IS NOT VALIDATE
		for(x=0;x<ajaxErrorLength;x++){
	 		if($.validationEngine.ajaxValidArray[x][1] == false){
	 			$.validationEngine.ajaxValid = false;
 			}
 		}
		if(stopForm || !$.validationEngine.ajaxValid){		// GET IF THERE IS AN ERROR OR NOT FROM THIS VALIDATION FUNCTIONS
			if($.validationEngine.settings.scroll){
				destination = $(".formError:not('.greenPopup'):first").offset().top;
				$(".formError:not('.greenPopup')").each(function(){
					testDestination = $(this).offset().top;
					if(destination>testDestination){
						destination = $(this).offset().top;
					}
				})
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 1100);
			}
			return true;
		}else{
			return false;
		}
	}
}
})(jQuery);

function _validateRules(cfg){
	for(index in cfg)
	{
		$.validationEngineLanguage.allRules[index] = cfg[index];
	}
};

(function($) {
	$.fn.validationEngineLanguage = function() {};
	$.validationEngineLanguage = {
		newLang: function() {
			$.validationEngineLanguage.allRules = 	{
					
				"required":{    			// Add your regex rules here, you can take telephone as an example
					"regex":"none",
					"alertText":"* This field is required",
					"alertTextCheckboxMultiple":"* Please select an option",
					"alertTextCheckboxe":"* This checkbox is required"
				},
				"length":{
					"regex":"none",
					"alertText":"*Between ",
					"alertText2":" and ",
					"alertText3": " characters allowed"
				},
				"maxCheckbox":{
					"regex":"none",
					"alertText":"* Checks allowed Exceeded"
				},	
				"minCheckbox":{
					"regex":"none",
					"alertText":"* Please select ",
					"alertText2":" options"
				},	
				"confirm":{
					"regex":"none",
					"alertText":"* Your field is not matching"
				},		
				"telephone":{
					"regex":"/^[0-9\-\(\)\ ]+$/",
					"alertText":"* Invalid phone number"
				},	
				"email":{
					"regex":"/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",
					"alertText":"* Invalid email address"
				},	
				"date":{
                     "regex":"/^[0-9]{4}\-\[0-9]{1,2}\-\[0-9]{1,2}$/",
                     "alertText":"* Invalid date, must be in YYYY-MM-DD format"
                },
				"onlyNumber":{
					"regex":"/^[0-9\ ]+$/",
					"alertText":"* Numbers only"
				},	
				"noSpecialCaracters":{
					"regex":"/^[0-9a-zA-Z]+$/",
					"alertText":"* No special caracters allowed"
				},		
				"onlyLetter":{
					"regex":"/^[a-zA-Z\ \']+$/",
					"alertText":"* Letters only"
				}
			}
					
		}
	}
})(jQuery);

$(document).ready(function() {	
	$.validationEngineLanguage.newLang()
});