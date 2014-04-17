package webServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.ArrayList;

public class Worker extends Thread {
	private Socket clientSocket;
	
	public Worker(Socket clientSocket) {
		this.clientSocket = clientSocket;
	}
	
	public void run() {
        System.out.println("Hello! I'm a Worker!");
        
        try {
        	InputStream request = clientSocket.getInputStream();

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
        	
			PrintWriter out = new PrintWriter(clientSocket.getOutputStream());
			out.println(header);
			out.close();
        	in.close();
        	
        	System.out.println("Page sent");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
