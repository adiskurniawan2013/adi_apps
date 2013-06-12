<!DOCTYPE html>
<html lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title>My Apps | Demo</title>
<base href="<?php echo base_url() ?>" />

<link href="<?php echo base_url() ?>images/home.png" rel="shortcut icon" type="image/x-icon"/>

<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery-1.4.4.min.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/jquery/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/html5.js"></script>
<script type="text/javascript" src="<?php echo base_url() ?>js/highslide-full.packed.js"></script>

<link href="<?php echo base_url() ?>css/cupertino/jquery-ui-1.10.3.custom.min.css" rel="stylesheet" type="text/css"/> 
<link href="<?php echo base_url() ?>css/menu_styles.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo base_url() ?>css/global.css" rel="stylesheet" type="text/css"/> 
<link href="<?php echo base_url() ?>css/styles.css" rel="stylesheet" type="text/css"/> 
<link href="<?php echo base_url() ?>css/highslide.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo base_url() ?>css/validationEngine.jquery.css" rel="stylesheet" type="text/css"/>

<!-- tooltip -->
<script type="text/javascript" src="<?php echo base_url() ?>js/jtip.js" ></script>
<link rel="stylesheet" href="<?php echo base_url() ?>css/jtip.css" type="text/css" />

<!-- Bootstrap -->
<link href="<?php echo base_url('js/bootstrap/css/bootstrap.css'); ?>" rel="stylesheet"> 
<!-- <link href="<?php echo base_url('css/admin.css'); ?>" rel="stylesheet"> -->

<link href="<?php echo base_url('css/datepicker.css'); ?>" rel="stylesheet">
	
<!-- <script src="http://code.jquery.com/jquery-latest.js"></script> -->
<script src="<?php echo base_url('js/bootstrap/js/bootstrap.min.js'); ?>"></script>
<script src="<?php echo base_url('js/bootstrap/js/bootstrap-datepicker.js'); ?>"></script>

<?php if(isset($sortable) && $sortable === TRUE): ?>
<script src="<?php echo base_url('js/jquery-ui-1.9.1.custom.min.js'); ?>"></script>
<script src="<?php echo base_url('js/jquery.mjs.nestedSortable.js'); ?>"></script>
<?php endif; ?>

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!-- TinyMCE -->
<script type="text/javascript" src="<?php echo base_url('js/tiny_mce/tiny_mce.js'); ?>"></script>
<script type="text/javascript">
	tinyMCE.init({
		// General options
		mode : "textareas",
		theme : "advanced",
		plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,visualblocks",

		// Theme options
		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,visualblocks",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,
	});
</script>


</head>
<body>