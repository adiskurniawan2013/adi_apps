intelli.usergroups = function(){
	return {
		title: _t('usergroups'),
		first_index: 3,
		url: intelli.config.admin_url + '/accounts/groups/',
		texts: {
			confirm_one: _t('are_you_sure_to_delete_this_usergroup'),
			confirm_many: _t('are_you_sure_to_delete_this_usergroups')
		},
		record: ['id','title','perms','remove','accounts','count','config','admin'],
		columns: ['numberer',{
			header: _t('title'), 
			dataIndex: 'title', 
			sortable: true,
			width: 250,
			editor: new Ext.form.TextField({
				allowBlank: false
			}),
            renderer: function(val, obj, grid) {
				if (grid.json.admin == 1)
                {
					val = '<b style="color:green;">'+val+'</b>';
				}
				return val;
			}
		},{
			header: _t('all_accounts'),
			dataIndex: 'accounts',
			width: 300,
            renderer: function(val, obj, grid){
                if (val)
                {
                    return val.replace(/, $/, '');
                }

                return '<span style="color:red;font-style:italic;">-no accounts-</span>';

            }
		},{
			header: _t('accounts'),
			dataIndex: 'count',
			sortable: true,
            align: 'center',
			width: 100
		},{
			header: _t('admin_panel'),
			dataIndex: 'admin',
			sortable: true,
            width: 100,
            renderer: function(val, obj, grid){
				if (grid.json.admin == 1)
                {
					val = '<b style="color:green;">Allow</b>';
				}
                else
                {
                    val = '<b style="color:red;">Disallow</b>';
                }
				return val;
			}
		},{
			custom: 'perms',
            index: true,
            redirect: '',
			href: intelli.config.admin_url + '/manage/permissions/?group={value}',
			icon: 'lock_category.png',
			iconSize: 16,
			title: _t('permissions')
		},{
			custom: 'custom_config',
            dataIndex: 'config',
			index: true,
			href: intelli.config.admin_url+'/configuration/?group={value}',
			icon: 'config-grid-ico.png',
			title: _t('go_to_config')
		}, 'remove']
	};
}();

Ext.onReady(function()
{
    intelli.usergroups = new intelli.exGrid(intelli.usergroups);
    intelli.usergroups.init();
});