var opc, txt = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) != -1 ? '请在 loadTxt 加载文本文件' : 'Please load the text file in loadTxt', btnN = 0;

function preload() {
  opc = new oPC({
    displayBoo: true,
    updateWithUrlBoo: true,
    updateWithCookieBoo: true,
    autoHide: true
  });
  preset = {
    '_slider': 99, '_sel': 'sel c', '_radio': 'radio b', '_color': '#ffaa00'
  };

  opc.slider('_slider', 20, 0, 100, 1);
  opc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e); });
  opc.button('_button', 'btnText', () => {
    btnN++;
    console.log('button clicked');
  });

  opc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {
    console.log('box clicked');
  });
  opc.hr();
  opc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
  opc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
  opc.color('_color', '#fff');
  opc.input('txtInput', 'sth wanner say');
  opc.fileinput('loadTxt', (e) => {
    console.log(e.data);
    let l = loadStrings(e.data, (arr) => {
      txt = arr.join('\n');
      console.log(txt);
    });
  });
  opc.load(preset);
}
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  background(222);
  ['_slider', '_slider2', '_button', '_check_box', '_sel', '_radio', '_color', 'txtInput', 'txt'].map((n, idx) => {
    if (n == '_button') {
      let str = n + ' : ' + btnN;
      text(str, 20, 10 + 20 * (idx + 1));
    } else {
      let str = n + ' : ' + eval(n);
      text(str, 20, 10 + 20 * (idx + 1));
      if (n == '_color') {
        push();
        fill(eval(n));
        rect(textWidth('10') + textSize() + textWidth(str), 10 + 20 * (idx + 1) - textSize(), textSize(), textSize());
        pop();
      }
    }
  });
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}