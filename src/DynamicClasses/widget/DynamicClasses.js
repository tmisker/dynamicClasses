define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("DynamicClasses.widget.DynamicClasses", [ _WidgetBase ], {

        // Modeler variables
        nfReturningClass: null,
        mfReturningClass: null,
        nfBooleanTest: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _elementToApplyTo: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            this._getClasses (callback);
            this._updateRendering(callback);
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");

        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Get classes from microflow and/or nanoflow and apply them to the right element
        _getClasses: function (callback) {
          // Microflow part
          if (this.mfReturningClass && this._contextObj) {
            mx.ui.action(this.mfReturningClass, {
              params: {
                applyto: "selection",
                guids: [this._contextObj.getGuid()]
              },
              callback: lang.hitch(this, function (callback, returnedString) {
                console.log("Microflow result " + returnedString)
                this._addClasses(returnedString);
              }, callback),
              error: lang.hitch(this, function(error) {
                console.log("Microflow error")
                console.log(error)
              })
            });
          };
          // Nanoflow part
          if (this.nfReturningClass && this.mxcontext) {
            mx.data.callNanoflow({
              nanoflow: this.nfReturningClass,
              context: this.mxcontext,
              origin: this.mxform,
              callback: lang.hitch(this, function(callback, returnedString) {
                console.log("Nanoflow result " + returnedString);
                this._addClasses(returnedString);
              }, callback),
              error: lang.hitch(this, function(error) {
                console.log("Nanoflow error");
                console.log(error);
              })
            });
          };
          // Nanoflow test
          if (this.nfBooleanTest && this.mxcontext) {
            mx.data.callNanoflow({
              nanoflow: this.nfBooleanTest,
              context: this.mxcontext,
              origin: this.mxform,
              callback: lang.hitch(this, function(callback, returnedBoolean) {
                console.log("Nanoflow TEST result " + returnedBoolean);
                this._addClasses(returnedBoolean);
              }, callback),
              error: lang.hitch(this, function(error) {
                console.log("Nanoflow TEST error");
                console.log(error);
              })
            });
          };
        },

        _addClasses: function (classes) {
          // Determine the element to apply to
          this._elementToApplyTo = this.domNode.parentNode;

          //split on spaces
          //add the classes
          this._elementToApplyTo.classList.add(classes);
          console.log(this._elementToApplyTo.classList);
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DynamicClasses/widget/DynamicClasses"]);
