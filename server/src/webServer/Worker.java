package webServer;

import java.io.*;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.WatchEvent.Kind;
import java.nio.file.WatchEvent.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
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
        	String parameters = url.getQuery();
        	
        	sendResponse(filename);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
	
	public void sendHeaders(OutputStream res, String mime, String status) {
		PrintWriter writer = new PrintWriter(res);
		
		writer.print("HTTP/1.1 "+status+"\r\n");
		writer.print("Content-Type: "+mime+"\r\n");
		writer.print("Cache-Control: no-cache"+"\r\n");
		writer.print("Pragma: no-cache"+"\r\n");
		
		writer.print("\r\n");
		
		writer.flush();
		//writer.println("Content-Length	3513");
	}
	
	public void sendResponse(String path) {
		if(path.equals("/")) {
			path = "/index.html";
		}
		
		path = VIEW_FOLDER + path;	
		
		try {
			OutputStream res = clientSocket.getOutputStream();
	    	
	    	try {
	        	File file = new File(path);
	        	String mime = getMIME(file);
	        	
	        	FileInputStream fis = new FileInputStream(file);
	        	
	        	byte [] bytearray  = new byte [(int) file.length()];
	        	BufferedInputStream bis = new BufferedInputStream(fis);
	        	
	        	sendHeaders(res, mime, "200 OK");
	        	
	            int count;
	            while ((count = bis.read(bytearray)) > 0) {
	                res.write(bytearray, 0, count);
	            }
	    	} catch (FileNotFoundException e) {
	        	sendHeaders(res, "text/plain", "404 Not Found");
	        	
	    		PrintWriter writer = new PrintWriter(res);
	    		writer.println("Error 404. Page not found.");
	    		System.out.println("Error 404. ("+path+")");
	    		writer.close();
	    	}
		    
			res.flush();
			clientSocket.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public URL getURL(String requestLine) throws MalformedURLException {
		Pattern pattern = Pattern.compile("^.*\\s+(.*)\\s+.*$");
		Matcher matcher = pattern.matcher(requestLine);
		
		URL url = null;
		
		if(matcher.find()) {
			String get = matcher.group(1);
			url = new URL("http://localhost:7123"+get);
		}
		
		return url;
	}

	public String getMIME(File file) {
		return URLConnection.guessContentTypeFromName(file.getName());
	}
	
	public ArrayList<String> getHeader(InputStream request) throws IOException {
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
