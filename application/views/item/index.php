<script type="text/javascript" src="<?php echo base_url(); ?>js/datatables/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/datatables/js/jquery.dataTables.delay.min.js"></script>

<link href="<?php echo base_url() ?>js/datatables/css/jquery.dataTables_themeroller.css" rel="stylesheet" type="text/css"/>

<script type="text/javascript">
    $(document).ready(function() {
        var tA = "javascript:load_content('item/edit/";
        var tB = "','#tab_loader','#form_loader')";    
        
        var oTable = $('#itemtable').dataTable( {
            "bProcessing": true,
            "bServerSide": true,
            "sScrollY": "360px",
            "sAjaxSource": '<?php echo base_url(); ?>item/datatable',
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "iDisplayLength": 25,
            "aaSorting": [[1, 'asc']],
            "aLengthMenu": [[25, 50, 100, 200], [25, 50, 100, 200]],

            "aoColumns": [
                { "bVisible": false, "bSearchable": false, "bSortable": false },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": false },
                { "bVisible": true, "bSearchable": false, "bSortable": false }
            ],

            "oLanguage": {
                "sProcessing": "<img src='<?php echo base_url(); ?>images/loader.gif'>"
            },  
            "fnInitComplete": function() {
                    //oTable.fnAdjustColumnSizing();
            },
            "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                $('td:eq(0)', nRow).html('<a href="' + tA + aData[0] + tB +'">' + aData[1] + '</a>');
                return nRow;
            },   
            "fnServerData": function(sSource, aoData, fnCallback) {
                $.ajax ({
                    'dataType': 'json',
                    'type'    : 'POST',
                    'url'     : sSource,
                    'data'    : aoData,
                    'success' : fnCallback
                });
            }
        });
    }).fnSetFilteringDelay(700);
</script>

<script type="text/javascript">
    //deletion confirmation
    function delconfirm(recid) {
        conf=confirm("Are you sure you want to delete this item?");
        if(conf) {
            load_content('item/delete/'+recid, '#tab_loader');
        }
    }
</script>

<div id="form_loader">
    <div class="form_block2" id="item_form" style="width:1000px; margin-left:23px; margin-top:2px;">
        <div class="form_title">List of Items</div>

        <table cellpadding="0" cellspacing="0" border="0" id="itemtable" width="100%">
            <thead>
                <tr>
                    <th width='0%'>ID</th>
                    <th width='30%'>Name</th>
                    <th width='25%'>Category</th>
                    <th width='12%'>Unit Price</th>
                    <th width='8%'>Quantity</th>
                    <th width='10%'>Tax (%)</th>
                    <th width='4%'></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
            <tfoot>
            </tfoot>
        </table>

    </div> <!-- end class form block -->
</div> <!-- end class form loader -->

<div id="tab_loader" style="display:none"> 


