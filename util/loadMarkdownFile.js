enMdPath = typeof enMdPath != 'undefined' && enMdPath ? enMdPath : './README_en.md', cnMdPath = typeof cnMdPath != 'undefined' && cnMdPath ? cnMdPath : './README.md';

function loadMarkdownFile(callback = () => { hljs.initHighlightingOnLoad(); }) {
    // console.trace();

    /* 加载写人 markdown 文件 */
    [...document.querySelectorAll(".markdown-body")].map(function (dom) {
        fetch(dom.getAttribute("data-mdfile")).then(function (response) {
            return response.text();
        }).then(function (r) {
            dom.innerHTML = marked.marked(r);
        }).then(callback);

    });

    //cssFilePath = "./libraries/markdown.css",
    // /* 把所有markdown class 的，全部指定id，为后面提升markdowm.css 提升优先级作准备 */ /** 老版本主页用 */
    // var markdownList = [...document.querySelectorAll('.markdown-body')].map(function (dom) {
    //     console.log(dom);
    //     if (!dom.hasAttribute('id')) {
    //         do {
    //             var domId = 'markdown_body_' + Math.floor(Math.random() * 100000);
    //             console.log(domId);
    //         } while (document.querySelectorAll('#' + domId).length != 0)
    //         dom.setAttribute('id', domId);
    //     } else {
    //         var domId = dom.id;
    //     }
    //     return domId;
    // });
    // /* 把markdown.css 的选择器全部定位到内部的id上，提升优先级 */
    // fetch(cssFilePath).then(function (response) {
    //     return response.text();
    // }).then(function (r) {
    //     var style = document.createElement('style');

    //     r = r.replace(/\.markdown-body([^{]+)/g, markdownList.map(function (id) {
    //         return '#main li.active>ul[column] > li#' + id + ' $1 '
    //     }).join(','));

    //     // console.log(r);
    //     style.innerHTML = (r);
    //     document.querySelector('body').appendChild(style);
    // });
    /** 不active 的 隐藏，active 的不隐藏 */
    // markdownList.map(function (id) {
    //     console.log(id);
    //     var style = document.createElement('style');
    //     style.innerHTML = '#main #' + id + '{max-height:0;overflow:hidden;}' + '#main li.active #' + id + '{max-height:none;overflow: auto;}';
    //     document.getElementsByTagName('body')[0].appendChild(style);
    // });

    var arg = [...arguments];
    arg.map(a => a());
    return this;
}

loadReadmeFile = () => {
    let p = document.createElement('p');
    p.id = 'readme' + String(Math.random()).replace(/\./, ''),
        p.classList.add('markdown-body'),
        p.setAttribute('data-mdfile',
            ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? enMdPath : cnMdPath
        );
    if (document.body.clientHeight > document.body.clientWidth) {
        p.classList.add('mob');
    }

    let style = document.createElement('style');
    style.innerHTML = `#${p.id}{
margin: 0;
max-height: 100vh;
max-width: 48vw;
min-width: 400px;

padding: 1em;
overflow: scroll;
position: fixed;
right: 0;
top: 0;
z-index: 0;
background-color: #ffffffcc;

white-space: inherit;
word-break: break-all;
}

#${p.id}.mob {
max-width: unset;
max-height: unset;
min-width: unset;
width: 80vw;
position: relative;
left: 50%;
transform: translate(-50%,0);
overflow: auto;
}

`;

    [p, style].every(dom => document.body.appendChild(dom));
    loadMarkdownFile(() => {
        hljs.initHighlightingOnLoad();
    });
}