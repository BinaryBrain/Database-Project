(function () {
	"use strict";
	
	var buttons = [
		{ 
			name: "A) Artist from Switzerland",
			table: "artist",
			request: "SELECT A.name, A.ID_ARTIST FROM Artist A, Area B WHERE A.ID_AREA = B.ID_AREA AND B.name= 'Switzerland'"
		},
		{
			name: "B) Area with the highest number of female, male and group artist",
			table: "area",
			request: "SELECT * FROM(SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA) AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA) AS COUNTM, (SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA) AS COUNTG FROM AREA B ORDER BY COUNTF DESC) WHERE ROWNUM=1 UNION SELECT * FROM (SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA) AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA)AS COUNTM, (SELECT COUNT(DISTINCT A.ID_ARTIST)FROM ARTIST A WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA) AS COUNTG FROM AREA B ORDER BY COUNTM DESC) WHERE ROWNUM=1 UNION SELECT * FROM (SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST)FROM ARTIST A WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA) AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST)FROM ARTIST A WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA)AS COUNTM, SELECT COUNT(DISTINCT A.ID_ARTIST) FROM ARTIST A WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA) AS COUNTG FROM AREA B ORDER BY COUNTG DESC)WHERE ROWNUM=1;"
			//timeout
		},
		{
			name: "C) 10 groups with the most recorded track",
			table: "artist",
			request: "SELECT * FROM(SELECT A.NAME FROM  Artist A, Artist_Track S	WHERE A.ID_ARTIST=S.ID_ARTIST AND A.TYPE='Group' GROUP BY A.ID_ARTIST, A.NAME ORDER BY count(S.ID_TRACK) DESC) WHERE ROWNUM <=10"
		},
		{
			name: "D) 10 groups with the most release",
			table: "artist",
			request: "SELECT * FROM(SELECT A.NAME FROM Artist A, Track T, Artist_Track S, Medium M, Release R	WHERE A.ID_ARTIST =S.ID_ARTIST AND T.ID_TRACK=S.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM AND R.ID_RELEASE = M.ID_RELEASE AND A.TYPE='Group'	GROUP BY A.ID_ARTIST, A.NAME ORDER BY count(DISTINCT R.ID_RELEASE) DESC) WHERE ROWNUM <=10"
		},
		{
			name: "E) Female artist with the most genres",
			table: "artist",
			request: "SELECT NAME FROM (SELECT A.NAME AS NAME, COUNT(DISTINCT G.ID_GENRE) AS COUNT_GENRE FROM ARTIST_GENRE G, ARTIST A WHERE A.ID_ARTIST= G.ID_ARTIST AND A.GENDER='Female' GROUP BY A.ID_ARTIST, A.NAME ORDER BY COUNT_GENRE DESC)WHERE ROWNUM=1"
		},
		{
			name: "F) Cities that have more female artist than male artist",
			table: "area",
			request: "SELECT B.name FROM Area B WHERE B.type='City' AND (SELECT Count(*) FROM Artist A WHERE A.gender='Female' AND A.ID_AREA= B.ID_AREA) > (SELECT Count(*)	 FROM Artist A1	 WHERE A1.gender='Male' AND A1.ID_AREA=B.ID_AREA)"
			//timeout
		},
		{
			name: "G) The releases with the most number of tracks",
			table: "release",
			request: "SELECT ID, FORMAT, COUNT_TRACK FROM(SELECT M.ID_MEDIUM AS ID, M.FORMAT AS FORMAT, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM TRACK T, MEDIUM M WHERE M.ID_MEDIUM = T.ID_MEDIUM GROUP BY M.ID_MEDIUM, M.FORMAT)WHERE COUNT_TRACK = (SELECT MAX(COUNT_TRACK) FROM (SELECT M.ID_MEDIUM AS ID, M.FORMAT AS FORMAT, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM TRACK T, MEDIUM M WHERE M.ID_MEDIUM=T.ID_MEDIUM GROUP BY M.ID_MEDIUM, M.FORMAT));"
		}
		{
			name: "H) For each area with more than 30 artists list the male,female and group with highest tracks",
			table: "area", //I am not sure if it is area or artist
			request: "SELECT A.NAME, M.ART_NAME, F.ART_NAME, G.ART_NAME FROM AREA A,(SELECT AREA_ID, ART_NAME FROM(SELECT AM.ID_AREA AS AREA_ID, AM.NAME AS ART_NAME, COUNT(DISTINCT ATM.ID_TRACK) AS TCOUNT, ROW_NUMBER()OVER (PARTITION BY AM.ID_AREA ORDER BY COUNT(DISTINCT ATM.ID_TRACK)DESC) AS RN FROM ARTIST AM, ARTIST_TRACK ATM WHERE AM.GENDER='Male' AND AM.ID_ARTIST=ATM.ID_ARTIST AND AM.ID_AREA IN (SELECT AR2.ID_AREA	FROM AREA AR2, ARTIST A	WHERE A.ID_AREA= AR2.ID_AREA GROUP BY AR2.ID_AREA HAVING COUNT(DISTINCT A.ID_ARTIST)>=30) GROUP BY AM.ID_AREA,  AM.ID_ARTIST, AM.NAME)WHERE RN<=1) M,(SELECT AREA_ID, ART_NAME FROM(SELECT AM.ID_AREA AS AREA_ID, AM.NAME AS ART_NAME, COUNT(DISTINCT ATM.ID_TRACK) AS TCOUNT, ROW_NUMBER()OVER (PARTITION BY AM.ID_AREA ORDER BY COUNT(DISTINCT ATM.ID_TRACK)DESC) AS RN FROM ARTIST AM, ARTIST_TRACK ATM WHERE AM.GENDER='Female' AND AM.ID_ARTIST=ATM.ID_ARTIST AND AM.ID_AREA IN (SELECT AR2.ID_AREA	FROM AREA AR2, ARTIST A	WHERE A.ID_AREA= AR2.ID_AREA GROUP BY AR2.ID_AREA HAVING COUNT(DISTINCT A.ID_ARTIST)>=30) GROUP BY AM.ID_AREA,  AM.ID_ARTIST, AM.NAME)WHERE RN<=1) F,(SELECT AREA_ID, ART_NAME FROM(SELECT AM.ID_AREA AS AREA_ID, AM.NAME AS ART_NAME, COUNT(DISTINCT ATM.ID_TRACK) AS TCOUNT, ROW_NUMBER()OVER (PARTITION BY AM.ID_AREA ORDER BY COUNT(DISTINCT ATM.ID_TRACK)DESC) AS RN FROM  ARTIST AM, ARTIST_TRACK ATM WHERE AM.TYPE='Group' AND AM.ID_ARTIST=ATM.ID_ARTIST AND AM.ID_AREA IN (SELECT AR2.ID_AREA FROM AREA AR2, ARTIST A WHERE A.ID_AREA= AR2.ID_AREA GROUP BY AR2.ID_AREA HAVING COUNT(DISTINCT A.ID_ARTIST)>=30) GROUP BY AM.ID_AREA,  AM.ID_ARTIST, AM.NAME)WHERE RN<=1) G WHERE A.ID_AREA=M.AREA_ID AND A.ID_AREA=G.AREA_ID AND A.ID_AREA=F.AREA_ID;"
			//timeout
		}
		{
			name: "I) 25 most famous track of metallica",
			table: "recording",
			request: "SELECT DISTINCT * FROM(SELECT R.NAME, COUNT(DISTINCT T.ID_MEDIUM) FROM TRACK T, RECORDING R, ARTIST_TRACK AT, ARTIST A WHERE A.NAME = 'Metallica' AND A.ID_ARTIST = AT.ID_ARTIST AND  AT.ID_TRACK = T.ID_TRACK AND T.ID_RECORDING = R.ID_RECORDING GROUP BY R.ID_RECORDING, R.NAME ORDER BY COUNT(DISTINCT T.ID_MEDIUM) DESC)WHERE ROWNUM <= 25;"
		}
		{
			name: "J) For the 10 genre with the most artists, list the female with the highest tracks",
			table: "artist", //I am not sure if it is genre or artist
			request: "SELECT GENRE_ID, NAME FROM(SELECT AG.ID_GENRE AS GENRE_ID, A.NAME AS NAME, COUNT(DISTINCT AT.ID_TRACK), ROW_NUMBER()OVER (PARTITION BY AG.ID_GENRE ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC) AS RN FROM ARTIST A, ARTIST_TRACK AT, ARTIST_GENRE AG WHERE A.ID_ARTIST= AT.ID_ARTIST  AND A.GENDER='Female' AND A.ID_ARTIST=AG.ID_ARTIST AND AG.ID_GENRE IN (SELECT * FROM (SELECT G.ID_GENRE FROM ARTIST_GENRE G GROUP BY G.ID_GENRE ORDER BY COUNT(DISTINCT G.ID_ARTIST) DESC)WHERE ROWNUM <=10) GROUP BY AG.ID_GENRE, A.ID_ARTIST, A.NAME)WHERE RN=1;"
		}
		{
			name: "K) List all genres that have no male or female or group",
			table: "genre",
			request:"SELECT G.ID_GENRE FROM GENRE G WHERE G.ID_GENRE NOT IN (SELECT AG.ID_GENRE FROM ARTIST_GENRE AG, ARTIST A WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Female')UNION SELECT G.ID_GENRE FROM GENRE G WHERE G.ID_GENRE NOT IN (SELECT AG.ID_GENRE FROM ARTIST_GENRE AG, ARTIST A WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Male')UNION SELECT G.ID_GENRE FROM GENRE G WHERE G.ID_GENRE NOT IN (SELECT AG.ID_GENRE FROM ARTIST_GENRE AG, ARTIST A WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.TYPE = 'Group');"
		}
		{
			name: "L) For areas with more than 10 groups list the 5 males with highest tracks",
			table: "area", //I am not sure if it is area or artist
			request: "SELECT AREA_NAME, ART_NAME FROM (SELECT ARE.NAME AS AREA_NAME, A.NAME AS ART_NAME, COUNT(DISTINCT AT.ID_TRACK) AS TRACKCOUNT, ROW_NUMBER()OVER(PARTITION BY ARE.ID_AREA, ARE.NAME ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC) AS RN FROM ARTIST A, ARTIST_TRACK AT, AREA ARE WHERE A.ID_ARTIST = AT.ID_ARTIST AND A.ID_AREA=ARE.ID_AREA AND ARE.ID_AREA IN (SELECT AR.ID_AREA FROM AREA AR, ARTIST A2 WHERE AR.ID_AREA = A2.ID_AREA AND A2.TYPE = 'Group' GROUP BY AR.ID_AREA HAVING COUNT(DISTINCT A2.ID_ARTIST) > 10) GROUP BY ARE.ID_AREA, ARE.NAME, A.ID_ARTIST, A.NAME)WHERE RN <= 5;"
		}
		{
			name: "M) List the 10 groups with the highest number of tracks in compilation",
			table: "artist",
			request:"SELECT * FROM(SELECT A.NAME AS NAME, COUNT(DISTINCT T.ID_TRACK) FROM ARTIST A, ARTIST_TRACK AT, TRACK T WHERE A.TYPE='Group' AND A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM IN (SELECT DISTINCT T2.ID_MEDIUM FROM ARTIST_TRACK AT2, TRACK T2, ARTIST_TRACK AT3, TRACK T3 WHERE AT2.ID_TRACK=T2.ID_TRACK AND AT3.ID_TRACK =T3.ID_TRACK AND T2.ID_TRACK <>T3.ID_TRACK AND AT3.ID_ARTIST <>AT2.ID_ARTIST AND T2.ID_MEDIUM=T3.ID_MEDIUM)GROUP BY A.ID_ARTIST, A.NAME ORDER BY COUNT(DISTINCT T.ID_TRACK)DESC)WHERE ROWNUM<=10;"
			//timeout
		}
		{
			name: "N) List the 10 releases with the most collaborations",
			table: "release",
			request: "SELECT * FROM (SELECT B.RELEASE_ID, C.COUNT_ART FROM (SELECT M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM GROUP BY M.ID_RELEASE, A.ID_ARTIST) A,(SELECT  M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK)AS COUNT_TRACK FROM MEDIUM M, TRACK T WHERE T.ID_MEDIUM=M.ID_MEDIUM GROUP BY M.ID_RELEASE) B,(SELECT M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT A.ID_ARTIST)AS COUNT_ART, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM GROUP BY M.ID_RELEASE) C WHERE B.RELEASE_ID=A.RELEASE_ID AND A.COUNT_TRACK=B.COUNT_TRACK AND B.RELEASE_ID=C.RELEASE_ID GROUP BY B.RELEASE_ID, C.COUNT_ART ORDER BY C.COUNT_ART DESC)WHERE ROWNUM<=10;"
			//timeout
		}
		{
			name: "O) List the release that are associated with the most mediums",
			table: "release",
			request:"SELECT RID FROM (SELECT M.ID_RELEASE AS RID, COUNT(DISTINCT M.ID_MEDIUM) AS COUNTM FROM MEDIUM M GROUP BY M.ID_RELEASE ORDER BY COUNT(DISTINCT M.ID_MEDIUM) DESC) WHERE COUNTM = (SELECT MAX(COUNTM)FROM (SELECT COUNT(DISTINCT M.ID_MEDIUM) AS COUNTM FROM MEDIUM M GROUP BY M.ID_RELEASE ORDER BY COUNT(DISTINCT M.ID_MEDIUM) DESC));"
		}
		{
			name: "P) List the most popular genre among the groups that have more than 3 genres ",
			table: "genre",
			request:"SELECT GNAME FROM (SELECT G.NAME AS GNAME FROM GENRE G, ARTIST_GENRE AG WHERE G.ID_GENRE=AG.ID_GENRE AND AG.ID_ARTIST IN (SELECT AG.ID_ARTIST FROM ARTIST A, ARTIST_GENRE AG WHERE A.TYPE = 'Group' AND AG.ID_ARTIST = A.ID_ARTIST GROUP BY AG.ID_ARTIST HAVING COUNT(DISTINCT AG.ID_GENRE)>=3)GROUP BY G.ID_GENRE, G.NAME ORDER BY COUNT(DISTINCT AG.ID_ARTIST) DESC)WHERE ROWNUM <= 1;"
		}
		{
			name: "Q) The releases with the most number of tracks",
			table: "releases",
			request: "SELECT ID, FORMAT, COUNT_TRACK FROM(SELECT M.ID_MEDIUM AS ID, M.FORMAT AS FORMAT, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM TRACK T, MEDIUM M WHERE M.ID_MEDIUM = T.ID_MEDIUM GROUP BY M.ID_MEDIUM, M.FORMAT)WHERE COUNT_TRACK = (SELECT MAX(COUNT_TRACK) FROM (SELECT M.ID_MEDIUM AS ID, M.FORMAT AS FORMAT, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK FROM TRACK T, MEDIUM M WHERE M.ID_MEDIUM=T.ID_MEDIUM GROUP BY M.ID_MEDIUM, M.FORMAT));"
		}
		{
			name: "R) List the 5 titles that are associated with the most different song",
			table: "recording",
			request: "SELECT * FROM (SELECT R.NAME, COUNT(R.ID_RECORDING) FROM RECORDING R GROUP BY R.NAME ORDER BY COUNT(R.ID_RECORDING) DESC) WHERE ROWNUM <=5;"
		}
		{
			name: "S) Hit artist and hit ability",
			table: "artist",
			request:"SELECT ART_ID, AVG(COUNTM) FROM(SELECT AT.ID_ARTIST AS ART_ID,  R.NAME AS RECORD_NAME, COUNT(DISTINCT T.ID_MEDIUM) AS COUNTM FROM ARTIST_TRACK AT, RECORDING R, TRACK T WHERE T.ID_RECORDING=R.ID_RECORDING  AND AT.ID_TRACK=T.ID_TRACK GROUP BY AT.ID_ARTIST, R.NAME HAVING COUNT(DISTINCT T.ID_MEDIUM)>=100) GROUP BY ART_ID HAVING COUNT(RECORD_NAME)>=10;"
			//timeout
		}
	]

	var searchTable = [
		'area', 
		'artist',
		'genre',
		'recording',
		'release'
	]
		var structure = {
		"area": [
			'ID_AREA',
			'NAME',
			'TYPE'
		],
		"artist": [
			'ID_ARTIST',
			'NAME',
			'TYPE',
			'GENDER',
			'ID_AREA'
		],
		"artist_genre": [
			'ID_ARTIST',
			'ID_GENRE'
		],
		"genre": [
			'ID_GENRE',
			'NAME',
			'COUNT'
		],
		"medium": [
			'ID_MEDIUM',
			'FORMAT',
			'ID_RELEASE'
		],
		"recording": [
			'ID_RECORDING',
			'NAME',
			'LENGTH'
		],
		"release": [
			'ID_RELEASE',
			'NAME'
		],
		"track": [
			'ID_TRACK',
			'POSITION',
			'ID_MEDIUM',
			'ID_RECORDING'
		]
	}

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
		var id = s($(row).attr('data-id'))
		var table = s($(row).attr('data-table'))
		var idCol = s($(row).attr('data-id-col'))

		$(row).slideUp();
		alert("PLEASE UNCOMMENT ME!\nDELETE FROM " + table + " WHERE " + idCol + " = '" + id + "'")
		// TODO Uncomment
		//sendSQLRequest("DELET FROM " + table + " WHERE " + idCol + " = '" + id + "'")
	})

	$('.tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	$("#fullscreen-button").click(function (e) {
		e.preventDefault()
		toFullscreen()
	})

	$("#fullscreen-close").click(function (e) {
		e.preventDefault()
		closeFullscreen()
	})

	$("#insert-form").submit(function (event) {
		event.preventDefault()

		var table = s($("#insert-form").attr('data-table-name'))
		var keys = []
		var values = []
		
		$("#insert-form input").each(function () {
			keys.push($(this).attr('data-column-name'))
			values.push(s($(this).val()))
		})

		console.log(values)

		values = values.map(function (value) {
			return (value === '') ? "null" : "'"+ value +"'"
		})

		console.log(values)
		
		alert("PLEASE UNCOMMENT ME!\nINSERT INTO "+ table + '( '+ keys.join(', ') +' ) VALUES ( ' + values.join(', ') + ' )')
		// TODO Uncomment
		//sendSQLRequest("INSERT INTO "+ table + '( '+ keys.join(', ') +' ) VALUES ( ' + values.join(', ') + ' )')
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
		createInsertForm(tableName)

		$("#insert-div").slideDown()

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
				html += '<tr title="ID: '+data[i][idCol]+'" class="result-links" href="#" data-table="'+tableName+'" data-id-col="'+idCol+'" data-id="'+data[i][idCol]+'" data-name="'+name+'">'
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

	function createInsertForm(table) {
		var columns = structure[table]
		var html = ""

		$("#insert-form").attr('data-table-name', table)

		for(var i = 0, l = columns.length; i < l; i++) {
			html += '<div class="form-group">'
			html += '<label class="sr-only" for="search-input">'+ columns[i] +'</label>'
			html += '<input ' + ((columns[i].toLowerCase() === "name") ? "required" : "") + ' type="text" placeholder="'+ columns[i] +'" id="insert-form-'+ columns[i] +'" class="form-control" data-column-name="'+ columns[i] +'">'
			html += '</div> '
		}

		html += '<button class="btn btn-primary" type="submit">Insert <span class="glyphicon glyphicon-save"></span></button>'

		$("#insert-form").html(html)
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

	var uid = 0

	function createTabs(tables) {
		function createTabs(tables, tabs, divs) {
			if(tables.length > 1) {
				var htmlTabs = ''
				var htmlDivs = ''
				for(var i = 0; i < tables.length; i++) {
					if(i === 0) {
						htmlTabs += '<li class="active">'
						htmlDivs += '<div class="tab-pane active table-'+tables[i]+'" id="table-'+tables[i]+ '-' + uid +'"></div>'
					} else {
						htmlTabs += '<li>'
						htmlDivs += '<div class="tab-pane table-'+tables[i]+'" id="table-'+tables[i]+ '-' + uid +'"></div>'
					}

					htmlTabs += '<a href="#table-'+tables[i]+ '-' + uid +'" data-toggle="tab">'+firstCap(tables[i])+'</a></li>'
					htmlTabs += '</li>'

					uid++
				}

				$(tabs).html(htmlTabs)
				console.log($(divs), htmlDivs)
				$(divs).html(htmlDivs)
			} else {
				debug.write("Warning: trying to create one tab.")
			}
		}

		createTabs(tables, "#main-tabs", "#main-output")
		createTabs(tables, "#fullscreen-tabs", "#fullscreen-content")
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

	function toFullscreen() {
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