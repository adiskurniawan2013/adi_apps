intelli.accounts = function()
{
	return {
		title: _t('members'),
		url: intelli.config.admin_url + '/accounts/',
		statusesStore: ['active', 'approval', 'suspended', 'unconfirmed'],
		texts: {
			confirm_one: _t('are_you_sure_to_delete_this_account'),
			confirm_many: _t('are_you_sure_to_delete_selected_accounts'),
			not_remove: _t('not_remove_account')
		},
		removeBtn: true,
		first_index: 2,
		progressBar: false,
		record: [
			'id', 'username', 'email', 'fullname', 'usergroup', 'status', 'remove',
			{name: 'date', mapping: 'date_reg'},
			{name: 'edit', mapping: 'id'},
			{name: 'perms', mapping: 'id'},
			{name: 'config', mapping: 'id'}
		],
		columns: ['checkcolumn', {
				header: _t('id'),
				dataIndex: 'id',
				sortable: true,
				width: 40
			}, {
				header: _t('username'),
				dataIndex: 'username',
				sortable: true,
				width: 150,
				editor: new Ext.form.TextField(
				{
					allowBlank: false
				})
			}, {
				header: _t('fullname'),
				dataIndex: 'fullname',
				sortable: true,
				width: 100,
				editor: new Ext.form.TextField(
				{
					allowBlank: false
				})
			}, {
				header: _t('usergroups'),
				dataIndex: 'usergroup',
				sortable: true,
				width: 150,
				renderer: function(val, obj, grid)
				{
					var group = grid.json.usergroup_id;
					switch(group)
					{
						case '1': case 1:
							val = '<b style="color:green;">'+val+'</b>';
							break;
						case '2': case 2:
							val = '<b style="color:green;">'+val+'</b>';
							break;
						case '4': case '8': case 4: case 8:
							val = '<b style="color:grey;">'+val+'</b>';
							break;
					}

					return val;
				}
			}, {
				header: _t('email'),
				dataIndex: 'email',
				sortable: true,
				width: 180,
				editor: new Ext.form.TextField(
				{
					allowBlank: false
				})
			},
			'status', {
				header: _t('date'),
				dataIndex: 'date',
				sortable: true,
				width: 120
			}, {
				custom: 'perms',
				index: true,
				href: intelli.config.admin_url + '/manage/permissions/?user={value}',
				icon: 'lock_category.png',
				iconSize: 16,
				title: _t('permissions')
			}, {
				custom: 'custom_config',
				dataIndex: 'config',
				index: true,
				href: intelli.config.admin_url+'/configuration/?user={value}',
				icon: 'config-grid-ico.png',
				title: _t('go_to_config')
			}, {
				custom: 'edit',
				redirect: intelli.config.admin_url + '/accounts/edit/?id=',
				icon: 'edit-grid-ico.png',
				title: _t('edit')
			}, 'remove'
		]
	};
}();

Ext.onReady(function()
{
	intelli.accounts = new intelli.exGrid(intelli.accounts);

	var usergroups_store = new Ext.data.JsonStore(
	{
		url: intelli.accounts.cfg.url + 'read.json?action=getusergroups',
		root: 'data',
		fields: ['value', 'display']
	});

	var search_click = function()
	{
		var id = Ext.getCmp('searchId').getValue();
		var username = Ext.getCmp('searchUsername').getValue();
		var status = Ext.getCmp('stsFilter').getValue();
		var usergroup = Ext.getCmp('searchUsergroup').getValue();

		if ('' != id || '' != username || '' != status || '' != usergroup)
		{
			intelli.accounts.dataStore.baseParams =
			{
				action: 'get',
				username: username,
				status: status,
				id: id,
				usergroup: usergroup
			};

			intelli.accounts.dataStore.reload();
		}
	};

	intelli.accounts.cfg.tbar = new Ext.Toolbar(
	{
		items:[
			_t('id') + ':',
			{
				xtype: 'numberfield',
				allowDecimals: false,
				allowNegative: false,
				name: 'searchId',
				id: 'searchId',
				width: 50,
				emptyText: 'ID',
				style: 'text-align: left',
				listeners:
				{
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER) Ext.getCmp('fltBtn').handler();
					}
				}
			},

			'&nbsp;' + _t('username') + ':',
			{
				xtype: 'textfield',
				name: 'searchUsername',
				id: 'searchUsername',
				emptyText: 'Username, Fullname, or Email',
				width: 180,
				listeners:
				{
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER) Ext.getCmp('fltBtn').handler();
					}
				}
			},

			'&nbsp;' + _t('status') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: intelli.accounts.cfg.statusesStoreWithAll,
				value: 'all',
				width: 100,
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'stsFilter'
			},

			'&nbsp;' + _t('usergroup') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				editable: false,
				lazyRender: true,
				store: usergroups_store,
				displayField: 'display',
				value: _t('_select_'),
				valueField: 'value',
				id: 'searchUsergroup',
				name: 'searchUsergroup',
				width: 150
			},
			{
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'fltBtn',
				handler: search_click
			},
			'-',
			{
				text: _t('reset'),
				id: 'resetBtn',
				handler: function()
				{
					Ext.getCmp('searchId').reset();
					Ext.getCmp('searchUsername').reset();
					Ext.getCmp('stsFilter').setValue(_t('_select_'));
					Ext.getCmp('searchUsergroup').setValue(_t('_select_'));

					intelli.accounts.dataStore.baseParams =
					{
						action: 'get',
						username: '',
						status: '',
						usergroup: ''
					};

					intelli.accounts.dataStore.reload();
				}
			}
		]
	});

	intelli.accounts.init();

	if (intelli.urlVal('status'))
	{
		Ext.getCmp('stsFilter').setValue(intelli.urlVal('status'));
	}

	var search = intelli.urlVal('quick_search');

	if (null != search)
	{
		if (intelli.is_int(search))
		{
			Ext.getCmp('searchId').setValue(search);
		}
		else
		{
			Ext.getCmp('searchUsername').setValue(search);
		}

		search_click();
	}
});