$(function() {
	$('input[name="items[]"]').bind('click', function() {
		toggle_fields($(this).val());
	});
	$('input:checked[name="items[]"]').each(function() {
		toggle_fields($(this).val());
	});
});

// show/hide additional items fields
function toggle_fields(aItem)
{
	var fieldset = $('#' + aItem + '_fields');
    var parent = fieldset.parent('div:first');
    if(fieldset.css('display') == 'none')
    {
        fieldset.show();
        parent.show();
    }
    else
    {
        fieldset.hide();
        if(parent.find('fieldset:visible').length == 0)
        {
            parent.hide();
        }
    }

}