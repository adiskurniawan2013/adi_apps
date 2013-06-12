<?php
class Invoicing extends CI_Controller {
    
   function __construct() {
        parent::__construct();
        if (!sess_var('is_logged_in')) {
            redirect('login');
        }
    }
    
    function index() {
        $data   = array('main_content'=>'invoicing');
        $this->load->view("loader", $data);
    }

}
?>