const briefAnim = anime.timeline();

document.querySelector('.banner-slideshow').style.opacity = 0;

briefAnim.add({
    targets: '.banner-bg',
    height: '100vw',
    width: '100vw',
    duration: 3000,
    delay: 1000
});
briefAnim.add({
    targets: '.banner',
    height: '100vh',
    width: '35%',
    duration: 2000,
    easing: 'easeOutQuint',
    delay: 0
}, 5000);
briefAnim.add({
    targets: '.banner-header',
    top: '100px',
    fontSize: '1.5rem',
    easing: 'easeOutQuint',
    duration: 2000
}, 5000);
briefAnim.add({
    targets: '.banner-title',
    fontSize: '2.5rem',
    easing: 'easeOutQuint',
    duration: 2000
}, 5000);
briefAnim.add({
    targets: '.banner-body',
    opacity: 1,
    easing: 'easeOutQuint',
    duration: 2000
}, 7000);
briefAnim.add({
    targets: '.banner-slideshow',
    opacity: 1,
    easing: 'easeOutQuint',
    duration: 2000
}, 7000);

briefAnim.pause();
briefAnim.reset();

async function startBriefAnim() {
    await anime({
        targets: '.video',
        opacity: 0,
        easing: 'linear',
        duration: 2000
    }).finished;

    document.querySelector('.banner-header').style.opacity = 1;

    briefAnim.play();
}
