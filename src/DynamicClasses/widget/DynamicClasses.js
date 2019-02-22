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
        nfReturningClass: "",
        mfReturningClass: "",

        // Internal variables.
        _handles: null,
        _handle: null,
        _contextObj: null,
        _elementToApplyTo: null,

        constructor: function () {
          this._handles = [];
        },

        postCreate: function () {
          //logger.debug(this.id + ".postCreate");
          this.domNode.style.display = "none";
          this.domNode.classList = this.domNode.parentNode.classList;
          this._elementToApplyTo = this.domNode.parentNode;
        },

        update: function (obj, callback) {
          //logger.debug(this.id + ".update");
          this._contextObj = obj;
          this._resetSubscriptions();
          this._updateRendering();
          this._executeCallback(callback, "update");
        },

        resize: function (box) {
          //logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
          //logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function () {
          //logger.debug(this.id + "._updateRendering");
          this._setClasses ();
        },

        // Get classes from microflow and/or nanoflow and apply them to the right element
        _setClasses: function (callback) {
          // Reset to original classes
          this._elementToApplyTo.classList = this.domNode.classList
          // Microflow part
          if (this.mfReturningClass && this._contextObj) {
            mx.ui.action(this.mfReturningClass, {
              params: {
                applyto: "selection",
                guids: [this._contextObj.getGuid()]
              },
              callback: lang.hitch(this, function (callback, returnedString) {
                //logger.debug("Microflow result " + returnedString)
                this._addClasses(returnedString);
              }, callback),
              error: lang.hitch(this, function(error) {
                logger.error("Error in microflow " + this.mfReturningClass);
                logger.error(error);
              })
            });
          };
          // Nanoflow part
          if (this.nfReturningClass.nanoflow && this._contextObj && this.mxcontext) {
            mx.data.callNanoflow({
              nanoflow: this.nfReturningClass,
              context: this.mxcontext,
              origin: this.mxform,
              callback: lang.hitch(this, function(callback, returnedString) {
                //logger.debug("Nanoflow result " + returnedString);
                this._addClasses(returnedString);
              }, callback),
              error: lang.hitch(this, function(error) {
                logger.error("Error in nanoflow");
                logger.error(error);
              })
            });
          };
        },

        _addClasses: function (_classes) {
          // Split classes on spaces and add to node
          _classes.split(" ").forEach(lang.hitch(this, function (_class) {
            this._elementToApplyTo.classList.add(_class);
          }));
        },

        // Reset subscriptions
        _resetSubscriptions: function () {
          //logger.debug(this.id + "._resetSubscriptions");
          if (this._handles) {
            this._handles.forEach(lang.hitch(this, function (handle) {
              this.unsubscribe(handle);
            }));
            this._handles = [];
          }
          if (this._contextObj) {
            this._handle = this.subscribe({
              guid: this._contextObj.getGuid(),
              callback: lang.hitch(this, function (guid) {
                this._updateRendering();
              })
            });
          }
          this._handles [this._handle];
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
          //logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
          if (cb && typeof cb === "function") {
            cb();
          }
        }
    });
});

require(["DynamicClasses/widget/DynamicClasses"]);
