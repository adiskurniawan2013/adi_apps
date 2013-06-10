$(document).ready(function() {
	// SUCCESS AJAX CALL, replace "success: false," by:     success : function() { callSuccessFunction() }, 
	_validateRules({
		"ajaxUser":{
			"alertTextOk":"* This user is available",	
			"alertTextLoad":"* Loading, please wait",
			"alertText":"* This user is already taken"},	
		"ajaxName":{
			"alertText":"* This name is already taken",
			"alertTextOk":"* This name is available",	
			"alertTextLoad":"* Loading, please wait"},
		"validate2fields":{
			"nname":"validate2fields",
			"alertText":"You must have a firstname and a lastname"}	
		
	});

	$("input.mask").each(function(i){
		$(this).mask($(this).attr('mask'));
	});
	
	$('form').each(function(){
		$(this).validationEngine();
	});
	
});

// JUST AN EXAMPLE OF VALIDATIN CUSTOM FUNCTIONS : funcCall[validate2fields]
function validate2fields(){
	if($("#firstname").val() =="" || $("#lastname").val() == ""){
		return true;
	}else{
		return false;
	}
}
