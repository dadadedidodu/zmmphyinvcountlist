sap.ui.define([], function () {
    "use strict";

    return {
        previewObject: function (sFileName, sBlobType, oContent, bDownload, bPlainText) {
            if (!bPlainText) {
                var byteCharacters = atob(oContent);
                var byteNumbers = new Array(byteCharacters.length);

                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                var oBlob = new Blob([byteArray], {
                    type: sBlobType
                });
            }else{ //XML, TXT or other plain text file
                oBlob = new Blob([oContent], { type: bDownload ? "application/octet-stream" : sBlobType });
            }

            if (bDownload) {
                this._downloadFile(oBlob, sFileName);
            } else {
                const blobUrl = URL.createObjectURL(oBlob);
                window.open(blobUrl, "_blank");
            }
        },

        _downloadFile: function (oBlob, sFileName) {
            var oLink = document.createElement("a");
            oLink.href = URL.createObjectURL(oBlob);
            oLink.download = sFileName;

            document.body.appendChild(oLink);
            oLink.click();
            document.body.removeChild(oLink);
        }
    };
});