intelli.fields = function()
{
	return {
		title: _t('fields_groups_manage'),
		url: intelli.config.admin_url + '/manage/fields/group/',
		removeBtn: true,
		progressBar: false,
		record: ['name', 'title', 'item', 'extras', 'collapsed', 'order', 'edit', 'remove'],
		columns: ['checkcolumn', {
			header: _t('name'),
			dataIndex: 'name',
			sortable: true,
			width: 200
		}, {
			header: _t('title'),
			dataIndex: 'title',
			width: 200
		}, {
			header: _t('item'),
			dataIndex: 'item',
			width: 130
		}, {
			header: _t('extras'),
			dataIndex: 'extras',
			width: 130
		},{
			header: _t('collapsed'),
			dataIndex: 'collapsed',
			width: 150
		},{
			header: _t('order'),
			dataIndex: 'order',
			editor: new Ext.form.NumberField({
				allowBlank: false,
				allowDecimals: false,
				allowNegative: false
			}),
			sortable: true,
			width: 90
		},{
			custom: 'edit',
			redirect: intelli.config.admin_url + '/manage/fields/group/edit/?id=',
			icon: 'edit-grid-ico.png',
			title: _t('edit')
		}, 'remove']
	};
}();

Ext.onReady(function()
{
	intelli.fields = new intelli.exGrid(intelli.fields);
	intelli.fields.cfg.tbar = new Ext.Toolbar(
	{
		items:[
			_t('fields_item_filter') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: new Ext.data.SimpleStore(
				{
					fields: ['value', 'display'],
					data : intelli.config.items
				}),
				value: intelli.config.items[0][1],
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'itemsFilter'
			},
			' ',
			{
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'srchBtn',
				handler: function()
				{
					var tmp = Ext.getCmp('itemsFilter').getValue();

					if ('' != tmp)
					{
						intelli.fields.dataStore.baseParams = {action: 'get', item: tmp};
						intelli.fields.dataStore.reload();
					}
				}
			},
			'-',
			{
				text: _t('reset'),
				id: 'resetBtn',
				handler: function()
				{
					Ext.getCmp('itemsFilter').reset();
					intelli.fields.dataStore.baseParams = {action: 'get', item: ''};
					intelli.fields.dataStore.reload();
				}
			}
		]
	});

	intelli.fields.init();
});