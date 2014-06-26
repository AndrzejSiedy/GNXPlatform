/**
 * @class
 */
Ext.define('Workspace.Data.ModuleModel', {

    extend: 'Ext.data.Model',

    fields: [
        { name: 'Id', type: 'string', defaultValue: null },
    	{ name: 'Name', type: 'string', defaultValue: null },
		{ name: 'Desciption', type: 'string', defaultValue: null},
        { name: 'IsPublic', type: 'boolean', defaultValue: false},
        { name: 'OwnerId', type: 'string', defaultValue: false },
        { name: 'ImgUrl', type: 'string', defaultValue: false}
    ]

});
