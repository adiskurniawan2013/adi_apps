$(function()
{
	if ($('#error').length > 0)
	{
		$('html, body').animate(
		{
			scrollTop: $('.page-header').offset().top
		});
	}

	intelli.common.init();

	if ('object' == typeof jQuery.tabs)
	{
		$('#ia-tab-container').tabs();
	}

	// hide tab if content is empty

	$('.tab-pane').each(function()
	{
		if ($.trim($(this).html()) == '')
		{
			var tab_id = '#';
			tab_id += $(this).attr('id');
			$(this).remove();
			$('a[href='+ tab_id +']').parent('li').remove();
		}
	});
	// hide tab list if no tabs exists
	$('.tabbable').each(function()
	{
		if (!$(this).children('.nav-tabs').children('li').length)
		{
			$(this).remove();
		}
	});

	$('fieldset.collapsible > legend').each(function()
	{
		/* Hacked for compatibility with CKEditor.
		 * If editor located in the fieldset, place all content
		 * in <div class="fieldset-wrapper"></div>
		 */
		var fieldset = $(this).parent();
		var content = $('div.fieldset-wrapper', fieldset);
		var legend = $('<a href="#" />').html($(this).html()).click(function()
			{
				toggleFieldset(fieldset);
				return false;
			});
		$(this).html(legend);
		if (!content.length)
		{
			legend = $('<legend />').append(legend);
			content = $('<div class="fieldset-wrapper" />').append(fieldset.children(':not(legend)'));
			fieldset.empty().append(legend).append(content);
		}
	});

	$('input[placeholder]').each(function(){
		inputPlaceholder(this);
	});

	$('.js-filter-numeric').each(function(){
		$(this).numeric();
	});

	$('.search-text').focus(function () {
		 $(this).parent().addClass('focused');
	}).focusout(function () {
		 $(this).parent().removeClass('focused');
	});

	// Navbar clickable parent menus

	//fix last item caret
	$('.navbar li:not(:has(li)) a').addClass('last');

	$('.navbar .main-menu > li:has(ul)').hover(function(){
		var _this = $(this);
		_this.addClass('open');
		var thisHref = $('> a', _this).attr('href');
		_this.click(function(){
			window.location = thisHref;
		});
	}, function () {
		_this = $(this);
		setTimeout(function(){
			_this.removeClass('open');
		});
	});
});

// Get filename on picture select
function detectFilename() {
	$('.wrap_upload').on('change', 'input[type="file"]', function() {
		var filename = $(this).val();
		var lastIndex = filename.lastIndexOf("\\");
		if (lastIndex >= 0) {
			filename = filename.substring(lastIndex + 1);
		}
		$(this).prev().find('.uneditable-input').text(filename);
	});
}

detectFilename();

//Add additional image field
function add(btn)
{
	var clone = $(btn).parent().parent().clone();
	var counterobj = $('#'+$('input:file', clone).attr('name').substr(0,$('input:file', clone).attr('name').length-2));
	if (counterobj.val() > 0)
	{
		$('input:file', clone).val('');
		$('.uneditable-input', clone).text('');
		$('input.text', clone).val('');
		$(btn).parent().parent().after(clone);
		counterobj.val(counterobj.val()-1);
	}
	else
	{
		alert(_f('no_more_files'));
	}
	detectFilename();
}
function remove_block(btn)
{
	var clone = $(btn).parent().parent().clone();
	var counterobj = $('#'+$('input:file', clone).attr('name').substr(0,$('input:file', clone).attr('name').length-2));


	if ($(btn).parent().parent().prev().hasClass('pictures') || $(btn).parent().parent().next().hasClass('pictures'))
	{
		$(btn).parent().parent().remove();
		counterobj.val(counterobj.val()+1);
	}
}

function inputPlaceholder (input, color)
{
  if (!input) return null;

  // Do nothing if placeholder supported by browser (Webkit, Firefox 3.7)
  if (input.placeholder && 'placeholder' in document.createElement(input.tagName)) return input;

  color = color || '#AAA';
  var default_color = input.style.color;
  var default_type = input.type;
  var placeholder = input.getAttribute('placeholder');

  if (input.value === '' || input.value == placeholder) {
	input.value = placeholder;
	input.style.color = color;
	if (default_type == 'password') input.type = 'text';
  }

  var add_event = /*@cc_on'attachEvent'||@*/'addEventListener';

  input[add_event](/*@cc_on'on'+@*/'focus', function()
  {
	input.style.color = default_color;
	if (input.value == placeholder) {
	  input.value = '';
	  if (default_type == 'password') input.type = 'password';
	}
  }, false);

  input[add_event](/*@cc_on'on'+@*/'blur', function()
  {
	if (input.value === '') {
	  input.value = placeholder;
	  input.style.color = color;
	  if (default_type == 'password') input.type = 'text';
	} else {
	  input.style.color = default_color;
	}
  }, false);

  input.form && input.form[add_event](/*@cc_on'on'+@*/'submit', function()
  {
	if (input.value == placeholder) {
	  input.value = '';
	}
  }, false);

  return input;
}

function toggleFieldset(fieldset) 
{
	if ($(fieldset).is('.collapsed'))
	{
		var content = $('> div', fieldset).css('display', 'none');
		$('> legend a i', fieldset).removeClass('icon-arrow-down').addClass('icon-arrow-up');
		$(fieldset).removeClass('collapsed');
		content.slideDown(300, function() 
		{
			// Make sure we open to height auto
			$(this).css('height', 'auto');
		});
	} 
	else
	{
		$('> legend a i', fieldset).removeClass('icon-arrow-up').addClass('icon-arrow-down');
		$('> div', fieldset).slideUp('medium', function()
		{
			$(this.parentNode).addClass('collapsed');
		});
	}
}

$(document).ready(function()
{
	$('.carousel').carousel();

	var pictureTitles = $('.js-edit-picture-title');
	if (pictureTitles.length)
	{
		$(pictureTitles).editable(
		{
			url: intelli.config.ia_url + 'actions.json',
			type: 'text',
			params: function(params)
			{
				var self = $(this);

				params.action = 'edit_picture_title';
				params.field = self.data('field');
				params.item = self.data('item');
				params.itemid = self.data('item-id');
				params.path = self.data('picture-path');

				return params;
			}
		});
	}

	// delete picture
	$('.js-delete-picture').click(function(e)
	{
		e.preventDefault();

		var self = $(this);

		var path = self.data('picture-path');
		var id = self.data('item-id');
		var item = self.data('item');
		var field = self.data('field');

		if (confirm(_t('sure_rm_file')))
		{
			$.get(intelli.config.ia_url + 'actions.json', {action: 'rm_pic', item: item, field:field, path: path, itemid: id}, function(data)
			{
				$(self).closest('.thumbnail').remove();

				var counter = $('#' + field);
				counter.val(parseInt(counter.val()) + 1);
				if (counter.val() == 0)
				{
					$('#wrap_' + field).show();
				}
			});
		}
	});
});