﻿var moduleRegisterViewModel;

// use as register module views view model
function Module(Id, Name, Description, GadgetUrl, Thumbnail, IsPublic) {

    var self = this;

    // observable are update elements upon changes, also update on element data changes [two way binding]
    self.Id = ko.observable(Id);
    self.Name = ko.observable(Name);
    self.Description = ko.observable(Description);
    self.GadgetUrl = ko.observable(GadgetUrl);
    self.Thumbnail = ko.observable(Thumbnail);
    self.IsPublic = ko.observable(IsPublic);

    self.addModule = function () {

        var dataObject = ko.toJSON(this);

        

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var token = __RequestVerificationToken;

        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = token;
            return data;
        };


        var output = dataObject;
        // add request validation token - can be mixed in with other data
        $.extend(output, { token: token });

        console.warn('dataObject', output);
        $.ajax({
            type: "POST",
            url: '/api/ModuleModelsApi',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //traditional: true,
            data: dataObject,
            success: function (data) {
                moduleRegisterViewModel.moduleListViewModel.modules.push(new Module(data.Id, data.Name, data.Description, data.GadgetUrl, data.Thumbnail, data.IsPublic));
                self.Id('');
                self.Name('');
                self.Description('');
                self.GadgetUrl('');
                self.Thumbnail('');
                self.IsPublic(false);
            }
        })
    };
}

// use as module list view's view model
function ModuleList() {

    var self = this;

    // observable arrays are update binding elements upon array changes
    self.modules = ko.observableArray([]);

    self.getModules = function () {
        self.modules.removeAll();

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var token = __RequestVerificationToken;
        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = token;
            return data;
        };

        $.ajax({
            type: "GET",
            url: '/api/ModuleModelsApi',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            traditional: true,
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token
            }),
            success: function (data) {
                $.each(data, function (key, value) {
                    self.modules.push(new Module(value.Id, value.Name, value.Description, value.GadgetUrl, value.Thumbnail, value.IsPublic));
                });
            }
        })

    };


    // remove module. current data context object is passed to function automatically.
    self.removeModule = function (module) {

        console.warn('remove module', module, module.Id());

        $.ajax({
            url: '/api/ModuleModelsApi/' + module.Id(),
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function () {
                self.modules.remove(module);
            }
        });
    };
}


// create index view view model which contain two models for partial views
moduleRegisterViewModel = { addModuleViewModel: new Module(), moduleListViewModel: new ModuleList() };
