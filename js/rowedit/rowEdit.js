// Row editor for a YAHOO.widget.DataTable record.
// Author: Daniel Barreiro, satyam@satyam.com.ar  aka Devasatyam
// updated for version 2.3.0 of the YUI library,
//  see:  https://sourceforge.net/tracker/index.php?func=detail&aid=1717216&group_id=165715&atid=836479

/**
 * A reference to the form created by createEditForm.
 *
 * @property _rowEditForm
 * @type HTMLElement (form)
 * @private
 */
YAHOO.widget.DataTable.prototype._rowEditForm = undefined;

/**
 * A reference to the record being edited
 *
 * @property _rowEditRecord
 * @type YAHOO.widget.Record
 * @private
 */
YAHOO.widget.DataTable.prototype._rowEditRecord = undefined;


/**
 * Holds an array of oCellEditor objects indexed by column key (that's why it is an object, but I'm using it more like an associative array)
 *
 * @property _rowEditors
 * @type object
 * @private
 */
YAHOO.widget.DataTable.prototype._rowEditors = {};

/**
 * Temporarily holds the value of a control in between the field is changed and the click event fires.
 * It is a temporary fix until cellEditors are made re-entrant.
 * see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
 *
 * @property _rowEditorValue
 * @type object
 * @private
 */
YAHOO.widget.DataTable.prototype._rowEditorValue = undefined;


/**
 * Creates a form within the container given with all fields in the datatable that have a 'editor' property set for the column.  
 * If an url is not provided it will try to take the one from the DataSource, if available
 * The submit button for the form will be labeled Ok unless the third argument is provided.
 *
 * @method createEditForm
 * @param container {String || HTMLElement}  ID or HTML element which will contain the form
 * @param url {String} (optional) URL to submit the form to.
 * @param options {object} (optional)   submitButtonLabel (default: 'Ok'), submitButtonName (default:'submit'),formMethod (default:'POST') , submitButtonName (default:'submit')
 */
 
 
YAHOO.widget.DataTable.prototype.createEditForm = function(container,url,options) {
	var elCell,elLabel;
	
	// local copies of options
	if (options !== undefined) {
		var submitButtonLabel = options.submitButtonLabel;
		var formMethod = options.formMethod;
		var submitButtonName = options.submitButtonName;
	}

	if (this._rowEditForm) {
		// If the form already exists, don't do anything
		return;
	}

	var elformContainer = YAHOO.util.Dom.get(container);
	
	// create the form within the container
	var elForm = document.createElement('form');
	this._rowEditForm = elForm;
	elForm.setAttribute('method',formMethod || 'post');
	elForm.setAttribute('action',url || ((this.getDataSource().dataType == YAHOO.util.DataSource.TYPE_XHR)?this.getDataSource.liveData:''));
	elformContainer.appendChild(elForm);
	YAHOO.util.Dom.addClass(elForm,'yui-dt-edit-form');
	
	// read any row from the table, basically  to pick the individual cells
	var tr = this.getTrEl(0);
	
	for (var i = 0;i<this.getColumnSet().keys.length;i++) {
		var oColumn = this.getColumnSet().keys[i];
		if(!oColumn.editor) {
			// I f the column doesn't have an 'editor' property set, skip to the next
			continue;
		}
		
		elCell = tr.childNodes[i];
		
		// create the lable for the form
		elLabel = document.createElement('label');
		elLabel.setAttribute('for',oColumn.key);
		elLabel.innerHTML = oColumn.label || oColumn.key;
		elForm.appendChild(elLabel);
		
		// create the container for the standard in-line editor
	    var elContainer = document.createElement("div");
		elContainer.id = this.id + "-celleditor-" + i;
		elContainer.style.display = "none";
		elContainer.style.width = elCell.offsetWidth + 'px';
		YAHOO.util.Dom.addClass(elContainer, 'yui-dt-edit-container');
		elForm.appendChild(elContainer);

		// create something that looks like the cellEditor object that DataTable uses for its in-line editing.
		// DataTable has just one active at a time and stores it in this._cellEditor
		// but since we have several editors at once, we use an array of them
		this._rowEditors[oColumn.key] = {
			cell:elCell,
			container:elContainer
		};
		// This is a temporary fix until cellEditors are made re-entrant.
		// It is quite an obscure fix.  The clean one is to fix the editXXX methods.
		// The DataTablePatches.js file contains several patched methods
		// fill free to fix the rest and get rid of this lines
		// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
		YAHOO.util.Event.on(elContainer,'click',function(ev) {
			console.log('container click: ',ev.currentTarget.id);
			var i = ev.currentTarget.id.split('-');
			i = parseInt(i[i.length -1],10);
			var col = this.getColumn(i);
			this._rowEditors[col.key].value = this._rowEditorValue;
		},this,this);
		// end fix
	}
	
	//We are finished with the individual fields, go for the submit button.
	var buttonSubmit = document.createElement('input');
	buttonSubmit.setAttribute('type','submit');
	buttonSubmit.setAttribute('name',submitButtonName || 'submit');
	buttonSubmit.setAttribute('value', submitButtonLabel || 'Ok');
	elForm.appendChild(buttonSubmit);
	YAHOO.util.Dom.addClass(buttonSubmit,'yui-dt-edit-submit');

	YAHOO.util.Event.on(elForm,'submit',this._submitForm,this,true);
	
	// This is a temporary fix until cellEditors are made re-entrant.
	// see: https://sourceforge.net/tracker/?func=detail&atid=836479&aid=1767319&group_id=165715
	this.subscribe('editorUpdateEvent',function (ev) {
		console.log('editorUpdateEvent',ev.editor.value,ev);
		this._rowEditorValue = ev.editor.value;
	});
	// end fix
	
/**
     * Fired to give a chance to validate the whole form.  A return of false will cancel the update of the record and the submit.
     *
     * @event formValidateEvent
     * @param oArgs.form {HTML form element} The HTML form element
     * @param oArgs.oldData {Object} Original data in the record, with column keys as property names
     * @param oArgs.newData {Object} New data entered into the form, with column keys as property names
     * @param oArgs.oRecord {YAHOO.util.Record} original data as a Record object.
     */
	this.createEvent('formValidateEvent');
 /**
     * Fired after the record has been updated.  A return of false will cancel the submit but the record remains (actually, it doesn't make much sense, sorry.
     *
     * @event formSubmitEvent
     * @param oArgs.form {HTML form element} The HTML form element
     * @param oArgs.oldData {Object} Original data in the record, with column keys as property names
     * @param oArgs.newData {Object} New data entered into the form, with column keys as property names
     * @param oArgs.oRecord {YAHOO.util.Record} original data as a Record object.
     */
	this.createEvent('formSubmitEvent');
};

