<?php
class Customer_m extends Person_m {	
	
	// Determines if a given person_id is a customer
	function exists($person_id)	{
		$this->db->from('customers');	
		$this->db->join('people', 'people.person_id = customers.person_id');
		$this->db->where('customers.person_id',$person_id);
		$query = $this->db->get();
		return ($query->num_rows() == 1);
	}

	// Returns all the customers
	// function get_all($limit=10000, $offset=0)
	function get_all() {
		$this->db->from('customers');
		$this->db->join('people','customers.person_id=people.person_id');			
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
		$this->db->from('customers');
		$this->db->where('deleted',0);
		return $this->db->count_all_results();
	}
 	
	function get_customer($customer_id){
	$this->db->from('customers');	
	$this->db->join('people', 'people.person_id = customers.person_id');
	$this->db->where('customers.person_id', $customer_id);
	$query = $this->db->get();
	
	if ($query->num_rows() > 0) {
	    return $query->row_array();
	} else
	    return FALSE;
	}
	
	// Gets information about multiple customers
	function get_multiple_info($customer_ids) {
		$this->db->from('customers');
		$this->db->join('people', 'people.person_id = customers.person_id');		
		$this->db->where_in('customers.person_id', $customer_ids);
		$this->db->order_by("last_name", "asc");
		return $this->db->get();		
	}
	
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
            
        $customer_data=array(
        	'company_name'=>$this->input->post('company_name'),
            'account_number'=>$this->input->post('account_number')=='' ? null:$this->input->post('account_number'),
            'taxable'=>$this->input->post('taxable')=='' ? 0:1,
            );

    	$this->db->trans_start();
    	if(parent::save($person_data, $customer_id='')) {
    		if (!$customer_id or !$this->exists($customer_id)) {
				$customer_data['person_id'] = $person_data['person_id'];
				$this->db->insert('customers', $customer_data);
			}
		}
		$this->db->trans_complete();
        
        return $this->db->_error_number();

    }
    
    function update($customer_id){
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
            
        $customer_data=array(
        	'company_name'=>$this->input->post('company_name'),
            'account_number'=>$this->input->post('account_number')=='' ? null:$this->input->post('account_number'),
            'taxable'=>$this->input->post('taxable')=='' ? 0:1,
            );

        $this->db->trans_start();
        if(parent::save($person_data, $customer_id)) {
    		if ($customer_id or $this->exists($customer_id)) {
				$this->db->where('person_id', $customer_id);
				$this->db->update('customers', $customer_data);
			}
		}
        $this->db->trans_complete();

        return $this->db->_error_number();
    }

	// Deletes one customer
	function delete($customer_id) {
		$this->db->where('person_id', $customer_id);
		return $this->db->update('customers', array('deleted' => 1));
	}
	
	// Deletes a list of customers
	function delete_list($customer_ids)	{
		$this->db->where_in('person_id', $customer_ids);
		return $this->db->update('customers', array('deleted' => 1));
 	}
}
?>
