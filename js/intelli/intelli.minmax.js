(function()
{
	var selector = 'div.collapsible';
	if (intelli.readCookie('first') === null)
	{
		$(selector).each(function()
		{
			if ($(this).parent().attr('id') != 'block_')
			{
				$(this).before('<div class="minmax maximized"></div>');
				intelli.createCookie('box_' + $(this).attr('id'), 'block');
			}
		});
		intelli.createCookie('first', 'foo');
	}
	else
	{
		$(selector).each(function()
		{
			if ($(this).parent().attr('id') != 'block_')
			{
				if (intelli.readCookie('box_' + $(this).attr('id')) == 'block')
				{
					$(this).before('<div class="minmax maximized"></div>');
				}
				else
				{
					$(this).before('<div class="minmax"></div>');
				}
			}
		});
	}

	$('div.minmax').each(function()
	{
		$(this).click(function()
		{
			var obj = $(this).next();
			var id = obj.attr('id');

			if (obj.css('display') == 'block')
			{
				obj.slideUp('slow', function()
				{
                    $(this).prev().removeClass('maximized');
					$(window).resize();
				});
				obj.next().hide();

				intelli.createCookie('box_' + id, 'none');
			}
			else
			{
				obj.slideDown('slow', function()
				{
                    $(this).prev().addClass('maximized');
					$(window).resize();
				});
				obj.next().show();

				intelli.createCookie('box_' + id, 'block');
			}
		});
	});
})();