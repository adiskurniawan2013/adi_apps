intelli.plans = function(){

	return {
		oGrid: null,
		title: _t('manage_plans'),
		renderTo: 'grid-placeholder',
		url: intelli.config.admin_url + '/manage/plans/',
		removeBtn: true,
		progressBar: false,
		record: [
			{name: 'title', mapping: 'title'},
			{name: 'item', mapping: 'item'},
			{name: 'cost', mapping: 'cost'},
			{name: 'days', mapping: 'days'},
			{name: 'order', mapping: 'order'},
			{name: 'status', mapping: 'status'},
			{name: 'edit', mapping: 'edit'},
			{name: 'remove', mapping: 'remove'}
		],
		columns: ['checkcolumn', {
			header: _t('title'), 
			dataIndex: 'title', 
			sortable: false, 
			width: 250
		},{
			header: _t('item'),
			dataIndex: 'item', 
			width: 100,
			sortable: true
		},{
			header: _t('cost'),
			dataIndex: 'cost', 
			width: 70,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: _t('days'), 
			dataIndex: 'days', 
			width: 70,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: _t('order'), 
			dataIndex: 'order',
			width: 100,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},'status',{
			custom: 'edit',
			redirect: intelli.config.admin_url + '/manage/plans/edit/?id=',
			icon: 'edit-grid-ico.png',
			title: _t('edit')
		}, 'remove']
	};
}();

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.plans.oGrid = new intelli.exGrid(intelli.plans);
		intelli.plans.oGrid.init();
	}
	else
	{
		var check_all = true;
		$("input[name='fields[]']").each(function()
		{
			if(!$(this).attr("checked"))
			{
				check_all = false;
			}
		});
	
		$("#check_all_fields").attr("checked", check_all);
	
		$("#check_all_fields").click(function()
		{
			var checked = $(this).attr("checked");
	
			$("input[name='fields[]']").each(function()
			{
				$(this).attr("checked", checked);
			});
		});

        $('select[name="item"]').change(function(){
            $('.items_fields').hide();
            $('.items_div').hide();
            var value = $(this).val();
            if(value == '') value = 'empty';
            $('#fields_'+value).show();
            $('#item_'+value).show();
        }).change();

		$("textarea.cked").each(function()
		{
			intelli.ckeditor($(this).attr("id"), {toolbar: 'Simple', height: '200px'});
		});
	}
});