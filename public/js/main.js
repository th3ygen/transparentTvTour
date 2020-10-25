const slideshow = document.querySelector('.banner-slideshow');
let slideshowImgs = [];

let videoPlaylistIndex = 0;
let videoPlaylist = [];

const briefOpt = {
    duration: 2 * 60 * 1000,
    slideInterval: 8000,
    textScrollSpeed: 20,
    header: '',
    subheader: '',
    description: ''
};

(async () => {
    // get playlist url
    videoPlaylist = await snippet.ajax({
        url: 'http://localhost:8080/info/vid/corporate',
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    });

    document.querySelector('.video').setAttribute('src', videoPlaylist[videoPlaylistIndex]);

    (loop = async () => {
        await briefAnim.finished;

        autoScrollPause = false;

        let x = 0;
        const l = setInterval(() => {
            slideshow.style.backgroundImage = `url('.${slideshowImgs[x]}')`;
            x = ++x % slideshowImgs.length;
        }, briefOpt.slideInterval);

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
    document.querySelector('.video').setAttribute('src', videoPlaylist[videoPlaylistIndex]);
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
        duration: ($('.banner-body').prop('scrollHeight') / briefOpt.textScrollSpeed) * 1000,
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
        url: `http://localhost:8080/info/img/${content.fac}`,
        type: 'get',
        contentType: 'application/json; charset=utf-8'
    });

    slideshow.style.backgroundImage = `url('.${slideshowImgs[0]}')`;

    briefOpt.duration = content.duration;
    briefOpt.slideInterval = 10000;
    /* briefOpt.slideInterval = content.slideInterval; */

    $('.banner-title').text(content.header);
    $('.banner-subtitle').text(content.subheader);

    $('.banner-description').text(content.description);

    startBriefAnim();
}

autoScroll();

mqttClient.on('message', (topic, message) => {
    let payload;
    try {
        payload = JSON.parse(message);
    } catch(err) {
        return console.error(err);
    }

    if (topic === 'loc-trigger') {
        if (!(payload.fac && payload.duration && payload.slideInterval)) {
            return console.error('missing or invalid attribute in payload', payload);
            
        }

        brief(payload);

        /* if (payload.textScrollSpeed) {
            briefOpt.textScrollSpeed = payload.textScrollSpeed;
        } */
    }
});
