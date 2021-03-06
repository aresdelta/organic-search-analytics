/**
 *  Sends an AJAX request for data to capture
 *
 *  @param catId     String   Category ID for which data is being captured
 *  @param script     String   File name/path to run
 *  @param domain     String   Domain name to capture data for
 *  @param date     String   Date to search.  YYYY-MM-DD
 *  @param callback     String   Function to run upon success
 *
 *  @returns   Object   Database records.  MySQL object
 */
function ajaxScript(catId, script, domain, date, callback) {
	jQuery.ajax({
		type : "GET",
		url : script,
		data : {
			type : catId,
			domain : domain,
			date : date
		},
		beforeSend: function( xhr ) {
			$("#"+catId+" li[domain='"+domain+"'][date='"+date+"']").append('<span style="margin-left: 5px;">Processing...</span>');
		},
		success: function(data) {
			if( callback ) {
				window[callback](catId, domain, date, data);
			}
		},
		error: function(xhr, status, errorThrown) {
			$("#"+catId+" li[domain='"+domain+"'][date='"+date+"']").append('<span style="margin-left: 5px;">Error, try again.</span>');
		}
	});
}


/**
 *  Import all pending data
 */
importAllStop();
function importAllRun() {
	window.importAllProcessing = true;

	$("#importAllButtons .buttonImportAllRun").hide();
	$("#importAllButtons .buttonImportAllStop").show();

	/* Trigger the first import button */
	if( $(".buttonImport").length > 0 ) {
		$(".buttonImport").eq(0).trigger("click");
	} else {
		importAllStop();
		window.importAllProcessing = false;
	}
}


/**
 *  Stop importing all data process
 */
function importAllStop() {
	window.importAllProcessing = false;
	$("#importAllButtons .buttonImportAllStop").hide();
	$("#importAllButtons .buttonImportAllRun").show();
}


/**
 *  Callback after Google Search Analytics are imported
 *  If import all is triggered, iniitiate the next import
 *
 *  @param catId     String   Category ID for which data is being captured
 *  @param domain     String   Domain name to capture data for
 *  @param date     String   Date to search.  YYYY-MM-DD
 *  @param data     String   Message to display
 */
function postGoogleSearchAnalyticsAjax(catId, domain, date, data) {
	$("#"+catId+" li[domain='"+domain+"'][date='"+date+"']").empty().append(data);

	if( window.importAllProcessing == true ) {
		importAllRun();
	}
}


/**
 *  Callback after Bing Search Keywords are imported
 *  If import all is triggered, iniitiate the next import
 *
 *  @param catId     String   Category ID for which data is being captured
 *  @param domain     String   Domain name to capture data for
 *  @param date     String   Date to search.  YYYY-MM-DD
 *  @param data     String   Message to display
 */
function postBingSearchKeywordsAjax(catId, domain, date, data) {
	$("#"+catId+" li[domain='"+domain+"'][date='"+date+"']").empty().append(data);

	/* If import all is set, continue processing */
	if( window.importAllProcessing == true ) {
		importAllRun(catId);
	}
}