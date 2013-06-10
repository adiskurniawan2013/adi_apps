<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine-en.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine.js"></script>

<script language="javascript" type="text/javascript">
$(document).ready(function() {
	function submit_form(querystr){
		//display loading
		$("#loading div").fadeIn(300);
		$.ajax({
			url		:	"<?php echo base_url('supplier/submit/'.@$person_id) ?>",
			type	:	"POST",
			dataType:	"json",
			data	:	querystr,
			success	:	function(data){
			//hide loading
			$("#loading div").fadeOut(300);
				if(data.server_validation) {
					$.validationEngine.buildPrompt('#form',data.server_validation,'error');
				} else {
					$.validationEngine.closePrompt('#form');
					if(!data.is_valid) {
						$.validationEngine.buildPrompt('#first_name','Already exists.','error');
					} else {
						load_content('supplier','#tab_loader');
					}
				}
			}//END SUCCESS
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

<div style="height:0px"></div>

<div class="form_block" id="form_block_1" style="width:900px; margin-left:22px; margin-top:2px;">

<div class="form_title"><?php echo @$person_id?@$first_name:"New Supplier" ?>
	<div style="float:right; padding: 0;"><a href="javascript:load_content('supplier','#tab_loader')"><img src="<?php echo base_url() ?>images/fileclose.png" width="17.5" height="17.5" border="0"/></a></div>
</div> 

<div class="form" style="height:350px;">
	
	<div id="form_loader">

		<form action="<?php echo base_url('suppliers/submit/'.@$person_id) ?>" method="post" onsubmit="return false" id="form">
			
			<div style="height:12px"></div>

			<div id="rowContent"></div> 
			
			<div style="float:left; width:48%;">
				<div id="rowContentInner">
				    <div id="contentBoxTwoEdit">
						<table class="editTable">
							<tr>
								<td class="cellLeftEditTable">
									Name:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="first_name" name="first_name" value="<?php echo @$first_name ?>" class="validate[required,length[3,32]]">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Company Name:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="company_name" name="company_name" value="<?php echo @$company_name ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									E-mail:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="email" name="email" value="<?php echo @$email ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Phone:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="phone_number" name="phone_number" value="<?php echo @$phone_number ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Address 1:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="address_1" name="address_1" value="<?php echo @$address_1 ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Address 2:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="address_2" name="address_2" value="<?php echo @$address_2 ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									City:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="city" name="city" value="<?php echo @$city ?>">
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>

			<div style="float:right; width:48%;">
				<div id="rowContentInner">
				    <div id="contentBoxTwoEdit">
						<table class="editTable">
							<tr>
								<td class="cellLeftEditTable">
									Postal Code:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="zip" name="zip" value="<?php echo @$zip ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Province:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="state" name="state" value="<?php echo @$state ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Country:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="country" name="country" value="<?php echo @$country ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Account #:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="account_number" name="account_number" value="<?php echo @$account_number ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Comments:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="comments" name="comments" value="<?php echo @$comments ?>">
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		
			<br/><br/><br/>
							
			<div>
				<label for="submit">&nbsp;</label>
				<input type="submit" value="Submit" style="margin-left:242px"/>
				&nbsp;&nbsp;
				<input name="cancel" type="button" id="cancel" value="Cancel" onclick="javascript:load_content('supplier','#tab_loader')"/>
			</div> 
				
		</form>

		</div> <!-- end form loader -->
	</div> <!-- end form -->  
</div> <!-- end form block2 -->  

<div id="tab_loader" style="display:none"></div>	