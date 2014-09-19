function ModuleModel(Id, Name, Description, GadgetUrl, Thumbnail, IsPublic) {
    var self = this;

    // observable are update elements upon changes, also update on element data changes [two way binding]
    self.Id = ko.observable(Id);
    self.Name = ko.observable(Name);
    self.Description = ko.observable(Description);
    self.GadgetUrl = ko.observable(GadgetUrl);
    self.Thumbnail = ko.observable(Thumbnail);
    self.IsPublic = ko.observable(IsPublic);
}

// use as register module views view model
function ModuleViewModel(Id, Name, Description, GadgetUrl, Thumbnail, IsPublic) {

    var self = this;

    // observable are update elements upon changes, also update on element data changes [two way binding]

    self.currentModule = new ModuleModel();

    self.Id = ko.observable(Id);
    self.Name = ko.observable(Name);
    self.Description = ko.observable(Description);
    self.GadgetUrl = ko.observable(GadgetUrl);
    self.Thumbnail = ko.observable(Thumbnail);
    self.IsPublic = ko.observable(IsPublic);

    // observable arrays are update binding elements upon array changes
    self.modules = ko.observableArray([]);

    self.addModule = function () {

        var dataObject = ko.toJSON(this.currentModule);

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var token = __RequestVerificationToken;

        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = token;
            return data;
        };

        var output = dataObject;
        // add request validation token - can be mixed in with other data
        $.extend(output, { token: token });

        $.ajax({
            type: "POST",
            url: '/api/ModuleModelsApi',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //traditional: true,
            data: dataObject,
            success: function (data) {
                self.modules.push(new ModuleModel(data.Id, data.Name, data.Description, data.GadgetUrl, data.Thumbnail, data.IsPublic));

                self.currentModule.Id(undefined);
                self.currentModule.Name(undefined);
                self.currentModule.Description(undefined);
                self.currentModule.GadgetUrl(undefined);
                self.currentModule.Thumbnail(undefined);
                self.currentModule.IsPublic(undefined);
            }
        })
    };

    // for partial table data update without reloading it
    // see http://jsfiddle.net/q9D36/

    self.saveModule = function () {
        var dataObject = {
            Id: self.currentModule.Id(),
            Name: self.currentModule.Name(),
            Description: self.currentModule.Description(),
            GadgetUrl: self.currentModule.GadgetUrl(),
            Thumbnail: self.currentModule.Thumbnail(),
            IsPublic: self.currentModule.IsPublic()
        }


        $.ajax({
            url: '/api/ModuleModelsApi/' + self.currentModule.Id(),
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(dataObject),
            success: function () {
                
                // update collection - table data
                // with out getting data from service
                var itm = self.modules().filter(function (item) {
                    return item.Id() === dataObject.Id;
                });
                itm[0].Name(dataObject.Name);
                itm[0].Description(dataObject.Description);
                itm[0].GadgetUrl(dataObject.GadgetUrl);
                itm[0].Thumbnail(dataObject.Thumbnail);
                itm[0].IsPublic(dataObject.IsPublic);

                self.currentModule.Id(undefined);
                self.currentModule.Name(undefined);
                self.currentModule.Description(undefined);
                self.currentModule.GadgetUrl(undefined);
                self.currentModule.Thumbnail(undefined);
                self.currentModule.IsPublic(undefined);

            }
        });

    };

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
                    self.modules.push(new ModuleViewModel(value.Id, value.Name, value.Description, value.GadgetUrl, value.Thumbnail, value.IsPublic));
                });
            }
        })

    };

    // edit module is bind to row click on list
    self.editModule = function (module) {

        self.currentModule.Id(module.Id());
        self.currentModule.Name(module.Name());
        self.currentModule.Description(module.Description());
        self.currentModule.GadgetUrl(module.GadgetUrl());
        self.currentModule.Thumbnail(module.Thumbnail());
        self.currentModule.IsPublic(module.IsPublic());
    }


    // remove module. current data context object is passed to function automatically.
    self.removeModule = function () {

        var id = self.currentModule.Id();

        $.ajax({
            url: '/api/ModuleModelsApi/' + id,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function () {

                // we need filter
                self.modules.remove(function (item) {
                    return item.Id() == id;
                });

                self.currentModule.Id(undefined);
                self.currentModule.Name(undefined);
                self.currentModule.Description(undefined);
                self.currentModule.GadgetUrl(undefined);
                self.currentModule.Thumbnail(undefined);
                self.currentModule.IsPublic(undefined);
            }
        });

    };

}

// For reference only use as module list view's view model
function ModuleList() {

    //var self = this;

    //// observable arrays are update binding elements upon array changes
    //self.modules = ko.observableArray([]);

    //self.getModules = function () {
    //    self.modules.removeAll();

    //    var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
    //    var token = __RequestVerificationToken;
    //    function addRequestVerificationToken(data) {
    //        data.__RequestVerificationToken = token;
    //        return data;
    //    };

    //    $.ajax({
    //        type: "GET",
    //        url: '/api/ModuleModelsApi',
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: "json",
    //        traditional: true,
    //        data: addRequestVerificationToken({
    //            // add some extra data to do proper logoff
    //            token: token
    //        }),
    //        success: function (data) {
    //            $.each(data, function (key, value) {
    //                self.modules.push(new Module(value.Id, value.Name, value.Description, value.GadgetUrl, value.Thumbnail, value.IsPublic));
    //            });
    //        }
    //    })

    //};

    //// edit module is bind to row click on list
    //self.editModule = function (module) {
        
    //    console.warn('edit module', self);
    //}


    //// remove module. current data context object is passed to function automatically.
    //self.removeModule = function (module) {

    //    $.ajax({
    //        url: '/api/ModuleModelsApi/' + module.Id(),
    //        type: 'DELETE',
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: "json",
    //        success: function () {
    //            self.modules.remove(module);
    //        }
    //    });

    //};

}


// create index view view model which contain two models for partial views
Gnx.KoViewModels = { modulesViewModel: new ModuleViewModel(), moduleModel: new ModuleModel() };

