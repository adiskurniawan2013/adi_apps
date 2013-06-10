<?php
class Login_m extends CI_Model {

	function validate_login(){
		// $this->db->select('userid, accountid , name, is_admin');
		$this->db->select('username, person_id');
		// $this->db->where("email ='".$_POST['email']."' AND pass ='".md5($_POST['pass'])."' AND status =1");
		$this->db->where("username ='".$_POST['username']."' AND password ='".md5($_POST['password'])."' AND deleted = 0");
		$query = $this->db->get('employees');
		if ($query->num_rows() > 0) {
		   	return $query->row_array();
		} else
			return FALSE;
	}
	
}
?>