(function () {
	"use strict";
	
	var buttons = [
		{ name: "Get All Artists", request: "SELECT * FROM artist" },
		{ name: "Get All Songs from The xx", request: "SELECT * FROM song INNER JOIN artist ON song.artist_id = artist.artist_id WHERE artist.name = 'The xx'"},
	]

	var structure = [
		{
			name: "area", columns: [
				{ name: 'ID_AREA', search: false },
				{ name: 'NAME', search: true },
				{ name: 'TYPE', search: false }
			]
		},
		{
			name: "artist", columns: [
				{ name: 'ID_ARTIST', search: false },
				{ name: 'NAME', search: true },
				{ name: 'TYPE', search: false },
				{ name: 'GENDER', search: false },
				{ name: 'ID_AREA', search: false }
			]
		},
		{
			name: "artist_genre", columns: [
				{ name: 'ID_ARTIST', search: false },
				{ name: 'ID_GENRE', search: false }
			]
		},
		{
			name: "gendre", columns: [
				{ name: 'ID_GENRE', search: false },
				{ name: 'NAME', search: true },
				{ name: 'COUNT', search: false }
			]
		},
		{
			name: "medium", columns: [
				{ name: 'ID_MEDIUM', search: false },
				{ name: 'FORMAT', search: false },
				{ name: 'ID_RELEASE', search: false }
			]
		},
		{
			name: "recording", columns: [
				{ name: 'ID_RECORDING', search: false },
				{ name: 'NAME', search: true },
				{ name: 'LENGTH', search: false }
			]
		},
		{
			name: "release", columns: [
				{ name: 'ID_RELEASE', search: false },
				{ name: 'NAME', search: true }
			]
		},
		{
			name: "track", columns: [
				{ name: 'ID_TRACK', search: false },
				{ name: 'POSITION', search: FALSE },
				{ name: 'ID_MEDIUM', search: false },
				{ name: 'ID_RECORDING', search: false }
			]
		}		
	]

	var html = ''
	for(var i = 0, l = buttons.length; i < l; i++) {
		html += '<a href="#" class="list-group-item sql-button" data-button-id="'+i+'">'+buttons[i].name+'</a>'
	}

	$("#sql-buttons").html(html)

	$("#sql-buttons .sql-button").click(function (event) {
		event.preventDefault()
		var id = $(this).attr('data-button-id')
		var request = buttons[id].request
		sendSQLRequest(request)
	})

	$("#search-form").submit(function (event) {
		event.preventDefault()
		var keyword = $("#search-input").val()
		var sqlReq = "SELECT * FROM artist WHERE name LIKE '%" + keyword + "%'" // TODO Much complex request
		sendSQLRequest(sqlReq)
	})

	function sendSQLRequest(request) {
		debug.write('Sending request: ' + request)

		$.getJSON( "do-sql", { sql: request }, function(res) {
			debug.write("  Server responded " + res.status)
			if(res.status === "OK") {
				renderTable(res.data)
			} else if (res.status === "Error") {
				debug.write(res.error)
			}
		});
	}

	function renderTable(data) {
		// Handling empty tables
		if (data.length === 0) {
			$("#output").html('<span class="data-empty">The table is empty. There is no result to show.</span>')
			return
		}

		// Extracting column names
		var columns = []
		for(var i = 0, l = data.length; i < l; i++) {
			for(var key in data[i]) {
				if (columns.indexOf(key) < 0) {
					columns.push(key)
				}
			}
		}

		var html = ""
		html += '<table class="table table-striped table-hover">'
		html += "<tr>"

		for(var i = 0, l = columns.length; i < l; i++) {
			html += "<th>" + columns[i] + "</th>"
		}

		html += "</tr>"

		for(var i = 0, l = data.length; i < l; i++) {
			html += "<tr>"

			for(var j = 0, k = columns.length; j < k; j++) {
				html += "<td>"

				if(data[i][columns[j]]) {
					html += htmlEntities(data[i][columns[j]])
				} else {
					html += '<span class="data-null">null</span>'
				}

				html += "</td>"
			}

			html += "</tr>"
		}

		html += '</table>'
		$("#output").html(html)
	}

	function htmlEntities(str) {
		return $('<div/>').text(str).html();
	}

	var debug = {
		write: function (lines) {
			lines = '> '+lines+'\n'
			$(document.createTextNode(lines)).appendTo("#debug")
		},
		clean: function () {
			$("#debug").html('')
		}
	}
})()