sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"zmmphyinvcountlist/test/integration/pages/CountListList.gen",
	"zmmphyinvcountlist/test/integration/pages/CountListObjectPage.gen"
], function (JourneyRunner, CountListListGenerated, CountListObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('zmmphyinvcountlist') + '/test/flp.html#app-preview',
        pages: {
			onTheCountListListGenerated: CountListListGenerated,
			onTheCountListObjectPageGenerated: CountListObjectPageGenerated
        },
        async: true
    });

    return runner;
});

