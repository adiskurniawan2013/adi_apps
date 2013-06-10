intelli.language = function()
{
	var vUrl = intelli.config.admin_url + '/manage/language/';

	var categoriesStore = new Ext.data.SimpleStore({
		fields: ['value', 'display'],
		data : [['admin', 'Administration Board'],['frontend', 'User Frontend'],['common', 'Common'],['tooltip', 'Tooltip']]
	});

	var categoriesStoreSearch = new Ext.data.SimpleStore({
		fields: ['value', 'display'],
		data : [['all', 'All Categories'],['admin', 'Administration Board'],['frontend', 'User Frontend'],['common', 'Common'],['tooltip', 'Tooltip']]
	});

	var enterKeyListener = {
		specialkey: function(field, e){
			if (e.getKey() == e.ENTER) Ext.getCmp('srchBtn').handler();
		}
	};

	var tempLangStore = [];
	var j = 0;
	for (var i in intelli.langList)
	{
		tempLangStore[j++] = [i, intelli.langList[i]];
	}

	var languagesStore = new Ext.data.SimpleStore({
		fields: ['value', 'display'],
		data: tempLangStore
	});

	return {
		title: _t('phrase_manager'),
		url: vUrl,
		baseParams: {
			grid: 'phrase',
			language: intelli.urlVal('language')
		},
		removeBtn: true,
		renderTo: 'box_phrases',
		progressBar: false,
		send_key: [['ids[]', 'id'],['lang', 'code']],
		languageCount: tempLangStore.length,
		categoriesStore: categoriesStore,
		categoriesStoreSearch: categoriesStoreSearch,
		languagesStore: languagesStore,

		record:[
			{name: 'key', mapping: 'key'},
			{name: 'value', mapping: 'value'},
			{name: 'lang', mapping: 'code'},
			{name: 'category', mapping: 'category'},
			{name: 'remove', mapping: 'remove'}
		],
		columns:[
			'checkcolumn',
			{
				header: _t('key'),
				dataIndex: 'key',
				sortable: true,
				width: 150
			},{
				header: _t('value'),
				dataIndex: 'value',
				sortable: true,
				width: 400,
				editor: new Ext.form.TextArea({
					allowBlank: false,
					grow: true
				})
			},{
				header: _t('language'),
				dataIndex: 'lang',
				width: 80
			},{
				header: _t('category'),
				dataIndex: 'category',
				sortable: true,
				width: 100,
				editor:	new Ext.form.ComboBox(
					{
						typeAhead: true,
						triggerAction: 'all',
						editable: false,
						lazyRender: true,
						store: categoriesStore,
						value: 'admin',
						displayField: 'display',
						valueField: 'value',
						mode: 'local'
					})
			}
			,'remove'
		],

		tbar: new Ext.Toolbar({
			items:[
				_t('key') + ':',
				{
					xtype: 'textfield',
					id: 'srchKey_lang',
					name: 'srchKey_lang',
					emptyText: 'Phrase key',
					listeners: enterKeyListener
				},
				' ',
				_t('value') + ':',
				{
					xtype: 'textfield',
					id: 'srchValue_lang',
					name: 'srchValue_lang',
					emptyText: 'Phrase value',
					listeners: enterKeyListener
				},
				' ',
				_t('category') + ':',
				{
					xtype: 'combo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: categoriesStoreSearch,
					value: 'all',
					displayField: 'display',
					valueField: 'value',
					mode: 'local',
					id: 'srchCategory_lang',
					name: 'srchCategory_lang'
				},
				' ',
				_t('plugin') + ':',
				{
					xtype: 'combo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: new Ext.data.JsonStore({
						url: vUrl + 'read.json?action=getplugins',
						root: 'data',
						fields: ['value', 'display']
					}),
					displayField: 'display',
					valueField: 'value',
					id: 'srchPlugin_lang',
					name: 'srchPlugin_lang'
				},
				' ',
				{
					text: _t('search'),
					iconCls: 'search-grid-ico',
					id: 'srchBtn',
					handler: function()
					{
						var searchKeyVal = Ext.getCmp('srchKey_lang').getValue();
						var searchValueVal = Ext.getCmp('srchValue_lang').getValue();
						var searchCategoryVal = Ext.getCmp('srchCategory_lang').getValue();
						var searchPlugin = Ext.getCmp('srchPlugin_lang').getValue();

						if ('' != searchKeyVal || '' != searchValueVal || '' != searchCategoryVal || '' != searchPlugin)
						{
							intelli.language.dataStore.baseParams.key = searchKeyVal;
							intelli.language.dataStore.baseParams.value = searchValueVal;
							intelli.language.dataStore.baseParams.category = searchCategoryVal;
							intelli.language.dataStore.baseParams.filter_plugin = searchPlugin;

							if (intelli.language.dataStore.lastOptions.params.start > 0)
							{
								intelli.language.dataStore.lastOptions.params.start = 0;
							}

							intelli.language.dataStore.reload();
						}
					}
				},
				'-',
				{
					text: _t('reset'),
					id: 'resetBtn',
					handler: function()
					{
						Ext.getCmp('srchKey_lang').reset();
						Ext.getCmp('srchValue_lang').reset();
						Ext.getCmp('srchCategory_lang').reset();
						Ext.getCmp('srchPlugin_lang').reset();

						intelli.language.dataStore.baseParams.key = '';
						intelli.language.dataStore.baseParams.value = '';
						intelli.language.dataStore.baseParams.category = '';
						intelli.language.dataStore.baseParams.filter_plugin = '';

						intelli.language.dataStore.reload();
					}
				}
			]
		}),

		bbar: ['-',_t('category') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: categoriesStore,
				value: 'admin',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				disabled: true,
				id: 'categoryCmb'
			},
			{
				text: _t('do'),
				disabled: true,
				iconCls: 'go-grid-ico',
				id: 'goBtn',
				handler: function()
				{
					var rows = intelli.language.grid.getSelectionModel().getSelections();
					var category = Ext.getCmp('categoryCmb').getValue();
					var ids = new Array();

					for (var i = 0; i < rows.length; i++)
					{
						ids[i] = rows[i].json.id;
					}

					Ext.Ajax.request(
						{
							url: intelli.language.cfg.url + 'update.json',
							method: 'POST',
							params:
							{
								action: 'update',
								'ids[]': ids,
								field: 'category',
								value: category
							},
							failure: function()
							{
								Ext.MessageBox.alert(_t('error_saving_changes'));
							},
							success: function(data)
							{
								var response = Ext.decode(data.responseText);
								var type = response.error ? 'error' : 'notif';

								intelli.admin.notifBox({msg: response.msg, type: type, autohide: true});

								intelli.language.grid.getStore().reload();
							}
						});
				}
			}],
		customBtns: ['goBtn', 'categoryCmb'],
		event: function(data, record, that){

		}
	};
}();

