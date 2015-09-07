package com.infinisong.infra;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Paths;
import java.util.logging.Logger;

/**
 * Created by pestano on 07/09/15.
 */
@WebServlet(urlPatterns = "/listen",loadOnStartup = 1)
public class StreamServlet extends HttpServlet {

    File musicFile;

    @Override
    public void init() throws ServletException {
         musicFile = new File(Thread.currentThread().getContextClassLoader().getResource("nebel.mp3").getPath());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Logger.getLogger(getClass().getName()).info("DO GET");
        int totallen = 0;
        InputStream is = null;
        OutputStream os = response.getOutputStream();
        try {
            response.addHeader("Content-Disposition", "attachment; filename=" + musicFile.getName());
            response.setHeader("Accept-Ranges", "bytes");
            String range = request.getHeader("Range");
            if(range == null){
                range = "range=1";
            }
            int start = 0;
            long end = 0;
            is = new BufferedInputStream(new FileInputStream(musicFile));
            if (range != null) {
                response.setContentType("audio/mpeg");
                String[] split = range.split("=");
                String[] rangeValues = split[1].split("-");
                //start = Integer.valueOf(rangeValues[0]);
                start = 0;
                if (rangeValues.length > 1) {
                    end = Long.valueOf(rangeValues[1]);
                } else {
                    end = musicFile.length() - 1;
                }
                for (int i = start; i < end + 1; i++) {
                    totallen++;
                    os.write(is.read());
                }
            }
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                }
            }
        }
    }
}
