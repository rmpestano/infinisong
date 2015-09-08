package com.infinisong.infra;

import com.infinisong.model.Song;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Created by pestano on 07/09/15.
 */
@WebServlet(urlPatterns = "/listen",loadOnStartup = 1)
public class InfiniServlet extends HttpServlet {

    File musicFile;
    Song song;

    @Override
    public void init() throws ServletException {
        String location = Thread.currentThread().getContextClassLoader().getResource("nebel.mp3").getPath();
         musicFile = new File(location);
         song = new Song(location);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int totallen = 0;
        InputStream is = null;
        OutputStream os = response.getOutputStream();
        try {
            response.addHeader("Content-Disposition", "inline; filename=" + musicFile.getName());
            response.setHeader("Accept-Ranges", "bytes");
            response.addHeader("title",song.getTitle());
            response.addHeader("artist",song.getArtist());
            response.addHeader("album",song.getAlbum());
            response.addHeader("year",song.getYear());
            response.addHeader("count","2");//TODO get number of times played from database (query by artist and title)
            response.addHeader("radio","Infini Radio");//TODO get number of times played from database (query by artist and title)
            //String range = request.getHeader("Range");

            int start = 0;
            long end = 0;
            is = new BufferedInputStream(new FileInputStream(musicFile));
                response.setContentType("audio/mpeg");
                start = 0;
                end = musicFile.length() - 1;
                for (int i = start; i < end + 1; i++) {
                    totallen++;
                    os.write(is.read());
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
