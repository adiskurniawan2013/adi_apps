intelli.menus = function()
{
	var blockPositions = [];

	$.each(intelli.config.block_positions.split(','), function(i, v)
	{
		blockPositions.push([v, v]);
	});

    return {
		url: intelli.config.admin_url + '/manage/menus/',
		removeBtn: true,
		title: _t('manage_menus'),
		renderTo: 'grid-placeholder',
		progressBar: true,
		tests:{
			confirm_one: _t('are_you_sure_to_delete_selected_menu'),
			confirm_many: _t('are_you_sure_to_delete_selected_menus')
		},
		statusesStore: ['active', 'inactive'],
		record:['name', 'title', 'position', 'status', 'order', 'edit', 'remove'],
		columns:[
			'checkcolumn',
			{
				header: _t('title'),
				dataIndex: 'title',
				sortable: true,
				width: 550
			},
			{
				header: _t('unique_key'),
				dataIndex: 'name',
				sortable: true,
				hidden: true,
				width: 150
			},
			'status',
			{
				header: _t('position'), 
				dataIndex: 'position', 
				sortable: true,
				width: 85,
				editor: new Ext.form.ComboBox({
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: new Ext.data.SimpleStore({ fields: ['value', 'display'], data : blockPositions }),
					displayField: 'value',
					valueField: 'display',
					mode: 'local'
				})
			},{
				header: _t('order'),
				dataIndex: 'order',
				sortable: true,
				width: 50,
				editor: new Ext.form.NumberField({
					allowBlank: false,
					allowDecimals: false,
					allowNegative: false
				})
			},{
				custom: 'edit',
				redirect: intelli.config.admin_url+'/manage/menus/edit/?id=',
				icon: 'edit-grid-ico.png',
				title: _t('edit')
			},'remove'
		]
	};
}();

