<%@ page import="java.sql.*, java.util.*, org.json.*" %>

<%
    // Database connection details
    String url = "jdbc:mysql://localhost:3306/demo_test";
    String user = "root";
    String password = "jaiganesh";

    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;
    List<String> reasons = new ArrayList<>();

    try {
        Class.forName("com.mysql.cj.jdbc.Driver"); // Load MySQL Driver
        conn = DriverManager.getConnection(url, user, password);

        // Corrected Query: Fetch JSON from the 'value' column where config_key is 'account_delete_reason'
        String query = "SELECT value FROM config WHERE config_key = 'account_delete_reason'";
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();

        if (rs.next()) {
            String jsonString = rs.getString("value");

            // Parse JSON string into Java List
            JSONArray jsonArray = new JSONArray(jsonString);
            for (int i = 0; i < jsonArray.length(); i++) {
                reasons.add(jsonArray.getString(i));
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (rs != null) rs.close();
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
    }
%>

<div class="panel hide" id="step3">
    <div class="panel-header">
        <h5>Why are you leaving?</h5>
    </div>
    <div class="panel-body">
        <div class="form-group reason">
            <label for="reasonSelect">Why are you deleting your account?</label>
            <select id="reasonSelect">
                <% for (String reason : reasons) { %>
                <option value="<%= reason %>"><%= reason %></option>
                <% } %>
            </select>
        </div>
        <div class="form-group hide" id="other-reason">
            <textarea id="otherReasonText" placeholder="Tell us why..." maxlength="250"></textarea>
        </div>
    </div>
    <div class="panel-footer">
        <button onclick="moveNextStep(3)">Continue</button>
    </div>
</div>
