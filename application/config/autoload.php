<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| AUTO-LOADER
| -------------------------------------------------------------------
| This file specifies which systems should be loaded by default.
|
| In order to keep the framework as light-weight as possible only the
| absolute minimal resources are loaded by default. For example,
| the database is not connected to automatically since no assumption
| is made regarding whether you intend to use it.  This file lets
| you globally define which systems you would like loaded with every
| request.
|
| -------------------------------------------------------------------
| Instructions
| -------------------------------------------------------------------
|
| These are the things you can load automatically:
|
| 1. Libraries
| 2. Helper files
| 3. Plugins
| 4. Custom config files
| 5. Language files
| 6. Models
|
*/

/*
| -------------------------------------------------------------------
|  Auto-load Libraries
| -------------------------------------------------------------------
| These are the classes located in the system/libraries folder
| or in your system/application/libraries folder.
|
| Prototype:
|
|	$autoload['libraries'] = array('database', 'session', 'xmlrpc');
*/

$autoload['libraries'] = array('datatables', 'table', 'database','form_validation','session', 'email', 'user_agent', 'pagination', 'smarty');

/*
| -------------------------------------------------------------------
|  Auto-load Helper Files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['helper'] = array('url', 'file');
*/

$autoload['helper'] = array('form','url','table','date', 'text', 'security','lib', 'html', 'download', 'csv', 'datatables');

/*
| -------------------------------------------------------------------
|  Auto-load Plugins
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['plugin'] = array('captcha', 'js_calendar');
*/

$autoload['plugin'] = array();


/*
| -------------------------------------------------------------------
|  Auto-load Config files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['config'] = array('config1', 'config2');
|
| NOTE: This item is intended for use ONLY if you have created custom
| config files.  Otherwise, leave it blank.
|
*/

$autoload['config'] = array();


/*
| -------------------------------------------------------------------
|  Auto-load Language files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['language'] = array('lang1', 'lang2');
|
| NOTE: Do not include the "_lang" part of your file.  For example 
| "codeigniter_lang.php" would be referenced as array('codeigniter');
|
*/

$autoload['language'] = array('common', 'config', 'customers', 'employees', 'error', 'items', 'login', 'module', 'reports', 'sales','suppliers','receivings','giftcards', 'item_kits');



/*
| -------------------------------------------------------------------
|  Auto-load Models
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['model'] = array('model1', 'model2');
|
*/
$autoload['model'] = array('sale_m','person_m', 'module_m', 'appconfig_m', 'customer_m', 'supplier_m', 'item_m', 'item_tax_m', 'employee_m', 'inventory_m');

// $autoload['model'] = array('');



/* End of file autoload.php */
/* Location: ./system/application/config/autoload.php */