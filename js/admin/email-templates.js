$(document).ready(function()
{
	var tags_win = new Ext.Window(
	{
		title: intelli.admin.lang.email_templates_tags,
		width : 'auto',
		height : 'auto',
		modal: false,
		autoScroll: true,
		closeAction : 'hide',
		contentEl: 'template-tags',
		buttons: [
		{
			text : intelli.admin.lang.close,
			handler : function()
			{
				tags_win.hide();
			}
		}]
	});

	$('#view_tags').click(function(e)
	{
		e.preventDefault();
		tags_win.show();
	});

	$('input[name="template"]').change(function()
	{
		var template = $('#tpl').val().replace(/_subject/, '');
		if ('' != template)
		{
			$.post(intelli.config.admin_url + '/email-templates/edit.json', {id: template, status: $(this).val()}, function(data)
			{

			});
		}
		return false;
	});

	$('#tpl').change(function()
	{
		var id = $('#tpl').val();
		if (!id)
		{
			$('#subject').val('').attr('disabled', 'disabled');
			CKEDITOR.instances.body.setData('');
			$('#switcher').hide();
			$('#tpl_form input[type="submit"]').attr('disabled', 'disabled');

			return false;
		}

		$('#subject').removeAttr('disabled');
		$('#switcher').show();
		$('#tpl_form input[type="submit"]').removeAttr('disabled');

		$.get(intelli.config.admin_url + '/email-templates/read.json', {id: id}, function(data)
		{
			$('#subject').val(data['subject']);
			// a little bit hack to make the iphoneswitcher work as we need
			if (data['config'] != 0)
			{
				$('#box-template').attr('checked', 'checked');
			}
			else
			{
				$('#box-template').removeAttr('checked');
			}
			$('#box-template').change();
			//
			CKEDITOR.instances.body.setData(data['body']);
		},
		'json');
	});

	$('#tpl_form').submit(function()
	{
		if ('' == $('#tpl').val())
		{
			return false;
		}

		if ('object' == typeof CKEDITOR.instances.body)
		{
			CKEDITOR.instances.body.updateElement();
		}

		$.post(intelli.config.admin_url + '/email-templates/edit.json', {id: $('#tpl').val(), subject: $('#subject').val(), body: CKEDITOR.instances.body.getData()}, function(data)
		{
			if (data == 'ok')
			{
				intelli.admin.notifBox({msg: intelli.admin.lang.changes_saved, type: 'notification', autohide: true});
			}
		});

		return false;
	});

	$('a.tags').click(function(e)
	{
		e.preventDefault();
		CKEDITOR.instances.body.insertHtml($(this).text());
	});
});