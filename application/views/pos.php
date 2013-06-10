<script type="text/javascript"> 
   $(document).ready(function(){
      $("#tanggal1").datepicker({
        showAnim    : "drop",
        showOptions : { direction: "up" }
      });
      $("#tanggal2").datepicker({
        showAnim    : "drop",
        showOptions : { direction: "up" }
      });
    });
</script>

<link rel="stylesheet" href="<?php echo base_url() ?>js/accordion/css/accordion.core.css" type="text/css" charset="utf-8">

        <style type="text/css">
            .loading {
                display: none;
            }
            .accordion {
                border: 1px solid #ccc;
                width:  100%;
            }
                .accordion li h3 a {
                    background:             #666;
                    background:             #666 -webkit-gradient(linear, left top, left bottom, from(#999), to(#666)) no-repeat;
                    background:             #666 -moz-linear-gradient(top,  #999,  #666) no-repeat;
                    border-bottom:          1px solid #333;
                    border-top:             1px solid #ccc;
                    color:                  #fff;
                    display:                block;
                    font-style:             normal;
                    margin:                 0;
                    padding:                10px 10px;
                    text-shadow:            0 -1px 2px #333, #ccc 0 1px 2px;
                }
                    .accordion li.active h3 a {
                        background:             #369;
                        background:             #369 -webkit-gradient(linear, left top, left bottom, from(#69c), to(#369)) no-repeat;
                        background:             #369 -moz-linear-gradient(top,  #69c,  #369) no-repeat;
                        border-bottom:          1px solid #036;
                        border-top:             1px solid #9cf;
                        text-shadow:            0 -1px 2px #036, #9cf 0 1px 2px;
                    }
                    .accordion li.locked h3 a {
                        background:             #963;
                        background:             #963 -webkit-gradient(linear, left top, left bottom, from(#c96), to(#963)) no-repeat;
                        background:             #963 -moz-linear-gradient(top,  #c96,  #963) no-repeat;
                        border-bottom:          1px solid #630;
                        border-top:             1px solid #fc9;
                        text-shadow:            0 -1px 2px #630, #fc9 0 1px 2px;
                    }
                .accordion li h3 {
                    margin:         0;
                    padding:        0;
                }
                .accordion .panel {
                    padding:        7px;
                }
        </style>


<div id="container">

  <div style="float:left; width:18%;">
          
          <h3 style="margin-left:3px;">Point of Sale</h3>  
          <ul id="accordion_pos" class="accordion">
                <li>
                    <h3>Customers</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="javascript:load_content('customer','#tab_loader')">List of Customers</a></li>
                        <li class="sublist"><a href="javascript:load_content('customer/add','#tab_loader')">New Customer</a></li>
                        <li class="sublist"><a href="">Excel Import</a></li>
                    </ul>
                </li>
                <li>
                    <h3>Suppliers</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="javascript:load_content('supplier','#tab_loader')">List of Suppliers</a></li>
                        <li class="sublist"><a href="javascript:load_content('supplier/add','#tab_loader')">New Supplier</a></li>
                        <li class="sublist"><a href="">Excel Import</a></li>
                    </ul>
                </li>
                <li>
                    <h3>Items</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="">List of Items</a></li>
                        <li class="sublist"><a href="">New Item</a></li>
                        <li class="sublist"><a href="">Excel Import</a></li>
                        <li class="sublist"><a href="">Items Receiving</a></li>
                        <li class="sublist"><a href="">Barcode Labels</a></li>
                    </ul>
                </li>
                <li>
                    <h3>Item Kits</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="">List of Item Kits</a></li>
                        <li class="sublist"><a href="">New Item Kit</a></li>
                        <li class="sublist"><a href="">Barcode Labels</a></li>
                    </ul>
                </li>
                <li>
                    <h3>Sales</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="">Sales Register </a></li>
                        <li class="sublist"><a href="">Suspended Sales</a></li>
                        <li class="sublist"><a href="">Search Sales</a></li>
                    </ul>
                </li>
                <li>
                    <h3>Reports</h3>
                    <ul class="panel loading">
                        <li class="sublist"><a href="">Graphical Reports</a></li>
                        <li class="sublist"><a href="">Summary Reports</a></li>
                        <li class="sublist"><a href="">Detailed Reports</a></li>
                    </ul>
                </li>
            </ul>

      <div class="clear"></div>
  </div>

  <div style="float:right; width:82%;">
      <div id="tab_loader" style="display:none"> 
  </div>

</div>

<script type="text/javascript" src="<?php echo base_url() ?>js/accordion/jquery-1.4.2.min.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/accordion/jquery.accordion.2.0.js" charset="utf-8"></script>

<script type="text/javascript">
    $('#accordion_pos').accordion({
        canToggle: true
    });
    
    $(".loading").removeClass("loading");
</script>