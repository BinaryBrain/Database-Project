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
	// JDBC driver name and database URL
	static final String JDBC_DRIVER = "oracle.jdbc.driver.OracleDriver";
	// jdbc:oracle:thin:@//<host>:<port>/<service_name> 
	static final String DB_URL = "jdbc:oracle:thin:@//icoracle.epfl.ch:1521/srso4.epfl.ch";

	// Database credentials
	static final String USER = "db2014_g03";
	static final String PASS = "MysteriousNinjaRiders";

	public static void main(String[] args) {
		Connection conn = null;
		Statement stmt = null;
		try {
			// STEP 2: Register JDBC driver
			Class.forName(JDBC_DRIVER);

			// STEP 3: Open a connection
			System.out.println("Connecting to database...");
			conn = DriverManager.getConnection(DB_URL, USER, PASS);

			// STEP 4: Execute a query
			System.out.println("Creating statement...");
			stmt = conn.createStatement();
			String sql;
			sql = "SELECT * FROM Area A WHERE A.ID_AREA=37830";
			ResultSet rs = stmt.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData();
			
			int columnCount = rsmd.getColumnCount();
			
			Map<String, String> columnNames = new HashMap<String, String>();
			for (int i = 0; i < columnCount; i++) {
				columnNames.put(rsmd.getColumnName(i+1), rsmd.getColumnClassName(i+1));
			}

			// STEP 5: Extract data from result set
			while (rs.next()) {
				// Retrieve by column name

				for(Entry<String, String> column : columnNames.entrySet()) {
				    String key = column.getKey();
				    String value = column.getValue();
				    
					if (Class.forName(value).equals(BigDecimal.class)) {
						int integer = rs.getInt(key);
						System.out.println(key + " (Int): " + integer);
					} else if (Class.forName(value).equals(String.class)) {
						String str = rs.getString(key);
						System.out.println(key + " (String): " + str);
					}
				}
			}
			// STEP 6: Clean-up environment
			rs.close();
			stmt.close();
			conn.close();
		} catch (SQLException se) {
			// Handle errors for JDBC
			se.printStackTrace();
		} catch (Exception e) {
			// Handle errors for Class.forName
			e.printStackTrace();
		} finally {
			// finally block used to close resources
			try {
				if (stmt != null)
					stmt.close();
			} catch (SQLException se2) {
			}// nothing we can do
			try {
				if (conn != null)
					conn.close();
			} catch (SQLException se) {
				se.printStackTrace();
			}// end finally try
		}// end try
		System.out.println("Goodbye!");
	}// end main
}
