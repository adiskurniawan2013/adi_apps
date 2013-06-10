Row editor for YAHOO.widget.DataTable

This is a working sample of a row editor for YUI's DataTable.  
This package is meant to be unzipped on a single web-accessible directory.  It contains the following files:

rowEdit.js - The source of the new methods added to the DataTable object which add the row edit functionality
index.html - A sample program to show and test the rowEdit
DataTablePatches.js - A series of changed methods from DataTable. Each is commented and has links to the SourceForge bug report or feature request.
readme.txt -  this file
*.gif, *.png - a few image files for styling.

The YUI files are pulled from YAHOO's public servers.

It works in Firefox as is, but in IE you should strip out the calls to console.log from the index.html and rowEdit.js files.

Just open the index.html file and the datatable will show up, with the values as hardcoded in a JS array within the file.

First click in the "Create Form" button and then on any of the buttons on the left of each form.
This is meant so that you can trace each of the two functions involved separately, it is not meant to be used in this way.
Once the changes to the form are made, click on Ok at the end and in the FireBug console of FireFox you will see
the async post made.  To see the submitted data, open the line with the url and check the 'post' tab.

See:

https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1717216&group_id=165715


Satyam

(satyam@satyam.com.ar)
