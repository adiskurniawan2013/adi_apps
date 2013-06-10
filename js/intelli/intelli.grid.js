Ext.grid.ColumnModel.override({
	getTotalWidth: function(includeHidden) {
	  var off = 0;
	  if (!Ext.isDefined(Ext.isChrome20)){
		Ext.isChrome20 = /\bchrome\/20\b/.test(navigator.userAgent.toLowerCase());
	  };
	  if (Ext.isChrome20){
		  off = 2;
	  };
	if (!this.totalWidth) {
	  this.totalWidth = 0;
	  for (var i = 0, len = this.config.length; i < len; i++) {
		if (includeHidden || !this.isHidden(i)) {
		  this.totalWidth += this.getColumnWidth(i)+off;
		};
	  };
	};
	return this.totalWidth;
  }
});

intelli.grid = function(config)
{
	this.grid;
	this.dataStore;
	this.columnModel;
	this.selectionModel;
	this.topToolbar;
	this.bottomToolbar;

	this.plugins = config.plugins || '';

	this.start = config.start || 0;
	this.limit = config.limit || 15;

	this.title = config.title || '';
	this.renderTo = config.renderTo || '';
	this.frame = config.frame || config.frame !== false ? true : false;
	this.autoHeight = config.autoHeight || false;
	this.height = config.height || 485;

	this.gridConfig = config.grid;
	/** 
	 * Installing the grid object 
	 */
	this.setupGrid = function()
	{
		var cfg = {
			store: this.dataStore,
			fill:true,
			colModel: this.columnModel,
			selModel: this.selectionModel,
			autoWidth: true,
			autoHeight: this.autoHeight,
			height: this.height,
			title: this.title,
			renderTo: this.renderTo,
			frame: this.frame,
			loadMask: true,
			stateful: true,
			plugins: this.plugins,
			trackMouseOver: true,
			bbar: this.bottomToolbar,
			tbar: this.topToolbar
		};
		for (i in this.gridConfig)
		{
			cfg[i] = this.gridConfig[i];
		}

		this.grid = new Ext.grid.EditorGridPanel(cfg);
	};

	this.getGrid = function()
	{
		return this.grid;
	};

	/**
	 * Load data
	 *
	 */
	this.loadData = function()
	{
		var grid = this.getGrid();
		var name = 'startStore_' + grid.id;
		var state = Ext.state.Manager.getProvider();
		var stateStart = state.get(name, 0);

		var columns = state.get('columns_'+grid.id, []);
		var resizer = state.get('resize_'+grid.id, []);
		var hidden = state.get('hide_'+grid.id, []);
		var sort = state.get('sort_'+grid.id, '');
		var default_sort = '';
		if (grid.getColumnModel().config.length == columns.length)
		{
			jQuery.each(columns, function(index, column){
				jQuery.each(grid.colModel.config, function(i, val){
					if ((val.dataIndex != '' && val.dataIndex == column) || (val.id != '' && val.id == column))
					{
						if (column != 'expander')
						{
							var hide = hidden[index] == 1 && column != 'checker' && column != 'numberer' ? true : false;
							if (val.width != resizer[index] && resizer[index])
								grid.getColumnModel().setColumnWidth(i, resizer[index]);
							if (hide != grid.getColumnModel().isHidden(i)) 
								grid.getColumnModel().setHidden(i, hide);
							if (i != index)
								grid.getColumnModel().moveColumn(i, index);
						}
					}
					if (sort.field && sort.field == val.dataIndex && val.sortable)
						default_sort = sort;
				});
			});
			if (default_sort != '') grid.store.sort(default_sort.field, default_sort.direction);
		}
		else
		{
			state.set('columns_'+grid.id, '');
			state.set('hide_'+grid.id, '');
			state.set('resize_'+grid.id, '');
			state.set('sort_'+grid.id, '');
		}
		
		var bbar = grid.getBottomToolbar();

		if ('undefined' != typeof bbar)
		{
			var pageStore = 'pageSizeStore_' + grid.id;
			var pageRestore = state.get(pageStore, 0);

			if (pageRestore && Ext.getCmp('pgnPnl' + this.cfg.rand))
			{
				bbar.pageSize = pageRestore;
				Ext.getCmp('pgnPnl' + this.cfg.rand).setValue(pageRestore);

				state.clear(pageStore);
			}
		}

		var start = stateStart ? stateStart : this.start;
		var limit = pageRestore ? pageRestore : this.limit;

		state.clear(name);
		params = {};
		if (this.cfg.dataParams) params = this.cfg.dataParams; 
		params.start = start;
		params.limit = limit;

		this.dataStore.load({params:params});
	};

	this.saveGridState = function()
	{
		var grid = this.getGrid();
		var state = Ext.state.Manager.getProvider();
		var name = 'startStore_' + grid.id;
		var bbar = grid.getBottomToolbar();

		if ('undefined' != typeof bbar)
		{
			var pageStore = 'pageSizeStore_' + grid.id;

			state.set(pageStore, bbar.pageSize);
		}
		
		state.set(name, grid.store.lastOptions.params.start);
	}
};
intelli.exGModel = Ext.extend(intelli.gmodel,
{
	constructor: function(config)
	{
		intelli.exGModel.superclass.constructor.apply(this, arguments);
	},

	setupReader: function()
	{
		this.record = Ext.data.Record.create(this.cfg.record);

		this.reader = new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'id'
			}, this.record
		);

		return this.reader;
	},

	setupColumnModel: function()
	{
		var self = this;
		this.cfg.custom_btn = [];

		jQuery.each(self.cfg.columns, function(i, val)
		{
			if (val == 'checkcolumn')
			{
				self.cfg.columns[i] = self.checkColumn;
			}
			else if (val == 'numberer')
			{
				self.cfg.columns[i] = new Ext.grid.RowNumberer();
			}
			else if (val == 'status')
			{
				if (self.cfg.statusBar !== false)
					self.cfg.statusPos = i;
				else
					self.cfg.statusBar = i;

				self.cfg.columns[i] = {
					header: _t('status'), 
					dataIndex: 'status',
					width: 100,
					sortable: true,
					editor: new Ext.form.ComboBox({
						typeAhead: true,
						triggerAction: 'all',
						editable: false,
						lazyRender: true,
						store: self.cfg.statusesStore,
						displayField: 'display',
						valueField: 'value',
						mode: 'local'
					})
				};
			}
			else if (val == 'remove')
			{
				self.cfg.btn_remove = i;
				self.cfg.columns[i] = {
					header: '', 
					dataIndex: val,
					width: 40,
					hideable: false,
					menuDisabled: true,
					align: 'center'
				};
			}
			else if (val.custom)
			{
				if (val.custom == 'expander')
				{
					self.cfg.columns[i] = new Ext.grid.RowExpander(
					{
						tpl: new Ext.Template(val.tpl)
					});
					self.cfg.plugins.push(self.cfg.columns[i]);
				}
				else
				{
					val.menuDisabled = true;
					val.hideable = false;
					val.pos = i;

					if (!val.dataIndex) val.dataIndex = val.custom;
					if (!val.align) val.align = 'center';
					if (!val.width) val.width = 40;
					
					self.cfg.columns[i] = val;
					self.cfg.custom_btn.push(val);
				}
			}

			if (val.dataIndex)
			{
				if (self.cfg.sort == 'none') self.cfg.sort = val.dataIndex;
				if (self.cfg.expandColumn == 'none') self.cfg.expandColumn = i;
			}
		});

		this.columnModel = new Ext.grid.ColumnModel(self.cfg.columns);

		return this.columnModel;
	}
});

