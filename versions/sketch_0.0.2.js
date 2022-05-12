// readmore: https://leizingyiu.github.io/p5js_Ctrler/index.html
// github:   https://github.com/leizingyiu/p5js_Ctrler

import { PC } from './PC_0.0.2.js';


let pc, grp, sld, btnN = 0, cnv, _slider3;
const language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) != -1 ? 'cn' : 'en';
const contentText = {
  'cn': {
    "loadTxt": "loadTxt:\n请在这里加载文本文件",
    "txtFileContent": "请在 loadTxt 加载文本文件",
    "group": "编组",
    "grpSlider": "编组里面的滑块",
    "grpSelect": "编组里面的下拉菜单",
    "grpRadio": "编组里面的单选",
    "motionSlider": "用数值驱动控制器",
    "lorem": "控制器可不显示名称，而只显示提示文本。",
    "addCtrlerBtnTxt": "添加控制器",
    "addCtrlerAlt": "添加控制器，更改值，并在 devtool 的控制台中查看结果",
    "cnvPause": {
      'true': "点击底色\n暂停 draw() 程序",
      'false': "点击底色\n继续运行 draw() 程序"
    }
  },
  'en': {
    "loadTxt": "loadTxt:\nPlease load text file here",
    "txtFileContent": "Please load the text file in loadTxt",
    "group": "Group",
    "grpSlider": "Slider in group",
    "grpSelect": "Drop-down menu in group",
    "grpRadio": "Radio selection in group",
    "motionSlider": "Drive controllers with variables",
    "lorem": "The controller can display the prompt text instead of the name.",
    "addCtrlerBtnTxt": "add a ctrler",
    "addCtrlerAlt": "Add a controller, change the values, and view the results in the devtool's console",
    "cnvPause": {
      'true': "Click the background color \nto pause the draw() program",
      'false': "Click the background color \nto continue running the draw() program"
    }

  }
}[language];
let txtFileContent = contentText.txtFileContent;
const drawVariableArr = ['_slider', '_slider2', '_button', '_check_box', '_sel', '_radio', '_color', '', 'grpSlider', 'grpSelect', 'grpRadio', '', 'txtInput', 'txtareaTesting', 'txtFileContent'];

// const ballsObj = new Balls();

