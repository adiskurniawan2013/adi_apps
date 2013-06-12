<?php
class Item_m extends CI_Model {
	
	// Determines if a given item_id is an item

	function exists($item_id) {
		$this->db->from('items');
		$this->db->where('item_id',$item_id);
		$query = $this->db->get();

		return ($query->num_rows()==1);
	}

	// Returns all the items
	// function get_all($limit=50, $offset=3) {
	function get_all() {
		$this->db->from('items');
		$this->db->where('deleted',0);
		// $this->db->order_by("name", "asc");
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
		$this->db->from('items');
		$this->db->where('deleted',0);
		return $this->db->count_all_results();
	}

	function get_all_filtered($low_inventory=0,$is_serialized=0,$no_description) {
		$this->db->from('items');
		if ($low_inventory !=0 ) {
			$this->db->where('quantity <=','reorder_level', false);
		}
		if ($is_serialized !=0 ) {
			$this->db->where('is_serialized',1);
		}
		if ($no_description!=0 ) {
			$this->db->where('description','');
		}
		$this->db->where('deleted',0);
		$this->db->order_by("name", "asc");
		return $this->db->get();
	}

	// Gets information about a particular item
	function get_info($item_id) {
		$this->db->from('items');
		$this->db->where('item_id',$item_id);
		
		$query = $this->db->get();

		if($query->num_rows()==1) {
			return $query->row();
		} else {
			//Get empty base parent object, as $item_id is NOT an item
			$item_obj=new stdClass();

			//Get all the fields from items table
			$fields = $this->db->list_fields('items');

			foreach ($fields as $field)	{
				$item_obj->$field='';
			}

			return $item_obj;
		}
	}

	function get_item($item_id){
	$this->db->from('items');	
	$this->db->where('item_id',$item_id);
	$query = $this->db->get();
	
	if ($query->num_rows() > 0) {
	    return $query->row_array();
	} else
	    return FALSE;
	}

	/*
	Get an item id given an item number
	*/
	function get_item_id($item_number)
	{
		$this->db->from('items');
		$this->db->where('item_number',$item_number);

		$query = $this->db->get();

		if($query->num_rows()==1)
		{
			return $query->row()->item_id;
		}

		return false;
	}

	/*
	Gets information about multiple items
	*/
	function get_multiple_info($item_ids) {
		$this->db->from('items');
		$this->db->where_in('item_id',$item_ids);
		$this->db->order_by("item", "asc");
		return $this->db->get();
	}

	/*
	// Inserts or updates a item
	function save(&$item_data,$item_id=false) {
		if (!$item_id or !$this->exists($item_id)) {
			if($this->db->insert('items',$item_data)) {
				$item_data['item_id']=$this->db->insert_id();
				return true;
			}
			return false;
		}

		$this->db->where('item_id', $item_id);
		return $this->db->update('items',$item_data);
	}
	*/

	function add(){
       	$item_id=-1;
       	$item_data = array(
        'name'=>$this->input->post('name'),
        'description'=>$this->input->post('description'),
        'category'=>$this->input->post('category'),
        'supplier_id'=>$this->input->post('supplier_id')=='' ? null:$this->input->post('supplier_id'),
        'item_number'=>$this->input->post('item_number')=='' ? null:$this->input->post('item_number'),
        'cost_price'=>$this->input->post('cost_price'),
        'unit_price'=>$this->input->post('unit_price'),
        'quantity'=>$this->input->post('quantity'),
        'reorder_level'=>$this->input->post('reorder_level'),
        'location'=>$this->input->post('location'),
        'allow_alt_description'=>$this->input->post('allow_alt_description'),
        'is_serialized'=>$this->input->post('is_serialized')
        );
        
        // $employee_id = $this->m_employees->get_logged_in_employee_info()->person_id;
        $employee_id = sess_var('person_id');
        $cur_item_info = $this->get_info($item_id); 
        
		$this->db->insert('items', $item_data);
		$item_data['item_id'] = $this->db->insert_id();
		$item_id = $item_data['item_id'];
        
        $inv_data = array (
                'trans_date'=>date('Y-m-d H:i:s'),
                'trans_items'=>$item_id,
                'trans_user'=>$employee_id,
                'trans_comment'=>'manual editing',
                'trans_inventory'=>$cur_item_info ? $this->input->post('quantity') - $cur_item_info->quantity : $this->input->post('quantity')
            );
        $this->inventory_m->insert($inv_data);

        $items_taxes_data = array();
        $tax_names = $this->input->post('tax_names');
        $tax_percents = $this->input->post('tax_percents');
        for($k=0;$k<count($tax_percents);$k++) {
            if (is_numeric($tax_percents[$k])) {
                $items_taxes_data[] = array('name'=>$tax_names[$k], 'percent'=>$tax_percents[$k] );
            }
        }
        $this->item_tax_m->save($items_taxes_data, $item_id);

        return $this->db->_error_number();
    }
    
    function update($item_id){
        $item_data = array(
        'name'=>$this->input->post('name'),
        'description'=>$this->input->post('description'),
        'category'=>$this->input->post('category'),
        'supplier_id'=>$this->input->post('supplier_id')=='' ? null:$this->input->post('supplier_id'),
        'item_number'=>$this->input->post('item_number')=='' ? null:$this->input->post('item_number'),
        'cost_price'=>$this->input->post('cost_price'),
        'unit_price'=>$this->input->post('unit_price'),
        'quantity'=>$this->input->post('quantity'),
        'reorder_level'=>$this->input->post('reorder_level'),
        'location'=>$this->input->post('location'),
        'allow_alt_description'=>$this->input->post('allow_alt_description'),
        'is_serialized'=>$this->input->post('is_serialized')
        );
        
        // $employee_id = $this->m_employees->get_logged_in_employee_info()->person_id;
        $employee_id = sess_var('person_id');
        $cur_item_info = $this->get_info($item_id);

        $this->db->where('item_id', $item_id);
		$this->db->update('items', $item_data);

		$inv_data = array (
                'trans_date'=>date('Y-m-d H:i:s'),
                'trans_items'=>$item_id,
                'trans_user'=>$employee_id,
                'trans_comment'=>'manual editing',
                'trans_inventory'=>$cur_item_info ? $this->input->post('quantity') - $cur_item_info->quantity : $this->input->post('quantity')
            );
        $this->inventory_m->insert($inv_data);

        $items_taxes_data = array();
        $tax_names = $this->input->post('tax_names');
        $tax_percents = $this->input->post('tax_percents');
        for($k=0;$k<count($tax_percents);$k++) {
            if (is_numeric($tax_percents[$k])) {
                $items_taxes_data[] = array('name'=>$tax_names[$k], 'percent'=>$tax_percents[$k] );
            }
        }
        $this->item_tax_m->save($items_taxes_data, $item_id);

        return $this->db->_error_number();
    }

	/*
	Updates multiple items at once
	*/
	function update_multiple($item_data, $item_ids)	{
		$this->db->where_in('item_id',$item_ids);
		return $this->db->update('items',$item_data);
	}

	/*
	Deletes one item
	*/
	function delete($item_id) {
		$this->db->where('item_id', $item_id);
		return $this->db->update('items', array('deleted' => 1));
	}

	/*
	Deletes a list of items
	*/
	function delete_list($item_ids)	{
		$this->db->where_in('item_id',$item_ids);
		return $this->db->update('items', array('deleted' => 1));
 	}

	function get_categories() {
		$this->db->select('category');
		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->distinct();
		$this->db->order_by("category", "asc");

		return $this->db->get();
	}
}
?>
