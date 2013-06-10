intelli.plugins = {
	url: intelli.config.admin_url + '/manage/plugins/'
};

var install_click = function(val, data, record, that)
{
	var type = Ext.getCmp('typeFilter').getValue();

	if (record.json.notes)
	{
		Ext.Msg.show(
		{
			title: 'Invalid plugin dependencies',
			msg: record.json.notes,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.WARNING
		});

		return ;
	}

	Ext.Msg.show(
	{
		title: _t('confirm'),
		msg: _t('are_you_sure_' + val.custom + '_plugin'),
		buttons: Ext.Msg.YESNO,
		icon: Ext.Msg.QUESTION,
		fn: function(btn)
		{
			if ('yes' == btn)
			{
				Ext.Ajax.request(
				{
					url: intelli.plugins.url + 'read.json',
					method: 'POST',
					params:
					{
						prevent_csrf: $("#box_extras input[name='prevent_csrf']").val(),
						action: val.custom,
						type: type,
						extra: record.json.file
					},
					failure: function()
					{
						Ext.MessageBox.alert(_t('error_saving_changes'));
					},
					success: function(data)
					{
						intelli.installed.dataStore.reload();
						if (intelli.available.cfg)
						{
							intelli.available.dataStore.reload();
						}

						var response = Ext.decode(data.responseText);
						var type = response.error ? 'error' : 'notif';

						intelli.admin.notifBox({msg: response.msg, type: type, autohide: false});
						intelli.admin.refreshAdminMenu();
					}
				});
			}
		}
	});
};

var install_request = function()
{
	if (intelli.install_data.length >= 1)
	{
		var params = intelli.install_data.shift();

		Ext.Ajax.request(
		{
			url: intelli.plugins.url + 'read.json',
			method: 'POST',
			params: params,
			failure: function()
			{
				var msg = new String(_t('error_install_plugin'));

				Ext.MessageBox.alert(msg.replace(/:plugin/, params.extra));
				install_request();
			},
			success: function(data)
			{
				var response = Ext.decode(data.responseText);
				var type = response.error ? 'error' : 'notif';
				var msg = '';
				if (intelli.install_data.length > 0)
				{
					msg = new String(_t('plugins_left'));
					msg = msg.replace(/:count/, intelli.install_data.length);
				}
				intelli.admin.notifBox({msg: response.msg + '<br />' + msg, type: type, autohide: false});	
				install_request();
			}
		});
	}
	else
	{
		intelli.installed.dataStore.reload();
		if (intelli.available.cfg)
		{
			intelli.available.dataStore.reload();
		}
		intelli.admin.refreshAdminMenu();
	}
};

var install_click_multiple = function()
{
	var rows = intelli.available.grid.getSelectionModel().getSelections();
	intelli.install_data = [];
	for (var i = 0; i < rows.length; i++)
	{
		intelli.install_data.push({action:'install', extra: rows[i].json.file});
	}

	install_request();
};

