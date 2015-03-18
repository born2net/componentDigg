/**
 Digg data model
 @class DiggModel
 @constructor
 @return {Object} instantiated DiggModel
 **/
define(['jquery', 'backbone'], function ($, Backbone) {

    var DiggModel = Backbone.Model.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
            var self = this;
        }
    });

    return DiggModel;

});