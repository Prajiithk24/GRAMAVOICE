import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDB {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require";
        String user = "postgres.nffwpckgcrwaljmpxcef";
        String password = "Prajubhai143";
        try {
            System.out.println("Connecting...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Success! Connected to database.");
            conn.close();
        } catch (SQLException e) {
            System.out.println("Failed!");
            e.printStackTrace();
        }
    }
}
