intelli.admin = function()
{
	/*
	 * Constants 
	 */

	/**
	 * Debug mode true to enable debug mod
	 * @type Boolean
	 */
	var DEBUG = true;
	
	/**
	 * Notification box id
	 * @type String
	 */
	var BOX_NOTIF_ID = 'notification';
	
	/**
	 * Header box id
	 * @type String
	 */
	var BOX_HEADER_ID = 'header';

	/**
	 * Footer box id
	 * @type String
	 */
	var BOX_FOOTER_ID = 'footer';

	/**
	 * Main box id
	 * @type String
	 */
	var BOX_MAIN_ID = 'main';

	/** 
	 * Menu box id
	 * @type String
	 */
	var BOX_MENU_ID = 'admin_menu';

	/**
	 * AJAX loader box id
	 * @type String
	 */
	var BOX_AJAX_ID = 'ajax-loader';

	/*
	 * Variables
	 */
	var tempNotifElement = null;
	var layout = null;
	var loaderBox = null;
	var notifElement = null;
	var notifFloatElement = null;

	if (DEBUG)
	{
		//console.time('time');
	}
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.BLANK_IMAGE_URL = intelli.config.ia_url + 'js/ext/resources/images/default/s.gif';
	Ext.chart.Chart.CHART_URL = intelli.config.ia_url + 'js/ext/resources/charts.swf';

	Ext.Ajax.defaultHeaders = {
		'X-FlagToPreventCSRF': 'using ExtJS'
	};

	$.ajaxSetup(
	{
		global: true,
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("X-FlagToPreventCSRF", "using jQuery");
		}
	});

	function buildAdminMenuItems(items)
	{
		var html = '';
		if (items && items.length > 0)
		{
			for(var i = 0; i < items.length; i++)
			{
				if ('undefined' != typeof items[i].text && '' != items[i].text)
				{
					html += '<li><a class="submenu" href="'+ items[i].href +'"';
					if ('undefined' != typeof items[i].attr && '' != items[i].attr)
					{
						html += ' ' + items[i].attr;
					}
					if ('undefined' != typeof items[i].style && '' != items[i].style)
					{
						html += ' ' + items[i].style;
					}
					html += '>' + items[i].text + '</a></li>';
				}
			}
		}
		return html;
	}

	function ajaxLoader()
	{
		/* show and hide ajax loader box */
		var loaderBox = Ext.get(BOX_AJAX_ID);

		Ext.Ajax.on('beforerequest', function()
		{
			loaderBox.show();
		});
		
		Ext.Ajax.on('requestcomplete', function()
		{
			loaderBox.hide({duration: '1'});
		});

		$('#' + BOX_AJAX_ID).ajaxStart(function()
		{
			$(this).fadeIn('1000');
		});
	
		$('#' + BOX_AJAX_ID).ajaxStop(function()
		{
			$(this).fadeOut('1000');
		});

		return loaderBox;
	};
	
	return {
		/**
		 *  Debug mode
		 */
		DEBUG: DEBUG,
		/**
		 * Assign event for displaying AJAX actions
		 *
		 * @return object of box
		 */
		initAjaxLoader: ajaxLoader,
		/**
		 * Show or hide element 
		 *
		 * @opt array array of options
		 * @el string id of element
		 * @action string the action (show|hide|auto)
		 *
		 * @return object of element
		 */
		display: function(opt)
		{
			if (!opt.el)
			{
				return false;
			}

			var obj = ('string' == typeof opt.el) ? Ext.get(opt.el) : opt.el;
			var act = opt.action || 'auto';

			if ('auto' == act)
			{
				act = obj.isVisible() ? 'hide' : 'show';
			}

			obj[act]();

			return obj;
		},
		/**
		 * Show notification box
		 *
		 * @opt array array of options
		 * @msg mixed string or array of messages
		 * @type string string of type of message
		 * @autohide boolean auto hide notification box
		 * @pause int number of seconds before hide box
		 *
		 * @return object of element
		 */
		notifBox: function(opt)
		{
			var msg = opt.msg;
			var type = opt.type || 'notification';
			var autohide = opt.autohide || (type == 'notification' || type == 'success' || type == 'notif' ? true : false);
			var pause = opt.pause || 5;
			var html = '';

			if ('notif' == type)
			{
				type = 'notification';
			}
			
			if (opt.boxid)
			{
				var boxid = opt.boxid;
			}
			else
			{
				var boxid = BOX_NOTIF_ID;
			}

			notifElement = Ext.get(boxid);
			notifElement.update('');

			if (tempNotifElement)
			{
				Ext.get(tempNotifElement).remove();
			}

			html += '<div class="message '+ type +'">';
			html += '<div class="inner">';
			html += '<div class="icon">&nbsp;</div>';

			if (Ext.isArray(msg))
			{
				html += '<ul>';
				for(var i = 0; i < msg.length; i++)
				{
					if ('' != msg[i])
					{
						html += '<li>' + msg[i] + '</li>';
					}
				}
				html += '</ul>';
			}
			else
			{
				html += ['<ul><li>', msg, '</li></ul>'].join('');
			}
			
			html += '</div></div>';

			tempNotifElement = Ext.DomHelper.append(notifElement, html);

			this.display({el: notifElement, action: 'show'});

			if (autohide)
			{
				Ext.get(boxid).pause(pause).fadeOut({useDisplay: true});
			}

			return notifElement;
		},

		notifFloatBox: function(opt)
		{
			var msg = opt.msg;
			var type = opt.type || 'notif';
			var pause = opt.pause || 5;
			var html = '';

			if (!notifFloatElement)
			{
				notifFloatElement = Ext.DomHelper.insertFirst(document.body, {id:'msg_box'}, true);
			}
			
			html += '<div class="msg_box_float">';
			if (Ext.isArray(msg))
			{
				html += '<ul>';
				for(var i = 0; i < msg.length; i++)
				{
					if ('' != msg[i])
					{
						html += '<li>' + msg[i] + '</li>';
					}
				}
				html += '</ul>';
			}
			else
			{
				html += ['<ul><li>', msg, '</li></ul>'].join('');
			}
			html += '</div>';
			
            notifFloatElement.alignTo(document, 't-t');

			var m = Ext.DomHelper.append(notifFloatElement, {html: html}, true);
			
			m.slideIn('t').pause(pause).ghost("t", {remove: true});
		},

		/**
		 * Show alert notification message 
		 *
		 * @opt array array of options
		 * @msg string the message
		 * @title string the title of box
		 * @type string the type of message
		 *
		 * @return void
		 */
		alert: function(opt)
		{
			if (Ext.isEmpty(opt.msg))
			{
				return false;
			}

			opt.title = (Ext.isEmpty(opt.title)) ? 'Alert Message' : opt.title;
			opt.type = intelli.inArray(opt.type, ['error', 'notif']) ? opt.type : 'notif';

			var icon = ('error' == opt.type) ? Ext.MessageBox.ERROR : Ext.MessageBox.WARNING;

			Ext.Msg.show(
			{
				title: opt.title,
				msg: opt.msg,
				buttons: Ext.Msg.OK,
				icon: icon
			});
		},
		/**
		 * Return the viewport object 
		 *
		 * @return object
		 */
		getLayout: function()
		{
			return layout;
		},
		/**
		 * Reload the admin menu tree 
		 *
		 * @return void
		 */
		refreshAdminMenu: function()
		{
			var query = [];
			$('div.menu ul.menu').each(function(i, k)
			{
				query[i] = 'menu[]=' + $(this).attr('id').split('_')[1];
			});
			$.get(intelli.config.admin_url+'/menu-items.json?' + query.join('&'), function(response){
				var menus = response.menus;
				$('div.menu').each(function(){
					var name = $(this).attr('id').split('box_')[1];
					var html = '';
					if (menus[name])
					{
						html = buildAdminMenuItems(menus[name].items);
						$('#menu_'+name).html(html).show();
						$(this).show();
					}
					if ('' == html)
					{
						$('#menu_'+name).hide();
						$(this).hide();
					}
				});
			});
		}
	}
}();

intelli.admin.lang = new Object();
