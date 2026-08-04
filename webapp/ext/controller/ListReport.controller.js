sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	'sap/m/BusyIndicator',
	'sap/m/VBox',
	'sap/m/Text',
	'../util/Helper'
], function (ControllerExtension, MessageToast, MessageBox, Dialog, BusyIndicator, VBox, Text, Helper) {
	'use strict';

	return ControllerExtension.extend('zmmphyinvcountlist.ext.controller.ListReport', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf zmmphyinvcountlist.ext.controller.ListReport
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			}
		},
		onDisplayCountSheet: function(oContext, aSelectedContexts) {
            var oResourceBundle = this.base.getView().getModel("i18n").getResourceBundle();
            const oExtensionAPI = this.base.getExtensionAPI();
            var oDataV4 = oExtensionAPI.getModel();
			if (!this._busyDialog) {
                this._busyDialog = new Dialog({
                    title: oResourceBundle.getText("generatingfile"),
                    type: "Message",
                    content: new VBox({
                        items: [
                            new Text({ text: oResourceBundle.getText("pleasewait") }),
							new BusyIndicator({ size: "1.0rem" })
                            // ... add other texts
                        ]
                    })
                });
                this.base.getView().addDependent(this._busyDialog);
            }
			this._busyDialog.open();
			var sNamespace = "com.sap.gateway.srvd.zmm_sd_countlistform.v0001";
			var sAction = "PrintCountList(...)";
			var oOperation = oDataV4.bindContext(`${aSelectedContexts[0].sPath}/${sNamespace}.${sAction}`);
			
			//Execute Back-end call
			oOperation.execute().then( () =>{
				var oResult = oOperation.getBoundContext().getObject();
				if(oResult.ErrorMessage){
					MessageToast.show(oResult.ErrorMessage);
					return;
				}

				var sBlobType = oResult.MimeType;
				var sFilename = oResult.FileName;
				var oContent = oResult.FileContent;
				
				Helper.previewObject(sFilename, sBlobType, oContent, false, false);
				MessageBox.success(oResourceBundle.getText("fileGenerated"));

			}).catch(function (oError){
				MessageBox.error(oResourceBundle.getText("processingError"));
				console.error(oError);
			}).finally(() => {
                if(this._busyDialog){
                    this._busyDialog.close();
                    this._busyDialog.destroy();
                    this._busyDialog = null;
                }
				this.base.getExtensionAPI().refresh();
            })


        },
		onDownloadDatasource: function( ) {
            var oResourceBundle = this.base.getView().getModel("i18n").getResourceBundle();
            const oExtensionAPI = this.base.getExtensionAPI();
            var oDataV4 = oExtensionAPI.getModel();
			if (!this._busyDialog) {
                this._busyDialog = new Dialog({
                    title: oResourceBundle.getText("generatingfile"),
                    type: "Message",
                    content: new VBox({
                        items: [
                            new Text({ text: oResourceBundle.getText("pleasewait") }),
							new BusyIndicator({ size: "1.0rem" })
                            // ... add other texts
                        ]
                    })
                });
                this.base.getView().addDependent(this._busyDialog);
            }
			this._busyDialog.open();

			var sNamespace = "com.sap.gateway.srvd.zmm_sd_countlistform.v0001";
			var sAction = "DownloadSchema(...)";
			var oOperation = oDataV4.bindContext(`/CountList/${sNamespace}.${sAction}`);
			
			//Execute Back-end call
			oOperation.execute().then( () =>{
				var oResult = oOperation.getBoundContext().getObject();
				if(oResult.ErrorMessage){
					MessageToast.show(oResult.ErrorMessage);
					return;
				}

				var sBlobType = oResult.MimeType;
				var sFilename = oResult.FileName;
				var oContent = oResult.FileContent;
				
				Helper.previewObject(sFilename, sBlobType, oContent, true, false);
				MessageBox.success(oResourceBundle.getText("fileGenerated"));

			}).catch(function (oError){
				MessageBox.error(oResourceBundle.getText("processingError"));
				console.error(oError);
			}).finally(() => {
                if(this._busyDialog){
                    this._busyDialog.close();
                    this._busyDialog.destroy();
                    this._busyDialog = null;
                }
				this.base.getExtensionAPI().refresh();
            })
        },
	});
});
