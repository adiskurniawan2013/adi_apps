/*
	This methods are taken from the file datatable.js and modified as indicated.  
	References are provided to the SourceForge bug reports or feature requests filed for them
	Unless indicated (enclosed in comments with my nickname) the method is just like the original one.
	Original comments have been stripped out
	
	Author (for the changes) Daniel Barreiro, satyam@satyam.com.ar  aka Devasatyam
	These correspond to YUI version 2.3.0, copyrighted and authored as per their documentation in the original distribution.

*/
/**
 * Enables TEXTAREA Editor.
 *
 * @method editTextarea
 */
YAHOO.widget.DataTable.editTextarea = function(oEditor, oSelf) {
   var elCell = oEditor.cell;
   var oRecord = oEditor.record;
   var oColumn = oEditor.column;
   var elContainer = oEditor.container;
   var value = oRecord.getData(oColumn.key);

    var elTextarea = elContainer.appendChild(document.createElement("textarea"));
    elTextarea.style.width = elCell.offsetWidth + "px"; 
    elTextarea.style.height = "3em"; 
    elTextarea.value = YAHOO.lang.isValue(value) ? value : "";
    
    YAHOO.util.Event.addListener(elTextarea, "keyup", function(){
// satyam
// This was added so that multiple editors could be active at the same time
// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
        oEditor.value = elTextarea.value;
        oSelf.fireEvent("editorUpdateEvent",{editor:oEditor});
// end satyam
    });
    
    elTextarea.focus();
    elTextarea.select();
};

YAHOO.widget.DataTable.editTextbox = function(oEditor, oSelf) {
   var elCell = oEditor.cell;
   var oRecord = oEditor.record;
   var oColumn = oEditor.column;
   var elContainer = oEditor.container;
   var value = YAHOO.lang.isValue(oRecord.getData(oColumn.key)) ? oRecord.getData(oColumn.key) : "";

    var elTextbox = elContainer.appendChild(document.createElement("input"));
    elTextbox.type = "text";
    elTextbox.style.width = elCell.offsetWidth + "px";
    elTextbox.value = value;

    YAHOO.util.Event.addListener(elTextbox, "keyup", function(){
// satyam
// This was added so that multiple editors could be active at the same time
// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
        oEditor.value = elTextbox.value;
        oSelf.fireEvent("editorUpdateEvent",{editor:oEditor});
// end satyam
    });

    elTextbox.focus();
    elTextbox.select();
};


// satyam:
/*
	This is completely different version.
	The original one, as provided, draws an actual dropdown box, regardless of whether the
	drowdown is editable or not.  I believe this to be quite confusing so in my version
	I browse through the values and display the text of the selected option.
	An down arrow showing this to be a select box can be provided via the style sheet.
	see: https://sourceforge.net/tracker/index.php?func=detail&aid=1763030&group_id=165715&atid=836476
*/
YAHOO.widget.DataTable.formatDropdown = function(elCell, oRecord, oColumn, oData) {
    YAHOO.util.Dom.addClass(elCell, YAHOO.widget.DataTable.CLASS_DROPDOWN);
    var selectedValue = (YAHOO.lang.isValue(oData)) ? oData : oRecord.getData(oColumn.key);
    var options = (YAHOO.lang.isArray(oColumn.dropdownOptions)) ?  oColumn.dropdownOptions : null;
	for (var i = 0;i< options.length;i++) {
		if (options[i].value == selectedValue) {
			elCell.innerHTML = options[i].text;
		}
	}
};

// satyam
/*
	most issues with this method are covered in the bug report:
	
https://sourceforge.net/tracker/index.php?func=detail&aid=1763030&group_id=165715&atid=836476

*/

YAHOO.widget.DataTable.editDropdown = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var value = oRecord.getData(oColumn.key);

    var elDropdown = elContainer.appendChild(document.createElement("select"));
	// satyam
	// The original formatDropdown, editDropdown and the documentation are not consistent. 
	// In one of them the dropdownOptions array is a property of the column
	// in the other it is under editorOptions
	// I placed it it just one place since the dropdownOptions are useful even if the field is not editable
    var dropdownOptions = (YAHOO.lang.isArray(oColumn.dropdownOptions)) ?  oColumn.dropdownOptions : [];
	// end satyam
    for(var j=0; j<dropdownOptions.length; j++) {
        var dropdownOption = dropdownOptions[j];
        var elOption = document.createElement("option");
        elOption.value = (YAHOO.lang.isValue(dropdownOption.value)) ?
                dropdownOption.value : dropdownOption;
        elOption.innerHTML = (YAHOO.lang.isValue(dropdownOption.text)) ?
                dropdownOption.text : dropdownOption;
        elOption = elDropdown.appendChild(elOption);
        if(value == elDropdown.options[j].value) {
            elDropdown.options[j].selected = true;
        }
    }
    
    YAHOO.util.Event.addListener(elDropdown, "change",
        function(){
// satyam
// This was added so that multiple editors could be active at the same time
// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
            oEditor.value = elDropdown[elDropdown.selectedIndex].value;
            oSelf.fireEvent("editorUpdateEvent",{editor:oEditor});
// end satyam
		}
	);
            
    oSelf._focusEl(elDropdown);
};


