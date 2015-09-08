
function Player (url, initialPosition) {
    if(!initialPosition){
        initialPosition = 0;
    }
    this.position = initialPosition;
    this.ac = new (window.AudioContext || webkitAudioContext)();
    this.url = url;
    var el = document.querySelector('.player');
    this.button = el.querySelector('.button');
    this.track = el.querySelector('.track');
    this.progress = el.querySelector('.progress');
    this.scrubber = el.querySelector('.scrubber');
    this.message = el.querySelector('.message');
    this.gainNode = this.ac.createGain();
    this.bindEvents();
    this.fetch();
}

Player.prototype.bindEvents = function() {
    this.button.addEventListener('click', this.toggle.bind(this));
    this.scrubber.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.onDrag.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
};


Player.prototype.fetch = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        this.decode(xhr.response);
        this.title = xhr.getResponseHeader('title');
        this.artist = xhr.getResponseHeader('artist');
        this.album = xhr.getResponseHeader('album');
        this.year = xhr.getResponseHeader('year');
        this.count = xhr.getResponseHeader('count');
        this.radio = xhr.getResponseHeader('radio');

    }.bind(this);

    xhr.send();
};

Player.prototype.decode = function( arrayBuffer ) {
    this.ac.decodeAudioData(arrayBuffer, function( audioBuffer ) {
        this.message.innerHTML = '';
        this.buffer = audioBuffer;
        this.draw();
        this.play();
    }.bind(this));
};

Player.prototype.connect = function() {
    if ( this.playing ) {
        this.pause();
    }
    this.source = this.ac.createBufferSource();
    this.gainNode.connect(this.ac.destination);
    this.source.connect(this.gainNode);
    this.source.buffer = this.buffer;
};

Player.prototype.play = function( position ) {
    this.connect();
    this.position = typeof position === 'number' ? position : this.position || 0;
    this.startTime = this.ac.currentTime - ( this.position || 0 );
    this.source.start(this.ac.currentTime, this.position);
    this.playing = true;
};

Player.prototype.pause = function() {
    if ( this.source ) {
        this.source.stop(0);
        this.source = null;
        this.position = this.ac.currentTime - this.startTime;
        this.playing = false;
    }
};

Player.prototype.seek = function( time ) {
    if ( this.playing ) {
        this.play(time);
    }
    else {
        this.position = time;
    }
};

Player.prototype.updatePosition = function() {
    this.position = this.playing ?
    this.ac.currentTime - this.startTime : this.position;
    if ( this.position >= this.buffer.duration ) {
        this.position = this.buffer.duration;
        this.pause();
    }
    return this.position;
};

Player.prototype.toggle = function() {
    if ( !this.playing ) {
        this.play();
    }
    else {
        this.pause();
    }
};

Player.prototype.onMouseDown = function( e ) {
    this.dragging = true;
    this.startX = e.pageX;
    this.startLeft = parseInt(this.scrubber.style.left || 0, 10);
};

Player.prototype.onDrag = function( e ) {
    var width, position;
    if ( !this.dragging ) {
        return;
    }
    width = this.track.offsetWidth;
    position = this.startLeft + ( e.pageX - this.startX );
    position = Math.max(Math.min(width, position), 0);
    this.scrubber.style.left = position + 'px';
};

Player.prototype.onMouseUp = function() {
    var width, left, time;
    if ( this.dragging ) {
        width = this.track.offsetWidth;
        left = parseInt(this.scrubber.style.left || 0, 10);
        time = left / width * this.buffer.duration;
        this.seek(time);
        this.dragging = false;
    }
};

Player.prototype.draw = function() {
    var progress = ( this.updatePosition() / this.buffer.duration ),
        width = this.track.offsetWidth;
    if ( this.playing ) {
        this.button.classList.add('fa-pause');
        this.button.classList.remove('fa-play');

    } else {
        this.button.classList.add('fa-play');
        this.button.classList.remove('fa-pause');
    }
    this.progress.style.width = ( progress * width ) + 'px';
    if ( !this.dragging ) {
        this.scrubber.style.left = ( progress * width ) + 'px';
    }
    document.getElementById('title').innerHTML = '&nbsp;<b>' + this.title + '</b>';
    document.getElementById('artist').innerHTML = '&nbsp;<b>'+this.artist + '</b>';
    document.getElementById('album').innerHTML = '&nbsp;<b>'+this.album + '</b>';
    document.getElementById('year').innerHTML = '&nbsp;<b>'+this.year + '</b>';
    var countHtml = '&nbsp;<b>'+this.count + '</b> time';
    if(this.count > 1){
        countHtml = countHtml + 's';
    }
    document.getElementById('count').innerHTML = countHtml;
    document.getElementById('radio').innerHTML = 'Welcome to radio <b>'+this.radio + '</b>';

    requestAnimationFrame(this.draw.bind(this));
};


Player.prototype.volume = function( element ) {
    var volume = element.value;
    var fraction = parseInt(element.value) / parseInt(element.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    volume = fraction * fraction;
    this.gainNode.gain.value = volume;

}



// create a new instance of the player and get things started
