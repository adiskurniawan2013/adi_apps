function dialog_package(type, item, package_url, package_name)
{
	intelli.config.default_package = $('#default_package').val();
	var height = 450;
	var default_package = '<p class="docs">'+_t('root_old').replace(/\{active_package\}/gi, intelli.config.default_package)+'</p><b>'+intelli.config.ia_url+'</b><input type="text" value="" name="url[0]" class="common" /><b>/</b>';
	var form_text = '<hr><div class="url_type"><h2><input type="radio" value="1" name="type" id="subdomain_type" /> <label for="subdomain_type">'+_t('subdomain_title')+'</label></h2><p class="docs">'+_t('subdomain_about')+'</p>'+
	'<b>http://</b><input type="text" value="'+/*package_name*/package_url+'" name="url[1]" class="common" /><b>.' + location.hostname + '/</b></div>' +
	'<hr><div class="url_type"><h2><input type="radio" value="2" name="type"' + (intelli.config.default_package ? ' checked="checked"' : '') + ' id="subdirectory_type" /> <label for="subdirectory_type">'+_t('subdirectory_title')+'</label></h2><p class="docs">'+_t('subdirectory_about')+'</p>'+
	'<b>' + intelli.config.ia_url+'</b><input type="text" value="'+package_url+'" name="url[2]" class="common" /><b>/</b></div>';

	if(intelli.package_window)
	{
		intelli.package_window.remove();
	}
	var html = '';

	if(type == 'install')
	{
		html = '<div class="url_type"><h2><input type="radio" value="0" name="type" id="root_type"'
			+ (intelli.config.default_package ? '' : ' checked="checked"') + ' /> <label for="root_type">'+_t('root_title')+'</label></h2><p class="docs">'+_t('root_about')+'</p>'
			+ (intelli.config.default_package ? default_package : '') +
			'</div>' + form_text;
		height = intelli.config.default_package ? 520 : 450;
	}
	else if(type == 'set_default')
	{
		if(intelli.config.default_package)
		{
			html = '<div class="url_type">' + default_package + '</div>';
			height = 200;
		}
		else
		{
			window.location = $(item).attr('url');
			return false;
		}
		
	}
	else if(type == 'reset_default')
	{
		html = '<div class="url_type">' + _t('reset_default_package') + '</div>' + form_text;
		height = 420;
	}
	html = '<div class="window"><form action="'+$(item).attr('url')+'" method="get">' + 
		html + '<div class="url_type"><input type="submit" value="'+_t(type)+'" class="common">&nbsp;'+
		'<input type="button" value="'+_t('cancel')+'" class="common" onclick="intelli.package_window.hide()"></div>' + 
	'</form></div>';
	
	intelli.package_window = new Ext.Window({
		title: _t('window_package_installation'),
		closable: true,
		width: 530,
		height: height,
		html: html
	}).show();

	$('input[name="url[2]"]').change(function()
	{
		$('#subdirectory_type').attr('checked', 'checked');
	});
}
function install_package(item, package_url, package_name)
{
	dialog_package('install', item, package_url, package_name);	
}
function set_default(item, package_url, package_name)
{
	dialog_package('set_default', item, package_url, package_name);
}
function reset_default(item, package_url, package_name)
{
	dialog_package('reset_default', item, package_url, package_name);
}

function readme(extra)
{
	Ext.Ajax.request({
		url: intelli.config.admin_url + '/manage/packages.json',
		method: 'POST',
		params:
		{
			action: 'getdoctabs',
			extra: extra
		},
		failure: function()
		{
			Ext.MessageBox.alert(_t('error_while_doc_tabs'));
		},
		success: function(data)
		{
			var data = Ext.decode(data.responseText);
			var doc_tabs = data.doc_tabs;
			var package_info = data.extra_info;

			if(null != doc_tabs)
			{
				var package_tabs = new Ext.TabPanel(
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

				var package_info = new Ext.Panel(
				{
					region: 'east',
					split: true,
					minWidth: 200,
					collapsible: true,
					html: package_info,
					bodyStyle: 'padding: 5px;'
				});

				var win = new Ext.Window(
				{
					title: _t('package_documentation'),
					closable: true,
					width: 800,
					height: 550,
					border: false,
					plain: true,
					layout: 'border',
					items: [package_tabs, package_info]
				});

				win.show();
			}
			else
			{
				Ext.Msg.show(
				{
					title: _t('error'),
					msg: _t('doc_package_not_available'),
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
	});
}