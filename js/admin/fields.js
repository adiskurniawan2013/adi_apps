intelli.fields = function(){
	var tbar;
	var fieldItem = $('#field_item').val();
	var dataParams;
	if (fieldItem)
	{
		dataParams = {item: fieldItem};
	}
	if (!fieldItem)
	{
		tbar = new Ext.Toolbar({
			items:[
				_t('fields_item_filter') + ':',
				{
					xtype: 'combo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: new Ext.data.SimpleStore({
						fields: ['value', 'display'],
						data : intelli.config.items
					}),
					value: intelli.config.items[0][1],
					displayField: 'display',
					valueField: 'value',
					mode: 'local',
					id: 'itemsFilter'
				},
				_t('field_relation') + ':',
				{
					xtype: 'combo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: new Ext.data.SimpleStore({
						fields: ['value', 'display'],
						data : [['all', _t('_select_')],['regular', _t('field_relation_regular')],['dependent', _t('field_relation_dependent')],['parent', _t('field_relation_parent')]]
					}),
					value: _t('_select_'),
					displayField: 'display',
					valueField: 'value',
					mode: 'local',
					id: 'relationFilter'
				},
				' ',
				{
					text: _t('search'),
					iconCls: 'search-grid-ico',
					id: 'srchBtn',
					handler: function()
					{
						var tmp = Ext.getCmp('itemsFilter').getValue();
						var relation = Ext.getCmp('relationFilter').getValue();
						if ('' != tmp || '' != relation)
						{
							if (relation == 'all') relation = '';
							intelli.fields.dataStore.baseParams = {action: 'get', item: tmp, relation: relation};
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
						Ext.getCmp('relationFilter').reset();
						intelli.fields.dataStore.baseParams = {action: 'get', item: '', relation: ''};
						intelli.fields.dataStore.reload();
					}
				}
			]
		});
	}

	return {
		baseParams: dataParams,
		title: _t('fields_manage'),
		renderTo: 'grid-placeholder',
		first: 'name',
		url: intelli.config.admin_url + '/manage/fields/',
		removeBtn: true,
		expandColumn: 2,
		progressBar: false,
		tbar: tbar,
		record: ['name', 'title', 'type', 'length', 'item', 'relation', 'group', 'order', 'edit', 'remove'],
		columns: ['checkcolumn', {
			header: _t('name'),
			dataIndex: 'name',
			sortable: true,
			hidden: true,
			width: 160
		},{
			header: _t('title'),
			dataIndex: 'title',
			width: 200
		},{
			header: _t('item'),
			dataIndex: 'item',
			sortable: true,
			width: 80,
            renderer: function(val, obj, grid){
				return _t(val, val);
            }
		},{
			header: _t('fields_group'),
			dataIndex: 'group',
			width: 120
		},{
			header: _t('fields_type'),
			dataIndex: 'type',
			sortable: true,
			width: 140,
            renderer: function(val, obj, grid){
				return _t('fields_type_'+val, val);
            }
		},{
			header: _t('field_relation'),
			dataIndex: 'relation',
			hidden: true,
			width: 80
		},{
			header: _t('field_length'),
			dataIndex: 'length',
			hidden: true,
			width: 70
		},{
			header: _t('order'),
			dataIndex: 'order',
			sortable: true,
			width: 50,
			editor: new Ext.form.TextField({allowBlank: false})
		},{
			custom: 'edit',
			redirect: intelli.config.admin_url + '/manage/fields/edit/?id=',
			icon: 'edit-grid-ico.png',
			title: _t('edit')
		}, 'remove']
	};
}();

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.fields = new intelli.exGrid(intelli.fields);
		intelli.fields.init();
	}
	else
	{
		editAreaLoader.init({
			id: 'required_checks',
			start_highlight: true,
			allow_resize: 'no',
			allow_toggle: false,
			syntax: 'php',
			toolbar: 'search, go_to_line, |, undo, redo, |, help',
			replace_tab_by_spaces: 4,
			min_height: 200
		});
		editAreaLoader.init({
			id: 'extra_actions',
			start_highlight: true,
			allow_resize: 'no',
			allow_toggle: false,
			syntax: 'php',
			toolbar: 'search, go_to_line, |, undo, redo, |, help',
			replace_tab_by_spaces: 4,
			min_height: 200
		});

		$('#field_show_on_pages').show();
		$('#field_item').change(function()
		{
			var item = $(this).val();
			if ('' != item)
			{
				$.get(intelli.config.admin_url + '/manage/fields.json', {action: 'getgroups', item: item}, function(data)
				{
					var fieldGroups = $('#fieldGroups');
					fieldGroups.empty().append('<option selected="selected" value="">' + _t('_select_') + '</option>');

					$.each(data.data, function(item, value)
					{
						fieldGroups.append($('<option />').val(value.id).text(_t('fieldgroup_' + value.name)));
					});
				});
			}
			else
			{
				$('#fieldGroups').empty().append('<option selected="selected" value="">' + _t('_select_') + '</option>');
			}

			$('.field_pages').css('display', 'block');
			$('.field_pages[item!="'+item+'"]').css('display', 'none');
			$('.field_pages input[type="checkbox"]:not(:visible)').removeAttr('checked');
		});

		$('#type').change(function()
		{
			var type = $(this).val();

			$('div.field_type').css('display', 'none');

			$('#tr_use_editor td *:only-child').css('display', ('textarea' != type ? 'none' : 'block') );

			if (type != '' && ('textarea' == type || 'text' == type || 'number' == type || 'storage' == type || 'image' == type || 'url' == type) || 'pictures' == type)
			{
				$('#' + type).css('display', 'block');

				if ($('[name="searchable"]').val() == '1' && ('textarea' == type || 'text' == type) && 'none' == $("#fulltext_search_zone").css("display"))
				{
					$('#fulltext_search_zone').fadeIn('slow');
				}
			}
			else if ('combo' == type || 'radio' == type || 'checkbox' == type)
			{
				$('#multiple').css('display', 'block');
				if ('checkbox' == type)
				{
					$('#textany_meta_container').css('display', 'none');
				}
				else
				{
					$('#textany_meta_container').css('display', 'block');
				}
			}

			return true;
		}).change();

		$('#relation').change(function(){
			var value = $(this).val();
			if (value == 'dependent')
			{
				$('#regular_field').show();
			}
			else
			{
				$('#regular_field').hide();
			}
			if (value == 'parent')
			{
				$('.main_fields').show();
			}
			else
			{
				$('.main_fields').hide();
			}
		});

		$('input[name="searchable"]').change(function()
		{
			if ($(this).val() == 1)
			{
				$('#showAs').removeAttr('disabled');
				$('input[name*="any_meta"]').removeAttr('disabled');
			}
			else
			{
				$('#showAs').attr('disabled', 'disabled');
				$('input[name*="any_meta"]').attr('disabled', 'disabled');
			}
		}).change();

		$('#add_two_items').click(function()
		{
			$('#value_two_items')
				.clone(true)
				.insertBefore(this)
				.find('input').each(function(){	$(this).val(''); });
			return false;
		});

		$('#add_item').click(function(e)
		{
			e.preventDefault();
			$('#value_item')
				.clone(true)
				.attr('id', 'item'+Math.ceil(Math.random()*10000))
				.insertBefore(this)
				.find('input').each(function(){	$(this).val(''); });
			intelli.display_updown();
		});

		if ($('.field_value:visible').length == 0) $('#add_item').click();
		$('select[name="pic_resize_mode"]').change(function()
		{
			$('.option_tip[id^=pic_resize_mode_tip_]').hide();
			$('#pic_resize_mode_tip_'+$(this).val()).show();
		}).change();
		$('select[name="resize_mode"]').change(function()
		{
			$('.option_tip[id^=resize_mode_tip_]').hide();
			$('#resize_mode_tip_'+$(this).val()).show();
		}).change();
		$('.actions').click(function()
		{
			var action = $(this).data('action');
			var type = $('#type').val();
			var val = $(this).parent().parent().find('input[name="values[]"]:first').val();
			var defaultVal = $('#multiple_default').val();
			var allDefault = defaultVal.split('|');

			if ('removeItem' == action)
			{
				$(this).parents('.field_value').remove();
			}
			else if ('clearDefault' == action)
			{
				$('#multiple_default').val('');
			}
			else if ('setDefault' == action)
			{
				if ('' != val)
				{
					if ('checkbox' == type)
					{
						if ('' != defaultVal)
						{
							if (!intelli.inArray(val, allDefault))
							{
								allDefault[allDefault.length++] = val;
							}

							$('#multiple_default').val(allDefault.join('|'));
						}
						else
						{
							$('#multiple_default').val(val);
						}
					}
					else
					{
						$('#multiple_default').val(val);
					}
				}
			}
			else if ('removeDefault' == action)
			{
				if ('' != defaultVal)
				{
					if (allDefault.length > 1)
					{
						var array = [];
						for (i = 0; i < allDefault.length; i++)
						{
							if (allDefault[i] != val)
							{
								array[array.length] = allDefault[i];
							}
						}
						$('#multiple_default').val(array.join('|'));
					}
					else if (defaultVal == val)
					{
						$('#multiple_default').val('');
					}
				}
			}
			else if ('itemUp' == action || 'itemDown' == action)
			{
				var current = {};
				current.item = $(this).parents('.field_value');
				current.id = current.item.attr('id');
				current.index = null;

				var parent = current.item.parent();
				var items = parent.children('.field_value');
				$.each(items, function(index, item)
				{
					if ($(item).attr('id') == current.id)
					{
						current.index = index;
					}
				});
				if (action == 'itemUp')
				{
					if (current.index >= 1)
					{
						current.index--;
						$('.field_value:eq('+current.index+')', parent).before($(current.item).clone(true));
						$(current.item).remove();
					}
				}
				else
				{
					if (current.index < items.length)
					{
						current.index++;
						$('.field_value:eq('+current.index+')', parent).after($(current.item).clone(true));
						$(current.item).remove();
					}
				}

			}
			else if ('removeNumItem' == action)
			{
				$(this).parent().remove();

				if ('' != defaultVal)
				{
					if (allDefault.length > 1)
					{
						var array = [];
						for (i = 0; i < allDefault.length; i++)
						{
							if (allDefault[i] != val)
							{
								array[array.length] = allDefault[i];
							}
						}
						$('#multiple_default').val(array.join('|'));
					}
					else if (defaultVal == val)
					{
						$('#multiple_default').val('');
					}
				}
			}
			intelli.display_updown();
			return false;
		});
		$('.js-filter-numeric').numeric();
        $('#type').change(function(){
            $('#field_type_tip .option_tip').hide();
            $('#type_tip_'+$(this).val()).show();
        });
		intelli.display_updown();
	}
});
intelli.display_updown = function(){
	$('.field_value .itemUp, .field_value .itemDown').show();
	$('.field_value .itemUp:first').hide();
	$('.field_value[id^="item"] .itemDown:last').hide();
};
var wfields = function(item){
	var temp;
	var div = $(item).parent().find('input:first');
	var info = $(item).parent().find('.list:first');
	var url = intelli.config.admin_url + '/manage/fields.json?a=fields&item='+$('#field_item').val()+'&ids=' + div.val();
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
				info.html('');
				win.close();
			}
		},{
			text: 'Cancel',
			handler: function(){
				temp = false;
				win.close();
			}
		},{
			text: 'Save fields',
			handler: function(){
				var msg = [], selNodes = tree.getChecked(), title = [];
				Ext.each(selNodes, function(node){
					msg.push(node.id);
					title.push(node.text);
				});

				div.val(msg.join(', '));
				info.html(title.join(', '));
				win.close();
			}
		}]
	});

	var win = new Ext.Window({
		title: 'Fields List',
		closable: true,
		width: 352,
		autoScroll: true,
		height: 500,
		plain:true,
		listeners: {
			'beforeclose': function(){
				var msg = [], selNodes = tree.getChecked();
				Ext.each(selNodes, function(node){
					msg.push(node.id);
				});
				msg = msg.join(', ');

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
};
var toggle_required = function(value)
{
	if (value == 1)
	{
		$('#tr_required').show();
		$('#for_plan_only').hide();
		eAL.toggle_on('required_checks');
	}
	else
	{
		$('#tr_required').hide();
		$('#for_plan_only').show();
		eAL.toggle_off('required_checks');
	}
};

$(document).ready(function()
{
	$('#toggle-pages')
		.data('checked', true)
		.click(function(e)
		{
			e.preventDefault();
			var checked = $(this).data('checked');
			if (checked)
			{
				$(this).text(_t('select_none'));
				$('.field_pages input[type="checkbox"]:visible').attr('checked', 'checked');
			}
			else
			{
				$(this).text(_t('select_all'));
				$('.field_pages input[type="checkbox"]:visible').removeAttr('checked');
			}
			$(this).data('checked', !checked);
		});
});