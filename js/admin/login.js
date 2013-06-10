$(function()
{
	$('input[type="text"], input[type="password"]').focus(function()
	{
		$('div.tip').fadeOut('slow');
		$('div.text-field').each(function()
		{
			$(this).removeClass('error');
		});
	});

	$('#login').click(function()
	{
		$('#action').val('login');
		$('#login_form').submit();
	});

	var forgot_win = null;
	var forgot_form = null;

	$('#js-forgot-dialog').click(function(e)
	{
		e.preventDefault();
		if (!forgot_form)
		{
			forgot_form = new Ext.FormPanel(
			{
				labelWidth: 35, // label settings here cascade unless overridden
				border: false,
				frame:true,
				bodyStyle:'padding:5px 5px 0;color:black;',
				width: 350,
				defaults: {width: 230},
				defaultType: 'textfield',
				items: [
				{
					fieldLabel: _t('email'),
					name: 'email',
					emptyText: _t('type_username_email'),
					allowBlank: false
				}],
				buttons: [
				{
					text: _t('email'),
					handler: function()
					{
						if (forgot_form.form.isValid())
						{
							forgot_form.form.submit(
							{
								url: intelli.config.ia_url + 'registration.json',
								method: 'GET',
								params:
								{
									action: 'restore'
								},
								failure: function(form, action)
								{
									var response = action.result;
									//var type = response.error ? 'error' : 'notif';
									var msg = action.result.msg;

									forgot_form.form.reset();
									forgot_win.hide();

									Ext.Msg.show({
										title: _t('restore_password'),
										msg: msg,
										buttons: Ext.Msg.OK,
										icon: response.type == 'error' ? Ext.MessageBox.ERROR : Ext.MessageBox.INFO
									});
								}
							});
						}
					}
				},{
					text: _t('cancel'),
					handler: function()
					{
						forgot_form.form.reset();
						forgot_win.hide();
					}
				}]
			});
		}

		if (!forgot_win)
		{
			forgot_win = new Ext.Window(
			{
				title: _t('restore_password'),
				width : 383,
				height : 135,
				modal: true,
				closeAction : 'hide',
				bodyStyle: 'padding: 10px;',
				items: forgot_form
			});
		}

		forgot_win.show();
	});
});