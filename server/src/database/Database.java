package database;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class Database {
	private static Database instance = null;
	// JDBC driver name and database URL
	static final String JDBC_DRIVER = "oracle.jdbc.driver.OracleDriver";
	// jdbc:oracle:thin:@//<host>:<port>/<service_name> 
	static final String DB_URL = "jdbc:oracle:thin:@//icoracle.epfl.ch:1521/srso4.epfl.ch";

	// Database credentials
	static final String USER = "db2014_g03";
	static final String PASS = "MysteriousNinjaRiders";

	private Connection conn;
	private Statement stmt;
	
	private Database() throws SQLException {
		// Register JDBC driver
		try {
			Class.forName(JDBC_DRIVER);

			// Open a connection
			System.out.println("Connecting to database...");
			conn = DriverManager.getConnection(DB_URL, USER, PASS);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static Database getInstance() throws SQLException {
		if(instance == null) {
		   instance = new Database();
		}
		return instance;
	}
	
	// TODO Return stuff
	public void executeQuery(String sqlQuery) throws SQLException {
		stmt = conn.createStatement();
		String sql;
		sql = sqlQuery;
		ResultSet rs = stmt.executeQuery(sql);
		ResultSetMetaData rsmd = rs.getMetaData();
		
		int columnCount = rsmd.getColumnCount();
		
		Map<String, String> columnNames = new HashMap<String, String>();
		for (int i = 0; i < columnCount; i++) {
			columnNames.put(rsmd.getColumnName(i+1), rsmd.getColumnClassName(i+1));
		}
	
		// Extract data from result set
		while (rs.next()) {
			// Retrieve by column name
	
			for(Entry<String, String> column : columnNames.entrySet()) {
			    String key = column.getKey();
			    String value = column.getValue();
			    
				try {
					if (Class.forName(value).equals(BigDecimal.class)) {
						int integer = rs.getInt(key);
						System.out.println(key + " (Int): " + integer);
					} else if (Class.forName(value).equals(String.class)) {
						String str = rs.getString(key);
						System.out.println(key + " (String): " + str);
					}
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

		rs.close();
		stmt.close();
	}
}
