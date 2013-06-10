<?php

class Login extends CI_Controller {
	
	function __construct() {
		parent::__construct();
	}
	
	function index(){
		$this->load->view("login_loader", array('main_content'=>"login"));
	}
	
	function logout(){
		$this->session->sess_destroy();
		redirect('login');
	}
	
	function submit(){
		if ( ! $this->validate_login()){
			//ajax data array
			$data	=	array(
				'is_valid'	=>	0
			);
			echo json_encode($data);
		}else{
			//view data array
			$data	=	array(
						'username'		=>	$_POST['username']
						);
			$content	=	$this->load->view("login_success", $data, TRUE);
			//ajax data array
			$data		=	array(
				'is_valid'	=>	1,
				'content'	=>	$content
			);
			echo json_encode($data);
		}
	}
	
	function validate_login(){
		$this->load->model('login_m');
		$result	= $this->login_m->validate_login();
		if($result === FALSE){
			return FALSE;
		} else {
			$result['is_logged_in']	=	TRUE;
			$this->session->set_userdata($result);
			return TRUE;
		}
	}
}
?>