$(function()
{
	$('#disable_fields').click(function()
	{
		if ($(this).attr('checked'))
		{
			intelli.display('pass_fieldset', 'hide');

			$('#pass1').attr('disabled', 'disabled');
			$('#pass2').attr('disabled', 'disabled');
		}
		else
		{
			intelli.display('pass_fieldset', 'show');

			$('#pass1').removeAttr('disabled');
			$('#pass2').removeAttr('disabled');
		}
	});

	if ($("#disable_fields").attr('checked'))
	{
		intelli.display('pass_fieldset', 'hide');
	}
});