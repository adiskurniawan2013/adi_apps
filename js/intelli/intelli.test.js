intelli.test_grid = function(){

	return {
		oGrid: null,			// place for grid! not modified
		title: false,			// grid title, default: false
		url: '',				// url to load vars
		pagingStore:[],			// paging values, default: [10,20,30,40,50]
		statusesStore:[],		// status values, default: ['active', 'inactive']
		rand: false,			// unique name for all ids in grid, default: random value
		renderTo: false,		// box for grid, if false generate unique box (box + rand value)
		removeBtn: false,		// show remove button to delete all. params: true, false. default: false
		paging: false,			// paging in grid
		progressBar: true,		// show progress bar in right corner (if paging false then become false too), default: true
		sliding: true,			// pagging type: sliding
		first: 'none',			// first column for sort, if 'none' then grid get first column
		first_index: 'none',	// column index for autoExpandColumn, if 'none' then grid get first column
		tbar:[],				// top toolbar ( recommended after 'new intelli.exGrid(intelli.test_grid)' )
		bbar:[],				// add custom bottom toolbar after all system buttons			
		record: [],				// record for store
		texts: {},				// texts in grid. (confirm_one, confirm_many)
		columns: [				// columns in grid
			'checkcolumn',		// check columns 
			'numberer',			// numberer columns
			'status',			// status column
			'remove',			// remove button 
			{					// custom button for redirect
				custom: 'edit',
				redirect: intelli.config.admin_url + 'manage/fields/group/edit/?id=',
				icon: 'edit-grid-ico.png',
				width: 32,
				iconSize: 16,
				title: _t('edit')
			}]
	};
}();
Ext.onReady(function()
{
	intelli.test_grid.oGrid = new intelli.exGrid(intelli.test_grid);
	intelli.test_grid.oGrid.init();
});

