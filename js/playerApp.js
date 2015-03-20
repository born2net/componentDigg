/**
 Digg application for embedding node-web-kit inside the SignagePlayer
 @app app.js
 @license MIT
 **/
define(['Consts', 'bootstrap', 'backbone.controller', 'ComBroker', 'Lib', 'Elements', 'DiggPlayerView', 'LoadingView', 'StackView', 'DiggCollection', 'simplestorage'], function (Consts, bootstrap, backbonecontroller, ComBroker, Lib, Elements, DiggPlayerView, LoadingView, StackView, DiggCollection, simplestorage) {

    /*
     To setup remote node web kit debug be sure to config correct ip address in:

     A) NodeWebkitBridge client.connect(port, '192.168.81.135', function() ....
     B) In SignagePlayer Desktop PC c:\Program Files (x86)/SignagePlayer/config.xml
     C) In Intellij set Node-Web-Kit arguments of: 1234 8555

     */

    var App = Backbone.Controller.extend({

        initialize: function () {
            var self = this;
            BB.SCROLL_SPEED = 10;
            BB.globs['UNIQUE_COUNTER'] = 0;
            BB.Elements = Elements;
            BB.lib = new Lib();
            BB.lib.addBackboneViewOptions();
            BB.comBroker = new ComBroker();
            BB.comBroker.name = 'AppBroker';
            window.log = BB.lib.log;

            $.ajaxSetup({cache: false});
            $.ajaxSetup({headers: {'Authorization': ''}});

            self._listenPlayerError();
            self._listenPlayerDataEvent();
            self._listenDispose();
            self._initViews();
            self._waitPlayerData();

        },

        /**
         Listen to when player xml data is available
         @method _waitPlayerData
         **/
        _waitPlayerData: function () {
            var self = this;
            var fd = setInterval(function () {
                if (window.xmlData) {
                    var x2js = new X2JS();
                    var jData = x2js.xml_str2json(window.xmlData);

                    self._setStyle(jData.Data);
                    BB.SCROLL_SPEED = parseInt(jData.Data._speed);
                    window.clearInterval(fd);
                    setTimeout(function () {
                        self.m_diggCollection.getData();
                    }, 500)
                }
            }, 1000);
        },

        /**
         Set the background color and styling of component
         @method _setStyle
         @param {string} i_style
         **/
        _setStyle: function (i_style) {
            var self = this;
            $('.bgColor').css({'backgroundColor': i_style._bgColor})
        },

        /**
         Listen for errors on parsing player data
         @method _listenPlayerError
         **/
        _listenPlayerError: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.ON_XMLDATA_ERROR, function (e) {
                if (window.debug)
                    alert('err parsing xdata: ' + e.edata);
            });
        },

        /**
         Listen application / component removed from timeline
         @method _listenDispose
         **/
        _listenDispose: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.ON_DISPOSE, function (e) {
                BB.comBroker.stopListen(BB.EVENTS.ON_XMLDATA_ERROR);
                BB.comBroker.stopListen(BB.EVENTS.ON_PLAYER_EVENT);
                BB.comBroker.stopListen(BB.EVENTS.ON_DISPOSE);
            });
        },

        /**
         Listen when new player data event is fire from AS3 side of SignagePlayer
         @method _listenPlayerDataEvent
         **/
        _listenPlayerDataEvent: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.ON_PLAYER_EVENT, function (e) {
                // alert('data: ' + e.edata.name + ' ' + e.edata.param);
            });
        },

        /**
         Initialize the Backbone views of the application
         @method _initViews
         **/
        _initViews: function () {
            var self = this;

            self.m_stackView = new StackView.Fader({duration: 333});
            BB.comBroker.setService(BB.EVENTS.APP_STACK_VIEW, self.m_stackView);

            self.m_diggCollection = new DiggCollection();

            self.m_loadingView = new LoadingView({
                el: Elements.LOADING_CONTAINER,
                collection: self.m_diggCollection
            });

            self.m_DiggPlayerView = new DiggPlayerView({
                el: Elements.DIGG_CONTAINER,
                collection: self.m_diggCollection
            });

            self.m_stackView.addView(self.m_loadingView);
            self.m_stackView.addView(self.m_DiggPlayerView);
            self.m_stackView.selectView(self.m_loadingView);
            // self.m_diggCollection.getData();
        },

        /**
         Example of storing values locally for later retrieval (works only in Node-Web-Kit)
         @method _exampleSimpleStorage
         **/
        _exampleSimpleStorage: function () {
            var self = this;
            simplestorage.set('tst', 123);
            if (simplestorage.get('tst')) {
                console.log('storage supported');
            } else {
                console.log('storage not supported');
            }
        }
    });

    return new App();

});
