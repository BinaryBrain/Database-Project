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

### How to Use the Interface

### Pre-written Requests

### Custom Search

### Clicable Results

### Insertion

### Deletion