Ext.onReady(function()
{
	var addPhrasePanel = new Ext.FormPanel(
	{
		frame: true,
		title: _t('add_phrase'),
		bodyStyle: 'padding: 5px 5px 0',
		renderTo: 'box_add_phrase',
		id: 'add_phrase_panel',
		hidden: true,
		items: [
		{
			fieldLabel: _t('key'),
			name: 'key',
			xtype: 'textfield',
			allowBlank: false,
			anchor: '40%'
		},{
			fieldLabel: _t('value'),
			name: 'value',
			xtype: 'textarea',
			allowBlank: false,
			width: '99%'
		},{
			fieldLabel: _t('language'),
			name: 'language',
			hiddenName: 'language',
			xtype: 'combo',
			allowBlank: false,
			editable: false,
			triggerAction: 'all',
			lazyRender: true,
			value: 'en',
			store: intelli.language.languagesStore,
			displayField: 'display',
			valueField: 'value',
			mode: 'local'
		},{
			fieldLabel: _t('category'),
			hiddenName: 'category',
			xtype: 'combo',
			allowBlank: false,
			editable: false,
			triggerAction: 'all',
			lazyRender: true,
			value: 'admin',
			store: intelli.language.categoriesStore,
			displayField: 'display',
			valueField: 'value',
			mode: 'local',
			listWidth: 167
		}],
		tools: [
		{
			id: 'close',
			handler: function(event, tool, panel)
			{
				panel.hide();
			}
		}],
		buttons: [
		{
			text: _t('add'),
			handler: function()
			{
				addPhrasePanel.getForm().submit(
				{
					url: intelli.config.admin_url + '/manage/language.json?action=add_phrase',
					method: 'POST',
					params:
					{
						prevent_csrf: $("#box_add_phrase input[name='prevent_csrf']").val()
					},
					success: function(form, action)
					{
						Ext.Msg.show(
						{
							title: _t('add_new_phrase'),
							msg: _t('add_one_more_phrase'),
							buttons: Ext.Msg.YESNO,
							fn: function(btn)
							{
								if ('no' == btn)
								{
									addPhrasePanel.hide();
								}

								var response = action.result;
								var type = response.error ? 'error' : 'notif';

								intelli.admin.notifBox({msg: response.msg, type: type, autohide: true});

								form.reset();
							},
							icon: Ext.MessageBox.QUESTION
						});
					}
				});
			}
		},{
			text: _t('cancel'),
			handler: function()
			{
				$('#box_add_phrase').css('margin', '0');
				addPhrasePanel.hide();
			}
		}]
	});

	if (Ext.get('box_phrases'))
	{
		intelli.language = new intelli.exGrid(intelli.language);
		intelli.language.init();
	}

	$('#add_phrase').click(function(e)
	{
		e.preventDefault();

		$('#box_add_phrase').css('height', 'auto');
		$('#box_add_phrase').css('margin', '10px 0 15px');
		Ext.getCmp('add_phrase_panel').show();
	});

	$('a.delete_language').each(function()
	{
		$(this).click(function(e)
		{
			e.preventDefault();

			var link = $(this);

			Ext.Msg.show(
			{
				title: _t('confirm'),
				msg: _t('are_you_sure_to_delete_selected_language'),
				buttons: Ext.Msg.YESNO,
				fn: function(btn)
				{
					if ('yes' == btn)
					{
						window.location = link.attr('href');
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		});
	});

	if (Ext.get('comparison'))
	{
		intelli.languageComparison = function()
		{
			var categoriesStore = new Ext.data.SimpleStore(
			{
				fields: ['key', 'title'],
				data : [['all', 'All Categories'], ['admin', 'Administration Board'], ['frontend', 'User Frontend'], ['common', 'Common'], ['tooltip', 'Tooltip']]
			});

			var languagesStore = [];
			var j = 0;
			for (var i in intelli.langList)
			{
				languagesStore[j++] = [i, intelli.langList[i]];
			}
			var defaultListeners = {
				specialkey: function(field, e)
				{
					if (e.ENTER == e.getKey()) Ext.getCmp('cmprBtn').handler();
				}
			}

			return {
				title: _t('languages_comparison'),
				url: intelli.config.admin_url + '/manage/language/',
				baseParams: {
					grid: 'comparison',
					lang1: null,
					lang2: null,
					category: 'all',
					key: null
				},
				removeBtn: false,
				renderTo: 'comparison',
				progressBar: false,
				send_key: [['ids[]', 'id'], ['lang', 'lang']],
				languageCount: languagesStore.length,
				categoriesStore: categoriesStore,
				languagesStore: languagesStore,
				record:[
					{name: 'key', mapping: 'key'},
					{name: 'value', mapping: 'lang1'},
					{name: 'lang2', mapping: 'lang2'},
					{name: 'category', mapping: 'category'}
				],
				columns:[
					{
						header: _t('key'),
						dataIndex: 'key',
						sortable: true,
						width: 220
					},{
						header: _t('value'),
						dataIndex: 'value',
						id: 'col-l1',
						width: 350,
						editor: new Ext.form.TextArea({
							allowBlank: false,
							grow: true
						})
					},{
						header: _t('value'),
						dataIndex: 'lang2',
						id: 'col-l2',
						width: 350,
						renderer: function(value, obj, grid)
						{
							if (grid.json.lang2 === null)
							{
								value = '<span style="color: #F00;">&lt;' + _t('does_not_exist') + '&gt;</span>';
							}
							else if (grid.json.lang1 != grid.json.lang2)
							{
								value = '<span style="color: #FF4500;">' + value + '</span>';
							}
							else
							{
								value = '<span style="color: #999;">' + value + '</span>';
							}
							return value;
						}
					},
					{
						header: _t('category'),
						dataIndex: 'category',
						sortable: true,
						width: 100
					}
				],

				tbar: new Ext.Toolbar({
					items:[
						_t('language') + ':',
						{
							xtype: 'combo',
							typeAhead: true,
							triggerAction: 'all',
							editable: false,
							lazyRender: true,
							store: languagesStore,
							displayField: 'title',
							valueField: 'code',
							value: languagesStore[1][0],
							mode: 'local',
							id: 'lang1',
							name: 'lang1',
							listeners: defaultListeners
						},
						' ',
						_t('language') + ':',
						{
							xtype: 'combo',
							typeAhead: true,
							triggerAction: 'all',
							editable: false,
							lazyRender: true,
							store: languagesStore,
							displayField: 'title',
							valueField: 'code',
							value: languagesStore[0][0],
							mode: 'local',
							id: 'lang2',
							name: 'lang2',
							listeners: defaultListeners
						},
						' ',
						_t('category') + ':',
						{
							xtype: 'combo',
							typeAhead: true,
							triggerAction: 'all',
							editable: false,
							lazyRender: true,
							store: categoriesStore,
							value: 'all',
							displayField: 'title',
							valueField: 'key',
							mode: 'local',
							id: 'category',
							listeners: defaultListeners
						},
						' ',
						_t('key') + ':',
						{
							xtype: 'textfield',
							id: 'key',
							listeners: defaultListeners
						},
						{
							text: _t('compare'),
							iconCls: 'search-grid-ico',
							id: 'cmprBtn',
							handler: function()
							{
								var language1 = Ext.getCmp('lang1').getValue();
								var language2 = Ext.getCmp('lang2').getValue();

								if ('' != language1 || '' != language2)
								{
									intelli.languageComparison.dataStore.baseParams.lang1 = language1;
									intelli.languageComparison.dataStore.baseParams.lang2 = language2;
									intelli.languageComparison.dataStore.baseParams.category = Ext.getCmp('category').getValue();
									intelli.languageComparison.dataStore.baseParams.key = Ext.getCmp('key').getValue();

									if (intelli.languageComparison.dataStore.lastOptions.params.start > 0)
									{
										intelli.languageComparison.dataStore.lastOptions.params.start = 0;
									}

									intelli.languageComparison.dataStore.reload();

									intelli.languageComparison.grid.getColumnModel().getColumnById('col-l1').header = intelli.langList[language1];
									intelli.languageComparison.grid.getColumnModel().getColumnById('col-l2').header = intelli.langList[language2];
								}
							}
						},
						'-',
						{
							text: _t('reset'),
							id: 'resetBtn',
							handler: function()
							{
								Ext.getCmp('lang1').reset();
								Ext.getCmp('lang2').reset();
								Ext.getCmp('category').reset();
								Ext.getCmp('key').reset();

								intelli.languageComparison.dataStore.baseParams.lang1 = null;
								intelli.languageComparison.dataStore.baseParams.lang2 = null;
								intelli.languageComparison.dataStore.baseParams.category = 'all';
								intelli.languageComparison.dataStore.baseParams.key = null;

								intelli.languageComparison.dataStore.reload();
							}
						}
					]
				})
			};
		}();

		intelli.languageComparison = new intelli.exGrid(intelli.languageComparison);
		intelli.languageComparison.init();
	}
});