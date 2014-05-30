(function () {
	"use strict";
	
	var buttons = [
		{ 
			name: "A) Artist from Switzerland",
			table: "artist",
			request: "SELECT A.name, A.ID_ARTIST FROM Artist A, Area B WHERE A.ID_AREA = B.ID_AREA AND B.name= 'Switzerland'"
		},
		{
			name: "B) ?Area with the highest number of female, male and group artist",
			table: "area",
			request: ""
		},
		{
			name: "C) 10 groups with the most recorded track",
			table: "artist",
			request: "SELECT * FROM(SELECT A.NAME FROM  DUMMY_Artist A, DUMMY_Artist_Track S WHERE A.ID_ARTIST=S.ID_ARTIST AND A.TYPE='Group' GROUP BY A.NAME ORDER BY count(S.ID_TRACK) DESC)WHERE ROWNUM <=10"
		},
		{
			name: "D) 10 groups with the most release",
			table: "artist",
			request: "SELECT * FROM(SELECT A.NAME FROM Artist A, Track T, Artist_Track S, Medium M, Release R WHERE A.ID_ARTIST =S.ID_ARTIST AND T.ID_TRACK=S.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM AND R.ID_RELEASE = M.ID_RELEASE AND A.TYPE='Group' GROUP BY A.NAME ORDER BY count(R.ID_RELEASE) DESC) WHERE ROWNUM <=10"
		},
		{
			name: "E) Female artist with the most genres",
			table: "artist",
			request: "SELECT NAME FROM (SELECT A.NAME AS NAME, COUNT(G.ID_GENRE) AS COUNT_GENRE FROM ARTIST_GENRE G, ARTIST A WHERE A.ID_ARTIST= G.ID_ARTIST AND A.GENDER='Female' GROUP BY A.NAME ORDER BY COUNT_GENRE DESC) WHERE ROWNUM=1"
		},
		{
			name: "F) ?Cities that have more female artist than male artist",
			table: "area",
			request: "--SELECT B.name FROM Area B WHERE B.type='City' AND (SELECT Count(*) FROM Artist A WHERE A.gender='Female' AND A.ID_AREA= B.ID_AREA) > (SELECT Count(*) FROM Artist A1 WHERE A1.gender='Male' AND A1.ID_AREA=B.ID_AREA)"
		},
		{
			name: "G) The releases with the most number of tracks",
			table: "releases",
			request: "SELECT R.name as name, COUNT(T.ID_TRACK) AS COUNT_TRACK FROM RELEASE R, TRACK T, MEDIUM M WHERE R.ID_RELEASE = M.ID_RELEASE AND M.ID_MEDIUM = T.ID_MEDIUM GROUP BY R.NAME ORDER BY COUNT_TRACK DESC"
		}
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

	// Buttons
	$("#sql-buttons .sql-button").click(function (event) {
		event.preventDefault()
		var id = $(this).attr('data-button-id')
		var request = buttons[id].request
		var name = $(this).text()
		var table = buttons[id].table

		$("#table-title").text(name)

		destroyTabs()

		sendSQLRequest(request, function (data) {
			renderTable(data, ".output", table)
		})
	})

	// Search
	$("#search-form").submit(function (event) {
		event.preventDefault()
		var keyword = s($("#search-input").val())
		var table = s($('#form-table-select').val())
		var sqlReq = "SELECT * FROM "+table+" WHERE LOWER(name) LIKE lower('%" + keyword + "%')" // TODO Much complex request
		
		$("#table-title").html('Search: ' + firstCap(table) + ' &mdash; ' + keyword)

		destroyTabs()

		sendSQLRequest(sqlReq, function (data) {
			renderTable(data, ".output", table)
		})
	})

	// Links
	$(".output").on('click', '.result-links', function (event) {
		event.preventDefault()
		var that = $(this)
		var table = s($(that).attr("data-table"))
		var name = s($(that).attr("data-name"))
		var idCol = s($(that).attr("data-id-col"))
		var id = s($(that).attr("data-id"))

		$("#table-title").html(firstCap(table) + ' &mdash; ' + name)

		destroyTabs()

		var tables
		var requests = []
		if(table === 'artist') {
			tables = ['area', 'genre', 'release']
			requests['area'] = "SELECT area.NAME, area.ID_AREA, area.TYPE FROM area, artist WHERE area.ID_AREA=artist.ID_AREA AND artist."+idCol+"='"+id+"'"
			requests['genre'] = "SELECT g.NAME, g.ID_GENRE, g.COUNT FROM artist_genre x, genre g WHERE g.ID_GENRE = x.ID_GENRE AND x."+idCol+"='"+id+"'"
			requests['release'] = "SELECT DISTINCT r.NAME, r.ID_RELEASE FROM artist a, release r, medium m, track t, artist_track s WHERE s.ID_ARTIST = a.ID_ARTIST AND s.ID_TRACK = t.ID_TRACK AND t.ID_MEDIUM = m.ID_MEDIUM AND m.ID_RELEASE = r.ID_RELEASE AND a."+idCol+"='"+id+"'"
		} else if (table === 'area') {
			tables = ['artist']
			requests['artist'] = "SELECT a.NAME, a.ID_ARTIST, a.GENDER, a.ID_AREA, a.TYPE FROM artist a WHERE a.ID_AREA = "+id
		}  else if (table === 'genre') {
			tables = ['artist']
			requests['artist'] = "SELECT a.NAME, a.ID_ARTIST, a.GENDER, a.ID_AREA, a.TYPE FROM artist a, artist_genre g WHERE a.ID_ARTIST = g.ID_ARTIST AND g.ID_GENRE = "+id
		}  else if (table === 'recording') {
			tables = ['artist', 'release']
			requests['artist'] = "SELECT a.NAME, a.ID_ARTIST, a.GENDER, a.ID_AREA, a.TYPE FROM artist a, track t, artist_track x WHERE x.ID_TRACK = t.ID_TRACK AND x.ID_ARTIST = a.ID_ARTIST AND t.ID_RECORDING = "+id
			requests['release'] = "SELECT DISTINCT r.NAME, r.ID_RELEASE FROM track t, medium m, release r WHERE t.ID_MEDIUM = m.ID_MEDIUM AND m.ID_RELEASE = r.ID_RELEASE AND t.ID_RECORDING = "+id
		}  else if (table === 'relase') {
			tables = ['artist', 'recording']
			requests['artist'] = "SELECT a.NAME, a.ID_ARTIST, a.GENDER, a.ID_AREA, a.TYPE FROM artist a, medium m, track t, artist_track x WHERE t.ID_MEDIUM = m.ID_MEDIUM AND x.ID_TRACK = t.ID_TRACK AND x.ID_ARTIST = a.ID_ARTIST AND m.ID_RELEASE = "+id
			requests['recording'] = "SELECT r.NAME, r.ID_RECORDING, r.LENGTH FROM medium m, track t, recording r WHERE t.ID_MEDIUM = m.ID_MEDIUM AND t.ID_RECORDING = r.ID_RECORDING AND m.ID_RELEASE = "+id
		} else {
			return
		}

		if(tables.length > 1) {
			createTabs(tables)
			for(var i = 0; i < tables.length; i++) {
				sendSQLRequest(requests[tables[i]], function (data, table) {
					renderTable(data, ".output .table-"+table, table)
				}, tables[i])
			}
		} else {
			sendSQLRequest(requests[tables[0]], function (data) {
				renderTable(data, ".output", tables[0])
			})
		}
	})

	$(".output").on('click', '.delete-button', function (e) {
		e.preventDefault()
		e.stopPropagation()
		var row = $(this).parent().parent()
		var id = $(row).attr('data-id')
		var table = $(row).attr('data-table')
		var idCol = $(row).attr('data-id-col')

		$(row).slideUp();
		// TODO Uncomment
		//sendSQLRequest("DELET FROM " + table + " WHERE " + idCol + " = '" + id + "'")

	})

	$('.tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	$("#fullscreen-button").click(function (e) {
		e.preventDefault()
		toFullscreen(".output")
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

		// Header
		for(var i = 0, l = columns.length; i < l; i++) {
			if(tableName) {
				var idCol = "ID_"+tableName
				if(columns[i].toUpperCase().substring(0,3) !== "ID_") {
					html += "<th>" + firstCap(columns[i]) + "</th>"
				}
			} else {
				html += "<th>" + firstCap(columns[i]) + "</th>"
			}
		}
		
		// delete button
		html += '<th class="cell-delete-button"></th>'

		html += "</tr>"

		// Body
		for(var i = 0, l = data.length; i < l; i++) {
			if(tableName) {
				var idCol = "ID_"+tableName.toUpperCase()
				name = data[i].NAME
				html += '<tr class="result-links" href="#" data-table="'+tableName+'" data-id-col="'+idCol+'" data-id="'+data[i][idCol]+'" data-name="'+name+'">'
			} else {
				html += "<tr>"
			}

			for(var j = 0, k = columns.length; j < k; j++) {
				if(!tableName || columns[j].toUpperCase().substring(0,3) !== "ID_") {
					html += "<td>"

					if(data[i][columns[j]]) {
						html += htmlEntities(data[i][columns[j]])
					} else {
						html += '<span class="data-null">null</span>'
					}
					
					html += "</td>"
				}
			}

			// delete button
			html += '<td class="cell-delete-button">'
			html += '<button type="button" class="btn btn-danger btn-xs pull-right delete-button" title="Delete Entry">'
			html += '<span class="glyphicon glyphicon-remove">'
			html += '</span>'
			html += '</button>'
			html += '</td>'

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
					htmlDivs += '<div class="tab-pane active table-'+tables[i]+'" id="table-'+tables[i]+'"></div>'
				} else {
					htmlTabs += '<li>'
					htmlDivs += '<div class="tab-pane table-'+tables[i]+'" id="table-'+tables[i]+'"></div>'
				}

				htmlTabs += '<a href="#table-'+tables[i]+'" data-toggle="tab">'+firstCap(tables[i])+'</a></li>'
				htmlTabs += '</li>'
			}

			$(".tabs").html(htmlTabs)
			console.log($(".output"), htmlDivs)
			$(".output").html(htmlDivs)
		} else {
			debug.write("Warning: trying to create one tab.")
		}
	}

	function destroyTabs(tables) {
		$(".tabs").html('')
		$(".output").html('')
	}

	function showAjaxLoader() {
		$("#ajax-loader").show()
	}

	function hideAjaxLoader() {
		$("#ajax-loader").hide()
	}

	function toFullscreen(div) {
		//$("#fullscreen-content").html($(div).html());
		$("#fullscreen").fadeIn()
	}

	function closeFullscreen() {
		$("#fullscreen").fadeOut()
	}

	function s(str) {
		return str.replace(/[\'%_]/g, function (char) {
			switch (char) {
				case "'":
					return "''"
				case "%":
					return "\%"
				case "_":
					return "\_"
			}
		});
	}
})()