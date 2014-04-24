package webServer;

import java.io.*;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Worker extends Thread {
	private final static String VIEW_FOLDER = "../client/view";
	private Socket clientSocket;
	
	public Worker(Socket clientSocket) {
		this.clientSocket = clientSocket;
	}
	
	public void run() {
        System.out.println("Worker #"+Thread.currentThread().getId()+" is running...");
        
        try {
        	InputStream request = clientSocket.getInputStream();
        	
        	ArrayList<String> header = getHeader(request);
        	
        	URL url = getURL(header.get(0));
        	
        	String filename = url.getPath();
        	Map<String, String> parameters = getParameters(url);
        	
        	
        	sendResponse(filename, parameters);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
	
	public static Map<String, String> getParameters(URL url) throws UnsupportedEncodingException {  
		String query = url.getQuery();
		
	    Map<String, String> map = new HashMap<String, String>();
	    
		if(query != null) {
			query = URLDecoder.decode(query, "UTF-8" );
		    String[] params = query.split("&");
		    
		    for (String param : params) {
		        String name = param.split("=")[0];
		        String value = param.split("=")[1];
		        map.put(name, value);  
		    }
		}
	    
	    return map;
	}
	
	private void sendHeaders(OutputStream res, String mime, String status) {
		PrintWriter writer = new PrintWriter(res);
		
		writer.print("HTTP/1.1 "+status+"\r\n");
		writer.print("Content-Type: "+mime+"\r\n");
		writer.print("Cache-Control: no-cache"+"\r\n");
		writer.print("Pragma: no-cache"+"\r\n");
		
		writer.print("\r\n"); // DO NOT REMOVE THIS LINE
		
		writer.flush();
	}
	
	private void sendResponse(String path, Map<String, String> parameters) {
		try {
			OutputStream res = clientSocket.getOutputStream();
			// Handleing different behavior
			if(path.equals("/")) {
				path = "/index.html";
			}
			
			if(path.equals("/do-sql")) {
				// TODO Sanitize and Execute SQL request 
				String sql = parameters.get("sql");
				System.out.println(sql);
				String json = "{\"data\": ["+
				 		"{ \"name\": \"Change\", \"artist\": \"Flume\", \"album\": \"Flume\", \"length\": \"2\\\"30'\" },"+
				 		"{ \"name\": \"Belispeak\", \"artist\": \"Purity Ring\", \"album\": \"Shrines\", \"length\": \"2\\\"59'\" },"+
				 		"{ \"name\": \"When I'm Small\", \"artist\": \"Phantogram\", \"album\": \"Eyelid Movies\", \"length\": \"4\\\"11'\" },"+
				 		"{ \"name\": \"More Than You (Unplugged Version)\", \"artist\": \"Koven\", \"length\": \"3\\\"54'\" }"+
				 	"]}"; // TODO json = DB response
				
				sendHeaders(res, "application/json", "200 OK");
				
				PrintWriter writer = new PrintWriter(res);
	    		writer.println(json);
	    		writer.close();
			} else {
				path = VIEW_FOLDER + path;	
	
		    	try {
		        	File file = new File(path);
		        	String mime = getMIME(file);
		        	
		        	FileInputStream fis = new FileInputStream(file);
		        	
		        	byte [] bytearray  = new byte [(int) file.length()];
		        	BufferedInputStream bis = new BufferedInputStream(fis);
		        	
		        	// sending HTTP headers
		        	sendHeaders(res, mime, "200 OK");
		        	
		        	// Sending file
		            int count;
		            while ((count = bis.read(bytearray)) > 0) {
		                res.write(bytearray, 0, count);
		            }
		    	} catch (FileNotFoundException e) {
		    		// Error 404: Page not Found
		        	sendHeaders(res, "text/plain", "404 Not Found");
		        	
		    		PrintWriter writer = new PrintWriter(res);
		    		writer.println("Error 404. Page not found.");
		    		System.out.println("Error 404. ("+path+")");
		    		writer.close();
		    	}	
			}
			
			res.flush();
			clientSocket.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// Extract path and parameters from HTTP header
	private URL getURL(String requestLine) throws MalformedURLException {
		Pattern pattern = Pattern.compile("^.*\\s+(.*)\\s+.*$");
		Matcher matcher = pattern.matcher(requestLine);
		
		URL url = null;
		
		if(matcher.find()) {
			String get = matcher.group(1);
			url = new URL("http://localhost:7123"+get);
		}
		
		return url;
	}

	private String getMIME(File file) {
		return URLConnection.guessContentTypeFromName(file.getName());
	}
	
	// Get HTTP Header from Client
	private ArrayList<String> getHeader(InputStream request) throws IOException {
		BufferedReader in = new BufferedReader(new InputStreamReader(request));
		
		int input;
    	String header = "";
    	boolean endOfHeader = false;
    	
    	while (!endOfHeader) {
    		input = in.read();
    		
			if(input == -1) {
				endOfHeader = true;
			}
			
			header += (char) input;
			
			int l = header.length();
			
    		if(l >= 4 &&
    				header.charAt(l-4) == '\r' && header.charAt(l-3) == '\n' &&
					header.charAt(l-2) == '\r' && header.charAt(l-1) == '\n') {
            	
            	endOfHeader = true;
    		}
    	}
    	
    	return new ArrayList<String>(Arrays.asList(header.split("\\r?\\n")));
	}
}
