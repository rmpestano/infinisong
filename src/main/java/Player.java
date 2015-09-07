import javazoom.jl.decoder.Bitstream;
import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.player.advanced.AdvancedPlayer;
import javazoom.jl.player.advanced.PlaybackEvent;
import javazoom.jl.player.advanced.PlaybackListener;

import javax.media.Manager;
import javax.media.NoProcessorException;
import javax.media.bean.playerbean.MediaPlayer;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by pestano on 06/09/15.
 */
public class Player {



    public static void main(String[] args) throws IOException, NoProcessorException, JavaLayerException {
        javax.media.Player p = Manager.createProcessor(new URL(""));
        AdvancedPlayer player = new AdvancedPlayer(null);

        Bitstream bitstream;



    }
}
