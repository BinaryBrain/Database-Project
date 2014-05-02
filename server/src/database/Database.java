package database;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLSyntaxErrorException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.print.attribute.standard.Finishings;

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
			e.getMessage(); // TODO send to client
		}
	}
	
	public synchronized static Database getInstance() throws SQLException {
		if(instance == null) {
		   instance = new Database();
		}
		return instance;
	}
	
	// TODO Return stuff
	@SuppressWarnings("finally")
	public synchronized String executeQuery(String sqlQuery) throws SQLException {
		System.out.println("Executing: "+sqlQuery);
		stmt = conn.createStatement();
		String sql;
		sql = sqlQuery;
		
		String json = "{";
		
		try {
			ResultSet rs = stmt.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData();
			
			int columnCount = rsmd.getColumnCount();
			
			Map<String, String> columnNames = new HashMap<String, String>();
			for (int i = 0; i < columnCount; i++) {
				columnNames.put(rsmd.getColumnName(i+1), rsmd.getColumnClassName(i+1));
			}
			
			System.out.println("Extracting...");
			
			json += "\"status\": \"OK\","+
			"\"data\": [";
			
			boolean firstEntry = true;
			// Extract data from result set
			while (rs.next()) {
				// Retrieve by column name
				if(!firstEntry) {
					json += ", ";
				} else {
					firstEntry = false;
				}
				
				json += "{";
				
				boolean firstCol = true;
				
				for(Entry<String, String> column : columnNames.entrySet()) {
				    String colName = column.getKey();
				    String type = column.getValue();
				    
				    if(!firstCol) {
						json += ", ";
					} else {
						firstCol = false;
					}
				    
					try {
						if (Class.forName(type).equals(BigDecimal.class)) {
							int value = rs.getInt(colName);
							json += "\""+s(colName)+"\": "+value;
						} else if (Class.forName(type).equals(String.class)) {
							String value = rs.getString(colName);
							json += "\""+s(colName)+"\": \""+s(value)+"\"";
							//System.out.println(key + " (String): " + str);
						}
					} catch (ClassNotFoundException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				
				json += "}";
			}
			
			json += "]";
			
			System.out.println("Done.");
			
			rs.close();
			stmt.close();
		} catch (SQLSyntaxErrorException e) {
			System.out.println(e.getMessage());
			json += "\"status\": \"Error\","+"\"error\": \""+s(e.getMessage().trim())+"\"";
		} finally {
			json += "}";
			
			return json;
		}
	}
	
	public String s(String str) {
		return str.replaceAll("\"","\\\\\"");
	}
}
