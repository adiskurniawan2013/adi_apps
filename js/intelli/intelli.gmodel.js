/**
 * Auxiliary class for building grid 
 * @class This is the grid auxiliary class.  
 * @constructor 
 */
intelli.gsearch = function(store, list, type)
{
	var data = {};
	var open = false;
	$.each(list, function(index, value){
		var item = typeof(index) == 'number' ? value : index;

		if (type == 'reset')
		{
			open = true;
			data[item] = '';
			Ext.getCmp(value).reset();
		}
		else
		{
			data[item] = Ext.getCmp(value).getValue();
			if (data[item] != '' && data[item] != 'all') open = true;
		}
	});
	if (open)
	{
		$.each(data, function(item, value){
			store.baseParams[item] = value;
		});
		store.reload();
	}
};
intelli.checkboxSelectionModel = new Ext.grid.CheckboxSelectionModel();
intelli.gmodel = function(conf)
{
	this.cfg = conf;
	var url = conf.url + 'read.json';

	this.record = null;
	this.reader = null;
	this.proxy = null;

	this.checkColumn = intelli.checkboxSelectionModel;
	this.columnModel = null;

	this.dataStore = null;

	/** 
	 * Initialization proxy object
	 *
	 * @return {Object}
	 */
	this.setupProxy = function()
	{
		return new Ext.data.HttpProxy({url: url, method: 'GET'});
	};

	/**
	 * Initialization data store object
	 *
	 * @return {Object}
	 */
	this.setupDataStore = function()
	{
		var self = this;
		this.proxy = this.setupProxy();
		this.reader = this.setupReader();

		this.dataStore = new Ext.data.Store({
			remoteSort: true,
			proxy: this.proxy,
			reader: this.reader,
			listeners: { 
				load: function(data){
					if (data.lastOptions.params)
					{
						if (data.lastOptions.params.start > data.reader.jsonData.total)
						{
							var start = Math.max(data.reader.jsonData.total - data.lastOptions.params.limit, 0);
							params = data.lastOptions.params;
							params.start = start;
							self.dataStore.reload(params);
						}
					}
					
				} 
			}
		});

		return this.dataStore;
	};

	/**
	 * Initialization selection model 
	 *
	 * @return {Object}
	 */
	this.setupSelectionModel = function()
	{
		return intelli.checkboxSelectionModel;
	};
};