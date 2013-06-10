Ext.onReady(function()
{
	$("#update").click(function()
	{
		Ext.Msg.show(
		{
			title: _t('warning'),
			msg: _t('update_overwrite_note'),
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn: function(btn)
			{
				if('yes' == btn)
				{
					$("#update_form").submit();
				}
			}
		});

		return false;
	});
});
