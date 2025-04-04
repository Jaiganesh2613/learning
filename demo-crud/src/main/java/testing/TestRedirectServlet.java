package testing;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;

public class TestRedirectServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(TestRedirectServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {


        RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/jsp/desktop/dashboard.jsp");

        if (rd == null) {
            System.out.println("WEB-7529 TestRedirectServlet: RequestDispatcher is NULL!");
            resp.getWriter().write("RequestDispatcher is NULL. Check file path.");
            return;
        }

        LOG.info("WEB-7529 TestRedirectServlet: Forwarding request to " + rd.toString());

        rd.forward(req, resp);
    }
}




