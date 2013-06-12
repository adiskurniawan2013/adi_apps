<?php
class Supplier extends CI_Controller {
    
   function __construct() {
        parent::__construct();
        if (!sess_var('is_logged_in')) {
            redirect('login');
        }
    }
    
    function index() {
        $data   = array('main_content'=>'supplier/index');
        $this->load->view("loader", $data);
    }

    //function to handle callbacks
    function datatable() {
        $this->datatables->select('suppliers.person_id, people.first_name, suppliers.company_name, people.email, people.phone_number')
        ->from('suppliers')
        ->join('people', 'suppliers.person_id = people.person_id')           
        ->where('suppliers.deleted', 0)
        ->add_column('Actions', get_buttons('$1', strtolower(get_class())),'suppliers.person_id');

        echo $this->datatables->generate();
    }

    function add() {
        $this->load->view("loader",array('main_content'=>"supplier/edit"));
    }

    function edit($supplier_id='') {
        if(! $supplier_id) {
            echo "ID required";
            return;
        }
        $result =   $this->supplier_m->get_supplier($supplier_id);
        if( ! $result) {
            echo "Nothing to edit";
            return;
        }
        $result['main_content'] =   "supplier/edit";
        $this->load->view("loader",$result);
    }

    function delete($supplier_id='') {
        if(! $supplier_id) {
            echo "Id required";
            return;
        }
        $this->supplier_m->delete($supplier_id);
        $this->index();
    }
   
    function submit($supplier_id=''){
        //validate form
        $this->form_validation->set_rules('first_name', 'Name', 'trim|required|min_length[3]');
        
        if ($this->form_validation->run() == FALSE){
            //ajax data array
            $data   =   array(
                'server_validation'     =>  validation_errors()
            );
            echo json_encode($data);
        } else {
            if($supplier_id){
                $result     =   $this->supplier_m->update($supplier_id);
                $content    =   "Supplier has been UPDATED successfully.";
            } else {
                $result     =   $this->supplier_m->add();
                $content    =   "Supplier has been CREATED successfully.";
            }
            //if duplicate key
            if($result == 1062){
                //ajax data array
                $data   =   array(
                    'is_valid'  =>  0
                );
                echo json_encode($data);
            }else{
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
        $data = file_get_contents("import_suppliers.csv");
        $name = 'import_suppliers.csv';
        force_download($name, $data);
    }
    
    function excel_import() {
        // $this->load->view("suppliers/v_excel_import", null);
        $data   = array('main_content'=>'supplier/excel_import');
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
                    
                    $supplier_data=array(
                    'account_number'=>$data[11]=='' ? null:$data[11],
                    'taxable'=>$data[12]=='' ? 0:1,
                    );
                    
                    if(!$this->supplier_m->save($person_data,$supplier_data)) {   
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
            $msg = "Most suppliers imported. But some were not, here is list of their CODE (" .count($failCodes) ."): ".implode(", ", $failCodes);
            $success = false;
        } else {
            $msg = "Import suppliers successful";
        }

        echo json_encode( array('success'=>$success,'message'=>$msg) );
    }
}
?>