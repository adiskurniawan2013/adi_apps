var show_hook = function(val, data, record)
{
	if (record.data.open)
	{
		$.post(intelli.config.admin_url + '/manage/database/hooks.json', {action: 'get', hook: record.data.id}, function(response)
		{
			editAreaLoader.openFile('codeContainer', {id: record.data.id, text: response.code, syntax: record.data.type, title: record.data.name + ' | '+record.data.extras});
		});
	}
	return false;
};
intelli.hook_editor = function(){

	return {
		title: _t('hook_editor'),
		url: intelli.config.admin_url + '/manage/database/hooks/',
		statusesStore: ['active', 'inactive'],
		pagingStore: [50, 100, 150],
		removeBtn: false,
		progressBar: false,
		record: ['id', 'name', 'extras', 'status', 'type', 'filename', 'remove', 'open'],
		columns: ['numberer', {
			header: _t('name'),
			dataIndex: 'name',
			sortable: true,
			width: 150,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: _t('extras'),
			dataIndex: 'extras',
			sortable: true,
			width: 100,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: _t('type'),
			dataIndex: 'type',
			sortable: true,
			width: 100,
			editor: new Ext.form.ComboBox({
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: new Ext.data.SimpleStore({ fields: ['value', 'display'], data : [['php', 'PHP'],['smarty', 'Smarty'],['html', 'HTML'],['plain', 'Plain Text']] }),
				displayField: 'display',
				valueField: 'value',
				mode: 'local'
			})
		}, 'status', {
			header: _t('filename'),
			dataIndex: 'filename',
			width: 120,
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			custom: 'open_hook',
			index: false,
			click: show_hook,
			icon: 'edit-grid-ico.png',
			title: _t('edit')
		}, 'remove']
	};
}();

Ext.onReady(function()
{
	intelli.hook_editor = new intelli.exGrid(intelli.hook_editor);
    intelli.hook_editor.cfg.tbar = new Ext.Toolbar({
        items:[_t('item') + ':',
        {
            xtype: 'combo',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            lazyRender: true,
            store: new Ext.data.SimpleStore({
                fields: ['value', 'display'],
                data : intelli.config.hook_extras ? intelli.config.hook_extras : intelli.config.extras
            }),
            value: intelli.config.hook_extras ? intelli.config.hook_extras[0][1] : intelli.config.extras[0][1],
            displayField: 'display',
            valueField: 'value',
            mode: 'local',
            id: 'searchItem',
            name: 'searchItem'
        },{
            text: _t('search'),
            iconCls: 'search-grid-ico',
            id: 'fltBtn',
            handler: function()
            {
                var item = Ext.getCmp('searchItem').getValue();

                if ('' != item)
                {
                    intelli.hook_editor.dataStore.baseParams.item = item;
                    intelli.hook_editor.dataStore.reload();
                }
            }
        },
        '-',
        {
            text: _t('reset'),
            id: 'resetBtn',
            handler: function()
            {
                Ext.getCmp('searchItem').reset();

                intelli.hook_editor.dataStore.baseParams.item = '';
                intelli.hook_editor.dataStore.reload();
            }
        }]
    });
	intelli.hook_editor.init();

	editAreaLoader.init(
	{
		id : 'codeContainer'
		,syntax: 'php'
		,start_highlight: true
		,allow_resize: 'yes'
		,replace_tab_by_spaces: true
		,toolbar: 'save, search, go_to_line, |, undo, redo, |, help'
		,save_callback: 'saveHook'
	});

	$('#save').click(function()
	{
		var code = editAreaLoader.getValue('codeContainer');
		var save_hook = editAreaLoader.getCurrentFile('codeContainer').id;
		saveHook(save_hook, code);
	});

	$('#close_all').click(function()
	{
		var hooks = editAreaLoader.getAllFiles('codeContainer');

		if (hooks)
		{
			for(hook in hooks)
			{
				editAreaLoader.closeFile('codeContainer', hook);
			}
		}
	});
});

function saveHook(id, code)
{
	var save_hook = editAreaLoader.getCurrentFile('codeContainer').id;
	
	$.post(intelli.config.admin_url + '/manage/database/hooks.json', {action: 'set', hook: save_hook, code: code}, function()
	{
		intelli.admin.notifBox({msg: _t('successfully_saved'), type: 'notification', autohide: true});
	});
}