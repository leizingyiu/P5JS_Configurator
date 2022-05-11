// readmore: https://leizingyiu.github.io/p5js_Ctrler/index.html
// github:   https://github.com/leizingyiu/p5js_Ctrler
import {PC} from './PC_0.0.1.js';

var pc,
  txtFileContent = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) != -1 ?
    '请在 loadTxt 加载文本文件' :
    'Please load the text file in loadTxt',
  btnN = 0;
   const sketch=p=>{
 p.preload=function() {
  pc = new PC({
    displayBoo: true,
    updateWithUrlBoo: true,
    updateWithCookieBoo: true,
    autoHide: true
  },p);
  const preset = {
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
    txtFileContent = e.data;
    loadStrings(e.data, (arr) => {
      txtFileContent = arr.join('\n');
      console.log(txtFileContent);
    });
  });
  pc.textarea('txtareaTesting', 'this is a textarea ! ');
  pc.load(preset);
}


 p.setup=function() {
 let cnv=p.createCanvas(p.windowWidth, p.windowHeight);
 let parent=cnv.elt.parentElement;
 p.resizeCanvas(parent.clientWidth,parent.clientHeight);
}
 
 p.draw=function() {

  p.background(222);
  let varArr = ['_slider', '_slider2', '_button', '_check_box', '_sel', '_radio', '_color', 'txtInput', 'txtFileContent', 'txtareaTesting'];
  varArr.map((n, idx) => {
    n='p.'+n;
    let str;
    if (n == '_button') {
      str = n + ' : ' + btnN;
    } else { 
      str = n + ' : ' + eval(n);
    }
    p.text(str, 20, 10 + 20 * (idx + 1), p.width - 20, p. height - 10 + 20 * (idx + 1));
    if (n == '_color') {
      p.push();
      p.fill(eval(n));
      p.rectMode(p.CENTER);
      p.rect(7 + p.textWidth('10') + p.textSize() + p.textWidth(str), 7 + 20 * (idx + 1) - p.textSize(), p.textSize(), p.textSize());
      p.pop();
    }
  });

  let t = `_slider = ${p._slider},
_slider2 = ${p._slider2},
_button = ${p._button},
_check_box = ${p._check_box},
_sel = ${p._sel},
_radio = ${p._radio},
_color = ${p._color},
txtInput = ${p.txtInput},
txt = ${p.txtFileContent},
txtareaTesting = ${p.txtareaTesting}
`;

  if (p.frameCount <= 1) {
    console.log(t);
  }
}

 p.windowResized=function() {
 p. resizeCanvas(p.windowWidth, p.windowHeight);
}

}

export {sketch}