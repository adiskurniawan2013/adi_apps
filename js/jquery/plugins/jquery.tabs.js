intelli.tabs = {
    init: function(){
        //When page loads...
        $(".tab-content").css('display', 'none'); //Hide all content
        $("ul.ia-tabs li:first").addClass("active").show(); //Activate first tab
        $(".tab-content:first").css('display', 'block'); //Show first tab content

        //On Click Event
        $("ul.ia-tabs li").unbind('click');
        $("ul.ia-tabs li").click(function() {

            $("ul.ia-tabs li").removeClass("active"); //Remove any "active" class
            $(this).addClass("active"); //Add "active" class to selected tab
            $(".tab-content").css('display', 'none'); //Hide all tab content

            var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
            $(activeTab).fadeIn(); //Fade in the active ID content
            return false;
        });
    },add:function(name, title, content, container, tabs){
        if (!tabs)
        {
            tabs = $(".ia-tabs");
        }
        if (!container)
        {
            container = $("#ia-tab-container");
        }
		tabs.append('<li><a href="#ia-tab-container-'+name+'"><span>'+title+'</span></a></li>');
		container.append('<div id="ia-tab-container-'+name+'" class="tab-content '+name+'"><div style="clear:both;margin-bottom:10px;">'+content+'</div></div>');
		intelli.tabs.init();
    }
};
$(function(){
   intelli.tabs.init();
});