intelli.exGrid = Ext.extend(intelli.grid,
{
	config: [],
	constructor: function(config)
	{
		if (!config.rand) {
			config.rand = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
		}
		if (!config.pagingStore){
			config.pagingStore = new Ext.data.SimpleStore({
				fields: ['value', 'display'],
				data : [['10', '10'],['15', '15'],['20', '20'],['25', '25'],['30', '30'],['35', '35'],['40', '40'],['45', '45'],['50', '50']]
			});
		}else{
			jQuery.each(config.pagingStore,function(i,val){
				config.pagingStore[i] = [val,val];
			});
			
			config.pagingStore = new Ext.data.SimpleStore({
				fields: ['value', 'display'],
				data : config.pagingStore
			});	
		}
		
		config.statusesStoreWithAll = new Ext.data.SimpleStore({
			fields: ['value', 'display'],
			data : [['all', _t('_select_')],['active', 'active'],['inactive', 'inactive']]
		});

		if (!config.statusesStore){
			config.statusesStore = new Ext.data.SimpleStore({
				fields: ['value', 'display'],
				data : [['active', 'active'],['inactive', 'inactive']]
			});
		}else{
			config.statusesStoreWithAll = [];
			config.statusesStoreWithAll[0] = ['all', _t('_select_')];
			jQuery.each(config.statusesStore,function(i,val){
				config.statusesStore[i] = Ext.isArray(val) ? val : [val,val];
				config.statusesStoreWithAll[i+1] = [val,val];
			});
			
			config.statusesStore = new Ext.data.SimpleStore(
			{
				fields: ['value', 'display'],
				data : config.statusesStore
			});
			config.statusesStoreWithAll = new Ext.data.SimpleStore(
			{
				fields: ['value', 'display'],
				data : config.statusesStoreWithAll
			});
		}

		var default_texts = {
			confirm_one: _t('are_you_sure_to_delete_this_item'),
			confirm_many: _t('are_you_sure_to_delete_selected_items'),
			remove: _t('remove'),
			not_remove: _t('not_remove'),
			add_reason_title: _t('add_reason_title'),
			add_reason_text: _t('add_reason_text')
		};

		if (!config.texts)
		{
			config.texts = default_texts;
		}
		else
		{
			// TODO: add jQuery.extend
			for (i in default_texts)
			{
			   if (i)
			   {
				   	if (!config.texts[i])
					{
						config.texts[i] = default_texts[i];
					}
			   }
			}
		}
		if (!config.record){
			config.record = [];
			Ext.Msg.alert('Alert', _t('record_need'));
		}
		if (!config.grid){
			config.grid = [];
		}
		if (!config.columns){
			config.columns = [];
			Ext.Msg.alert('Alert', _t('columns_need'));
		}
		if (!config.expandColumn){
			config.expandColumn = 'none';
		}
		if (config.first_index){
			config.expandColumn = config.first_index;
		}
        if (!config.sort){
            config.sort = 'none';
        }
        if (!config.sortDir){
            config.sortDir = 'ASC';
        }
        if (config.first){
			config.sort = config.first;
		}
		if (!config.paging && config.paging !== false){
			config.paging = true;
		}
		if (!config.sliding && config.sliding !== false){
			config.sliding = false;
		}
		if (!config.send_key){
			config.send_key = [['ids[]', 'id']];
		}
		if (config.baseParams){
			config.params = config.baseParams;
		}
		if (!config.params){
			config.params = {};
		}
		if (!config.event && config.event !== false){
			config.event = false;
		}
		if (!config.customBtns && config.customBtns !== false){
			config.customBtns = false;
		}
		if (!config.removeBtn && config.paging !== false){
			config.removeBtn = false;
		}
		
		if (!config.renderTo){
            config.renderTo = 'box_' + config.rand;
            Ext.DomHelper.insertAfter(Ext.get('sandbox'), {tag: 'div', id: config.renderTo});
		}
		if (!config.title){
			config.title = false;
		}
		if (!config.tbar){
			config.tbar = false;
		}
		if (!config.plugins){
			config.plugins = [];
		}
		if (!config.action){
			config.action = 'get';
		}
		if (!config.progressBar && config.progressBar !== false) {
			config.progressBar = true;
		}
		if (!config.resizer && config.resizer !== false) {
			config.resizer = true;
		}
		var self = this;

		this.cfg = config;
		intelli.exGrid.superclass.constructor.apply(this, arguments);

        //this.baseParams = config.baseParams;
		this.model = new intelli.exGModel(config);
		this.dataStore = this.model.setupDataStore();
		this.columnModel = this.model.setupColumnModel();
		this.selectionModel = this.model.setupSelectionModel();
		this.cfg = this.model.cfg;

		this.dataStore.setDefaultSort(this.cfg.sort, this.cfg.sortDir);
		Ext.EventManager.onWindowResize(function(width){self.grid.setWidth(width - 250);});
	},

	init: function()
	{
		this.plugins = this.cfg.plugins;
		if (this.cfg.resizer)
		this.plugins.push( new Ext.ux.PanelResizer({minHeight: 250}) );

		this.title = this.cfg.title;
		this.renderTo = this.cfg.renderTo;

		this.setupBaseParams(this.cfg.action);
		this.setupPagingPanel();
		this.setupGrid();

		this.setRenderers();
		this.setEvents();

		if (this.cfg.expandColumn != 0) this.grid.autoExpandColumn = this.cfg.expandColumn;

		this.loadData();
	},

	setupPagingPanel: function()
	{
		var that = this;
		var bbar = [];
		if (this.cfg.paging)
		{
			bbar.push([
				_t('items_per_page') + ':',
				{
					xtype: 'bettercombo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					width: 80,
					store: this.cfg.pagingStore,
					value: '15',
					displayField: 'display',
					valueField: 'value',
					mode: 'local',
					id: 'pgnPnl' + this.cfg.rand
				},'-'
			]);
		}
		
		if (this.cfg.statusPos){
			bbar.push([
				_t('status') + ':',
				{
					xtype: 'combo',
					typeAhead: true,
					triggerAction: 'all',
					editable: false,
					lazyRender: true,
					store: that.cfg.statusesStore,
					value: that.cfg.statusesStore.data.items[0].json[1],
					displayField: 'display',
					valueField: 'value',
					mode: 'local',
					disabled: true,
					id: 'statusCmb' + this.cfg.rand
				},{
					text: _t('do'),
					id: 'goBtn' + this.cfg.rand,
					iconCls: 'go-grid-ico',
					disabled: true,
					handler: function(){
						var rows = that.grid.getSelectionModel().getSelections();
						var ids = [];

						for (var i = 0; i < rows.length; i++) {
							ids[i] = rows[i].json.id;
						}
						var req_status = {
							url: that.cfg.url + 'edit.json',
							method: 'POST',
							params: {
								action: 'update',
								'ids[]': ids,
								field: 'status',
								value: Ext.getCmp('statusCmb' + that.cfg.rand).getValue()
							},
							failure: function(){
								Ext.MessageBox.alert(_t('error_saving_changes'));
							},
							success: function(data){
								var response = Ext.decode(data.responseText);
								var type = (response.type ? response.type : (response.error ? 'error' : 'success'));
								
								intelli.admin.notifBox({
									msg: response.msg,
									type: type,
									autohide: true
								});
								that.grid.getStore().reload();
							}
						};
						if (that.cfg.reason && req_status.params.value != 'active')
						{
							Ext.MessageBox.show({				
								title: that.cfg.texts.add_reason_title,
								msg: that.cfg.texts.add_reason_text,
								width: 300,
								buttons: Ext.MessageBox.OKCANCEL,
								multiline: true,
								fn: function(type, val)
								{
									if (type == 'ok')
									{
										req_status.params.reason = val;
									}
									Ext.Ajax.request(req_status);
								}
							});
						}
						else
						{
							Ext.Ajax.request(req_status);
						}
					}
				},'-'
			]);
		}
		if (this.cfg.removeBtn)
		{
			bbar.push({
				text: _t('remove'),
				id: 'removeBtn' + this.cfg.rand,
				iconCls: 'remove-grid-ico',
				disabled: true
			});
		}
		if (this.cfg.bbar) {
			bbar.push(this.cfg.bbar);
		}

		if (this.cfg.paging) {
			var plugins = [];
			if (this.cfg.progressBar) {
				plugins.push(new Ext.ux.ProgressBarPager());
			}
			if (this.cfg.sliding) {
				plugins.push(new Ext.ux.SlidingPager());
			}
			this.bottomToolbar = new Ext.PagingToolbar({
				store: this.dataStore,
				pageSize: this.limit,
				displayInfo: true,
				plugins: plugins,
				items: bbar
			});
		}
		else if (bbar.length > 0)
		{
			this.bottomToolbar = bbar;
		}
		
		if (this.cfg.tbar) this.topToolbar = this.cfg.tbar;
	},

	setupBaseParams: function(action)
	{
        this.cfg.params.action = action;
		this.dataStore.baseParams = this.cfg.params;
	},

	setRenderers: function()
	{
		var that = this;
		
		if (that.cfg.statusPos || that.cfg.statusBar)
        {
			var temp = !that.cfg.statusPos ? that.cfg.statusBar : that.cfg.statusPos;
			this.columnModel.setRenderer(temp, function(value, metadata){
				metadata.css = value;
				return value;
			});
		}
		/* add edit link */
		jQuery.each(this.cfg.custom_btn,function(i, val)
        {
			that.columnModel.setRenderer(val.pos, function(value, metadata){
				if (val.index && (!value || value === false || value == 'false' || value == '0')) {
					return '';
				}
                var btn = that.cfg.custom_btn[i];
				/* custom fields */
				if (val.custom == 'config')
				{
					var tmp = value.split('|');
					value = tmp[0];
					btn.anchor = tmp[1];
				}

				href = !btn.href ? '' : '<a href="' + btn.href.replace('{value}', value) + '">';
				val.redirect = !btn.redirect ? '' : btn.redirect.replace('{value}', value);
				val.title = !btn.title ? '' : btn.title.replace('{value}', value);
				val.icon = !btn.icon ? '' : btn.icon.replace('{value}', value);

				return href + '<img '
                        +(val.iconSize ? 'width="'+val.iconSize+'" height="'+val.iconSize+'" ' : '')
                        +'class="grid_action" alt="' + val.title + '" title="' + val.title
                        + '" src="' + intelli.config.baseurl + 'admin/templates/' + intelli.config.admin_tmpl + '/img/icons/'+val.icon+'" />'
                        + (href != '' ? '</a>' : '');
			});
		});

		/* add remove link */
		if (this.cfg.btn_remove) {
			this.columnModel.setRenderer(this.cfg.btn_remove, function(value, metadata){
				return '<img '+(value != 1 ? ' title="' + that.cfg.texts.not_remove + '"' : 'class="grid_action" title="' + that.cfg.texts.remove + '"')+' alt="' + that.cfg.texts.remove + '" src="' + intelli.config.baseurl + 'admin/templates/' + intelli.config.admin_tmpl + '/img/icons/remove-grid-ico'+ ( value != 1 ? '-grey' : '')+'.png" />';
			});
		}
		
	},

	setEvents: function()
	{
		var that = this;
		var grid = this.getGrid();
		var state = Ext.state.Manager.getProvider();
		var stateChange = function(){
			var columns = [];
			var resizer = [];
			var hidding = [];
			$.each(grid.colModel.config, function(index, val){
				var name = val.dataIndex != '' ?  val.dataIndex : val.id;
				columns.push(name);
				resizer.push(val.width);
				hidding.push(val.hidden?1:0);
			});

			var old_columns = state.get('columns_'+grid.id, []);
			var old_resizer = state.get('resize_'+grid.id, []);
			var old_hidden = state.get('hide_'+grid.id, []);
			var old_sort = state.get('sort_'+grid.id, '');
			
			if (old_columns != columns) state.set('columns_'+grid.id, columns);
			if (old_resizer != columns) state.set('resize_'+grid.id, resizer);
			if (old_hidden != columns) state.set('hide_'+grid.id, hidding);
			if (old_sort != columns) state.set('sort_'+grid.id, grid.store.sortInfo);
		};
		/* 
		 * Events
		 */
		
		/* Edit fields */
//		this.grid.getColumnModel().addEvents('hiddenchange');
		this.grid.on('columnmove', stateChange);
		this.grid.on('columnresize', stateChange);
		this.grid.on('sortchange', stateChange);
		this.grid.getColumnModel().on('hiddenchange', stateChange);
		this.grid.on('afteredit', function(editEvent)
		{
			var params = {
				action: 'update',
				field: editEvent.field,
				value: editEvent.value
			};
			var json = editEvent.record.json;
			jQuery.each(that.cfg.send_key, function(){
				var item = this;
				if (!Ext.isArray(item)) item = [item, item];
				
				params[item[0]] = json[item[1]];
			});
			var req_status = {
				url: that.cfg.url + 'edit.json',
				method: 'POST',
				params:params,
				failure: function()
				{
					Ext.MessageBox.alert(_t('error_saving_changes'));
				},
				success: function(data)
				{
					editEvent.grid.getStore().reload();

					var response = Ext.decode(data.responseText);
					var type = (response.type ? response.type : (response.error ? 'error' : 'success'));
						
					intelli.admin.notifBox({msg: response.msg, type: type, autohide: true});
				}
			};
			if (editEvent.field == 'status')
			{
				if (that.cfg.reason && editEvent.value != 'active')
				{
					Ext.MessageBox.show({
						title: that.cfg.texts.add_reason_title,
						msg: that.cfg.texts.add_reason_text,
						width: 300,
						buttons: Ext.MessageBox.OKCANCEL,
						multiline: true,
						fn: function(type, val)
						{
							if (type == 'ok')
							{
								req_status.params.reason = val;
							}
							Ext.Ajax.request(req_status);
						}
					});
				}
				else
				{
					Ext.Ajax.request(req_status);
				}
			}
			else
			{
				Ext.Ajax.request(req_status);
			}
		});
		var removeRequest = function(params, count_ajax)
		{
			if (!that.cfg.count_ajax) that.cfg.count_ajax = 1;
			var req = {
				url: that.cfg.url + (params.action ? 'delete.json' : 'read.json'),
				method: 'POST',
				params: params,
				failure: function()
				{
					Ext.MessageBox.alert(_t('error_saving_changes'));
				},
				success: function(data)
				{
					that.cfg.count_ajax--;
					var response = Ext.decode(data.responseText);
					var type = (response.type ? response.type : (response.error ? 'error' : 'success'));
					
					intelli.admin.notifBox({
						msg: response.msg,
						type: type,
						autohide: true
					});
	
					if (that.cfg.count_ajax <= 0)
					{
						if (that.cfg.customBtns) {
							$.each(that.cfg.customBtns, function()
							{
								Ext.getCmp(this).disable();
							});
						}
						if (that.cfg.statusPos)
						{
							Ext.getCmp('statusCmb' + that.cfg.rand).disable();
							Ext.getCmp('goBtn' + that.cfg.rand).disable();
						}
						if (that.cfg.removeBtn) 
							Ext.getCmp('removeBtn' + that.cfg.rand).disable();

						that.grid.getStore().reload();
					}
				}
			};
			Ext.Ajax.request(req);
		};

		// cell click
		this.grid.on('cellclick', function(grid, rowIndex, columnIndex)
		{
			var record = grid.getStore().getAt(rowIndex);
			var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
			var data = record.get(fieldName);

			if (that.cfg.events)
			{
				that.saveGridState();
				that.cfg.event(data, record, that);
			}

			$.each(that.cfg.custom_btn,function(i, val)
			{
				if (val.custom == fieldName)
				{
					if (val.index && !record.json[val.custom])
					{
					}
					else
					{
						that.saveGridState();

						if (val.click)
							val.click(val, data, record, that);
						else if (val.redirect)
							window.location = val.redirect + (record.json.id ? record.json.id : '') + (val.anchor ? '#' + val.anchor : '');
					}
				}
			});
			
			if ('remove' == fieldName)
			{
				if (record.json.remove == '1')
				{
					var params = {action:'remove'};
					var j=0;
					
					jQuery.each(that.cfg.send_key, function()
					{
						var item = this;
						if (!Ext.isArray(item)) item = [item, item];
						params[item[0]] = record.json[item[1]];
						j++;
					});

					Ext.Msg.show(
					{
						title: _t('confirm'),
						msg: (j>1?that.cfg.texts.confirm_many:that.cfg.texts.confirm_one),
						buttons: Ext.Msg.YESNO,
						icon: Ext.Msg.QUESTION,
						fn: function(btn)
						{
							if ('yes' == btn)
							{
								if (that.cfg.rowdelete) 
								{
									params = that.cfg.rowdelete(params);
								}
								removeRequest(params, 1);
							}
						}
					});
				}
			}
		});

		// enable disable functionality buttons
		this.grid.getSelectionModel().on('rowselect', function()
		{
			if (that.cfg.customBtns)
			{
				$.each(that.cfg.customBtns, function()
				{
					Ext.getCmp(this).enable();
				});
			}

			if (that.cfg.statusPos)
			{
				Ext.getCmp('statusCmb' + that.cfg.rand).enable();
				Ext.getCmp('goBtn' + that.cfg.rand).enable();
			}

			if (that.cfg.removeBtn) 
			{
				var flag = false;
				var rows = that.grid.getSelectionModel().getSelections();
				for (var i = 0; i < rows.length; i++)
				{
					if (rows[i].json.remove == 1)
					{
						flag = true;
						break;
					}
				}

				if (flag)
					Ext.getCmp('removeBtn' + that.cfg.rand).enable();
				else
					Ext.getCmp('removeBtn' + that.cfg.rand).disable();
			}

			if (that.cfg.rowselect) 
			{
				that.cfg.rowselect(that);
			}
		});

		this.grid.getSelectionModel().on('rowdeselect', function(sm)
		{
			if (0 == sm.getCount())
			{
				if (that.cfg.customBtns)
				{
					$.each(that.cfg.customBtns, function()
					{
						Ext.getCmp(this).disable();
					});
				}
				if (that.cfg.statusPos)
				{
					Ext.getCmp('statusCmb' + that.cfg.rand).disable();
					Ext.getCmp('goBtn' + that.cfg.rand).disable();
				}

				if (that.cfg.removeBtn) Ext.getCmp('removeBtn' + that.cfg.rand).disable();
			}

			if (that.cfg.removeBtn) 
			{
				var rows = that.grid.getSelectionModel().getSelections();
				Ext.getCmp('removeBtn' + that.cfg.rand).disable();
				for (var i = 0; i < rows.length; i++)
				{
					if (rows[i].json.remove == 1)
					{
						Ext.getCmp('removeBtn' + that.cfg.rand).enable();

						break;
					}
				}
			}

			if (that.cfg.rowdeselect) 
			{
				that.cfg.rowdeselect(that);
			}
		});

		// remove button action
		if (this.cfg.removeBtn)
		{
			Ext.getCmp('removeBtn' + this.cfg.rand).on('click', function()
			{
				var rows = that.grid.getSelectionModel().getSelections();
				var start_params = {action:'remove'};
				var params = start_params;
				var j = 0;

				for (var i = 0; i < rows.length; i++)
				{
					if (!rows[i].json.remove && rows[i].json.remove != 0 || rows[i].json.remove == 1)
					{
						jQuery.each(that.cfg.send_key, function()
						{
							var item = this;
							if (!Ext.isArray(item)) item = [item, item];
							if (!params[item[0]]) params[item[0]] = [];
							params[item[0]].push(rows[i].json[item[1]]);
							j++;
						});
					}
				}

				Ext.Msg.show(
				{
					title: _t('confirm'),
					msg: (j>1?that.cfg.texts.confirm_many:that.cfg.texts.confirm_one),
					buttons: Ext.Msg.YESNO,
					icon: Ext.Msg.QUESTION,
					fn: function(btn)
					{
						if ('yes' == btn)
						{
							if (that.cfg.multi_ajax)
							{
								if (that.cfg.rowdelete) 
								{
									start_params = that.cfg.rowdelete(start_params);
								}

								var key = that.cfg.send_key[0][0];

								$.each(params[key], function(index)
								{
									var data = start_params;

									jQuery.each(that.cfg.send_key, function()
									{
										var item = this;
										if (!Ext.isArray(item)) item = [item, item];
										data[item[0]] = [ params[item[0]][index] ];
									});

									removeRequest(data, params[key].length);
								});
							}
							else
							{
								if (that.cfg.rowdelete) 
								{
									params = that.cfg.rowdelete(params);
								}
								removeRequest(params, 1);
							}
						}
					}
				});

			});
		}

		// Paging panel event
		if (this.cfg.paging)
		{
			Ext.getCmp('pgnPnl' + this.cfg.rand).on('change', function(field, new_value, old_value)
			{
				that.grid.getStore().lastOptions.params.limit = new_value;
				that.bottomToolbar.pageSize = parseInt(new_value);

				that.grid.getStore().reload();
			});
		}
	}
});