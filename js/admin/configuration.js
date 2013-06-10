$(function(){
	$("textarea.cked").each(function(){
		intelli.ckeditor($(this).attr("id"), {toolbar: 'Simple', height: '200px'});
	});

    $('.set_default').click(function(){
        var div = $(this).parent().parent().parent().get(0);
        $(div).removeClass('common').addClass('custom');
        $(div).find('.chck').val('0');
    });
    $('.set_custom').click(function(){
        var div = $(this).parent().parent().parent().get(0);
        $(div).removeClass('custom').addClass('common');
        $(div).find('.chck').val('1');
    });

    $('.item_val').dblclick(function(){
        var div = $(this).parent().parent().get(0);
        $(div).removeClass('custom').addClass('common');
        $(div).find('.chck').val('1');
    });
});
