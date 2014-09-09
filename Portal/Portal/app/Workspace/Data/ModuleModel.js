/**
 * @class
 */
Ext.define('Workspace.Data.ModuleModel', {

    extend: 'Ext.data.Model',

    fields: [
        { name: 'Id', type: 'string', defaultValue: null },
    	{ name: 'Name', type: 'string', defaultValue: null },
		{ name: 'Description', type: 'string', defaultValue: null},
        { name: 'IsPublic', type: 'boolean', defaultValue: false},
        { name: 'OwnerId', type: 'string', defaultValue: false },
        { name: 'Thumbnail', type: 'string', defaultValue: false}
    ]

});
