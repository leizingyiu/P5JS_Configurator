// Created: 2022/04/56 16:56:00
// Last modified: "2022/04/28 13:49:16"










var exampleArr = ['balls', 'fx'];
var _example = exampleArr[0];
var url = new URL(document.location.href);
if (url && url.searchParams.has('example')) {
    _example = url.searchParams.get('example');

}

Examples[_example]();


let _pc;
function preload() {
    _pc = new PC({
        showToolsBoo: false,
        autoHideBoo: false,
        ctrler_width: 400,

    }).title('choose example here. ');


    _pc.select('example', exampleArr, () => {
        const url = new URL(window.location.origin + window.location.pathname);
        const name = 'example';
        url.searchParams.append(name, example);

        document.querySelector('.markdown-body[id*=readme]').classList.add('hide');
        setTimeout(() => {
            window.location = url.href;
        }, 500);
    });
    _pc.button('hide_readme', 'hide readme', () => {
        document.querySelector('.markdown-body[id*=readme]').classList.toggle('hide');
        resizeCanvas(document.body.clientWidth, windowHeight);
    });



    __preload();

    document.addEventListener('onpagehide', () => {
        noLoop();
    });
    document.addEventListener('onpageshow', () => {
        loop();
    });


}

function setup() {
    __setup();
    loadReadmeFile();
    document.querySelector('.markdown-body[id*=readme]').classList.add('hide');
    setTimeout(() => {
        document.querySelector('.markdown-body[id*=readme]').classList.remove('hide');
    }, 500);

    resizeCanvas(document.body.clientWidth, windowHeight);


    // _pc.mainContainer.position(null, 0);
    // _pc.mainContainer.elt.style.bottom = 'unset';
    // _pc.mainContainer.elt.setAttribute('stick', 'top');
    _pc.stick('top');
}
function draw() {
    __draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}