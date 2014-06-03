# User Interface

The user interface is one of the big part of the project. We had a lot of choices to make during the development of the interface.
This section will explain how the interface work and why we made those choices.

## Choices

First of all, we choose to develop the user interface as Web App because it's an easy way to design the interface we want.

## Server Side

The server is a simple multi-threaded HTTP server that also access the EPFL's Oracle Database.

### Why Java

We choose to code it in Java because it's almost the only language we all know well. Another advantage is that it handles pretty well Oracle's database with the JDBC lib. Plus, Java is powered by Oracle too. It had to be well supported and it is.

### Web Server

The web server is pretty simple. It just handles basic HTTP GET requests.

When the server is running, a listener is called. This listener wait for a HTTP request and, when a request is catch, it spawns a worker new thread. Then, it waits for the next request.

The Worker is a little bit more complicated.
First of all, the worker will handle the stream of data comming on the port 80. It will extract the path and GET parameters from the header.
Then, it will try to open the file gave in the path and stream it to the client in the response. The MIME type is automatically detected and sent in the HTTP response headers.
If the requested path is `/do-sql`, the behavior will be different. The worker with try to extarct a SQL query from the GET parameters. Then, it will ask the Database handler to execute the SQL query and to return a JSON with the result (or an error).

### Database Access

The database access is handle by a `Database` class.
It manages the connection and can execute some queries on the Oracle database. To achieve that, we use the JDBC driver.

After executing a query, the response from the Oracle database will be transformed in a JSON.
For instance, if you search an artist called "Flume", the response sent to the client will be:

```
{
   "status":"OK",
   "data":[
      {
         "NAME":"Liza Flume",
         "GENDER":"Female",
         "ID_AREA":0,
         "ID_ARTIST":1057910,
         "TYPE":"Person"
      },
      {
         "NAME":"Flume",
         "GENDER":"Male",
         "ID_AREA":13,
         "ID_ARTIST":835335,
         "TYPE":"Person"
      },
      {
         "NAME":"The Flumes",
         "GENDER":"Other",
         "ID_AREA":0,
         "ID_ARTIST":837196,
         "TYPE":"Other"
      },
      {
         "NAME":"DJ Michael Flume",
         "GENDER":"Other",
         "ID_AREA":0,
         "ID_ARTIST":195126,
         "TYPE":"Other"
      }
   ]
}
```

## Client Side

The client is a web app. So, to access it, you must first, run the java server, and then, access `http://localhost:7123/`.


### How to Use the Interface

The interface is pretty simple and user-friendly.

### Pre-written Queries

Pre-written queries are easily runnable by clicking on buttons on the left of the interface.
Once a button is clicked, the corresponding SQL query is sent to the server and a JSON is returned as a response. This response will be show as a table in the center of the user interface.

### Custom Search

The custom search allows you to search things with a case-insensitive keyword. For instance, if you search `beetroots`, the result `The Bloody Beetroots` will appear.
The request behind it is pretty simple: `SELECT * FROM artist WHERE LOWER(name) LIKE lower('%beetroots%')`.
Note that characters like `%` (percent), `_` (underscore) and `'` (single quote) are escaped.

### Clicable Results

When a non-empty result is displayed, each row can be clicked to show more informations about the choosen result.
When the row is clicked, some tabs will appears to display new results.

### Insertion

For each table displayed, an insertion form will appear. This allows you to add some more data in the database.
If a field is left empty, the value will be `null`.

Note that the line will not directly appears in the already displayed table for technical reason (the ID has to be defined by the database so the row can be clicable).

### Deletion

To delete a data, just click on the red cross on the right of the row.

### Fullscreen mode

Above the results, on the right, a fullscreen button can be clicked to display results on a bigger view. This is pretty practical when the table has a lot of row.