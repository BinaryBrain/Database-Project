package webServer;

import java.io.IOException;

public class WebServer {
	final private static int PORT_NUMBER = 7123;
	
	public static void main(String[] args) {
		Listener listener = new Listener(PORT_NUMBER);
		
		try {
			listener.listen();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
