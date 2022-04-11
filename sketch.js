// readmore: https://leizingyiu.github.io/p5js_Ctrler/index.html
// github:   https://github.com/leizingyiu/p5js_Ctrler

var pc,
  txt = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) != -1 ?
    '请在 loadTxt 加载文本文件' :
    'Please load the text file in loadTxt',
  btnN = 0;

function preload() {
  pc = new PC({
    displayBoo: true,
    updateWithUrlBoo: true,
    updateWithCookieBoo: true,
    autoHide: true
  });
  preset = {
    '_slider': 99,
    '_sel': 'sel c',
    '_radio': 'radio b',
    '_color': '#ffaa00'
  };

  pc.slider('_slider', 20, 0, 100, 1);
  pc.slider('_slider2', 10, -20, 20, 1, (e) => {
    console.log(e);
  });
  pc.button('_button', 'btnText', () => {
    btnN++;
    console.log('button clicked');
  });

  pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {
    console.log('box clicked');
  });
  pc.hr();
  pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
  pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
  pc.color('_color', '#fff');
  pc.input('txtInput', 'sth wanner say');
  pc.fileinput('loadTxt', (e) => {
    console.log(e);
    console.log(this, this.value);
    console.log(e.data);
    txt = e.data;
    loadStrings(e.data, (arr) => {
      txt = arr.join('\n');
      console.log(txt);
    });
  });
  pc.load(preset);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  background(222);
  ['_slider', '_slider2', '_button', '_check_box', '_sel', '_radio', '_color', 'txtInput', 'txt'].map((n, idx) => {
    let str;
    if (n == '_button') {
      str = n + ' : ' + btnN;
    } else {
      str = n + ' : ' + eval(n);
    }
    text(str, 20, 10 + 20 * (idx + 1), width - 20, height - 10 + 20 * (idx + 1));
    if (n == '_color') {
      push();
      fill(eval(n));
      rectMode(CENTER);
      rect(7 + textWidth('10') + textSize() + textWidth(str), 7 + 20 * (idx + 1) - textSize(), textSize(), textSize());
      pop();
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}