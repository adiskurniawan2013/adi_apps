Ext.onReady(function()
{
	// display template info box
	var readme_click = function(template)
	{
		Ext.Ajax.request(
		{
			url: intelli.config.admin_url + '/templates/read.json',
			method: 'POST',
			params:
			{
				action: 'getdoctabs',
				template: template
			},

			failure: function ()
			{
				Ext.MessageBox.alert(_t('error_while_doc_tabs'));
			},

			success: function (data)
			{
				var data = Ext.decode(data.responseText);
				var doc_tabs = data.doc_tabs;
				var template_info = data.template_info;

				if (null != doc_tabs)
				{
					var template_tabs = new Ext.TabPanel(
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

					var template_info = new Ext.Panel(
					{
						region: 'east',
						split: true,
						minWidth: 200,
						collapsible: true,
						html: template_info,
						bodyStyle: 'padding: 5px;'
					});

					var win = new Ext.Window(
					{
						title: _t('template_documentation'),
						closable: true,
						width: 800,
						height: 550,
						border: false,
						plain: true,
						layout: 'border',
						items: [template_tabs, template_info]
					});

					win.show();
				}
				else
				{
					Ext.Msg.show(
					{
						title: _t('error'),
						msg: _t('doc_template_not_available'),
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
		});
	};

	// process details click
	$("a[id^='readme_']").click(function()
	{
		var template = $(this).attr('id');
		var template_id = template.split('_');

		readme_click(template_id[1]);

		return false;
	});
});