const sketch = p => {
  p.preload = function () {

    /** 初始化控制器 | Initialize the controller */
    pc = new PC({
      displayBoo: true,
      updateWithUrlBoo: true,
      updateWithCookieBoo: true,
      autoHideBoo: false,
      ctrler_width: 300
    }, p).title('p5js_ctrler 0.0.2');

    /** 控制器功能 | Controller Features */
    pc.slider('_slider', 20, 0, 100, 1).alt('testing');
    pc.slider('_slider2', 10, -20, 20, 1, (e) => {
      console.log(e);
    });
    pc.button('_button', 'button text', () => {
      btnN++;
      console.log('button clicked');
    });
    pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {
      console.log('box clicked');
    });
    pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
    pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
    pc.color('_color', '#fff');


    pc.hr(`--------------------------------------------`);

    /** 输入框，文本框，以及文件输入 | Input boxes, text boxes, and file input */
    pc.input('txtInput', 'sth wanner say');
    pc.textarea('txtareaTesting', 'this is a textarea ! ');
    pc.fileinput('loadTxt', (e) => {
      console.log(this, this.value, e, e.data);
      txtFileContent = e.data;
      p.loadStrings(e.data, (arr) => {
        txtFileContent = arr.join('\n');
        console.log(txtFileContent);
      });
    }).displayName(contentText.loadTxt);


    /** 预设及加载 | Default and Load */
    let preset = {
      '_slider': 99,
      '_sel': 'sel c',
      '_radio': 'radio b',
      '_color': '#ffaa00'
    };
    pc.load(preset);


    pc.hr(`--------------------------------------------`);

    /** 编组功能 | Group Features */

    //声明式
    // grp = pc.group();
    // grp.displayName(contentText.group);
    // grp.slider('grpSlider', 1);
    // grp.select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C']);
    // grp.radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);

    //链式
    pc.group()
      .displayName(contentText.group)
      .slider('grpSlider', 1)
      .select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C'])
      .radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);


    [{
      'grpSlider': contentText.grpSlider
    },
    {
      'grpSelect': contentText.grpSelect
    },
    {
      'grpRadio': contentText.grpRadio
    }
    ].map(ar => {
      let k = Object.keys(ar)[0],
        v = ar[k];
      pc.displayName(k, v);
    })

    pc.hr(`============================================`);

    /** 将控制器声明到变量, 并且将控制器的数据声明到变量
     * Declare the controller to a variable, and declare the controller's data to a variable
     */
    var sld3 = pc.slider('_slider3', 20, 0, 100, 1);
    /* 声明控制器 ｜ declare controller */

    sld3.displayName(contentText.motionSlider).update(48);
    /** 控制器更改显示名称, 更改数值 | Controller change display name, change value*/

    console.table('sld3,_slider3'.split(',').map(str => [str, eval(str)]));
    /* 可通过变量直接修改控制器 | The controller can be modified directly via variables _slider3=100; */

    sld3.alt('_slider3 = \\A (Math.sin((frameCount % 100) / 100 * Math.PI * 2) + 1) * 50');
    /*添加控制器的提示说明文本 | Add the controller's tooltip description text*/

    pc.hr(`--------------------------------------------`);

    /** 链式调用方式
     * chain call
     */
    pc.slider()
      .displayName('')
      .range(-100, 100)
      .update(-20)
      .var('variableOfSlider')
      .alt(contentText.lorem);

    pc.hr(`--------------------------------------------`);

    /** 可以在 draw 函数运行的时候添加控制器
     * You can add controllers while the draw function is running
     */
    let typeParas = {
      'slider': 'name = "new_slider" , \ndefaultValue=233 , \nmin=0 , \nmax=1000 , \nprecision=1 ',

      'radio': 'name = "new_radio" , \noptions = [ "val1" , "val2" ] ',

      'button': 'name = "new_button", \nbuttonText="a new button" ',

      'checkbox': 'name = "new_checkbox", \ndefaultValue= true , \n labelText = ["true!", "false?"] ',

      'select': 'name = "new_select", \noptions = ["select option 1", "select option 2", "select option 3"]  ',

      'color': 'name = "new_color", \ndefaultVal="#FFF" ',
    }
    pc.radio('add_ctrler_type', ['slider', 'radio', 'button', 'checkbox', 'select', 'color'], (e) => {
      let type = e.target.value;
      add_ctrler_para = typeParas[type];
    });
    pc.textarea('add_ctrler_para');
    pc.update('add_ctrler_para', typeParas[add_ctrler_type]);
    pc.button('add_ctrler', contentText.addCtrlerBtnTxt, () => {
      let fnTxt = 'pc.' + add_ctrler_type + '(' + add_ctrler_para + ', \n()=>{console.log(name+" : "+pc.getCtrlerVal(name))})';
      let fn = new Function(fnTxt);
      console.log('create a new ctrler by code test: \n___\n' + fnTxt + '\n---\n', fn);
      fn();
    }).alt(contentText.addCtrlerAlt);

    pc.title('p5js_Ctrler_0.0.2');
  }

  p.setup = function () {
    cnv = p.createCanvas(document.body.clientWidth, document.body.clientWidth / 16 * 9);
    cnv.mouseClicked(() => {
      if (p.isLooping()) {
        p.noLoop()
      } else {
        p.loop();
      }
    });

    p.loadReadmeDocIntoPage();

    document.addEventListener('onpagehide', () => {
      p.noLoop();
    });
    document.addEventListener('onpageshow', () => {
      p.loop();
    });
  }

  p.draw = function () {
    const margin = 20;
    _slider3 = (Math.sin((p.frameCount % 100) / 100 * Math.PI * 2) + 1) * 50;

    p.background(222);

    //在画布上显示控制器数据内容 ｜ Display controller data content on canvas
    drawVariableArr.map((n, idx) => {
      let str;
      if (n == '') {
        p.text('----------------------', 20, 10 + 20 * (idx + 1), p.width - 20, p.height - 10 + 20 * (idx + 1));
        return
      }

      if (n == '_button') {
        str = n + ' : ' + btnN;
      } else {
        str = n + ' : ' + eval(n);
      }

      p.text(str, margin, 10 + 20 * (idx + 1), p.width - margin, p.height - 10 + 20 * (idx + 1));
      if (n == '_color' || n == '_color2') {
        p.push();
        p.fill(eval(n));
        p.rectMode(p.CENTER);
        p.rect(7 + p.textWidth('10') + p.textSize() + p.textWidth(str), 7 + 20 * (idx + 2) - p.textSize(), p.textSize(), p.textSize());
        p.pop();
      }
    });

    // 启动时console控制器的初始化数据，然后 移动控制器到画布内容旁边
    // Display the controller's initialization data on startup, then move the controller next to the canvas content
    if (p.frameCount <= 1) {
      const consoleCode = drawVariableArr.map(v => Boolean(v) ? v : '').map(v => !v.match(/\S/) ? v : `${v} = \${${v}} ,\t// => ${eval(v)}`).join('\n');
      console.log(consoleCode.split('\n')
        .map((s, idx, ar) => {
          let ls = ar.map(ar_s => ar_s.match(/\S/) ? ar_s.match(/[^\t]+/)[0].length : 0),
            l = ls[idx],
            max = Math.max(...ls);
          let num = Math.ceil((max - l) / 4) + 1;
          let txt = s.replace(/\t/, [...new Array(num)].map(_ => '\t').join(''));
          return txt;
        })
        .join('\n')
      );

      if (p.width >= 1280 && p.width > p.height) {
        const initializationText = drawVariableArr.map(n => n + ' : ' + eval(n)).sort((a, b) => p.textWidth(b) - p.textWidth(a))[0];
        const textWidthOfInitTxt = p.textWidth(initializationText);
        pc.mainContainer.position(60 + textWidthOfInitTxt, 30, 'absolute');
        pc.mainContainer.elt.style.bottom = 'unset';
      }
    }

    { // 绘制背景提示文字 | Draw background prompt text
      p.push();
      let fSize = 128;
      const bgTxt = contentText.cnvPause[p.isLooping()];
      p.fill(168);
      p.rectMode(p.CENTER);
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle("light");
      p.textSize(fSize);
      const tWidth = p.textWidth(bgTxt);
      fSize = tWidth > p.width * 0.5 ? fSize * p.width / tWidth * 0.8 : fSize;
      fSize = fSize < 24 ? 24 : fSize;
      p.textSize(fSize);
      p.text(bgTxt, p.width / 2, p.height / 2);
      p.pop();
    }


    {
      p.text('fps: ' + Number(p.frameRate()).toFixed(0), margin, p.height - margin);
    }
  }

  // p.windowResized = function () {
  //   p.resizeCanvas(p.windowWidth, p.windowHeight);
  // }

  p.loadReadmeDocIntoPage = function () {
    // loadReadmeFile();
    if (p.height > p.width) {
      pc.mainContainer.elt.setAttribute("stick", "bottom right");
    }
    // p.resizeCanvas(document.body.clientWidth, p.windowHeight);
  }
};

export {
  sketch
};