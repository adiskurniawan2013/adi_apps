intelli.uiColor = '#9CA7AE';
$(function()
{
	if ($('.right-column .box').length > 1)
	{
		var items = [];
		var name,rand;
		$('.right-column .box').each(function(){
			rand = 'box'+Math.random();
			if ($(this).attr('id'))
			{
				name = $(this).attr('id');
				$(this).attr('id', rand);
			}
			else
			{
				name = rand;
			}
			$(this).find('.box-content').attr('id', name).show();
			items.push({
				contentEl: name,
				title: '<div class="tab-caption">'+$(this).find('.box-caption').text()+'</div>'
			});
		}).hide();
		$('.right-column .box:first').before('<div id="ext_tabs"></div>');
		intelli.box_tabs = new Ext.TabPanel({
			renderTo: 'ext_tabs',
			activeTab: 0,
			shim: false,
			defaults: { autoHeight: true },
			items: items
		});
		$('.x-tab-panel > div').removeClass('x-tab-panel-header');
	}

	$('div.left-column').Sortable(
    {
        accept: 'dragGroup',
        helperclass: 'sortHelper',
        activeclass: 'dropActive',
        hoverclass: 'dropHover',
        tolerance: 'intersect',
        handle: '.menu-caption',
        fx: function(){},
        onChange: function(groups)
        {
            $.get(intelli.config.admin_url + '/order-change.json?type=adminblocks&' + $.SortSerialize().hash, function(){});
        }
    });
	/* header-menu show/hide START */
	var showHideMenu = false, hideMenu = false, menuOver = false;
	if ($('#alert').length)
	{
		$('#alert').show();
	}
	if ($('#success'))
	{
		var text = []; 
		$('#success .inner li').each(function(){
			text.push($(this).html());
		});
		$('#success').html('');
		if (text.length > 0)
		{
			intelli.admin.notifBox({
				msg: text,
				type: 'notification',
				autohide: true
			});
		}
	}

	if ($('#notification').length)
	{
		$('#notification').show();
	}

	$('#js-cmd-logout').click(function(e)
	{
		e.preventDefault();
		Ext.Msg.show(
		{
			title: _t('confirm'),
			msg: _t('are_you_sure_to_logout'),
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function(btn)
			{
				if ('yes' == btn)
				{
					window.location = intelli.config.ia_url + 'logout/';
				}
			}
		});
	});

	$('body').mouseover(function()
	{
		if (!showHideMenu && menuOver)
		{
			setTimeout(function()
			{
				$('span.h-arrow').removeClass('h-arrow-down');
				$('div.h-submenu').hide();
				menuOver = false;
			}, 50);
		}
	});
	/* header-menu show/hide END */

	$('.tab-shortcut').click(function()
	{
		var id = $(this).attr('id').replace('iatab-shortcut-', '');
		var tab_content = $('#iatab-content-' + id);

		if ('block' == tab_content.css('display'))
		{
			tab_content.hide();

			$('.tab-shortcut').each(function()
			{
				$(this).removeClass('tab-shortcut-active');
				$(this).children().removeClass('tab-shortcut-inner-active');
				$(this).children().addClass('tab-shortcut-inner');
			});
		}
		else
		{
			$('.tab-content').each(function()
			{
				if ($(this).css('display') == 'block')
				{
					$(this).hide();
				}
			});

			$('.tab-shortcut').each(function()
			{
				$(this).removeClass('tab-shortcut-active');
				$(this).children().removeClass('tab-shortcut-inner-active');
				$(this).children().addClass('tab-shortcut-inner');
			});

			$(this).addClass('tab-shortcut-active');
			$(this).children().removeClass('tab-shortcut-inner');
			$(this).children().addClass('tab-shortcut-inner-active');

			tab_content.show();
		}
	});

	$('div.minmax').each(function()
	{
		$(this).click(function()
		{
			if ($(this).next('.box-content').css('display') == 'block')
			{
				$(this).next('.box-content').slideUp();
				Ext.util.Cookies.set(this.id, 0);
			}
			else
			{
				$(this).next('.box-content').slideDown();
				Ext.util.Cookies.set(this.id, 1);
			}
            $(this).toggleClass('white-close white-open');
		});
	});

	$('.js-filter-numeric').each(function(){
		$(this).numeric();
	});

	function getMousePosition(e) {
		return { x: e.clientX + document.documentElement.scrollLeft, y: e.clientY + document.documentElement.scrollTop};
	}

	// get substring count with limit
	$.fn.substrCount = function(needle)
	{
		var h = this.text();
		var times = 0;
		while((pos=h.indexOf(needle)) != -1)
		{
			h = h.substr(pos+needle.length);
			times++;
		}

		return times;
	};

	function stopPropagation(ev)
	{
		ev = ev||event;/* get IE event ( not passed ) */
		ev.stopPropagation? ev.stopPropagation() : ev.cancelBubble = true;
	}

	textareaResizer = function() {
	  $('textarea.resizable').each(function() {
	    var obj = $(this);

		cl = obj.attr('class');
		if (cl && -1 != cl.indexOf('noresize'))
		{
			return false;
		}

	    var content = obj.text();
	    var Height = 75;
	    if (content.length)
	    {
	    	// IE - doesnt find \n I gave up I don't know why it is so ..
	    	// Firefox works just as it must work as well as Opera
	    	var times = obj.substrCount($.browser.msie ? "\r" : "\n");
	    	if (times > 20)
	    	{
	    		Height = 200;
	    	}
	    	else
	    	{
	    		Height = 70+10*times;
	    	}
	    }

		obj.height(Height);

		var offset = null;

		$(this).wrap('<div class="resizable-textarea"></div>').after($('<div class="resizable-textarea2"></div>').bind("mousedown", dragBegins));


	    var image = $('div.resizable-textarea2', $(this).parent())[0];
	    image.style.marginRight = (image.offsetWidth - $(this)[0].offsetWidth) +'px';

	    function dragBegins(e)
	    {
	      offset = obj.height() - getMousePosition(e).y;
	      if ($.browser.opera)
	      {
	      	offset -= 6;
	      }
	      $(document)
			  .bind('mousemove', doDrag)
			  .bind('mouseup', dragEnds);
	      stopPropagation(e);
	    }

	    function doDrag(e)
	    {
	      obj.height(Math.max(15, offset + getMousePosition(e).y) + 'px');
	      stopPropagation(e);
	    }

	    function dragEnds(e)
	    {
			$(document).unbind();
	    }
	  });
	}();

	/* table highlighting START */
	$('table.striped tr:even').each(function()
	{
		$(this).addClass('highlight');
	});

	$('table.striped tr').mouseover(function()
	{
		$(this).addClass('hover');
	});
	$('table.striped tr').mouseout(function()
	{
		$(this).removeClass('hover');
	});
	/* table highlighting END */

	/*
	 * Help tooltips
	 */
	$('.tip-header').each(function()
	{
		var id = $(this).attr('id').replace('tip-header-', '');

		if ($('#tip-content-' + id).length > 0)
		{
			$(this).append('<span class="question" id="tip_'+ id +'"><img src="'+intelli.config.admin_url+'/templates/'+intelli.config.admin_tmpl+'/img/icons/sp.gif" alt="" width="16" height="17" /></span>').find("span.question").each(function()
			{
				new Ext.ToolTip(
				{
					target: this,
					dismissDelay: 0,
					contentEl: 'tip-content-' + id
				});
			});
		}
	});

	/*
	 * Top menu
	 */
	if ($('#top_menu').text())
	{
		$('#top_menu').show();
	}

	/*
	 * qtip for quick search listing text input
	 */
	if (Ext.get('quick_search_listing'))
	{
		new Ext.ToolTip(
		{
			target: 'quick_search_listing',
			anchor: 'top',
			anchorOffset: 125,
			html: _t('quick_search_listing_qtip')
		});
	}

	/*
	 * qtip for quick search category text input
	 */
	if (Ext.get('quick_search_category'))
	{
		new Ext.ToolTip(
		{
			target: 'quick_search_category',
			anchor: 'top',
			anchorOffset: 125,
			width: 155,
			html: _t('quick_search_category_qtip')
		});
	}

	/*
	 * qtip for quick search account text input
	 */
	if (Ext.get('quick_search_account'))
	{
		new Ext.ToolTip(
		{
			target: 'quick_search_account',
			anchor: 'top',
			anchorOffset: 125,
			html: _t('quick_search_account_qtip')
		});
	}

	/*
	 * Iphone switcher
	 */
	$('.switcher')
	.each(function(){
		var labels = $(this).attr('rel').split('--');
		$(this).iphoneStyle({
		  checkedLabel: labels[0],
		  uncheckedLabel: labels[1]
		});
	})
	.change(function(){
		var id = $(this).attr('id').replace('box-', '');
		$('#input-' + id).val($(this).is(':checked') ? 1 : 0).change();
	});

	/*
	 * Init AJAX notification box
	 */
	$('.collapsed[rel]').click(function(){
		$($(this).attr('rel')).toggle();
	});

	intelli.admin.initAjaxLoader();
});
//Add additional image field
function rm_pic_adm(path, link, item, field, itemid)
{
	if (confirm(_t('sure_rm_file')))
	{
		$.get(	intelli.config.admin_url + '/actions.json',
			{action: 'rm_pic', item: item, field:field, path: path, itemid: itemid},
			function(data)
			{
				$(link).parent().remove();
				var counter = $('#'+field);
				try {
					counter.val(parseInt(counter.val()) + 1);
					if (counter.val() == 0)
					{
						$('#wrap_'+field).show();
					}
				}
				catch (e) {}
			}
		  );
	}
	return false;
}

function add(btn)
{
	var clone = $(btn).parent().clone();
	var counterobj = $('#'+$('input:file', clone).attr('name').substr(0,$('input:file', clone).attr('name').length-2));
	if (counterobj.val() > 0)
	{
		$('input:file', clone).val('');
		$('input.text', clone).val('');
		$(btn).parent().after(clone);
		counterobj.val(counterobj.val()-1);
	}
	else
	{
		alert(_t('no_more_files'));
	}
}
function remove(btn)
{
	var clone = $(btn).parent().clone();
	var counterobj = $('#'+$('input:file', clone).attr('name').substr(0,$('input:file', clone).attr('name').length-2));

	if ($(btn).parent().prev().attr('class') == 'pictures' || $(btn).parent().next().attr('class') == 'pictures')
	{
		$(btn).parent().remove();
		counterobj.val(counterobj.val()*1+1);
	}
}