english : <https://github.com/leizingyiu/p5js_Ctrler/blob/main/README_en.md>  
# PC - p5js Ctrler
一个可以在 p5js 运行时，实时操控代码变量的插件。  
    
查看效果：<https://leizingyiu.github.io/p5js_Ctrler/index.html>    

马上试试：<https://openprocessing.org/sketch/1537105>  
  
## 目录  
- [示例](#示例)  
- [初始化](#初始化)  
- [功能](#功能)  
- [工具按钮](#工具按钮)  
- [引用及感谢](#引用及感谢)  
  
<hr>

## 示例
```javascript
 var pc,btnN=0,txt='';
 pc = new PC({
    displayBoo: true,
    updateWithUrlBoo: true,
    updateWithCookieBoo: true,
    autoHide: true
  });
  preset = {
    '_slider': 99, '_sel': 'sel c', '_radio': 'radio b', '_color': '#ffaa00'
  };

  pc.slider('_slider', 20, 0, 100, 1);
  pc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e); });
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
    console.log(e.data);
    let l = loadStrings(e.data, (arr) => {
      txt = arr.join('\n');
      console.log(txt);
    });
  });

  pc.load(preset);
```
<hr>

##  初始化
``` javascript
  pc = new PC({
    displayBoo: true,
    //是否显示设置框，如设置 false 则不显示   

    updateWithUrlBoo: true,
    //是否同步更新网址search参数，并且初始化时读取网址search   

    updateWithCookieBoo: true,
    //是否同步更新cookie，并且初始化时读取cookie

    autoHide: true,
    //是否自动隐藏 

    showToolsBoo: true,
    //是否显示工具按钮

    text_color: '#000',
    //文字颜色

    main_color: '#0075ffcc',
    //高亮颜色

    bg_color: 'hsla( 0deg, 100%, 100%, 0.8)',
    //背景颜色
    
    ctrler_width: 100,
    //滑块控制器宽度
    
    font_size: 12,
    //字体大小，单位为px
    
    line_height: '1.5em',
    //行高，与css中设置一样

  });
```

<hr>

## 功能
### 滑块 
```javascript
pc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 20);
pc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
```

<hr>

### 按钮
```javascript
pc.button(name, btnText, fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.button('_button', 'btnText', () => { console.log('button clicked'); });
```
<hr>

### 多选器
```javascript
pc.pc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

#### 示例
```javascript
pc = new PC();
pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```
<hr>

### 下拉菜单
```javascript
select(name, options = [], fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```
<hr>

### 单选器
```javascript
pc.radio(name, options = [], fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```
<hr>

### 拾色器
```javascript
pc.color(name, defaultVal = '#369') 
```
#### 示例
```javascript
pc = new PC();
pc.color('_color', '#fff');
```
<hr>

### 输入框
```javascript
pc.input(name, defaultVal = '', fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
```
<hr>

### 文本框
```javascript
pc.textarea(name, defaultVal = '', fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.textarea('textArea', 'a long long long long sentence');
```
<hr>

### 文件选择器
```javascript
pc.fileinput(name, fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.fileinput('loadTxt', (e) => {
    console.log(e.data);
    let l = loadStrings(e.data, (arr) => {
        txt = arr.join('\n');
        console.log(txt);
    });
});
```
<hr>

### 水平线
```javascript
pc.hr()
```
#### 示例
```javascript
pc = new PC();
pc.hr();
```
<hr>



### 刷新/赋值

```javascript
pc.update(name, value);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1, (e) => { console.log(e)});
pc.update('_slider', 10);
```

### 启用 与 禁用
```javascript
pc.enable(name);
pc.disable(name);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1, (e) => { console.log(e)});
pc.disable('_slider');
pc.enable('_slider');
```

### 调整(滑块控制器)范围
```javascript
pc.range(name, min, max);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1, (e) => { console.log(e)});
pc.range('_slider', -100, 100);
```

## 工具按钮
### var
生成 var 语句，让参数脱离 PC 使用。

### toJson
生成 json 。 可生成多套 json 参数，并通过 load() 加载。

#### 示例
```javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
pc = new PC();
pc.slider('slider',0);
pc.checkbox('boo',false);
pc.load(preset);
```

### renew
根据当前参数，重新生成 new PC 以及后续设置语句

### reset
重置所有参数，将参数回归到代码中的设置，并且清理地址栏中的参数

### generaUrl
将当前参数更新到网址中，以便分享带参数的网址

<hr> 

## 引用及感谢

这个项目最初只是为了把自己在 <a href='https://openprocessing.org/user/150269/'>openprocessing</a> 的东西，下载回来在本地也能用 <a href='https://github.com/msawired/OPC/'>OPC</a> 的滑块。  
可以说，这个项目当时是基于 OPC 的参考，并进行延伸。感谢 OPC 作者 <a href='https://github.com/msawired'>Sinan Ascioglu</a>。    
当 sketch 从 openprocessing 下载下来后，只需在开头声明变量 OPC 、 在 preload 中先初始化自己的 p5js_Ctrler ，就可以继续使用滑块。如下面的注释部分：
```javascript
// https://openprocessing.org/sketch/1414246
// let OPC;
function preload() {
	// OPC = new PC();
	OPC.slider('c1', 10, 0, 255);
	OPC.slider('c2', 100, 0, 255);
	// OPC.hr();
	OPC.slider('sizeMin', 1, 0, 200, 0.1);
	OPC.slider('sizeStep', 2, 0, 100, 1);
	OPC.slider('sizeMax', 10, 0, 600, 0.1);
	// OPC.hr();
	OPC.slider('posSteps', 10, 0, 100, 1);
}
```

其中拖拽功能参考 runoob.com 的案例：<https://c.runoob.com/codedemo/5370/>  

其中将 name 转换成变量名称的部分，参考 OPC 源码：<https://github.com/msawired/OPC/blob/61287403522196ea6c0354a3e3850bc4c853d0b9/opc.js>
  
感谢优设的小伙伴为文案提供帮助  
感谢 processing.love 的群主及群友，在技术上提供的帮助
  
如发现问题，请及时提出指正，感谢！