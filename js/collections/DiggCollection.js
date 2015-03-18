/**
 Digg data collection
 @class DiggCollection
 @constructor
 @return {Object} instantiated DiggCollection
 **/
define(['jquery', 'backbone', 'DiggModel'], function ($, Backbone, DiggModel) {

    var DiggCollection = Backbone.Collection.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
            var self = this;
        },

        /**
         Fetch the collection data from server
         @method getData
         **/
        getData: function () {
            var self = this;
            self.fetch({
                data: {},
                success: function (models) {
                },
                error: function () {
                    log('error fetch collection');
                }
            });
        },
        model: DiggModel,
        url: 'https://secure.digitalsignage.com/Digg'

    });

    return DiggCollection;

});