<script type="text/javascript" src="<?php echo base_url(); ?>js/datatables/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/datatables/js/jquery.dataTables.delay.min.js"></script>

<link href="<?php echo base_url() ?>js/datatables/css/jquery.dataTables_themeroller.css" rel="stylesheet" type="text/css"/>

<script type="text/javascript">
    $(document).ready(function() {
    var oTable = $('#suppliertable').dataTable( {
        "bProcessing": true,
        "bServerSide": true,
        "sScrollY": "360px",
        "sAjaxSource": '<?php echo base_url(); ?>supplier/datatable',
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "iDisplayLength": 25,
            "aaSorting": [[0, 'asc']],
            "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
             "aoColumns": [
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": true, "bSortable": true },
                { "bVisible": true, "bSearchable": false, "bSortable": false }
            ],
            "oLanguage": {
            "sProcessing": "<img src='<?php echo base_url(); ?>images/loader.gif'>"
        },  
        "fnInitComplete": function() {
                //oTable.fnAdjustColumnSizing();
         },
            'fnServerData': function(sSource, aoData, fnCallback) {
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
        conf=confirm("Are you sure you want to delete this supplier?");
        if(conf) {
            load_content('supplier/delete/'+recid, '#tab_loader');
        }
    }
</script>

<div id="form_loader">
    <div class="form_block2" id="person_form" style="width:1000px; margin-left:23px; margin-top:2px;">
        <div class="form_title">List of Suppliers</div>

        <table cellpadding="0" cellspacing="0" border="0" id="suppliertable" width="100%">
            <thead>
                <tr>
                    <th width='30%'>Name</th>
                    <th width='20%'>Company Name</th>
                    <th width='24%'>Email</th>
                    <th width='20%'>Phone</th>
                    <th width='6%'>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>

    </div> <!-- end class form block -->
</div> <!-- end class form loader -->

<div id="tab_loader" style="display:none"> 