YAHOO.widget.DataTable.editDate = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var value = oRecord.getData(oColumn.key);

    if(YAHOO.widget.Calendar) {
        var selectedValue = (value.getMonth()+1)+"/"+value.getDate()+"/"+value.getFullYear();
        var calContainer = elContainer.appendChild(document.createElement("div"));
        calContainer.id = "yui-dt-" + oSelf._nIndex + "-col" + oColumn.getKeyIndex() + "-dateContainer";
        var calendar =
                new YAHOO.widget.Calendar("yui-dt-" + oSelf._nIndex + "-col" + oColumn.getKeyIndex() + "-date",
                calContainer.id,
                {selected:selectedValue, pagedate:value});
        calendar.render();
        calContainer.style.cssFloat = "none";

        calendar.selectEvent.subscribe(function(type, args, obj) {
// satyam
// This was added so that multiple editors could be active at the same time
// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
            oEditor.value = new Date(args[0][0][0], args[0][0][1]-1, args[0][0][2]);
			oSelf.fireEvent("editorUpdateEvent",{editor:oEditor// end satyam
});
        });
    }
    else {
        //TODO;
    }
};

// satyam
/*
I don't like the output of the original method.  It produces an actual active checkbox, which is
misleading to the user since the filed might not be editable and even if it is, clicking it
will bring up the actual editor, so having a real <input> field there makes no sense.
As an alternative, I switch the cell from one to other CSS style which can use 
whatever image, color or background.  

An example of such style might be:

	.yui-dt-checkedbox {
		background: transparent  url(checked.gif) no-repeat center center;
	}
	
	.yui-dt-uncheckedbox {
		background: transparent  url(unchecked.gif) no-repeat center center;
	}
see
https://sourceforge.net/tracker/index.php?func=detail&aid=1684181&group_id=165715&atid=836476

*/
YAHOO.widget.DataTable.formatCheckbox = function(el, oRecord, oColumn, oData) {
	if (oData) {
		YAHOO.util.Dom.removeClass(el,'yui-dt-uncheckedbox');
		YAHOO.util.Dom.addClass(el,'yui-dt-checkedbox');
	} else {
		YAHOO.util.Dom.removeClass(el,'yui-dt-checkedbox');
		YAHOO.util.Dom.addClass(el,'yui-dt-uncheckedbox');
	}
};


// satyam
/*
	While  you would usually associate a checkbox with a bit value, the YUI team invented a
	'multiple option field' which in the end is quite confusing, not because it might not be
	useful but you would expect that if you use in a column with the following attributes:
	formatter:'checkbox',editor:'checkbox'
	the formatter and the editor will behave in a compatible manner. 
	I have no problem with the original editCheckbox except for the name
	which should be something else and not mislead users to believe it
	has anything to do with a simple boolean field.
	
	So, this version of editCheckbox shows a single checkbox representing the value
	of a boolean field.

https://sourceforge.net/tracker/index.php?func=detail&aid=1761410&group_id=165715&atid=836476

*/
YAHOO.widget.DataTable.editCheckbox = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    elContainer.innerHTML = "<input type=\"checkbox\"" + 
		((oRecord.getData(oColumn.key)) ? " checked" : "" ) + " />";
	var elCheckbox = elContainer.firstChild;
	elContainer.style.width = elCell.offsetWidth + 'px';
	elContainer.style.textAlign = 'center';
    YAHOO.util.Event.addListener(elCheckbox, "click", function(){
// satyam
// This was added so that multiple editors could be active at the same time
// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
        oEditor.value = elCheckbox.checked;
		oSelf.fireEvent("editorUpdateEvent",{editor:oEditor});
// end satyam
	});
    elCheckbox.focus();
};
