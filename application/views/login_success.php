<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<link href="<?php echo base_url('css/styles.css') ?>" rel="stylesheet" type="text/css" />
<body>
<script language="javascript" type="text/javascript">
	setTimeout("window.location.href='<?php echo base_url('site') ?>'", 3000);
</script>
<div class="form_block" id="login_success">
  <div class="form_title">Login Successful</div>
  <div class="form"> <br />
    <br />
	Welcome: <strong><?php echo sess_var('username') ?></strong><br /><br />
    You are loged in as: <strong>
    <?php echo $username ?>
    </strong><br />
    <br />
    You can now proceed to <a href="<?php echo base_url('site') ?>">Admin control panel</a>.<br />
    <br />
  </div>
</div>
</body>
</html>
