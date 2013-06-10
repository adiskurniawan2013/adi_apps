intelli.transactions = function()
{	
	return {
		title: _t('manage_transactions'),
		url: intelli.config.admin_url + '/manage/transactions/',
		removeBtn: true,
		renderTo: 'grid-placeholder',
		progressBar: true,
		vWindowAdd: null,
		vFormAdd: false,
		conditionsStoreFilter: new Ext.data.SimpleStore({
			fields: ['value', 'display'],
			data : [ ['or', _t('or')], ['and', _t('and')] ]
		}),
		texts:{
			confirm_one: _t('are_you_sure_to_delete_this_transaction'),			
			confirm_many: _t('are_you_sure_to_delete_transactions')
		},
		statusesStore: ['pending', 'passed', 'failed', 'refunded'],
		record:['username', 'plan_title', 'plan_id', 'item', 'item_id', 'email', 'order_number', 'total', 'date', 'status', 'remove'],
		columns:['checkcolumn', {
				header: _t('username'),
				dataIndex: 'username', 
				sortable: true, 
				width: 150
			},{
				header: _t('plan'), 
				dataIndex: 'plan_title',
				sortable: true, 
				width: 150,
				renderer: function(value, p, record)
				{
					if (value && record.json.plan_id > 0)
					{
						return String.format('<b><a href="'+intelli.config.admin_url+'/manage/plans/edit/?id={0}">{1}</a></b>', record.json.plan_id, value);
					}
					else
					{
						return String.format('<b>{0}</b>', record.json.plan_title);
					}
				}
			},{
				header: _t('item'),
				dataIndex: 'item', 
				sortable: true, 
				width: 100
			},{
				header: _t('item_id'),
				dataIndex: 'item_id',
				sortable: true,
				width: 30
			},{
				header: _t('email'), 
				dataIndex: 'email', 
				sortable: true, 
				width: 150,
				editor: new Ext.form.TextField({
					allowBlank: false
				})
			},{
				header: _t('order_number'),
				dataIndex: 'order', 
				sortable: true, 
				width: 150
			},{
				header: _t('total'), 
				dataIndex: 'total', 
				sortable: true, 
				width: 80
			},'status',{
				header: _t('date'), 
				dataIndex: 'date',
				sortable: true, 
				width: 120
			},'remove'
		]
	};
	
}();

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.transactions = new intelli.exGrid(intelli.transactions);

		var items_store = new Ext.data.JsonStore({
			url: intelli.transactions.cfg.url + 'read.json?action=getitems',
			root: 'data',
			fields: ['value', 'display']
		});

		intelli.transactions.cfg.tbar = new Ext.Toolbar(
		{
			items:[
			_t('username') + ':',
			{
				xtype: 'textfield',
				name: 'searchUsername',
				id: 'searchUsername',
				emptyText: 'Enter username',
				listeners: {
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER) Ext.getCmp('fltBtn').handler();
					}
				}
			},

			_t('item') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: items_store,
				displayField: 'display',
				valueField: 'value',
				id: 'searchItem',
				name: 'searchItem'
			},

			_t('status') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: intelli.transactions.cfg.statusesStoreWithAll,
				value: 'all',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'stsFilter'
			},{
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'fltBtn',
				handler: function()
				{
					var username = Ext.getCmp('searchUsername').getValue();
					var item = Ext.getCmp('searchItem').getValue();
					var status = Ext.getCmp('stsFilter').getValue();

					if ('' != username || '' != item || '' != status)
					{
						intelli.transactions.dataStore.baseParams =
						{
							action: 'get',
							username: username,
							item: item,
							status: status
						};

						intelli.transactions.dataStore.reload();
					}
				}
			},
			'-',
			{
				text: _t('reset'),
				id: 'resetBtn',
				handler: function()
				{
					Ext.getCmp('searchUsername').reset();
					Ext.getCmp('searchItem').reset();
					Ext.getCmp('stsFilter').setValue('all');

					intelli.transactions.dataStore.baseParams =
					{
						action: 'get',
						username: '',
						item: '',
						status: ''
					};

					intelli.transactions.dataStore.reload();
				}
			}]
		});
		intelli.transactions.init();
	}

	// add new transaction
	$('#add').click(function()
	{
		if (!intelli.transactions.cfg.vFormAdd)
		{
			// define item dropdown
			var item = new Ext.form.ComboBox(
			{
				fieldLabel: _t('item'),
				typeAhead: true,
				triggerAction: 'all',
				allowBlank: false,
				width: 200,
				editable: false,
				id: 'item_name',
				hiddenName: 'item_name',
				lazyRender: true,
				store: new Ext.data.JsonStore({
					url: intelli.transactions.cfg.url + 'read.json?action=getitems',
					root: 'data',
					fields: ['value', 'display']
				}),
				displayField: 'display',
				valueField: 'value',
				listeners: {
					select: function(combo, record, index)
					{
						var itemname = combo.getValue();

						// hide item id if creating plan for account
						if ('accounts' == itemname)
						{
							Ext.getCmp('itemid').hide();
						}
						else
						{
							Ext.getCmp('itemid').show();
						}

						// clear plans dropdown
						Ext.getCmp('item_plan').clearValue();

						Ext.getCmp('item_plan').getStore().baseParams = {'itemname': itemname};
						Ext.getCmp('item_plan').getStore().reload({params: {'itemname': itemname}});
					}
				}
			});

			// define plans dropdown
			var plan = new Ext.form.ComboBox(
			{
				fieldLabel: _t('plan'),
				typeAhead: true,
				triggerAction: 'all',
				allowBlank: false,
				width: 200,
				id: 'item_plan',
				editable: false,
				hiddenName: 'plan',
				lazyRender: true,
				store: new Ext.data.JsonStore({
					url: intelli.transactions.cfg.url + 'read.json?action=getplans',
					root: 'data',
					fields: ['value', 'display']
				}),
				displayField: 'display',
				valueField: 'value'
			});

			var gateway = new Ext.form.ComboBox(
			{
				fieldLabel: _t('payment_gateway'),
				typeAhead: true,
				triggerAction: 'all',
				allowBlank: true,
				width: 200,
				editable: false,
				hiddenName: 'payment',
				lazyRender: true,
				store: new Ext.data.JsonStore({
					url: intelli.transactions.cfg.url + 'read.json?action=getgateways',
					root: 'data',
					fields: ['value', 'display']
				}),
				displayField: 'display',
				valueField: 'value'
			});

			var date_fields = [
				new Ext.form.DateField(
				{
					name: 'date',
					editable: true,
					format: 'Y-m-d',
					width: 150
				}),
				new Ext.form.TimeField(
				{
					name: 'time',
					editable: true,
					format: 'H:i:s',
					increment: 30,
					width: 80
				})
			];

			intelli.transactions.cfg.vFormAdd = new Ext.FormPanel({
				labelWidth: 150,
				frame: true,
				autoHeight: true,
				border: false,
				bodyStyle: 'padding: 5px 5px 0;',
				renderTo: 'box_transactions_add',
				items: [item, plan, gateway,
				{
					fieldLabel: _t('order_number'),
					name: 'order',
					width: 200,
					allowBlank: false,
					xtype: 'textfield'
				}, {
					fieldLabel: _t('account'),
					name: 'username',
					width: 150,
					allowBlank: false,
					xtype: 'textfield'
				}, {
					fieldLabel: _t('email'),
					name: 'email',
					width: 200,
					vtype: 'email',
					allowBlank: false,
					xtype: 'textfield'
				}, {
					fieldLabel: _t('total'),
					name: 'total',
					width: 150,
					allowBlank: false,
					xtype: 'textfield'
				}, {
					fieldLabel: _t('id'),
					name: 'itemid',
					allowBlank: true,
					hidden: true,
					id: 'itemid',
					width: 150,
					xtype: 'numberfield'
				}, {
					fieldLabel: _t('date'),
					xtype: 'container',
					layout: 'column',
					anchor: '100%',
					defaultType: 'field',
					items: date_fields
				}]
			});

			intelli.transactions.cfg.vWindowAdd = new Ext.Window({
				title: _t('add_transaction'),
				items: intelli.transactions.cfg.vFormAdd,
				width: 425,
				closeAction: 'hide',
				buttons: [
				{
					text: _t('save'),
					autoWidth: true,
					handler: function()
					{
						var form = intelli.transactions.cfg.vFormAdd.getForm();

						if (form.isValid())
						{
							form.submit(
							{
								url: intelli.transactions.cfg.url + 'read.json?action=add',
								success: function(form, data)
								{
									Ext.Msg.show(
									{
										title: _t('confirm'),
										msg: _t('add_new_transaction'),
										buttons: Ext.Msg.YESNO,
										icon: Ext.Msg.QUESTION,
										fn: function(btn)
										{
											if ('no' == btn)
											{
												intelli.transactions.cfg.vWindowAdd.hide();
											}

											form.reset();
										}
									});

									intelli.transactions.dataStore.reload();
								},
								failure: function(form, data)
								{
									intelli.admin.notifBox({msg: data.result.data.msg, type: 'error', autohide: true});
								}
							});
						}
					}
				},
				{
					text: _t('cancel'),
					autoWidth: true,
					handler: function()
					{
						intelli.transactions.cfg.vWindowAdd.hide();

						var form = intelli.transactions.cfg.vFormAdd.getForm();
						form.reset();
					}
				}]
			});
		}

		intelli.transactions.cfg.vWindowAdd.show();
        $('.x-form-text[name="username"]').autocomplete({ url: intelli.config.admin_url + '/accounts.json', minChars: 2});

		return false;
	});
});