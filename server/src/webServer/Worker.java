package webServer;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;

public class Worker extends Thread {
	private Socket clientSocket;
	
	public Worker(Socket clientSocket) {
		this.clientSocket = clientSocket;
	}
	
	public void run() {
        System.out.println("Hello! I'm a Worker!");
        try {
			PrintWriter out = new PrintWriter(clientSocket.getOutputStream());
			out.println("Hi from the server!");
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
