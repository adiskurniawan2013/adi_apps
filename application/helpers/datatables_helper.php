<?php 
/*
 * function that generate the action buttons edit, delete
 * This is just showing the idea you can use it in different view or whatever fits your needs
 */
	/*
	function get_buttons($id, $controller_name) {
	    $ci= & get_instance();
	    // $edit_record = "javascript:load_content('$controller_name/edit/$id','#tab_loader','#form_loader')";
	    $delete_record = "javascript:delconfirm('$id')";
	    $html ='<span class="actions">';
	    // $html .='<a href="'.  base_url().'customer/edit/'.$id.'"><img width="15" height="15" border="0" src="'.  base_url().'images/icons_milky/13.png"/></a>';
	    // $html .='<a href="'.$edit_record.'"><img width="13" height="13" border="0" src="'.  base_url().'images/icons_milky/13.png"/></a>';
	    
	    // $html .='&nbsp;';
	    // $html .='<a href="'.  base_url().'customer/delete/'.$id.'"><img width="15" height="15" border="0" title="Delete record" src="'.  base_url().'images/icons_milky/118.png"/></a>';
	    $html .='<a href="'.$delete_record.'"><img align="center" title="Delete record" width="14" height="14" border="0" src="'.  base_url().'images/delete1.png"/></a>';
	    $html .='</span>';
	    
	    return $html;
	}
	*/

	function get_buttons($id, $controller_name) {
	    $delete_record = "javascript:delconfirm('$id')";
	    $html  = '<span>';
	    $html .='&nbsp;&nbsp;';
	    $html .= '<a href="'.$delete_record.'"><img align="center" title="Delete record" width="13" height="13" border="0" src="'.base_url().'images/delete1.png"/></a>';
	    $html .= '</span>';
	    return $html;
	}

	function align_right($number) {
	    $ci =& get_instance();
	    $html ='<div align="right">';
	    $html .= $number ;
	    $html .='</div>';
	    return $html;
	}

	function to_currency($number) {
		$CI =& get_instance();
		$currency_symbol = $CI->config->item('currency_symbol') ? $CI->config->item('currency_symbol') : '$';
			if($number >= 0) {
				return $currency_symbol.number_format($number, 2, '.', '');
		    } else {
		    	return '-'.$currency_symbol.number_format(abs($number), 2, '.', '');
		    }
	}

	function to_currency_no_money($number) {
		return number_format($number, 2, '.', '');
	}

	function to_tax_percents($id) {
		$CI =& get_instance();
		$item_tax_info = $CI->item_tax_m->get_info($id);
		$tax_percents = '';
		foreach($item_tax_info as $tax_info) {
			$tax_percents .= number_format($tax_info['percent'], 2). '%, ';
		}
		$tax_percents = substr($tax_percents, 0, -2);
		return $tax_percents;
	}