var readme_click = function(val, data, record, that)
{
	Ext.Ajax.request(
	{
		url: intelli.plugins.url + 'read.json',
		method: 'POST',
		params:
		{
			action: 'getdoctabs',
			extra: (record.json.file ? record.json.file : record.json.name)
		},
		failure: function()
		{
			Ext.MessageBox.alert(_t('error_while_doc_tabs'));
		},
		success: function(data)
		{
			var data = Ext.decode(data.responseText);
			var doc_tabs = data.doc_tabs;
			var plugin_info = data.extra_info;

			if (null != doc_tabs)
			{
				var plugin_tabs = new Ext.TabPanel(
				{
					region: 'center',
					bodyStyle: 'padding: 5px;',
					activeTab: 0,
					defaults:
					{
						autoScroll: true
					},
					items: doc_tabs
				});

				var plugin_info = new Ext.Panel(
				{
					region: 'east',
					split: true,
					minWidth: 200,
					collapsible: true,
					html: plugin_info,
					bodyStyle: 'padding: 5px;'
				});

				var win = new Ext.Window(
				{
					title: _t('plugin_documentation'),
					closable: true,
					width: 800,
					height: 550,
					border: false,
					plain: true,
					layout: 'border',
					items: [plugin_tabs, plugin_info]
				});

				win.show();
			}
			else
			{
				Ext.Msg.show(
				{
					title: _t('error'),
					msg: _t('doc_plugin_not_available'),
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
	});
};

var upgrade_click = function(val, data, record, that)
{
	Ext.Ajax.request({
		url: intelli.plugins.url + 'read.json',
		method: 'POST',
		params:
		{
			prevent_csrf: $("#box_extras input[name='prevent_csrf']").val(),
			action: 'install',
			extra: data
		},
		failure: function()
		{
			Ext.MessageBox.alert(_t('error_saving_changes'));
		},
		success: function(data)
		{
			intelli.installed.dataStore.reload();
			if(intelli.available.cfg)
			intelli.available.dataStore.reload();

			var response = Ext.decode(data.responseText);
			var type = response.error ? 'error' : 'notif';

			intelli.admin.notifBox({msg: response.msg, type: type, autohide: false});

			intelli.admin.refreshAdminMenu();
		}
	});
};

var uninstall_click = function(val, data, record, that)
{
	if (record.data.uninstall)
	{
		Ext.Msg.show(
		{
			title: _t('confirm'),
			msg: _t('are_you_sure_to_uninstall_selected_plugin'),
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function(btn)
			{
				if('yes' == btn)
				{
					Ext.Ajax.request(
					{
						url: intelli.plugins.url + 'read.json',
						method: 'POST',
						params:
						{
							prevent_csrf: $("#box_extras input[name='prevent_csrf']").val(),
							action: 'uninstall',
							'extras[]': record.json.name
						},
						failure: function()
						{
							Ext.MessageBox.alert(_t('error_saving_changes'));
						},
						success: function(data)
						{
							intelli.installed.dataStore.reload();
							if(intelli.available.cfg) intelli.available.dataStore.reload();

							var response = Ext.decode(data.responseText);
							var type = response.error ? 'error' : 'notif';

							intelli.admin.notifBox({msg: response.msg, type: type, autohide: false});

							intelli.admin.refreshAdminMenu();
						}
					});
				}
			}
		});
	}
};

intelli.installed = function()
{
	return {
		url: intelli.plugins.url,
		renderTo: 'box_install',
		height: 422,
		send_key: [['extras[]', 'name']],
		progressBar: true,
		statusBar: false,
		resizer: false,
		expandColumn: 3,
		sort: 'date',
		sortDir: 'DESC',
		statusesStore: ['active', 'inactive'],
		action: 'installed',
		baseParams: {},
		record: ['name','title','version','description','author','status','upgrade','config',{name: 'date', type: 'date', dateFormat: 'timestamp'},'readme','manage','remove','uninstall','reinstall'],
		tbar: new Ext.Toolbar(
		{
			items:[
			{
				xtype: 'textfield',
				id: 'installedFilter',
				width: 220,
				emptyText: 'Filter by Title',
				listeners: {
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER)
						{
							intelli.installed.dataStore.baseParams.filter = field.getValue();
							intelli.installed.dataStore.reload();
						}
					}
				}
			},'-',{
				xtype: 'button',
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'search',
				handler: function()
				{
					intelli.installed.dataStore.baseParams.filter = Ext.getCmp('installedFilter').getValue();
					intelli.installed.dataStore.reload();
				}
			},'-',{
				text: _t('reset'),
				handler: function()
				{
					Ext.getCmp('installedFilter').reset();
					intelli.installed.dataStore.baseParams.filter = '';
					intelli.installed.dataStore.reload();
				}
			}]
		}),

		columns: [
			'numberer', {
				custom: 'expander',
				tpl: '{description}'
			}, {
				header: _t('version'),
				dataIndex: 'version',
				align: 'center',
				width: 50
			}, {
				header: _t('title'),
				dataIndex: 'title',
				sortable: true
			}, {
				header: _t('date'),
				dataIndex: 'date',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				sortable: true,
				width: 150
			}, 'status',
			{
				custom: 'upgrade',
				index: true,
				click: upgrade_click,
				icon: 'upgrade-grid-ico.png',
				hideable: false,
				menuDisabled: true,
				title: _t('upgrade')
			}, {
				custom: 'config',
				index: true,
				href: intelli.config.admin_url + '/configuration/{value}',
				icon: 'config-grid-ico.png',
				hideable: false,
				menuDisabled: true,
				title: _t('go_to_config').replace('{extra}', '{value}')
			}, {
				custom: 'manage',
				index: true,
				href: intelli.config.admin_url + '/manage/{value}/',
				icon: 'manage-grid-ico.png',
				hideable: false,
				menuDisabled: true,
				title: _t('go_to_manage').replace('{extra}', '{value}')
			}, {
				custom: 'readme',
				index: false,
				click: readme_click,
				icon: 'readme-grid-ico.png',
				title: _t('readme')
			}, {
				custom: 'reinstall',
				index: true,
				click: install_click,
				icon: 'reinstall.png',
				hideable: false,
				menuDisabled: true,
				title: _t('reinstall')
			}, {
				custom: 'uninstall',
				index: true,
				click: uninstall_click,
				icon: 'uninstall-grid-ico.png',
				title: _t('uninstall')
			}
		]
	};
}();

intelli.available = function()
{
	return {
		url: intelli.plugins.url,
		renderTo:'box_available',
		send_key: [['extras[]', 'name']],
		paging: false,
		height: 422,
		resizer: false,
		first_index: 5,
		baseParams: {type: 'local'},
		tbar: new Ext.Toolbar(
		{
			items:[{
				xtype: 'textfield',
				id: 'availableFilter',
				width: 220,
				emptyText: 'Filter by Title',
				listeners: {
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER)
						{
							intelli.available.dataStore.baseParams.filter = field.getValue();
							intelli.available.dataStore.reload();
						}
					}
				}
			},
			' ' + _t('type') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: new Ext.data.SimpleStore({
					fields: ['value', 'display'],
					data : [['local', 'Local'], ['remote', 'Remote']]
				}),
				value: 'local',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'typeFilter'
			},
			'-',
			{
				xtype: 'button',
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'search2',
				handler: function()
				{
					var title = Ext.getCmp('availableFilter').getValue();
					var type = Ext.getCmp('typeFilter').getValue();

					if ('' != title || '' != type)
					{
						if ('remote' == type)
						{
							// hide checkbox column
							intelli.available.grid.getColumnModel().setHidden(1, true);
							intelli.available.grid.getColumnModel().setHidden(8, true);

							Ext.getCmp('multi_install_btn').disable();
						}
						else
						{
							intelli.available.grid.getColumnModel().setHidden(1, false);
							intelli.available.grid.getColumnModel().setHidden(8, false);
						}

						intelli.available.dataStore.baseParams =
						{
							action: 'available',
							filter: title,
							type: type
						};

						intelli.available.dataStore.reload();

						intelli.available.dataStore.on('load', function(ds, records)
						{
							var response = ds.reader.jsonData;

							if ('' == response.data && response.error)
							{
								intelli.admin.notifBox({msg: response.msg, type: 'error', autohide: true});
							}
						});
					}
				}
			},
			'-',
			{
				text: _t('reset'),
				handler: function()
				{
					Ext.getCmp('availableFilter').reset();
					Ext.getCmp('typeFilter').setValue('local');

					intelli.available.dataStore.baseParams = {
						action: 'available',
						filter: '',
						type: 'local'
					};

					intelli.available.grid.getColumnModel().setHidden(1, false);
					intelli.available.grid.getColumnModel().setHidden(8, false);

					intelli.available.dataStore.reload();
				}
			}]
		}),

		rowselect: function(that)
		{
			var type = Ext.getCmp('typeFilter').getValue();

			if ('local' == type)
			{
				Ext.getCmp('multi_install_btn').enable();
			}
		},

		rowdeselect: function(that)
		{
			var rows = that.grid.getSelectionModel().getSelections();
			if (rows.length == 0) Ext.getCmp('multi_install_btn').disable();
		},

		action: 'available',
		record: ['name', 'title', 'version', 'description', 'author', {name: 'date', type: 'date', dateFormat: 'timestamp'}, 'install', 'compatibility'],
		columns: ['numberer','checkcolumn',
			{
				header: _t('title'),
				dataIndex: 'title',
				sortable: true,
				width: 170
			},{
				header: _t('version'),
				dataIndex: 'version',
				width: 50
			},{
				header: _t('compatibility'),
				dataIndex: 'compatibility',
				width: 50,
				renderer: function(val, obj, grid)
				{
					return '<b style="color:' + (grid.json.install ? 'green' : 'red') + ';">' + val + '</b>';
				}
			},{
				header: _t('description'),
				dataIndex: 'description',
				autoWidth: true
			},{
				header: _t('author'),
				dataIndex: 'author',
				width: 100
			},{
				header: _t('date'),
				dataIndex: 'date',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				width: 100
			},{
				custom: 'readme',
				index: false,
				click: readme_click,
				icon: 'readme-grid-ico.png',
				title: _t('readme')
			},{
				custom: 'install',
				index: true,
				click: install_click,
				icon: 'install-grid-ico.png',
				title: _t('install')
			}]
	};
}();

