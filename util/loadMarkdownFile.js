enMdPath = typeof enMdPath != 'undefined' && enMdPath ? enMdPath : './README_en.md', cnMdPath = typeof cnMdPath != 'undefined' && cnMdPath ? cnMdPath : './README.md';
mdtempletsPath = typeof mdtempletsPath != 'undefined' && mdtempletsPath ? mdtempletsPath : './mdTemplets';

mdTempletsList = [
    'links_cn', 'links_en',
    'ver_links_cn', 'ver_links_en',
    'thanks'];
mdTempletsListReg = new RegExp('(' + mdTempletsList.map(word => `(${word})`).join('|') + ')', 'g');
console.log(mdTempletsListReg);



function mdTempletsInsert(dom) {
    [...dom.querySelectorAll('*')].map(d => {
        let match = (d.innerText.match(mdTempletsListReg));
        if (match && d.children.length == 0) {
            d.setAttribute('data-md-templet', match[0]);
        }
    });
    mdTempletsList.map(filename => {
        let fileUrl = mdtempletsPath + '/' + filename + '.md';
        let reg = new RegExp(`<#${filename}#>`, 'g');
        if ([...dom.querySelectorAll(`[data-md-templet=${filename}]`)].some(d => d.innerText.match(reg))) {
            fetch(fileUrl).then(response => response.text()).then(r => {
                console.log(fileUrl, '\n', r);
                [...dom.querySelectorAll(`[data-md-templet=${filename}]`)].map(d => {
                    let match = d.innerText.match(reg);
                    console.log('match!!', match, 'reg!!', reg, 'd:', d);
                    if (match) {
                        let temp = document.createElement(d.localName);
                        temp.innerText = match[0];
                        let htmlReg = new RegExp(temp.innerHTML, 'g');
                        console.log(htmlReg, temp.innerText);
                        d.innerHTML = d.innerHTML.replace(htmlReg, marked.marked(r));
                        delete temp;
                    }
                });
            }).then(hljs.initHighlightingOnLoad);
        }
    });
}

function loadMarkdownFile(callback = () => {
    hljs.initHighlightingOnLoad();

}) {
    // console.trace();

    /* 加载写人 markdown 文件 */
    [...document.querySelectorAll(".markdown-body")].map(function (dom) {
        fetch(dom.getAttribute("data-mdfile")).then(function (response) {
            return response.text();
        }).then(function (r) {
            dom.innerHTML = marked.marked(r);
        }).then(callback);

    });



    var arg = [...arguments];
    arg.map(a => a());
    return this;
}
function addBackToCatalog() {
    let language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';
    let html = {
        'cn': '<small style="float:right;font-weight:400;font-size: 0.5em; margin-top: 1em;">返回<a href="#目录">目录</a></small>',
        'en': '<small style="float:right;font-weight:400;font-size: 0.5em; margin-top: 1em;">return to <a href="#directory">directory</a></small > '
    }[language];
    [...document.body.querySelectorAll('h2,h3')].map(dom => {
        dom.insertAdjacentHTML('beforeend', html);
    });
}

loadReadmeFile = () => {
    let p = document.createElement('p'),
        language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';

    p.id = 'readme' + String(Math.random()).replace(/\./, ''),
        p.classList.add('markdown-body'),
        p.setAttribute('data-mdfile',
            language == 'en' ? enMdPath : cnMdPath
        );

    if (document.body.clientHeight > document.body.clientWidth) {
        p.classList.add('mob');
    }

    let style = document.createElement('style');
    style.innerHTML = `#${p.id}{
margin: 0;
max-height: 100vh;
min-height: 90vh;
max-width: 48vw;
min-width: 400px;
opacity:1;

padding: 1em;
overflow: scroll;
position: fixed;
right: 0;
top: 0;
z-index: 0;
background-color: #ffffffcc;

white-space: inherit;
word-break: break-all;
transition: max-width 0.5s ease ,
min-width 0.5s ease ,
max-height 0.5s ease ,
min-height 0.5s ease ,
padding 0.5s ease ,
margin 0.5s ease ,
border 0.5s ease ,
opacity 0.5s ease ;
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

#${p.id}.hide{
    max-width:0;
    min-width:0;
    opacity:0;
    padding: 0;
    margin:0;
    border:0;
}

#${p.id}.mob.hide {
    min-height:0!important;
    max-height:0!important;
}
`;

    [p, style].every(dom => document.body.appendChild(dom));
    loadMarkdownFile(() => {
        hljs.initHighlightingOnLoad();
        mdTempletsInsert(p);
        addBackToCatalog();
    });
}