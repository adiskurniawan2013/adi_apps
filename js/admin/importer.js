intelli.importer = function()
{
	var vUrl = 'controller.php?file=importer';

	return {
		vUrl: vUrl
	};
}();

Ext.onReady(function()
{
	$("#find_database").click(function()
	{
		$("#databases").html('');

		$.get(intelli.importer.vUrl + '&action=getdatabases', function(data)
		{
			if (data)
			{
				$(data).each(function(key, value)
				{
					$("#databases").append('<option value="'+ value +'">'+ value +'</option>');
				});
			}

			$("#databases_box").fadeIn();
		});
	});

	$("#databases").dblclick(function()
	{
		$("#database").val($(this).val());
	});

	$("#select").click(function()
	{
		$("#database").val($("#databases").val());
	});
});
