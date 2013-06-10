<div class="menu">

<script type="text/javascript"> 
$(document).ready(function(){
  
  $(".mi").hover(function() {
      var timeout = $(this).data("timeout");
        if(timeout) clearTimeout(timeout);
      
      $(this).find("span").addClass("subhover");
      $(this).find("ul.subnav").slideDown('fast').show();
    },
    function(){
        $(this).data("timeout", setTimeout($.proxy(function() { 
          $(this).find("ul.subnav").slideUp('slow'); 
          $(this).find("span").removeClass("subhover");
        }, this), 500)); 
      }
  );

});
</script>

<ul class="topnav">
    
    <li>
        <a href="http://www.freelogoservices.com/" target="_blank" style="padding:0; margin-top:4.5px; margin-left:35px"><img src="<?php echo base_url()?>images/logo.png" height="22"/></a>
    </li>   
    
    <li>
        <a href="javascript:load_content('site')" style="margin-left:35px">Home</a>
    </li>     

    <li class="mi">
        <a href="javascript:load_content('pos')">Point of Sale</a>
    </li>

    <li class="mi">
        <a href="">Employees</a>
    </li>

    <li class="mi">
        <a href="">Payroll</a>
    </li>

    <li class="mi">
        <a href="">Budgeting</a>
    </li> 
    
</ul>

<div class="login_welcome">
Welcome <strong><?php echo sess_var('username')?></strong><a href="<?php echo base_url('login/logout')?>">Logout</a>
</div>

<div style="clear:both"></div>

</div>
