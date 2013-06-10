intelli.database = [];
Ext.onReady(function()
{
	if ($('#query_out').text())
	{
		setTimeout( (function(){ $('#query_out').height(window.screen.height - $('#query_out').offset().top - 300) }), 1000);
	}
	
	$('.js-selecting a').click(function(e)
	{
		e.preventDefault();
		switch ($(this).attr('class'))
		{
			case 'js-select':
				$('#tbl option').attr('selected', 'selected');
				break;
			case 'js-drop':
				$('#tbl option').removeAttr('selected');
				break;
			case 'js-invert':
				$('#tbl option').each(function(i, obj)
				{
					$(obj).attr('selected') == 'selected'
						? $(obj).removeAttr('selected')
						: $(obj).attr('selected', 'selected');
				});
				break;
		}
	});

	$('#save_file').click(function()
	{
		var display = $(this).attr('checked') ? 'block' : 'none';

		$('#save_to').css('display', display);
	});
	
	$('#exportAction').click(function()
	{
		if($('#sql_structure').attr('checked') || $('#sql_data').attr('checked'))
		{
			$('#export').attr('value', '1');
			$('#dump').submit();

			return true;
		}
		else
		{
			intelli.admin.alert(
			{
				title: _t('error'),
				type: 'error',
				msg: _t('export_not_checked')
			});
		}

		return false;
	});

	$('#importAction').click(function(){
		if($('#sql_file').attr('value'))
		{
			$('#run_update').attr('value', '1');
			$('#update').submit();

			return true;
		}
		else
		{
			intelli.admin.alert(
			{
				title: _t('error'),
				type: 'error',
				msg: _t('choose_import_file')
			});
		}
		
		return false;
	});

	$('#addTableButton').click(function(){
		addData('table');
	});

	$('#table').dblclick(function(){
		addData('table');
	}).click(function()
	{
		var table = $(this).attr('value');

		if (table)
		{
			if (!intelli.database[table])
			{
				$.ajax(
				{
					type: 'GET',
					url: intelli.config.admin_url + '/manage/database.json',
					data: 'action=fields&table=' + table,
					success: function(data){
						var fields = $('#field')[0];

						intelli.database[table] = data;

						fields.options.length = 0;
						for (var i = 0; i < data.length; i++) {
							fields.options[fields.options.length] = new Option(data[i], data[i]);
						}
						fields.options[0].selected = true;
						
						// Show dropdown and the button
						$('#field').fadeIn();
						$('#addFieldButton').fadeIn();
					}
				});
			}
			else
			{
				var items = intelli.database[table];
				var fields = $('#field')[0];
				
				fields.options.length = 0;
				
				for (var i = 0; i < items.length; i++) {
					fields.options[fields.options.length] = new Option(items[i], items[i]);
				}
				
				fields.options[0].selected = true;
				
				// Show dropdown and the button
				$('#field').fadeIn();
				$('#addFieldButton').fadeIn();
			}
		}
	});

	$('#addFieldButton').click(function()
	{
		addData('field');
	});

	$('#field').dblclick(function()
	{
		addData('field');
	});

	$('#query_history .history').click(function(){
		$('#query').val($(this).text());
		$(window).scrollTop(0);
		$('#query_box .minmax.white-close').click();
		if(intelli.box_tabs)
		{
			intelli.box_tabs.setActiveTab(intelli.box_tabs.items.length >= 3 ? 1 : 0);
		}
	});
	
	$('#clearButton').click(function()
	{
		Ext.Msg.confirm('Question', _t('clear_confirm'), function(btn, text)
		{
			if (btn == 'yes')
			{
				$('#query').attr('value', 'SELECT * FROM ');
				$('#field').fadeOut();
				$('#addFieldButton').fadeOut();
			}
		});
		
		return true;
	});

	// disable server backup if non writable
	if ($('#backup_message').length > 0)
	{
		$('#server').attr('disabled', 'disabled');
	}

	function addData(item)
	{
		var value = $('#' + item).attr('value');

		if (value)
		{
			addText('`' + value + '`');
		}
		else
		{
			intelli.admin.alert(
			{
				title: 'Error',
				type: 'error',
				msg: 'Please choose any ' + item + '.'
			});
		}
	}

	// add text to query
	function addText(text)  
	{
		text = ' ' + text + ' ';
		var query = document.getElementById('query');

		if (document.selection)
		{
			query.focus();

			sel = document.selection.createRange();
			sel.text = text;
		}
		else if (query.selectionStart || query.selectionStart == '0')
		{
			var startPos = query.selectionStart;
			var endPos = query.selectionEnd;
			var flag = false;

			if(query.value.length == startPos) flag = true;
			query.value = query.value.substring(0, startPos) + text + query.value.substring(endPos, query.value.length);
			if(flag) query.selectionStart = query.value.length;
		}
		else
		{
			query.value += text;
		}

		query.focus();
	}  	  

	// sql template click
	$('#sqlButtons div').click(function()
	{
		addText($(this).text());
	});
	
	// reset tables
	$('#all_options').click(function()
	{
		var checked = $(this).attr('checked') ? 'checked' : '';
		
		$("input[name='options[]']").each(function()
		{
			$(this).attr('checked', checked);
		});
	});
});