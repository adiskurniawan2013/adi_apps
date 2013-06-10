<!-- Tablesorter: required -->
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery-1.4.4.min.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/tablesorter/jquery.tablesorter.js"></script>

<!-- Tablesorter: theme -->
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery-ui.js"></script>
<link class="ui-theme" rel="stylesheet" href="<?php echo base_url() ?>css/jquery-ui.css"> 

<link class="theme" rel="stylesheet" href="<?php echo base_url() ?>js/tablesorter/css/theme.jui.css">

<!-- Tablesorter: optional -->
<link rel="stylesheet" type="text/css" href="<?php echo base_url() ?>js/tablesorter/addons/pager/jquery.tablesorter.pager.css">
<script type="text/javascript" src="<?php echo base_url() ?>js/tablesorter/addons/pager/jquery.tablesorter.pager.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/tablesorter/jquery.tablesorter.widgets.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/tablesorter/widgets/widget-scroller.js"></script> 

<script id="js">$(function(){
// define pager options
var pagerOptions = {
    // target the pager markup - see the HTML block below
    container: $(".pager"),
    // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
    // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
    // table row set to a height to compensate; default is false
    fixedHeight: true,
    // remove rows from the table to speed up the sort of large tables.
    // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
    removeRows: false,
    // go to page selector - select dropdown that sets the current page
    cssGoto:     '.gotoPage'
};

// Initialize tablesorter
// ***********************
$("table")
    .tablesorter({
        // theme: 'blue',
        showProcessing: true,
        emptyTo: 'zero',
        widthFixed : true,
        headerTemplate : '{content} {icon}', // Add icon for jui theme; new in v2.7!
        widgets: ["scroller", "uitheme", "zebra"] , //[ "stickyHeaders", "scroller", "uitheme", "columns"],
        widgetOptions: {
            scroller_height       : 370,  // height of scroll window
            scroller_barWidth     : 17,   // scroll bar width
            scroller_jumpToHeader : true, // header snap to browser top when scrolling the tbody
            scroller_idPrefix     : 's_',  // cloned thead id prefix (random number added to end)
            zebra   : ["ui-widget-content even", "ui-state-default odd"],
            // use uitheme widget to apply defauly jquery ui (jui) class names
            // see the uitheme demo for more details on how to change the class names
            uitheme : 'jui' // jui, blue
        }
    })
    // initialize the pager plugin
    // ****************************
    .tablesorterPager(pagerOptions);
});
</script>

<script type="text/javascript">
    //deletion confirmation
    function delconfirm(recid) {
        conf=confirm("Are you sure you want to delete this item?");
        if(conf) {
            load_content('items/delete/'+recid, '#tab_loader');
        }
    }
</script>



<div id="form_loader">
    <div class="form_block2" id="person_form" style="width:1000px; margin-left:2px; margin-top:0px;">
        <div class="form" style="height:500px;">
            <div class="form_title">
                 <div class="pager" style="float:right; font-size:11px; padding:0">
                        Page: <select class="gotoPage"></select>        
                        <img src="<?php echo base_url() ?>js/tablesorter/addons/pager/icons/first.png" class="first" alt="First" title="First page" />
                        <img src="<?php echo base_url() ?>js/tablesorter/addons/pager/icons/prev.png" class="prev" alt="Prev" title="Previous page" />
                        <span class="pagedisplay"></span>
                        <img src="<?php echo base_url() ?>js/tablesorter/addons/pager/icons/next.png" class="next" alt="Next" title="Next page" />
                        <img src="<?php echo base_url() ?>js/tablesorter/addons/pager/icons/last.png" class="last" alt="Last" title= "Last page" />
                        <select class="pagesize">
                            <option selected="selected" value="50">50</option>
                            <option value="100">100</option>
                            <option value="150">150</option>
                            <option value="200">200</option>
                        </select>
                </div>
                List of items
            </div>
            
            <div style="height:5px"></div> 
            
            <?php
                if($items){
            ?>
                <table class="tablesorter">
                <thead>
                 <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Tax (%)</th>
                    <th>Quantity</th>
                    <th class='filter-false remove sorter-false'>Inventory</th>
                    <th class='filter-false remove sorter-false'></th>
                </tr>
                </thead>
                
                </body>
                    <?php
                    //display the result (records)
                    foreach($items as $item){
                        $item_tax_info=$this->m_item_taxes->get_info($item->item_id);
                        $tax_percents = '';

                        foreach($item_tax_info as $tax_info) {
                            $tax_percents.=$tax_info['percent']. '%, ';
                        }
                        $tax_percents=substr($tax_percents, 0, -2);
                    ?>
                    <tr>
                        <td align='center' width='150px'>
                            <a href="javascript:load_content('items/edit/<?php echo $item->item_id ?>','#tab_loader','#form_loader')"><?php echo $item->item_number ?></a>
                        </td>
                        <td>
                            <?php echo $item->name ?>
                        </td>
                         <td> 
                            <?php echo $item->category ?>
                        </td>
                         <td align='right'>
                            <?php echo to_currency($item->unit_price) ?>
                        </td>
                         <td align='right'>
                            <?php echo $tax_percents ?>
                        </td>
                         <td align='right'>
                            <?php echo $item->quantity ?>
                        </td>
                        <td align='center'>
                            <a href=""><img src='<?php echo base_url() ?>images/delete.png' width='13' height='13' border='0'  title='Delete record'/></a>
                            &nbsp;&nbsp;&nbsp;
                            <a href=""><img src='<?php echo base_url() ?>images/delete.png' width='13' height='13' border='0'  title='Delete record'/></a>
                        </td>
                        <td align='center' width='20px'>
                            <a href="javascript:delconfirm('<?php echo $item->item_id ?>')"><img src='<?php echo base_url() ?>images/delete.png' width='13' height='13' border='0'  title='Delete record'/></a>
                        </td>
                    </tr>
                    
                    <?php
                        }//end foreach
                    }else{
                        echo "<div style='text-align:center; padding:50px'>No data. Please add one.</div>\n";
                        }//end else
                    ?>
                </body>
            </table>
        </div> <!-- end class form -->
    </div> <!-- end class form block -->
</div>

<div id="tab_loader" style="display:none"> 