Ext.onReady(function()
{
	new Ext.TabPanel(
	{
		renderTo: 'box_extras',
		activeTab: 0,
		items: [
		{
			contentEl: 'box_install',
			title: _t('installed_plugins'),
			layout: 'fit',
			listeners:
			{
				activate: function()
				{
					if (!intelli.installed.cfg)
					{
						intelli.installed = new intelli.exGrid(intelli.installed);

						intelli.installed.init();
					}
				}
			}
		},
		{
			contentEl: 'box_available',
			title: _t('plugins_avail'),
			layout: 'fit',
			listeners:
			{
				activate: function()
				{
					if (!intelli.available.cfg)
					{
						intelli.available = new intelli.exGrid(intelli.available);
						intelli.available.cfg.bbar = [
						{
							xtype: 'button',
							text: _t('refresh'),
							iconCls: 'x-tbar-loading',
							handler: function()
							{
								intelli.available.dataStore.reload();
							}
						},
						{
							xtype: 'button',
							text: _t('install'),
							id: 'multi_install_btn',
							disabled: true,
							icon: intelli.config.ia_url + '/admin/templates/default/img/icons/install-grid-ico.png',
							handler: install_click_multiple
						}];

						intelli.available.init();
						intelli.available.grid.getColumnModel().setHidden(8, false);
					}
				}
			}
		}]
	});
});