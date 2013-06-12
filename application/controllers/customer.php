<?php
class Customer extends CI_Controller {
    
   function __construct() {
        parent::__construct();
        if (!sess_var('is_logged_in')) {
            redirect('login');
        }
    }
    
    function index() {
        // versi 1
        // $result = $this->customer_m->get_all();
        // $data   = array('main_content'=>'customer/index', 'customers'=>$result);
        // $this->load->view("loader", $data);

        // versi 2
        // set table id in table open tag
        // $tmpl = array ( 'table_open'  => '<table id="customertable" cellpadding="2" cellspacing="1">' );
        // $this->table->set_template($tmpl); 
        // $this->table->set_heading('Name','Company Name','Email','Phone', 'Action');
        // $this->load->view('customer/index');

        // versi terbaik 
        $data   = array('main_content'=>'customer/index');
        $this->load->view("loader", $data);
    }

    /*
    //function to handle callbacks
    function datatable() {
        $this->datatables->select('customers.person_id, people.first_name, customers.company_name, people.email, people.phone_number')
        ->from('customers')
        ->join('people', 'customers.person_id = people.person_id')           
        ->where('customers.deleted', 0)
        ->add_column('Actions', get_buttons('$1', strtolower(get_class())),'customers.person_id');

        echo $this->datatables->generate();
    }

    */

    function datatable() {
        $this->datatables->select('customers.person_id, people.first_name, customers.company_name, people.email, people.phone_number')
        ->from('customers')
        ->join('people', 'customers.person_id = people.person_id')           
        ->where('customers.deleted', 0)
        ->add_column('Actions', get_buttons('$1', strtolower(get_class())),'customers.person_id');

        echo $this->datatables->generate();
    }   

    function add() {
        $this->load->view("loader",array('main_content'=>"customer/edit"));
    }

    function edit($customer_id='') {
        if(! $customer_id) {
            echo "ID required";
            return;
        }
        $result =   $this->customer_m->get_customer($customer_id);
        if( ! $result) {
            echo "Nothing to edit";
            return;
        }
        $result['main_content'] =   "customer/edit";
        $this->load->view("loader",$result);
    }

    function delete($customer_id='') {
        if(! $customer_id) {
            echo "Id required";
            return;
        }
        $this->customer_m->delete($customer_id);
        $this->index();
    }
   
    function submit($customer_id=''){
        //validate form
        $this->form_validation->set_rules('first_name', 'Name', 'trim|required|min_length[3]');
        
        if ($this->form_validation->run() == FALSE){
            //ajax data array
            $data   =   array(
                'server_validation'     =>  validation_errors()
            );
            echo json_encode($data);
        } else {
            if($customer_id){
                $result     =   $this->customer_m->update($customer_id);
                $content    =   "Customer has been UPDATED successfully.";
            } else {
                $result     =   $this->customer_m->add();
                $content    =   "Customer has been CREATED successfully.";
            }
            //if duplicate key
            if($result == 1062){
                //ajax data array
                $data   =   array(
                    'is_valid'  =>  0
                );
                echo json_encode($data);
            } else {
                //ajax data array
                $data   =   array(
                    'is_valid'  =>  1,
                    'content'   =>  $content
                );
                echo json_encode($data);
            }
        }//end ELSE form valid
    }
   
   function excel() {
        $data = file_get_contents("import_customers.csv");
        $name = 'import_customers.csv';
        force_download($name, $data);
    }
    
    function excel_import() {
        // $this->load->view("customers/v_excel_import", null);
        $data   = array('main_content'=>'customer/excel_import');
        $this->load->view("loader", $data);
    }

    function do_excel_import() {
        $msg = 'do_excel_import';
        $failCodes = array();
        if ($_FILES['file_path']['error']!=UPLOAD_ERR_OK) {
            $msg = $this->lang->line('items_excel_import_failed');
            echo json_encode( array('success'=>false,'message'=>$msg) );
            return;
        } else {
            if (($handle = fopen($_FILES['file_path']['tmp_name'], "r")) !== FALSE) {
                //Skip first row
                fgetcsv($handle);
                
                $i=1;
                while (($data = fgetcsv($handle)) !== FALSE) {
                    $person_data = array(
                    'first_name'=>$data[0],
                    'last_name'=>$data[1],
                    'email'=>$data[2],
                    'phone_number'=>$data[3],
                    'address_1'=>$data[4],
                    'address_2'=>$data[5],
                    'city'=>$data[6],
                    'state'=>$data[7],
                    'zip'=>$data[8],
                    'country'=>$data[9],
                    'comments'=>$data[10]
                    );
                    
                    $customer_data=array(
                    'account_number'=>$data[11]=='' ? null:$data[11],
                    'taxable'=>$data[12]=='' ? 0:1,
                    );
                    
                    if(!$this->customer_m->save($person_data,$customer_data)) {   
                        $failCodes[] = $i;
                    }
                    
                    $i++;
                }
            } else {
                echo json_encode( array('success'=>false,'message'=>'Your upload file has no data or not in supported format.') );
                return;
            }
        }

        $success = true;
        if(count($failCodes) > 1) {
            $msg = "Most customers imported. But some were not, here is list of their CODE (" .count($failCodes) ."): ".implode(", ", $failCodes);
            $success = false;
        } else {
            $msg = "Import Customers successful";
        }

        echo json_encode( array('success'=>$success,'message'=>$msg) );
    }
}
?>