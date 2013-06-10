<?php
	
	// load our grid with a table
	$grid = new Grid("items", array(
		"save"=>true,
		"delete"=>true,
		"where"=>"ThumbnailLocation != ''",
		"joins"=>array(
			"LEFT JOIN categories ON categories.CategoryID = tutorials.CategoryID"
		),
		"fields"=>array(
			"thumb" => "CONCAT('http://cmivfx.com/images/thumbs/',ThumbnailLocation)"
		),
		"select" => 'selectFunction'
	));
	
	// drop down function
	// if you have anonymous function support, then you can just put this function in place of
	// 'selectFunction'
	function selectFunction($grid) {
		$selects = array();
	
		// category select
		$grid->table = "categories";
		$selects["CategoryID"] = $grid->makeSelect("CategoryID","Name");
		
		// active select
		$selects["active"] = array("1"=>"true","0"=>"false");
		
		// render data			
		$grid->render($selects);
	}

	
?>