intelli.pages = function()
{
	var ds = new Ext.data.Store(
	{
		proxy: new Ext.data.HttpProxy(
		{
			url: intelli.config.admin_url + '/manage/pages.json?action=extras',
			method: 'get'
		}),

		reader: new Ext.data.JsonReader(
		{
			root: 'data',
			totalProperty: 'total',
			id: 'id'
		}, ['value', 'display'])
	});

	return {
		title: _t('manage_pages'),
		url: intelli.config.admin_url + '/manage/pages/',
		removeBtn: true,
		renderTo: 'grid-placeholder',
		progressBar: false,
		texts:
		{
			confirm_one: _t('are_you_sure_to_delete_this_page'),
			confirm_many: _t('are_you_sure_to_delete_selected_pages')
		},
		statusesStore: ['active', 'inactive'],
		record:['name', 'title', 'last_updated', 'content', 'status', 'order', 'edit', 'remove', 'url'],
		columns:[
			'checkcolumn', {
				custom: 'expander',
				tpl: '{content}'
			}, {
				header: _t('unique_key'), 
				dataIndex: 'name', 
				sortable: true,
				width: 200
			}, {
				header: _t('title'), 
				dataIndex: 'title',
				width: 300
			}, {
				header: _t('url'), 
				dataIndex: 'url',
				sortable: true,
				width: 150
			},
			'status', {
				header: _t('last_updated'), 
				dataIndex: 'last_updated',
				sortable: true,
				width: 120
			}, {
				custom: 'edit',
				redirect: intelli.config.admin_url+'/manage/pages/edit/?id=',
				icon: 'edit-grid-ico.png',
				title: _t('edit')
			},
			'remove'
		],
		tbar: new Ext.Toolbar({
			items:[
			_t('unique_key') + ':',
			{
				xtype: 'textfield',
				name: 'searchKey',
				id: 'searchKey',
				emptyText: 'Enter key',
				listeners: {
					specialkey: function(field, e)
					{
						if (e.getKey() == e.ENTER) Ext.getCmp('fltBtn').handler();
					}
				}
			}, ' ',
			_t('fields_item_filter') + ':',
			{
				xtype: 'combo',
				typeAhead: true,
				triggerAction: 'all',
				editable: false,
				//lazyRender: true,
				store: ds,
				displayField: 'display',
				valueField: 'value',
				//mode: 'local',
				id: 'itemsFilter'
			},'-',{
				text: _t('search'),
				iconCls: 'search-grid-ico',
				id: 'fltBtn',
				handler: function()
				{
					var tmp = Ext.getCmp('itemsFilter').getValue();
					var searchKey = Ext.getCmp('searchKey').getValue();
					if ('' != searchKey || tmp != '')
					{
						intelli.pages.dataStore.baseParams =
						{
							action: 'get',
							item: tmp,
							key: searchKey
						};

						intelli.pages.dataStore.reload();
					}
				}
			},
			'-',
			{
				text: _t('reset'),
				id: 'resetBtn',
				handler: function()
				{
					Ext.getCmp('searchKey').reset();
					Ext.getCmp('itemsFilter').reset();
					intelli.pages.dataStore.baseParams = { 
						action: 'get',
						item: '',
						key: ''
					};

					intelli.pages.dataStore.reload();
				}
			}]
		})
	};

}();

Ext.onReady(function()
{
	if (Ext.get('grid-placeholder'))
	{
		intelli.pages = new intelli.exGrid(intelli.pages);
		intelli.pages.init();
	}
	else
	{
		$("input[name='preview']").click(function()
		{
			$('#page_form').attr('target', '_blank');
			$('#js-csrf-protection-code').val($('input[name="prevent_csrf"]:first', '#csrf_for_preview').val());
		});

		$('input[name="save"]').click(function(e)
		{
			if ($('#ajax-loader').is(':visible'))
			{
				e.preventDefault();
				return;
			}
			$('#page_form').removeAttr('target');
			$('#js-csrf-protection-code').val($('input[name="prevent_csrf"]:first', '#csrf_for_save').val());
		});

		$('input[name="name"], input[name="alias"], #custom_url').blur(fillUrlBox);

		$('input[name="unique"]').change(function(){
			if (this.value == 1) $('input[name="preview"]').hide();
			else $('input[name="preview"]').show();
		}).change();

		var items = [];
		$('.pre_lang').each(function()
		{
			var self = this;
			items.push(
			{
				contentEl: this.id,
				title: $(this).attr('title'),
				listeners:
				{
					activate: function(tab)
					{
						if (!CKEDITOR.instances['contents['+tab.title+']'])
						{
							intelli.ckeditor('contents['+tab.title+']', {toolbar: 'User'});
						}
						$('#js-active-language').val($(self).data('language'));
					}
				}
			});
		});

		new Ext.TabPanel(
		{
			renderTo: 'languages_content',
			activeTab: 0,
			shim: false,
			defaults: {autoHeight: true},
			items: items
		});

		$('input[name="unique"]').change(function()
		{
			fillUrlBox();

			var display = $(this).val() == 1 ? 'none' : 'block';

			$('#url_field').css('display', (display == 'block' ? 'none' : 'block'));
			$('#ckeditor').css('display', display);
			$('#page_options').css('display', display);

		}).change();
	}
});

function fillUrlBox()
{
	var page_unique_key = $("input[name='name']").val();
	var external_url = $('#uniqueyes').attr('checked');
	var custom_url = $('#custom_url').val();
	var custom_seo_url = $("input[name='alias']").val();

	var params = {page_unique_key: page_unique_key, external_url: external_url, custom_url: custom_url, custom_seo_url: custom_seo_url, action: 'getpageurl'};

	if (external_url && ('' != custom_url || '' != non_modrewrite_url))
	{
		sendQuery(params);
	}
	else if (!external_url && '' != page_unique_key)
	{
		sendQuery(params);
	}
	else
	{
		$('#page_url_box').fadeOut();
	}
}

function sendQuery(params)
{
	$.get(intelli.pages.url + 'read.json', params, function(data)
	{
		if ('' != data.data)
		{
			$('#page_url').text(data.data);
			$('#page_url_box').fadeIn();
		}
		else
		{
			$('#page_url_box').fadeOut();
		}
	});
}