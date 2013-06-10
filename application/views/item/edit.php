<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine-en.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery.validationEngine.js"></script>

<script language="javascript" type="text/javascript">
$(document).ready(function() {
	function submit_form(querystr){
		//display loading
		$("#loading div").fadeIn(300);
		$.ajax({
			url		:	"<?php echo base_url('items/submit/'.@$item_id) ?>",
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
						$.validationEngine.buildPrompt('#name','Already exists.','error');
					} else {
						load_content('items','#tab_loader');
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

//this process of tab_load processes as follows:
//1- hide the form_loader (which contains the form)
//2- load the tab page into tab_loader div
//3- when go back to the form_loader tab gust show that form again
//4- hide the tab_loader div

$('#info').click(function (){
	$('#tab_loader').fadeOut(300, function(){
		$('#form_loader').fadeIn('slow');
	});
});
</script>

<div style="height:0px"></div>

<div class="form_block" id="form_block_1" style="width:900px; margin-left:22px; margin-top:2px;">

<div class="form_title"><?php echo @$item_id?@$name:"New item" ?>
	<div style="float:right; padding: 0;"><a href="javascript:load_content('items','#tab_loader')"><img src="<?php echo base_url() ?>images/fileclose.png" width="17.5" height="17.5" border="0"/></a></div>
</div> 

<div class="form" style="height:350px;">
	<div id="form_loader">
		<form action="<?php echo base_url('items/submit/'.@$item_id) ?>" method="post" onsubmit="return false" id="form">
			
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
									<input type="text" id="name" name="name" value="<?php echo @$name ?>" class="validate[required,length[3,32]]">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Description:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="description" name="description" value="<?php echo @$description ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Category:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="category" name="category" value="<?php echo @$category ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Supplier ID:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="supplier_id" name="supplier_id" value="<?php echo @$supplier_id ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Item Number:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="item_number" name="item_number" value="<?php echo @$item_number ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Cost Price:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="cost_price" name="cost_price" value="<?php echo @$cost_price ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Unit Price:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="unit_price" name="unit_price" value="<?php echo @$unit_price ?>">
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
							<?php $item_tax_info = $this->m_item_taxes->get_info(@$item_id) ?>
							<tr>
								<td class="cellLeftEditTable">
									Tax 1:
								</td>
								<td class="cellRightEditTable">
									<?php echo form_input(array(
										'name'=>'tax_names[]',
										'id'=>'tax_name_1',
										'size'=>'8',
										'value'=> isset($item_tax_info[0]['name']) ? $item_tax_info[0]['name'] : $this->config->item('default_tax_1_name'))
									);?>
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Tax 1:
								</td>
								<td class="cellRightEditTable">
									<?php echo form_input(array(
										'name'=>'tax_percents[]',
										'id'=>'tax_percent_name_1',
										'size'=>'3',
										'value'=> isset($item_tax_info[0]['percent']) ? $item_tax_info[0]['percent'] : $this->config->item('default_tax_1_rate'))
									);?>
									%
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Tax 2:
								</td>
								<td class="cellRightEditTable">
									<?php echo form_input(array(
										'name'=>'tax_names[]',
										'id'=>'tax_name_2',
										'size'=>'8',
										'value'=> isset($item_tax_info[1]['name']) ? $item_tax_info[1]['name'] : $this->config->item('default_tax_2_name'))
									);?>
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Tax 2:
								</td>
								<td class="cellRightEditTable">
									<?php echo form_input(array(
										'name'=>'tax_percents[]',
										'id'=>'tax_percent_name_2',
										'size'=>'3',
										'value'=> isset($item_tax_info[1]['percent']) ? $item_tax_info[1]['percent'] : $this->config->item('default_tax_2_rate'))
									);?>
									%
								</td>
							</tr>
							
							<tr>
								<td class="cellLeftEditTable">
									Quantity:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="quantity" name="quantity" value="<?php echo @$quantity ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Reorder Level:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="reorder_level" name="reorder_level" value="<?php echo @$reorder_level ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Location:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="location" name="location" value="<?php echo @$location ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Allow Alt Description:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="allow_alt_description" name="allow_alt_description" value="<?php echo @$allow_alt_description ?>">
								</td>
							</tr>
							<tr>
								<td class="cellLeftEditTable">
									Item has Serial Number:
								</td>
								<td class="cellRightEditTable">
									<input type="text" id="is_serialized" name="is_serialized" value="<?php echo @$is_serialized ?>">
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
				<input name="cancel" type="button" id="cancel" value="Cancel" onclick="javascript:load_content('items','#tab_loader')"/>
			</div> 
				
		</form>

		</div> <!-- end form loader -->
	</div> <!-- end form -->  
</div> <!-- end form block2 -->  

<div id="tab_loader" style="display:none"></div>	