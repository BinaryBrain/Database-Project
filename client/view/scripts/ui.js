(function () {
	"use strict";
	
	var buttons = [
		{ name: "Get All Artists", request: "SELECT * FROM artist" },
		{ name: "Get All Songs from The xx", request: "SELECT * FROM song INNER JOIN artist ON song.artist_id = artist.artist_id WHERE artist.name = 'The xx'"},
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

	function sendSQLRequest(request) {
		debug.write('Sending request: ' + request)

		$.get( "do-sql", { sql: request }, function(data) {
			debug.write("  Server responded" + data)
		});
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