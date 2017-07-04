$("#submit-horses").click(function(){
	var horse_array = $("#horses-list").val().split("\n");
	data_array = [
		["Horse Name",
		"Other Horse Name",
		"Inbreeding Stats",
		"Crosses",
		"Lines",
		"Blood %",
		"Influence",
		"AGR"]
	];

	horse_array = $.map(horse_array, function(item, index) {
		return item.toUpperCase();
	});

	horses = {
		horses: horse_array
	};
	horse_json = JSON.stringify(horses);

	$.post("server.php", horse_json, function(data){
		$.each(data, function(key, value){
			if (isValidPage(value)){
				var processed_html = processHTML(value, key);
				$.each(processed_html, function(index, value){
					data_array.push(value);
				});
			}
		});

		var processed_csv = arrayToCSV(data_array);
		downloadCSV(processed_csv);
	}, "json");
});

isValidPage = function(html){
	if (html.search("not on record") === -1){
		return true;
	} else {
		return false;
	}
};

processHTML = function(html_string, name){
	horse_rows = [];
	html_string = html_string.replace(/\\"/g, '"');
	html_string = html_string.replace(/\\'/g, '');

	html_string = html_string.match(/<table\b[^>]*>([\s\S]*?)<\/table>/g);
	html_string = html_string[3];
	if (html_string === ""){return false}

	tbody = $.parseHTML(html_string);
	$("#processor").html(tbody);
	$("tr:eq(0)").remove();
	$("tr:eq(0)").remove();
	$("tr:eq(0)").remove();
	$("tr:eq(-1)").remove();
	$("tr:eq(-1)").remove();

	$("tr").each(function(){
		var row = [name];

		var other_horse = 		$("td:nth-child(1)", $(this)).children("a").text();
		row.push(other_horse);
		var inbreeding_stats = 	$("td:nth-child(2)", $(this)).text();
		row.push(inbreeding_stats);
		var crosses = 			$("td:nth-child(3)", $(this)).text();
		row.push(crosses);
		var lines = 			$("td:nth-child(4)", $(this)).text();
		row.push(lines);
		var blood = 			$("td:nth-child(5)", $(this)).text();
		row.push(blood);
		var influence = 		$("td:nth-child(6)", $(this)).text();
		row.push(influence);
		var agr = 				$("td:nth-child(7)", $(this)).text();
		row.push(agr);

		horse_rows.push(row);
	});
	$("#processor").html("");
	return horse_rows;
};

arrayToCSV = function(multi_array){
	var csv = "data:text/csv;charset=utf-8,";
	$.each(multi_array, function(index, value){
	   var row = value.join(",");
	   row += "\n";
	   csv += row;
	});

	return csv;
};

downloadCSV = function(csv){
	var encoded_uri = encodeURI(csv);
	var anchor = document.createElement("a");
	anchor.setAttribute("download", "horse_data.csv");
	anchor.setAttribute("href", encoded_uri);
	anchor.setAttribute("target", "_blank");
	anchor.click();
};

htmlEncode = function(value){
	return $('<div/>').text(value).html();
};