/**
 * Fills the form created with createEditForm with values from the given record.
   If the second argument is given, it will create hidden input elements taking the property names and values from the object
 *
 * @method showEditForm
 * @param oRecord {YAHOO.widget.Record}  DataTable record to be edited
 * @param extra {Object} (optional) Object containing name:value pairs to be inserted into the form as hidden input elements
 */
 
YAHOO.widget.DataTable.prototype.showEditForm = function(oRecord,extra) {
	var elForm = this._rowEditForm,i,elHidden;
	this._rowEditRecord = oRecord;
	
	// Delete previous hidden fields left over by previous row edit.
	for (i = 0; i < elForm.childNodes.length;i++) {
		var el = elForm.childNodes[i];
		if (el.nodeType === 1 && el.tagName.toUpperCase() === 'INPUT' && el.type === 'hidden') {
			elForm.removeChild(el);
		}
	}
			
	// If there are any extra fields, create them
	if (extra !== undefined) {
		for (i in extra) {
			if (YAHOO.env.ua.ie) {
				elHidden = document.createElement('<input type="hidden" name ="'  + i + '">');
			} else {
				elHidden = document.createElement('input');
				elHidden.setAttribute('type','hidden');
				elHidden.setAttribute('name',i);
			}
			elHidden.setAttribute('value',extra[i]);
			elForm.appendChild(elHidden);
		}
	}
			
	for (i = 0;i<this._oColumnSet.keys.length;i++) {
		var oColumn = this._oColumnSet.keys[i];

		if(!oColumn.editor) {
			// if it has no editor, skip over.
			continue;
		}

		// set the cellEditor object for the benefit of the standard cell editors provided with DataTable.
        var oCellEditor = this._rowEditors[oColumn.key];
		oCellEditor.record = oRecord;
		oCellEditor.column = oColumn;
		oCellEditor.validator = (
			oColumn.editorOptions &&
			YAHOO.lang.isFunction(oColumn.editorOptions.validator)) ? oColumn.editorOptions.validator : null
		;
		oCellEditor.value = oRecord.getData(oColumn.key);

		// Clear the container from any previous data and display it if hidden.
		var elContainer = oCellEditor.container;
		elContainer.innerHTML = '';
		elContainer.style.display = "";
		
		// Most of the following (and much of the previous)  is taken straight from showCellEditor
		// Render Editor markup
		var fnEditor;
		if(YAHOO.lang.isString(oColumn.editor)) {
			switch(oColumn.editor) {
				case "checkbox":
					fnEditor = YAHOO.widget.DataTable.editCheckbox;
					break;
				case "date":
					fnEditor = YAHOO.widget.DataTable.editDate;
					break;
				case "dropdown":
					fnEditor = YAHOO.widget.DataTable.editDropdown;
					break;
				case "radio":
					fnEditor = YAHOO.widget.DataTable.editRadio;
					break;
				case "textarea":
					fnEditor = YAHOO.widget.DataTable.editTextarea;
					break;
				case "textbox":
					fnEditor = YAHOO.widget.DataTable.editTextbox;
					break;
				default:
					fnEditor = null;
			}
		}
		else if(YAHOO.lang.isFunction(oColumn.editor)) {
			fnEditor = oColumn.editor;
		}

		if(fnEditor) {
			// Create DOM input elements
			fnEditor(oCellEditor, this);

			// Hook to customize the UI
            this.doBeforeShowCellEditor(oCellEditor);

            oCellEditor.isActive = true;
                
			//TODO: verify which args to pass
			this.fireEvent("editorShowEvent", {editor:oCellEditor});
		}
	}
};

