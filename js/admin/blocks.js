intelli.blocks = function()
{
	var blockPositions = [];

	$.each(intelli.config.block_positions.split(','), function(i, v)
	{
		blockPositions.push([v, v]);
	});

	return {
		blockPositions: blockPositions,
		title: _t('blocks'),
		renderTo: 'grid-placeholder',
		first: 'name',
		statusesStore: ['active', 'inactive'],
		url: intelli.config.admin_url + '/manage/blocks/',
		removeBtn: true,
		progressBar: false,
		record: ['id', 'title', 'extras', 'position', 'type', 'lang', 'contents', 'status', 'order', 'edit', 'remove', 'name'],
		columns: [
			'checkcolumn',
			{
				custom: 'expander',
				tpl: '<pre style="font-size: 0.8em">{contents}</pre>'
			}, {
				header: _t('title'),
				dataIndex: 'title',
				sortable: true,
				width: 300,
				editor: new Ext.form.TextField({
					allowBlank: false
				})
			}, {
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
			}, {
				header: _t('extras'),
				dataIndex: 'extras',
				sortable: true,
				width: 150
			}, {
				header: _t('type'),
				dataIndex: 'type',
				width: 85,
				sortable: true
			}, {
				header: _t('language'),
				dataIndex: 'lang',
				hidden: true,
				width: 85
			},
			'status', {
				header: _t('order'),
				dataIndex: 'order',
				sortable: true,
				width: 85,
				editor: new Ext.form.NumberField({
					allowBlank: false,
					allowDecimals: false,
					allowNegative: false
				})
			}, {
				custom: 'edit',
				redirect: intelli.config.admin_url + '/manage/blocks/edit/?id=',
				icon: 'edit-grid-ico.png',
				title: _t('edit')
			},
			'remove'
		]
	};
}();

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.blocks = new intelli.exGrid(intelli.blocks);
		intelli.blocks.cfg.blockPositions.unshift(['all', _t('_select_')]);

		intelli.blocks.cfg.tbar = new Ext.Toolbar(
		{
			items:[
			_t('title') + ':',
			{
				xtype: 'textfield',
				name: 'searchTitle',
				id: 'searchTitle',
				emptyText: 'Enter title',
                listeners: {
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) Ext.getCmp('fltBtn').handler();
                    }
                }
			},
			_t('status') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: intelli.blocks.cfg.statusesStoreWithAll,
				value: 'all',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'stsFilter'
			},
			_t('type') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: new Ext.data.SimpleStore({
					fields: ['value', 'display'],
					data : [['all', _t('_select_')],['plain', 'plain'],['smarty', 'smarty'],['php', 'php'],['html', 'html'],['menu', 'menu']]
				}),
				value: 'all',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'typeFilter'
			},
			_t('position') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				lazyRender: true,
				store: new Ext.data.SimpleStore({
					fields: ['value', 'display'],
					data : intelli.blocks.cfg.blockPositions
				}),
				value: 'all',
				displayField: 'display',
				valueField: 'value',
				mode: 'local',
				id: 'posFilter'
			},{
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'fltBtn',
				handler: function()
				{
					var title = Ext.getCmp('searchTitle').getValue();
					var type = Ext.getCmp('typeFilter').getValue();
					var pos = Ext.getCmp('posFilter').getValue();
					var status = Ext.getCmp('stsFilter').getValue();

					if ('' != title || '' != type || '' != pos || '' != status)
					{
						intelli.blocks.dataStore.baseParams =
						{
							action: 'get',
							title: title,
							type: type,
							pos: pos,
							status: status
						};
						intelli.blocks.dataStore.reload();
					}
				}
			},
			'-',
			{
				text: _t('reset'),
				id: 'resetBtn',
				handler: function()
				{
					Ext.getCmp('searchTitle').reset();
					Ext.getCmp('typeFilter').reset();
					Ext.getCmp('posFilter').reset();
					Ext.getCmp('stsFilter').setValue('all');

					intelli.blocks.dataStore.baseParams =
					{
						action: 'get',
						title: '',
						type: '',
						pos: '',
						status: ''
					};

					intelli.blocks.dataStore.reload();
				}
			}]
		});

		// initialize blocks grid
		intelli.blocks.init();

		// hide language column
		intelli.blocks.cfg.columns[6].hidden = true;
	}
	else
	{
        var multi_language = $('input[name="multi_language"]');

		multi_language.change(function(){
            var checked = false;
            var type = $('#block_type').val();
            if ($(this).val() == 0 && (type == 'php' || type == 'smarty'))
            {
                $('#box-multi_language').click();
                return false;
            }
			if ($(this).val() == 1)
			{
				$('#languages').hide();
				$('#blocks_contents_multi').hide();
				$('#blocks_contents').show();
		
				if ('html' != $('#block_type').val() && CKEDITOR.instances.multi_contents)
				{
					CKEDITOR.instances.multi_contents.destroy();
				}
			}
			else
			{
                checked = true;
				$('#languages').show();
				$('#blocks_contents_multi').show();
				$('#blocks_contents').hide();
				if ('html' == $('#block_type').val())
				{
					intelli.ckeditor('multi_contents', {toolbar: 'User', height: '400px'});
				}
			}
            $('input.block_languages').each(function(){
				if (checked)	$(this).attr('checked', 'checked');
				else $(this).removeAttr('checked');
                initContentBox({lang: $(this).val(), checked: checked});
            });
		}).change();

		$('input[name="sticky"]').change(function(){
			if ($(this).val() == 0)
			{
				$('#acos').show();
			}
			else
			{
				$('#acos').hide();
			}
		}).change();

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

		$('input[name="external"]').change(function(){
			if ($(this).val() == 0)
			{
				$('#multi_contents_row').show();
				$('#external_filename').hide();
			}
			else
			{
				$('#multi_contents_row').hide();
				$('#external_filename').show();
			}
		}).change();

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
                    text: 'Save',
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
                title: 'Subpages List',
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

		var all_acos_count = $('#acos input[name^="visible_on_pages"]').length;
		var checked_acos_count = $("#acos input[name^='visible_on_pages']:checked").length;
		
		if (checked_acos_count > 0 && all_acos_count == checked_acos_count)
		{
			$('#select_all').attr('checked', 'checked').click();
		}

		$('#acos input[name^="visible_on_pages"]').click(function(){
			var checked = (all_acos_count == $("#acos input[name^='visible_on_pages']:checked").length) ? 'checked' : '';
		});

		$('#select_all').click(function()
		{
            if ($(this).attr('checked'))
            {
                $('#acos input[type="checkbox"]').attr('checked', 'checked').change();
            }
            else
            {
                $('#acos input[type="checkbox"]').removeAttr('checked').change();
            }
		});

		$('#all_pages').click(function()
		{
            if ($(this).attr('checked'))
            {
                $('#pages input[type="checkbox"]').attr('checked', 'checked').change();
            }
            else
            {
                $('#pages input[type="checkbox"]').removeAttr('checked').change();
            }
		});

		$('.hide_btn, .show_btn').click(function(){
			var hide = $(this).hasClass('hide_btn');
			var group_class = $(this).attr('rel');

			$('ul.' + group_class).css('display', hide ? 'none' : 'block');
			$('fieldset.' + group_class + ' .'+(hide?'hide_btn':'show_btn')).hide();
			$('fieldset.' + group_class + ' .'+(hide?'show_btn':'hide_btn')).show();
		});

		$('#acos input[name^="select_all_"], input[name^="all_pages_"]').click(function(){
			var group = $('input.' + $(this).data('group'));
			if ($(this).is(':checked'))
			{
				group.attr('checked', 'checked').change();
			}
			else
			{
				group.removeAttr('checked').change();
			}
		});
	
		$('input[name="show_header"]').change(function(){
			if ($(this).val() == 1)
			{
				$('input[name="collapsible"]').parents('tr:first').show();
			}
			else
			{
				$('input[name="collapsible"]').parents('tr:first').hide();
			}
		}).change();

		$('input.block_languages').change(function(){
			initContentBox({lang: $(this).val(), checked: $(this).attr('checked')})
		});

		$('input.block_languages:checked').each(function(){
			initContentBox({lang: $(this).val(), checked: $(this).attr('checked')})
		});

		$('#select_all_languages').click(function()
		{
			var checked = $(this).attr('checked') ? true : false;
			$('input.block_languages').each(function()
			{
				if (checked) $(this).attr('checked', 'checked');
				else $(this).removeAttr('checked');
				$(this).change();
			});
		});
	
		if ($('input.block_languages:checked').length == $('input.block_languages').length)
		{
			$('#select_all_languages').attr('checked', 'checked');
		}

        editAreaLoader.init({
			id: 'multi_contents'
			,start_highlight: true
			,allow_resize: 'no'
			,allow_toggle: false
			,language: 'en'
			,syntax: 'php'
            ,toolbar: 'search, go_to_line, |, undo, redo, |, help'
			,display: 'later'
			,replace_tab_by_spaces: 4
			,min_height: 350
		});

        var last = '';
        var last_multi = false;
		$('#block_type').change(function(){
			$('#pages').hide();
            var type = $(this).val();

            eAL.toggle_off('multi_contents');
            if ('html' == type)
			{
                $("textarea.cked:visible").each(function()
                {
                    intelli.ckeditor($(this).attr("id"), {toolbar: 'User', height: '400px'});
                });
			}
			else
			{
				$.each(CKEDITOR.instances, function(i, o){
					o.destroy();
				});
			}

            if ('php' == type || 'smarty' == type)
            {
                last_multi = multi_language.val();
                if (multi_language.val() != 1)
                {
                    $('#box-multi_language').click();
                }
	            multi_language.parents('tr').hide();
                //multi_language.val(1).change();
                eAL.toggle_on('multi_contents');

                $('#external_file_row').show();
            }
            else if (last_multi !== false)
            {
                if (multi_language.val() != last_multi)
                {
                    $('#box-multi_language').click();
                }
	            multi_language.parents('tr').show();
                last_multi = false;

                $('#external_file_row').hide();
                $('#external_filename').hide();
                $('input[name="external"]').val(0);
            }
            else
            {
	            multi_language.parents('tr').show();
                multi_language.change();

                $('#external_file_row').hide();
                $('#external_filename').hide();
                $('input[name="external"]').val(0);
            }

			$('div.option_tip').hide();
			$("#type_tip_" + type).show();
            last = $(this).val();
		}).change();

	}
});

function initContentBox(o)
{
	var name = 'contents_' + o.lang;
	var display = o.checked ? 'block' : 'none';
	
	if ('html' == $('#block_type').val())
	{
		if (!CKEDITOR.instances[name])
		{
			intelli.ckeditor(name, {toolbar: 'User', height: '400px'});
		}
	}
	else if ('menu' == $('#block_type').val())
	{
		$('#pages').show();
		$('#blocks_contents').hide();
	}
	else
	{
		if (CKEDITOR.instances[name])
		{
			CKEDITOR.instances[name].destroy();
		}
	}

	$('#blocks_contents_' + o.lang).css('display', display);
}