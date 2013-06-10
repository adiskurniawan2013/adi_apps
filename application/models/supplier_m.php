<?php
class Supplier_m extends Person_m {	

	// Determines if a given person_id is a customer
	function exists($person_id) {
		$this->db->from('suppliers');	
		$this->db->join('people', 'people.person_id = suppliers.person_id');
		$this->db->where('suppliers.person_id',$person_id);
		$query = $this->db->get();
		return ($query->num_rows()==1);
	}
	
	// Returns all the suppliers
	// function get_all($limit=10000, $offset=0) {
	function get_all() {
		$this->db->from('suppliers');
		$this->db->join('people','suppliers.person_id=people.person_id');			
		$this->db->where('deleted',0);
		$this->db->order_by("first_name", "asc");
		// $this->db->limit($limit);
		// $this->db->offset($offset);
		// return $this->db->get();
		$query = $this->db->get();

        if ($query->num_rows() > 0) {
            foreach($query->result() as $row) {
                $result[] = $row;
            }
            return $result;
        }		
	}

	function count_all() {
		$this->db->from('suppliers');
		$this->db->where('deleted',0);
		return $this->db->count_all_results();
	}
	
	// Gets information about a particular supplier
	function get_supplier($supplier_id){
	$this->db->from('suppliers');	
	$this->db->join('people', 'people.person_id = suppliers.person_id');
	$this->db->where('suppliers.person_id', $supplier_id);
	$query = $this->db->get();
	
	if ($query->num_rows() > 0) {
	    return $query->row_array();
	} else
	    return FALSE;
	}
	
	// Gets information about multiple suppliers
	function get_multiple_info($suppliers_ids) {
		$this->db->from('suppliers');
		$this->db->join('people', 'people.person_id = suppliers.person_id');		
		$this->db->where_in('suppliers.person_id',$suppliers_ids);
		$this->db->order_by("first_name", "asc");
		return $this->db->get();		
	}
	
	// Inserts or updates a suppliers
	function add(){
    	$person_data = array(
		'first_name'=>$this->input->post('first_name'),
		'email'=>$this->input->post('email'),
		'phone_number'=>$this->input->post('phone_number'),
		'address_1'=>$this->input->post('address_1'),
		'address_2'=>$this->input->post('address_2'),
		'city'=>$this->input->post('city'),
		'state'=>$this->input->post('state'),
		'zip'=>$this->input->post('zip'),
		'country'=>$this->input->post('country'),
		'comments'=>$this->input->post('comments')
		);
		$supplier_data=array(
		'company_name'=>$this->input->post('company_name'),
		'account_number'=>$this->input->post('account_number')=='' ? null:$this->input->post('account_number'),
		);

    	$this->db->trans_start();
    	if(parent::save($person_data, $supplier_id='')) {
    		if (!$supplier_id or !$this->exists($supplier_id)) {
				$supplier_data['person_id'] = $person_data['person_id'];
				$this->db->insert('suppliers', $supplier_data);
			}
		}
		$this->db->trans_complete();
        
        return $this->db->_error_number();

    }
    
    function update($supplier_id){
       $person_data = array(
		'first_name'=>$this->input->post('first_name'),
		'email'=>$this->input->post('email'),
		'phone_number'=>$this->input->post('phone_number'),
		'address_1'=>$this->input->post('address_1'),
		'address_2'=>$this->input->post('address_2'),
		'city'=>$this->input->post('city'),
		'state'=>$this->input->post('state'),
		'zip'=>$this->input->post('zip'),
		'country'=>$this->input->post('country'),
		'comments'=>$this->input->post('comments')
		);
		$supplier_data=array(
		'company_name'=>$this->input->post('company_name'),
		'account_number'=>$this->input->post('account_number')=='' ? null:$this->input->post('account_number'),
		);

        $this->db->trans_start();
        if(parent::save($person_data, $supplier_id)) {
    		if ($supplier_id or $this->exists($supplier_id)) {
				$this->db->where('person_id', $supplier_id);
				$this->db->update('suppliers', $supplier_data);
			}
		}
        $this->db->trans_complete();

        return $this->db->_error_number();
    }
	
	// Deletes one supplier
	function delete($supplier_id) {
		$this->db->where('person_id', $supplier_id);
		return $this->db->update('suppliers', array('deleted' => 1));
	}
	
	// Deletes a list of suppliers
	function delete_list($supplier_ids) {
		$this->db->where_in('person_id',$supplier_ids);
		return $this->db->update('suppliers', array('deleted' => 1));
 	}
}
?>
