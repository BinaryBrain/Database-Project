(function () {
	"use strict";
	
	var buttons = [
		{ name: "Artist from Switzerland", request: "SELECT A.name FROM Artist A, Area B WHERE A.ID_AREA = B.ID_AREA AND B.name= 'Switzerland'" },
		{ name: "Get All Songs from The xx", request: "SELECT * FROM song INNER JOIN artist ON song.artist_id = artist.artist_id WHERE artist.name = 'The xx'"},
	]

	var searchTable = [
		'area', 
		'artist',
		'genre',
		'recording',
		'release'
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
			name: "genre", columns: [
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
				{ name: 'POSITION', search: false },
				{ name: 'ID_MEDIUM', search: false },
				{ name: 'ID_RECORDING', search: false }
			]
		}		
	]

	populateSelect(searchTable)

	var html = ''
	for(var i = 0, l = buttons.length; i < l; i++) {
		html += '<a href="#" class="list-group-item sql-button" data-button-id="'+i+'">'+buttons[i].name+'</a>'
	}

	$("#sql-buttons").html(html)

	$("#sql-buttons .sql-button").click(function (event) {
		event.preventDefault()
		var id = $(this).attr('data-button-id')
		var request = buttons[id].request

		destroyTabs()

		sendSQLRequest(request, function (data) {
			renderTable(data, "#output")
		})
	})

	$("#search-form").submit(function (event) {
		event.preventDefault()
		var keyword = $("#search-input").val()
		var table = $('#form-table-select').val()
		var sqlReq = "SELECT * FROM "+table+" WHERE name LIKE '%" + keyword + "%'" // TODO Much complex request
		
		destroyTabs()

		sendSQLRequest(sqlReq, function (data) {
			renderTable(data, "#output", table)
		})
	})

	$("#output").on('click', '.result-links', function (event) {
		event.preventDefault()
		var table = $(this).attr("data-table")
		var idCol = $(this).attr("data-id-col")
		var id = $(this).attr("data-id")

		destroyTabs()

		var tables, requests
		if(table === 'artist') {
			tables = ['area', 'genre', 'release']
			requests = []
			requests['area'] = "SELECT area.NAME, area.ID_AREA, area.TYPE FROM area, artist WHERE area.ID_AREA=artist.ID_AREA AND artist."+idCol+"='"+id+"'"
			requests['genre'] = "SELECT g.NAME, g.ID_GENRE, g.COUNT FROM artist_genre x, genre g WHERE g.ID_GENRE = x.ID_GENRE AND x."+idCol+"='"+id+"'"
			requests['release'] = "SELECT r.NAME, r.ID_RELEASE FROM artist a, release r, medium m, track t, artist_track s WHERE s.ID_ARTIST = a.ID_ARTIST AND s.ID_TRACK = t.ID_TRACK AND t.ID_MEDIUM = m.ID_MEDIUM AND m.ID_RELEASE = r.ID_RELEASE AND a."+idCol+"='"+id+"'"
		} else {
			return
		}

		if(tables.length > 1) {
			createTabs(tables)
			for(var i = 0; i < tables.length; i++) {
				sendSQLRequest(requests[tables[i]], function (data, table) {
					renderTable(data, "#output #table-"+table, table)
				}, tables[i])
			}
		} else {
			sendSQLRequest(requests[tables[0]], function (data) {
				renderTable(data, "#output", tables[0])
			})
		}
	})

	$('#tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	$("#fullscreen-button").click(function (e) {
		e.preventDefault()
		toFullscreen("#output")
	})

	$("#fullscreen-close").click(function (e) {
		e.preventDefault()
		closeFullscreen()
	})

	function sendSQLRequest(request, cb) {
		var cbArgs = Array.prototype.slice.call(arguments)
		cbArgs.splice(0, 2)

		debug.write('Sending request: ' + request)
		
		showAjaxLoader()
		$.getJSON("do-sql", { sql: request }, function(res) {
			hideAjaxLoader()
			if(res.status === "OK") {
				cbArgs.unshift(res.data)
				cb.apply(this, cbArgs)
			} else if (res.status === "Error") {
				debug.write("  Server responded: " + res.status + " (" + res.error + ")")
			} else {
				debug.write("  Server responded: " + res.status)
			}
		});
	}

	function renderTable(data, outputDiv, tableName) {
		// Handling empty tables
		if (data.length === 0) {
			$(outputDiv).html('<span class="data-empty">The table is empty. There is no result to show.</span>')
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
			if(tableName) {
				var idCol = "ID_"+tableName
				if(columns[i].toLowerCase() !== idCol.toLowerCase()) {
					html += "<th>" + firstCap(columns[i]) + "</th>"
				}
			} else {
				html += "<th>" + firstCap(columns[i]) + "</th>"
			}
		}

		html += "</tr>"

		for(var i = 0, l = data.length; i < l; i++) {
			html += "<tr>"

			for(var j = 0, k = columns.length; j < k; j++) {
				// TODO data-table
				if(tableName) {
					var idCol = "ID_"+tableName.toUpperCase()
					if(columns[j].toLowerCase() !== idCol.toLowerCase()) {
						html += "<td>"
						html += '<a class="result-links" href="#" data-table="'+tableName+'" data-id-col="'+idCol+'" data-id="'+data[i][idCol]+'">'
						html += htmlEntities(data[i][columns[j]])
						html += '</a>'
						html += "</td>"
					}
				} else {
					html += "<td>"
					if(data[i][columns[j]]) {
						html += htmlEntities(data[i][columns[j]])
					} else {
						html += '<span class="data-null">null</span>'
					}
					html += "</td>"
				}
			}

			html += "</tr>"
		}

		html += '</table>'
		$(outputDiv).html(html)
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

	function populateSelect(searchTables) {
		var html = ''
		for (var i = 0, l = searchTables.length; i < l; i++) {
			html += '<option value="'+searchTables[i]+'">'+firstCap(searchTables[i])+'</option>'
		}

		$("#form-table-select").html(html)
	}

	function firstCap(string) {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}

	function createTabs(tables) {
		if(tables.length > 1) {
			var htmlTabs = ''
			var htmlDivs = ''
			for(var i = 0; i < tables.length; i++) {
				if(i === 0) {
					htmlTabs += '<li class="active">'
					htmlDivs += '<div class="tab-pane active" id="table-'+tables[i]+'"></div>'
				} else {
					htmlTabs += '<li>'
					htmlDivs += '<div class="tab-pane" id="table-'+tables[i]+'"></div>'
				}

				htmlTabs += '<a href="#table-'+tables[i]+'" data-toggle="tab">'+firstCap(tables[i])+'</a></li>'
				htmlTabs += '</li>'
			}

			$("#tabs").html(htmlTabs)
			$("#output").html(htmlDivs)
		} else {
			debug.write("Warning: trying to create one tab.")
		}
	}

	function destroyTabs(tables) {
		$("#tabs").html('')
		$("#output").html('')
	}

	function showAjaxLoader() {
		$("#ajax-loader").show()
	}

	function hideAjaxLoader() {
		$("#ajax-loader").hide()
	}

	function toFullscreen(div) {
		$("#fullscreen-content").html($(div).html());
		$("#fullscreen").fadeIn()
	}

	function closeFullscreen() {
		$("#fullscreen").fadeOut()
	}
})()