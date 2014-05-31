﻿/*global define,document */
/*jslint sloppy:true,nomen:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([
    "dojo/ready",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/on"
], function (
    ready,
    declare,
    lang,
    arcgisUtils,
    dom,
    domClass,
    on
) {
    return declare(null, {
        config: {},
        startup: function (config) {
            // config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information.
            if (config) {
                this.config = config;
                // document ready
                ready(lang.hitch(this, function () {
                    
                    //supply either the webmap id or, if available, the item info
                    var itemInfo = this.config.itemInfo || this.config.webmap;
                    this._createWebMap(itemInfo);
$(document).ready(function(){
                    /////////// Código para cargar el API HTML5 de youtube
                    // 2. This code loads the IFrame Player API code asynchronously.
                    var tag = document.createElement('script');

                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                    //Evento del boton reproducir
                    $('#play').click(function(){
                    if (player) {
                      player.playVideo();
                    }
                    });

                    //Evento del boton detener
                    $('#detener').click(function(){
                    player.stopVideo();
                    });
                    //Evento del boton pausar
                    $('#pausar').click(function(){
                    player.pauseVideo();
                    });
                    //Evento del boton GX.comenzar en...
                    $('#GX.comenzar').click(function(){
                    var sec=$("#segundos").val()
                    player.seekTo(sec);
                    GX.segundoComienzo=sec;
                    GX.comenzar=true;
                    });

                    ////////Evento del boton cargar GPX
                    $('#gpx').click(loadGPX);

                    $("img").click(function() { 
                    var origsrc = $(this).attr('src');
                    var src = '';
                    if (origsrc == 'images/play.png'){
                      src = 'images/pause.png';
                      player.playVideo();
                    }
                    if (origsrc == 'images/pause.png'){
                      src = 'images/play.png';
                      player.pauseVideo();
                    }
                    $(this).attr('src', src);

                    });
                    $("#credits").click(function(){
                    $("#credits-content").modal();;  
                    });
                    });

                }));
            } else {
                var error = new Error("Main:: Config is not defined");
                this.reportError(error);
            }
        },
        reportError: function (error) {
            // remove loading class from body
            domClass.remove(document.body, "app-loading");
            domClass.add(document.body, "app-error");
            // an error occurred - notify the user. In this example we pull the string from the
            // resource.js file located in the nls folder because we've set the application up
            // for localization. If you don't need to support multiple languages you can hardcode the
            // strings here and comment out the call in index.html to get the localization strings.
            // set message
            var node = dom.byId("loading_message");
            if (node) {
                if (this.config && this.config.i18n) {
                    node.innerHTML = this.config.i18n.map.error + ": " + error.message;
                } else {
                    node.innerHTML = "Unable to create map: " + error.message;
                }
            }
        },
        // Map is ready
        _mapLoaded: function () {
            // remove loading class from body
            domClass.remove(document.body, "app-loading");
            // your code here!
            
            
            $(document).on("GPXReady", function(){
              loadGPX();
            });

            
        },
        // create a map based on the input web map id
        _createWebMap: function (itemInfo) {
            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: {
                    // Optionally define additional map config here for example you can
                    // turn the slider off, display info windows, disable wraparound 180, slider position and more.
                },
                bingMapsKey: this.config.bingKey
            }).then(lang.hitch(this, function (response) {
                
                GX.videoId = this.config.description;

                (function onYouTubeIframeAPIReady() {
                  player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: GX.videoId,//'33za2TEE5K4',
                    events: {
                      'onReady': onPlayerReady
                    }
                  });
                })();
                // Once the map is created we get access to the response which provides important info
                // such as the map, operational layers, popup info and more. This object will also contain
                // any custom options you defined for the template. In this example that is the 'theme' property.
                // Here' we'll use it to update the application to match the specified color theme.
                
                console.log(this.config);
                this.map = response.map;
                GX.map = this.map;
                // make sure map is loaded
                if (this.map.loaded) {
                    // do something with the map
                    this._mapLoaded();
                } else {
                    on.once(this.map, "load", lang.hitch(this, function () {
                        // do something with the map
                        this._mapLoaded()

                        
                    }));
                }
            }), this.reportError);
        }
    });
});