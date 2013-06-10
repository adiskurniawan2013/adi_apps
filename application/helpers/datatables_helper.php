<?php 
/*
 * function that generate the action buttons edit, delete
 * This is just showing the idea you can use it in different view or whatever fits your needs
 */
	function get_buttons($id, $controller_name) {
	    $ci= & get_instance();

	    $edit_record = "javascript:load_content('$controller_name/edit/$id','#tab_loader','#form_loader')";
	    $delete_record = "javascript:delconfirm('$id')";

	    $html ='<span class="actions">';
	    // $html .='<a href="'.  base_url().'customer/edit/'.$id.'"><img width="15" height="15" border="0" src="'.  base_url().'images/icons_milky/13.png"/></a>';
	    $html .='<a href="'.$edit_record.'"><img width="15" height="15" border="0" src="'.  base_url().'images/icons_milky/13.png"/></a>';
	    
	    $html .='&nbsp;&nbsp;&nbsp;';
	    // $html .='<a href="'.  base_url().'customer/delete/'.$id.'"><img width="15" height="15" border="0" title="Delete record" src="'.  base_url().'images/icons_milky/118.png"/></a>';
	    $html .='<a href="'.$delete_record.'"><img width="15" height="15" border="0" src="'.  base_url().'images/icons_milky/118.png"/></a>';
	    $html .='</span>';
	    
	    return $html;
	}