/**
 * Function called when the user submits the form
 * It will read the values from the form, fire cellValidateEvent for each field,
 * fire formValidateEvent for the whole form and if no error is found so far (for all validate, true means it does validate Ok)
 * it will update the DataTable and fire the event formSubmitEvent.  
 * If that event returns true, it means it is ok to allow the regular form submit
 * 
 * @method _submitForm
 * @param ev {Event object}
 */


YAHOO.widget.DataTable.prototype._submitForm = function (ev) {
	var elForm = this._rowEditForm;
	var cols = this.getColumnSet().keys;
	var oRecord = this._rowEditRecord;
	var newValues = {};
	var oldValues = oRecord.getData();
	var elHidden;

	// calls each of the cell validators, if present.  This is basically taken from the saveCellEditor but placed in a loop for all fields
	var go = true;
	for (var i = 0;i < cols.length;i++) {
		var col = cols[i];
		if(!col.editor) {
			continue;
		}
		var oCellEditor = this._rowEditors[col.key];
		var newData = oCellEditor.value;
		var oldData = oRecord.getData(col.key);
		if ((col.edit || col.editor) && oCellEditor) {
	        if(oCellEditor.validator) {
	            oCellEditor.value = oCellEditor.validator.call(this, newData, oldData);
	            if(oCellEditor.value === null ) {
					this.fireEvent("editorRevertEvent",
						{editor:oCellEditor, oldData:oldData, newData:newData});
					go=false;
	            }
	        }
			newValues[col.key] =  oCellEditor.value;
		}
	}
	
	// since the cell editors are not actual <input> fields, and when they are, they have no name, 
	// submitting the form will do no good, the post will go completely empty
	// thus, we add a series of hidden fields which can be submitted instead.
	
	if (go) {
		for (i in newValues) {
			if (YAHOO.env.ua.ie) {
				elHidden = document.createElement('<input type="hidden" name ="'  + i + '">');
			} else {
				elHidden = document.createElement('input');
				elHidden.setAttribute('type','hidden');
				elHidden.setAttribute('name',i);
			}
			YAHOO.util.Dom.addClass(elHidden);
			elHidden.setAttribute('value',newValues[i]);
			elForm.appendChild(elHidden);
		}
		
		// a last chance to reject the edit
		go = this.fireEvent('formValidateEvent',{
			form: elForm,
			oldData: oldValues,
			newData: newValues,
			oRecord: oRecord
		});
	}
	
	if (go) {
		// here the table is updated
		this.updateRow(this.getRecordIndex(oRecord),newValues);
		
		// This event allows you to handle the form submit yourself.  If it returns false, it won't submit
		go = this.fireEvent('formSubmitEvent',{
			form: elForm,
			oldData: oldValues,
			newData: newValues,
			oRecord:oRecord
		});
	}
	if (go) {
		return true;
	}
	YAHOO.util.Event.stopEvent(ev);
	return false;
};

/**
* This function is provided as an option to submit the form via the XHR object.  
* It is mean to be used as the function to call on the formSubmitEvent.
* When doing so, it is necesary to povide the callback ofbject for the XHR reply:
* <code>dt.dataTable.subscribe('formSubmitEvent', dt.dataTable.postEditForm, asyncRequestCallback);</code>
 * 
 * @method postEditForm
 * @param ev {Event object}  (ignored)
 * @param callback {object} as per YAHOO.util.Connect.asyncRequest callback object
 */

			
YAHOO.widget.DataTable.prototype.postEditForm = function(ev,callback) {
	YAHOO.util.Connect.setForm(this._rowEditForm);   
	YAHOO.util.Connect.asyncRequest('POST', this._rowEditForm.action, callback);
	return false;
};
