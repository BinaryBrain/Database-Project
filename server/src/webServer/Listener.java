package webServer;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Listener {
	private ServerSocket socket;
	
	Listener(int port) {
		try {
			socket = new ServerSocket(port);
			System.out.println("Listening on port " + port + " (try http://localhost:" + port + "/)");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void listen() throws IOException {
		while(true) {
			Socket clientSocket = socket.accept();
			System.out.println("New connection...");
			
			Worker worker = new Worker(clientSocket);
			worker.start();
		}
	}
}
