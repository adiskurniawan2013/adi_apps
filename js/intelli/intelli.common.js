intelli.common = function()
{
	var dialog = null;

	return {
		init: function()
		{
			$("a[class^='countable']").each(function()
			{
				$(this).click(function()
				{
					var type = $(this).attr('class').split(' ')[1];
					var id = $(this).attr('id').split('_')[1];

					if('' != type && '' != id)
					{
						$.ajax({
							type: 'POST',
							async: false,
							cache: false,
							url: 'counter',
							data: 'type=' + type + '&id=' + id
						});
					}

					return true;
				});
			});
		},
		/**
		* Opens Report Broken Listing window
		*
		* @param int id listing id
		*/
		reportBrokenListing: function(id)
		{
			if(confirm(intelli.lang.do_you_want_report_broken))
			{
				$.get("report-listing", {id: id, report: 1}, function(data)
				{
					$("body").after(data);
				});
			}
		},

		actionFavorites: function(item_id, item, action)
		{
			var msg = ('add' == action) ? intelli.lang.add_favorite : intelli.lang.remove_favorite;
			if (confirm(msg))
			{
				$.ajax({
					url: 'favorites.json',
					type: 'get',
					data: {
						item: item,
						item_id: item_id,
						action: action
					},
					success: function(data) {
						if (!data.error)
						{
							window.location.href = window.location.href;
						}
					}
				});
			}
			return false;
		},

		moveListing: function(id)
		{
			var html = '';
			var idLink = id;

			if (!confirm(intelli.lang.listing_move_confirmation))
			{
				return false;
			}

			$("tr[class='tree']").remove();

			html += '<tr class="tree"><td>';
			html += '<fieldset style="collapsible"><legend><span id="change_category_text">'+ intelli.lang.move_listing +'</span></legend>';	
			html += '<div id="tree"></div>';
			html += '</fieldset>';
			html += '</td></tr>';

			$('#tdlisting' + idLink).parent().after(html);
			
			var moveTree = new intelli.tree({
				id: 'tree',
				type: 'radio',
				state: '',
				hideRoot: false,
				callback: function()
				{
					if(!confirm(intelli.lang.listing_fin_move_confirmation))
					{
						return false;
					}
					
					var idCat = $(this).attr('id').split('_')[2];

					$.get('move-listings.php', {action: 'moving', idcat: idCat, idlink: idLink}, function(data)
					{
						$('#tree').html(data);
						$('#tdlisting' + idLink).parent().remove();
					});
				}
			});	

			moveTree.init();
		}
	}
}();
