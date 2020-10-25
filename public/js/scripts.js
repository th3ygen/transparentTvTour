const snippet = {
    sleep: (ms) => (new Promise((r,j) => (setTimeout(() => r(), ms)))),
    ajax: opt => (new Promise((resolve, reject) => $.ajax(opt).done(resolve).fail(reject)))
};
