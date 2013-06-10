intelli.index = function()
{
	var vUrl = intelli.config.admin_url+'/index.json';
	$('body').css('overflow-y','scroll');
	return {
		accountChart: null,
		statisticsPanel: null,
		newsPanel: null,
		newPluginsPanel: null,
		portal: null,
		vUrl: vUrl,
		chartStoreTr: new Ext.data.JsonStore({
			fields: ['statuses', 'total'],
			url: vUrl + '?action=get_transactions_chart'
		}),
		chartStore: new Ext.data.JsonStore({
			fields: ['statuses', 'total'],
			url: vUrl + '?action=get_accounts_chart'
		}),
		statusesStoreFilter: new Ext.data.SimpleStore(
		{
			fields: ['value', 'display'],
			data : [
				['all', _t('_status_')],
				['active', _t('active')],
				['approval', _t('approval')],
				['unconfirmed', _t('unconfirmed')]
			]
		}),
		pagingStore: new Ext.data.SimpleStore(
		{
			fields: ['value', 'display'],
			data : [['10', '10'],['20', '20'],['30', '30'],['40', '40'],['50', '50']]
		})
	};
}();

Ext.onReady(function()
{
	intelli.index.chartStore.load();
	intelli.index.accountChart = new Ext.Panel(
	{
		items:
		{
			store: intelli.index.chartStore,
			xtype: 'piechart',
			height: 200,
			dataField: 'total',
			categoryField: 'statuses',
			extraStyle:
			{
				legend:
				{
					display: 'bottom',
					padding: 5,
					font:{family: 'Tahoma',size: 13}
				}
			}
		}
	});

	intelli.index.chartStoreTr.load();
	intelli.index.transactionsChart = new Ext.Panel(
	{
		items:
		{
			store: intelli.index.chartStoreTr,
			xtype: 'piechart',
			height: 200,
			dataField: 'total',
			categoryField: 'statuses',
			extraStyle:
			{
				legend:
				{
					display: 'bottom',
					padding: 5,
					font:{family: 'Tahoma',size: 13}
				}
			}
		}
	});

	intelli.index.changelogPanel = new Ext.Panel(
	{
		el: 'box_changelog',
		listeners:
		{
			'afterrender': function(cmp)
			{
				cmp.el.setStyle("display", "block");
			}
		}
	});

	intelli.index.statisticsPanel = new Ext.Panel({
		el: 'box_statistics',
		listeners:
		{
			'afterrender': function(cmp)
			{
				cmp.el.setStyle("display", "block");
			}
		}
	});
	
	var modules = [{
		id: 'transactions_chart',
		column:'right',
		pos: 0,
		cfg:{
			title: _t('transactions_chart'),
			id: 'transactions_chart',
			style: 'margin: 5px 0 5px 0',
			items: intelli.index.transactionsChart
		}
	},{
		id: 'accounts_chart',
		column:'right',
		pos: 1,
		cfg:{
			title: _t('accounts_chart'),
			id: 'accounts_chart',
			style: 'margin: 5px 0 5px 0',
			items: intelli.index.accountChart
		}
	},{
		id: 'statistics',
		column:'left',
		pos: 1,
		cfg:{
			title: _t('statistics'),
			id: 'statistics',
			style: 'margin: 5px 0 5px 0',
			items: intelli.index.statisticsPanel
		}
	}];

	if (intelli.config.display_changelog != '0')
	{
		modules.push(
		{
			id: 'changelog',
			column:'right',
			pos: 0,
			cfg:
			{
				title: 'Change Log',
				id: 'changelog',
				style: 'margin: 5px 0 5px 0',
				draggable: false,
				collapsible: false,
				items: intelli.index.changelogPanel
			}
		});
	}

	$('#changelog_item').change(function()
	{
		var val = $(this).val();
		$('.changelog_item').hide();
		$('#changelog_'+val).show();
	}).change();

	if (Ext.get('box_fdb'))
	{
		intelli.index.fdbPanel = new Ext.Panel(
		{
			el: 'box_fdb',
			listeners:
			{
				'afterrender': function(cmp)
				{
					cmp.el.setStyle("display", "block");
				}
			}
		});

		modules.push(
		{
			id: 'fdb',
			column:'right',
			pos: 0,
			cfg:
			{
				id: 'fdb',
				title: _t('submit_feedback'),
				style: 'margin: 5px 0 5px 0',
				items: intelli.index.fdbPanel
			}
		});

		// set icon on value change
		$("#subject").change(function()
		{
			var subject = $("#subject").val();
			var image = '';

			// clear old value
			$("#subject_label").html('');
			
			if ('New Feature Request' == subject)
			{
				image = 'bulb';
			}
			else if ('Bug Report' == subject)
			{
				image = 'bug';
			}
			else if ('Custom Modification' == subject)
			{
				image = 'custom';
			}
			else
			{
				image = '';
			}
			// set new value
			if (image != '')
			{
				var html = '<img src="' + intelli.config.ia_url + 'admin/templates/default/img/icons/' + image + '.png">';
				$("#subject_label").html(html);
			}
		});

		$('#username, #email').focus(function(){
			var def = $(this).data('def');
			if (def == $(this).val())
			{
				$(this).val('');
			}
		}).blur(function(){
			if ($(this).val() == '')
			{
				$(this).val($(this).data('def'));
			}
		});

		$("#submitButton").click(function()
		{
			var subject = $("#subject").val();
			var body = $("#body").val();
			
			if (body != '' && '-- select --' != subject)
			{
				Ext.Msg.confirm(_t('confirm'), _t('send_confirm'), function(btn, text)
				{
					if (btn == 'yes')
					{
						var vUrl = intelli.config.admin_url + '.json';
						
						Ext.Ajax.request({
							url: vUrl,
							params: { action: 'submitrequest', subject: subject, body: body, username: $('#username').val(), email: $('#email').val() },
							success: function(data)
							{
								var response = Ext.decode(data.responseText);
								var type = 'notif';
									
								intelli.admin.notifBox({msg: response.msg, type: type, boxid: 'feedbackbox', autohide: true});
							},
							failure: function(data)
							{
							}					
						});
					}
				});
			}
			else
			{
				intelli.admin.notifBox({msg: _t('body_incorrect'), type: 'error', boxid: 'feedbackbox', autohide: true});
			}
		});

		// clear form
		$("#resetButton").click(function(){
			Ext.Msg.confirm(_t('confirm'), _t('clear_confirm'), function(btn, text){
				if (btn == 'yes')
				{
					$("#body").attr("value", "");
				}
			});
			
			return true;
		});
	}
	if(Ext.get('box_twitter'))
	{
		intelli.index.twitterPanel = new Ext.Panel({
			el: 'box_twitter',
			listeners:{
				'afterrender': function(cmp){
					cmp.el.setStyle("display", "block");
				}
			}
		});
		modules.push({
			id: 'twitter_news',
			column:'left',
			pos: 0,
			cfg: {
				id: 'twitter_news',
				draggable: false,
				collapsible: false,
				title: _t('twitter_news'),
				style: 'margin: 5px 0 5px 0',
				items: intelli.index.twitterPanel
			}
		});
	}

	/*
	 * News panel
	 */
	if(Ext.get('box_news'))
	{
		intelli.index.newsPanel = new Ext.Panel(
		{
			el: 'box_news',
			listeners:
			{
				'afterrender': function(cmp)
				{
					cmp.el.setStyle("display", "block");
				}
			}
		});
		modules.push({
			id: 'ia_news',
			column:'left',
			pos: 1,
			cfg:{
				title: _t('ia_news'),
				id: 'ia_news',
				style: 'margin: 5px 0 5px 0',
				items: intelli.index.newsPanel,
				listeners:
				{
					'beforerender': function(cmp)
					{
						if(!intelli.index.newsPanel)
						{
							return false;
						}
					
						return true;
					}
				}
			}
		});
	}

	if (Ext.get('box_new_plugins'))
	{
		intelli.index.newPluginsPanel = new Ext.Panel(
		{
			el: 'box_new_plugins',
			listeners:
			{
				'afterrender': function(cmp)
				{
					cmp.el.setStyle("display", "block");
				}
			}
		});
		modules.push(
		{
			id: 'subrion_new_plugins',
			column:'right',
			pos: 1,
			cfg:
			{
				title: _t('subrion_new_plugins'),
				id: 'subrion_new_plugins',
				style: 'margin: 5px 0 5px 0',
				items: intelli.index.newPluginsPanel,
				listeners:
				{
					'beforerender': function(cmp)
					{
						if(!intelli.index.newPluginsPanel)
						{
							return false;
						}
						
						return true;
					}
				}
			}
		});
	}
	intelli.index.portal = new Ext.Panel(
	{
		renderTo: 'box_panels_content',
		border: false,
		stateful: true,
		autoHeight: true,
		autoWidth: true,
		items:[
		{
			xtype:'portal',
			border: false,
			stateful: true,
			id: 'ia_portal',
			margins: '35 5 5 0',
			getState: function(){},
			applyState: function(state, config){},
			stateEvents: ['drop'],
			items:[
			{
				columnWidth:.50,
				items: []
			}, {
				columnWidth:.50,
				style: 'padding: 0 0 0 10px',
				items: []
			}],
			listeners:
			{
				'drop': function(e)
				{
					Ext.Ajax.request(
					{
						url: intelli.config.admin_url + '/index.json',
						method: 'GET',
						params:
						{
							action: 'columns_pos',
							id: e.panel.id,
							pos: e.position,
							column: e.columnIndex
						},
						failure: function()
						{
							Ext.MessageBox.alert(_t('error_saving_changes'));
						}
					});
				}
			}
		}]
	});

	jQuery.each(modules, function(i, item)
	{
		var cfg = [item.column,item.pos];
		if ($('#column_pos_'+item.id).val())
		{
			cfg = $('#column_pos_'+item.id).val().split('-');
		}

		if (cfg[0] == 'left') cfg[0] = 0;
		if (cfg[0] == 'right') cfg[0] = 1;
		Ext.getCmp("ia_portal").items.itemAt(cfg[0]).insert(cfg[1], item.cfg);
	});

	if (Ext.get('box_twitter'))
	{
		$(".twitter").tweet(
		{
			username: ["Subrion"],
			join_text: "auto",
			avatar_size: 32,
			number_of_tweets: intelli.config.twitter_count && intelli.config.twitter_count >= 3 ? intelli.config.twitter_count : 5,
			auto_join_text_default: "we said,", 
			auto_join_text_ed: "we",
			auto_join_text_ing: "we were",
			auto_join_text_reply: "we replied to",
			auto_join_text_url: "we were checking out",
			loading_text: "loading tweets..."
		});
	}

	Ext.EventManager.onWindowResize(function(){intelli.index.portal.doLayout();});
	intelli.index.portal.doLayout();
});