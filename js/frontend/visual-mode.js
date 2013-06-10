$(function ()
{
	$('div.groupWrapper').Sortable(
	{
		accept: 'block',
		helperclass: 'sortHelper',
		activeclass: 'dropActive',
		hoverclass: 'dropHover',
		tolerance: 'intersect',
		fx: function()
		{
		},
		onChange: function(groups)
		{
			$.get(intelli.config.admin_url+"/order-change.json?type=blocks&"+$.SortSerialize().hash, function()
			{
				$.each(groups, function(i, o)
				{
					$("#" + o.id).animate({backgroundColor: '#FFFF99'}, 300, function()
					{
						$(this).animate({backgroundColor: 'lightgreen'}, 300);
					});
				});
			});
		}
	}).each(function()
	{
		var id = $(this).attr("id").split("Blocks");

		$(this).prepend('<div class="manage-block-name"><span class="b">&quot;' + id[0] + '&quot;</span> blocks' + '</div>');
	});

    $('div.groupWrapper .block').css('cursor', 'move');
});