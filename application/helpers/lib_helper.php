<?php
	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	
	//check if variable exists and return it's result
	if ( ! function_exists('get_value')) { 
		function get_value($variable) { 
			return isset($variable)?$variable:'';
		}    
	}

	//return session variable
	function sess_var($session_var) {
		//logged_in, name, accountid, userid, is_admin
		$CI =& get_instance();
		return $CI->session->userdata($session_var);
	}
?>