<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<link href="<?php echo base_url('css/styles.css');?>" rel="stylesheet" type="text/css" />
<body>
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine-en.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine.js"></script>

<script language="javascript" type="text/javascript">
$(document).ready(function() {
	function submit_form(querystr){
		//display loading
		$("#loading div").fadeIn(300);
		$.ajax({
			url		:	"<?php echo base_url('login/submit');?>",
			type	:	"POST",
			dataType:	"json",
			data	:	querystr,
			success	:	function(data){
			//hide loading
			$("#loading div").fadeOut(300);
				if(!data.is_valid){
					$.validationEngine.buildPrompt('#password','Invalid Password','error');
				}else{
					$("#container").fadeOut("fast",function(){
						$("#container").html(data.content);
						$("#container").fadeIn("slow");
					});
				}
			}
		});
	}
	
	//form validation
	$("#form").validationEngine({
		unbindEngine	:	false,
		validationEventTriggers	:	"keyup blur",
		success	:	function(formData) { submit_form(formData) }
	})

});
</script>

<div id="container">
  <div class="form_block" id="login_form">
	<div class="form_title">Admin Login</div>
	<div class="form">
	<form action="<?php echo base_url('login/submit') ?>" method="post" onsubmit="return false" id="form">
		<br />
		
		<div class="sepa">
		<!-- <label for="email">Email</label>
		<input type="text" name="email" id="email" class="validate[required,custom[email]]" />  -->
		<label for="username">Username</label>
		<input type="text" name="username" id="username" />  

		</div>		
		<div class="sepa">
		<label for="pass">Password</label>
		<input type="password" name="password" id="password" class="validate[required]" />
		</div>
		
		<div class="sepa">
		<label for="submit">&nbsp;</label>
		<input type="submit" value="Submit" /></div>
	</form>
	</div>
	</div>
</div>
</body>
</html>
