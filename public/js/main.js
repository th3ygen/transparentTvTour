let config = {};
let pins = [];

const slideshow = document.querySelector('.banner-slideshow');
let slideshowImgs = [];

let videoPlaylistIndex = 0;
let videoPlaylist = [];

const briefOpt = {
    header: '',
    subheader: '',
    description: ''
};

(async () => {
    // load config file
    config = await snippet.ajax({
        url: 'http://localhost:8080/conf',
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    });

    // load pins
    pins = (await snippet.ajax({
        url: 'http://localhost:8080/pins',
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    })).pins;

    // get playlist url
    videoPlaylist = await snippet.ajax({
        url: 'http://localhost:8080/info/vid/corporate',
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    });

    document.querySelector('.video').setAttribute('src', `http://localhost:8080${videoPlaylist[videoPlaylistIndex]}`);

    (loop = async () => {
        await briefAnim.finished;

        autoScrollPause = false;

        let l;
        if (slideshowImgs.length > 0) {
            let x = 0;
            l = setInterval(() => {
                slideshow.style.backgroundImage = `url('.${slideshowImgs[x]}')`;
                x = ++x % slideshowImgs.length;
            }, config.imageSlideshowInterval);
        }

        await snippet.sleep(briefOpt.duration);

        clearInterval(l);
        briefAnim.reverse();
        briefAnim.play();

        await briefAnim.finished;

        briefAnim.reverse();
        briefAnim.pause();
        briefAnim.reset();

        autoScrollPause = true;
        $('.banner-body').stop();

        document.querySelector('.banner-header').style.opacity = 0;

        await anime({
            targets: '.video',
            opacity: 1,
            easing: 'linear',
            duration: 2000
        }).finished;

        return loop();
    })();
})();

function onVideoEnd() {
    videoPlaylistIndex = ++videoPlaylistIndex % videoPlaylist.length;
    document.querySelector('.video').setAttribute('src', `http://localhost:8080${videoPlaylist[videoPlaylistIndex]}`);
}

let autoScrollPause = true;
async function autoScroll() {
    if (autoScrollPause) {
        await snippet.sleep(500);
        return autoScroll();
    }

    await snippet.sleep(3000);

    await $('.banner-body').animate({
        scrollTop: $('.banner-body').prop('scrollHeight')
    }, {
        duration: ($('.banner-body').prop('scrollHeight') / config.descriptionScrollSpeed) * 1000,
        easing: 'linear'
    }).promise();

    await snippet.sleep(3000);

    await $('.banner-body').animate({
        scrollTop: 0
    }, 1000).promise();

    autoScroll();
}

async function brief(content) {
    slideshowImgs = await snippet.ajax({
        url: `http://localhost:8080/info/img/${content.label}`,
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    });

    if (slideshowImgs.length > 0) {
        slideshow.style.backgroundImage = `url('http://localhost:8080${slideshowImgs[0]}')`;
    }

    briefOpt.duration = content.duration;

    $('.banner-title').text(content.header);
    $('.banner-subtitle').text(content.subheader);

    $('.banner-description').text(content.description);

    startBriefAnim();
}

autoScroll();

mqttClient.on('message', (topic, message) => {
    if (topic === 'loc-trigger') {
        const content = pins.find(q => (q.label === message.toString()))

        if (content) {
            brief(content);
        }
    }
    
});