function save_menus()
{
    $('#tree_menus').val(new Ext.tree.JsonTreeSerializer(Ext.getCmp('menus')).toString());
	$('#form_menu').submit();
}

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.menus = new intelli.exGrid(intelli.menus);
		intelli.menus.init();
	}
    else
    {
        var changed = false;
        var add_menu = function(){
            if (!Ext.getCmp('menus').selModel.selNode)
            {
                root.select();
            }
            edit_menu('add');
        };
        var edit_menu = function(new_menu){
            if (Ext.getCmp('menus').selModel.selNode)
            {
                var selNode = Ext.getCmp('menus').selModel.selNode;
                var reg_exp = / \(no link\)/;
                var text = selNode.text.replace(/ \(custom\)/, '').replace(reg_exp, '');
                var win;
                var form;

                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: intelli.config.admin_url + '/manage/menus.json',
                    data: {
                        action: 'get_phrases',
                        id: selNode.id,
                        current: text,
                        menu: $('#name').val(),
                        'new': (new_menu == 'add')
                    },
                    success:function(json){
                        if (!json.langs || json.length == 0)
                        {
                            return false;
                        }
                        var node = (new_menu=='add' ? 'node_'+Math.floor(Math.random(1000) * 100000) : selNode.id);

                        win = new Ext.Window({
                            layout: 'fit',
                            width: 350,
                            autoHeight: true,
                            plain: true,
                            items: [new Ext.FormPanel({
                                id: 'form-panel',
                                labelWidth: 75,
                                url: intelli.config.admin_url + '/manage/menus.json?action=save_phrases&menu='+$('#name').val()+'&node='+node,
                                frame:true,
                                bodyStyle:'padding:5px 5px 0',
                                width: 350,
                                autoHeight: true,
                                defaults: {width: 230},
                                defaultType: 'textfield',

                                items: json.langs,
                                buttons: [{
                                    text: 'Save',
                                    handler: function(){
                                        changed = true;
                                        Ext.getCmp('form-panel').getForm().submit({waitMsg : 'Saving...',success:function(){
                                            var form_text = Ext.getCmp('form-panel').getForm().getValues()[intelli.config.lang];
                                            if (form_text == '')
                                            {
                                                return false;
                                            }
                                            if (new_menu == 'add')
                                            {
                                                var target = selNode;
                                                var newMenu = new Ext.tree.TreeNode({
                                                    id: node,
                                                    text: form_text + ' (no link)',
                                                    leaf: false,
                                                    cls: 'folder',
                                                    children: []
                                                });
                                                if (selNode.leaf) target = selNode.parentNode;

                                                target.appendChild(newMenu);
                                                target.expand();
                                            }
                                            else
                                            {
                                                selNode.setText(form_text + (selNode.text.match(reg_exp) ? ' (no link)' : ' (custom)'));
                                            }
                                            win.close();
                                        }});
                                    }
                                },{
                                    text: 'Cancel',
                                    handler: function(){
                                        win.close();
                                    }
                                }]
                            })]
                        }).show();
                    }
                });
            }

        };
        var contextmenu2 = new Ext.menu.Menu({
            id: 'mainContext2',
            items: [{
                id: 'create-menu2',
                iconCls: 'silk-add',
                text: _t('add_menu'),
                handler: add_menu
            }]
        });
        var contextmenu = new Ext.menu.Menu({
            id: 'mainContext',
            items: [{
                id: 'create-menu',
                iconCls: 'silk-add',
                text: _t('add_menu'),
                handler: add_menu
            },{
                id: 'edit-menu',
                iconCls: 'silk-edit',
                text: _t('edit_menu'),
                handler: edit_menu
            },{
                id: 'delete-node',
                text: _t('delete'),
                handler: function(){
                    var delNode = menus.selModel.selNode;
                    Ext.getCmp('menus').selModel.selNode.parentNode.select();
                    delNode.parentNode && delNode.parentNode.removeChild(delNode);
                },
                iconCls: 'silk-delete'
            }]
        });

        var menus = new Ext.tree.TreePanel({
            id: 'menus',
            animate: false,
            autoScroll:true,
            loader: new Ext.tree.TreeLoader({dataUrl:intelli.config.admin_url+'/manage/menus.json?tree='+intelli.urlVal('id')+'&action=tree'}),
            enableDD:true,
            containerScroll: true,
            border:false,
            listeners: {
                'beforenodedrop' : function(e){
                    if (!e.dropNode.parentNode.parentNode && e.dropNode.parentNode.attributes.id == 'pages') return false;
                    if (e.dropNode.parentNode.parentNode && e.dropNode.parentNode.parentNode.attributes.id == 'pages')
                    {
                        var add = true;
                        jQuery.each(menus.root.childNodes, function(index, item){
                            if (item.id == e.dropNode.id) add = false;
                        });
                        if (!add)return false;
                        e.dropNode = new Ext.tree.TreeNode({
                            id: e.dropNode.id+'_'+Math.floor(Math.random(1000) * 1000),
                            leaf: false,
                            text: e.dropNode.text,
                            cls: 'folder'
                        });

                        if (!e.target.leaf) {
                            e.target.appendChild(e.dropNode);
                        }
                        else {
                            e.target.parentNode.appendChild(e.dropNode);
                        }
                    }
                },
                'nodedrop' : function(e){
                    e.target.expand();
                }
            }
        });
        var root = new Ext.tree.AsyncTreeNode({
            text: _t('manage_menus'),
            draggable:false, // disable root node dragging
            id:'root'
        });
        menus.on('contextmenu', function(node){
            node.select();
            if (node.isRoot)
            {
                contextmenu2.show(node.ui.getAnchor());
            }
            else
            {
                contextmenu.show(node.ui.getAnchor());
            }


        }, this);
        menus.setRootNode(root);


        //-------------------------------------------------------------

        var pages = new Ext.tree.TreePanel({
            id: 'pages',
            animate:true,
            autoScroll:true,
            rootVisible: false,
            loader: new Ext.tree.TreeLoader({
                dataUrl:intelli.config.admin_url+'/manage/menus.json?action=pages',
                baseParams: {path:'extjs'} // custom http params
            }),
        	singleExpand: true,
            containerScroll: true,
            border:false,
            listeners: {
                'beforenodedrop' : function(){
                    return false;
                }
            },
            enableDD:true
        });

        // add a tree sorter in folder mode
        new Ext.tree.TreeSorter(pages, {folderSort:true});

        // add the root node
        var root2 = new Ext.tree.AsyncTreeNode({
            text: 'Pages',
            draggable:false,
            id:'pages'
        });
        pages.setRootNode(root2);

        menus.render('box_menus');
        pages.render('box_pages');

        root.expand(false, /*no anim*/ false);
        root2.expand(false, /*no anim*/ false);

        $('#delete_menu').click(function(){
            var delNode = menus.selModel.selNode;
			if (delNode && !delNode.isRoot)
            {
                Ext.getCmp('menus').selModel.selNode.parentNode.select();
                delNode.destroy();
            }
		});
		$('#add_menu').click(function(){
			var target = (menus.selModel.selNode ? menus.selModel.selNode : menus.root);
			if (pages.selModel.selNode)
			{
				var selNode = pages.selModel.selNode;
				var add = true;
				jQuery.each(menus.root.childNodes, function(index, item){
					if (item.id == selNode.id) add = false;
				});
				if (selNode.leaf && add)
				{
					var dropNode = new Ext.tree.TreeNode({
						id: selNode.id+'_'+Math.floor(Math.random(1000) * 1000),
						leaf: false,
						text: selNode.text,
                        cls: 'folder'
					});
					if (!target.leaf) {
						target.appendChild(dropNode);
					}
					else {
						target.parentNode.appendChild(dropNode);
					}
					target.expand();
				}
			}
		});

        /*
		 * Select all pages checkbox
		 *
		 */
        $('input[name="visible_on_pages[]"]').change(function(){
			if ($(this).is(':checked'))
			{
				$($(this).parent().children('.subpages').get(0)).show();
			}
			else
			{
				$($(this).parent().children('.subpages').get(0)).hide();
			}
		}).change();

        var temp = true;
        $('.subpages').click(function(){
            var temp = $(this).attr('rel').split('::');
            var div = $('#subpage_'+temp[1]);
            var url = intelli.config.admin_url + '/' + temp[0] + '.json?a=subpages&ids=' + div.val();
            var tree = new Ext.tree.TreePanel({
                height: 465,
                width: 335,
                useArrows:true,
                autoScroll:true,
                animate:true,
                enableDD:true,
                containerScroll: true,
                rootVisible: false,
                frame: true,
                root: {
                    nodeType: 'async'
                },

                // auto create TreeLoader
                dataUrl: url,

                buttons: [{
                    text: 'Reset',
                    handler: function(){
                        tree.getRootNode().cascade(function(n) {
                            var ui = n.getUI();
                            ui.toggleCheck(false);
                        });
                        div.val('');
                        win.close();
                    }
                },{
                    text: 'Cancel',
                    handler: function(){
                        temp = false;
                        win.close();
                    }
                },{
                    text: 'Save sub pages',
                    handler: function(){
                        var msg = '', selNodes = tree.getChecked();
                        Ext.each(selNodes, function(node){
                            if (msg.length > 0){
                                msg += '-';
                            }
                            msg += node.id;
                        });

                        div.val(msg);
                        win.close();
                    }
                }]
            });

            var win = new Ext.Window({
                title: 'Sub pages list',
                closable: true,
                width: 352,
                autoScroll: true,
                height: 500,
                plain:true,
                listeners: {
                    'beforeclose': function(panel){
                        var msg = '', selNodes = tree.getChecked();
                        Ext.each(selNodes, function(node){
                            if (msg.length > 0){
                                msg += '-';
                            }
                            msg += node.id;
                        });

                        if (div.val() != msg && temp)
                        {
                            Ext.Msg.show({
                               title: _t('save_changes')+'?',
                               msg: _t('closing_window_with_unsaved_changes'),
                               buttons: Ext.Msg.YESNO,
                               fn: function(btnID){
                                   if (btnID == 'yes')
                                   {
                                       div.val(msg);
                                       return true;
                                   }
                                   else if (btnID == 'no')
                                   {
                                       return true;
                                   }
                                   return false;
                               },
                               icon: Ext.MessageBox.QUESTION
                            });
                        }
                        temp = true;
                        return true;
                    }
                },
                items: [tree]
            });
            tree.getRootNode().expand();
            win.show();
        });

		/*
		 * Select all pages checkbox
		 *
		 */
		var all_acos_count = $("#sticky input[name^='visible_on_pages']").length;
		var checked_acos_count = $("#sticky input[name^='visible_on_pages']:checked").length;

		if (checked_acos_count > 0 && all_acos_count == checked_acos_count)
		{
			$('#select_all').attr('checked', 'checked').click();
		}

		$('#sticky input[name^="visible_on_pages"]').click(function()
		{
			if (all_acos_count == $("#sticky input[name^='visible_on_pages']:checked").length)
			{
				$('#select_all').attr('checked', 'checked');
			}
			else
			{
				$('#select_all').removeAttr('checked');
			}
		});

		$('#select_all').click(function()
		{
			if ($(this).attr('checked') == 'checked')
			{
				$('#sticky input[name^="visible_on_pages"]').attr('checked', 'checked');
			}
			else
			{
				$('#sticky input[name^="visible_on_pages"]').removeAttr('checked');
			}
		});

		$('.hide_btn, .show_btn').click(function()
		{
			var hide = $(this).hasClass('hide_btn');
			var groupClass = $(this).attr('rel');

			$('ul.' + groupClass).css('display', hide ? 'none' : 'block');
			$('fieldset.' + groupClass + ' .'+(hide?'hide_btn':'show_btn')).hide();
			$('fieldset.' + groupClass + ' .'+(hide?'show_btn':'hide_btn')).show();
		});

		$('#sticky input[name^="select_all_"]').click(function()
		{
			var groupClass = $(this).attr('class');
			if ($(this).attr('checked') == 'checked')
			{
				$('input.' + groupClass).attr('checked', 'checked');
			}
			else
			{
				$('input.' + groupClass).removeAttr('checked');
			}
		});
    }
	if (typeof serializedMenus == 'string')
	{
		var menusTree = Ext.getCmp('menus');
		menusTree.setRootNode(Ext.util.JSON.decode(serializedMenus));
		menusTree.root.expand();
	}
});