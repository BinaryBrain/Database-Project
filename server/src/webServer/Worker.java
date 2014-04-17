package webServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Worker extends Thread {
	private Socket clientSocket;
	
	public Worker(Socket clientSocket) {
		this.clientSocket = clientSocket;
	}
	
	public void run() {
        System.out.println("Worker is running...");
        
        try {
        	InputStream request = clientSocket.getInputStream();

        	ArrayList<String> header = getHeader(request);
        	
        	getRequestedFile(header.get(0));
        	
			PrintWriter out = new PrintWriter(clientSocket.getOutputStream());
			out.println(header);
			out.close();
        	
        	System.out.println("Page sent");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
	
	public String getRequestedFile(String requestLine) {
		Pattern pattern = Pattern.compile("^.*\\s+(.*)\\s+.*$");
		Matcher matcher = pattern.matcher(requestLine);
		
		if(matcher.find()) {
			System.out.println(matcher.group(1));
		}
		
		return "";
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
