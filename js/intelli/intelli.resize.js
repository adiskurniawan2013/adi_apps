/**
 * Class for resizing page.
 * @class This is the Resize class.  
 *
 *
 * TODO: 
 * - change works with cookie
 */
intelli.resize = function()
{
	var cookiePageWidth = 'cookiePageWidth', cookieLetterSize = 'cookieLetterSize';
	var curLetterSize, coeff = 1000;

	var minLetterSize = '0.7em';	// can be changed (only in em)
	var norLetterSize = '1em';
	var maxLetterSize = '1.3em';	// can be changed (only in em)
	var letterStep = 0.1;			// can be changed (step of letters size change only in em)

	var minPageWidth = '920px';		// can be changed (only in px)
	var norPageWidth = '1100px';	// can be changed (only in px)
	var maxPageWidth = '98%';		// can be changed (only in %)

	if (intelli.readCookie(cookiePageWidth) === null)
	{
		intelli.createCookie(cookiePageWidth, norPageWidth, 1);
		$('.resizable').css('width', norPageWidth);
	}
	if (intelli.readCookie(cookieLetterSize) === null)
	{
		intelli.createCookie(cookieLetterSize, norLetterSize, 1);
		
	}

	function hideAll ()
	{
		$('#small').html('&nbsp;');
		$('#normal').html('&nbsp;');
		$('#large').html('&nbsp;');
		$('#w800').html('&nbsp;');
		$('#w1024').html('&nbsp;');
		$('#wLiquid').html('&nbsp;');
	}

	function setCurrentStatus ()
	{
		hideAll();
		switch (intelli.readCookie(cookieLetterSize))
		{
			case minLetterSize:
				$('#small').html('<div id="dsmall">&nbsp;</div>');
				break;
			case norLetterSize:
				$('#normal').html('<div id="dnormal">&nbsp;</div>');
				break;
			case minPageWidth:
				$('#large').html('<div id="dlarge">&nbsp;</div>');
				break;
		}
		switch(intelli.readCookie(cookiePageWidth))
		{
			case minPageWidth:
				$('#w800').html('<div id="dw800">&nbsp;</div>');
				break;
			case norPageWidth:
				$('#w1024').html('<div id="dw1024">&nbsp;</div>');
				break;
			case maxPageWidth:
				$('#wLiquid').html('<div id="dwLiquid">&nbsp;</div>');
				break;
		}
	}

	return {
		init: function()
		{
			setCurrentStatus();
			var resizableObjects = $('.resizable');
			$('#w800').click(function() 
			{
				var w = intelli.readCookie(cookiePageWidth);
				if (maxPageWidth == w)
				{
					w = document.body.clientWidth;
					w = w * parseInt(maxPageWidth) / 100;
					resizableObjects.css('width', w + 'px');
				}
				intelli.createCookie(cookiePageWidth, minPageWidth, 1);
				resizableObjects.animate({
					width: parseInt(minPageWidth)
				}, 800, function(){
					$(window).resize();
				});
				setCurrentStatus();
			});
			$('#w1024').click(function() 
			{
				var w = intelli.readCookie(cookiePageWidth);
				if (maxPageWidth == w)
				{
					w = document.body.clientWidth;
					w = w * parseInt(maxPageWidth) / 100;
					resizableObjects.css('width', w + 'px');
				}
				resizableObjects.animate({
					width: parseInt(norPageWidth)
				}, 800, function(){
					$(window).resize();
				});
				intelli.createCookie(cookiePageWidth, norPageWidth, 1);
				setCurrentStatus();
			});
			$('#wLiquid').click(function() 
			{
				if (maxPageWidth != intelli.readCookie(cookiePageWidth))
				{
					var w = document.body.clientWidth;
					w = w * parseInt(maxPageWidth) / 100;
					resizableObjects.animate({
						width: w
					}, 800, function(){
						$(window).resize();
					});
				}
				intelli.createCookie(cookiePageWidth, maxPageWidth, 1);
				setCurrentStatus();
			});
			$('#small').click(function() 
			{
				curLetterSize = parseFloat(intelli.readCookie(cookieLetterSize)) * coeff - letterStep * coeff;
				curLetterSize /= coeff;
				if (curLetterSize < parseFloat(minLetterSize))
				{
					curLetterSize = parseFloat(minLetterSize);
				}
				resizableObjects.css({fontSize: curLetterSize + 'em'});
				intelli.createCookie(cookieLetterSize, curLetterSize + 'em', 1);
				setCurrentStatus();
			});
			$('#normal').click(function() 
			{
				resizableObjects.css({fontSize: norLetterSize});
				intelli.createCookie(cookieLetterSize, norLetterSize, 1);
				setCurrentStatus();
			});
			$('#large').click(function() 
			{
				curLetterSize = parseFloat(intelli.readCookie(cookieLetterSize)) * coeff + letterStep * coeff;
				curLetterSize /= coeff;
				if (curLetterSize > parseFloat(maxLetterSize))
				{
					curLetterSize = parseFloat(maxLetterSize);
				}
				resizableObjects.css({fontSize: curLetterSize + 'em'});
				intelli.createCookie(cookieLetterSize, curLetterSize + 'em', 1);
				setCurrentStatus();
			});
			$(window).resize(function() 
			{
				if (maxPageWidth == intelli.readCookie(cookiePageWidth))
				{
					resizableObjects.css('width', intelli.readCookie(cookiePageWidth));
				}
			});
		}
	}
}();