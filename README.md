english: <a href="https://github.com/leizingyiu/PC/blob/main/README_en.md">https://github.com/leizingyiu/PC/blob/main/README_en.md</a>  
# PC - P5JS Ctrler
最初只是为了把自己在 <a href='https://openprocessing.org/user/150269/'>openprocessing</a> 的东西，下载回来在本地也能用 <a href='https://github.com/msawired/OPC/'>OPC</a> 的滑块，就写了这个东西。

马上试试：<a href="https://leizingyiu.github.io/PC/index.html">https://leizingyiu.github.io/PC/index.html</a>
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
    updateWithUrlBoo: true,
    updateWithCookieBoo: true,
    autoHide: true,
    showToolsBoo: true,
  });
```

#### displayBoo 
是否显示设置框，如设置 false 则不显示   
#### updateWithUrlBoo 
是否同步更新网址search参数，并且初始化时读取网址search   
#### updateWithCookieBoo 
是否同步更新cookie，并且初始化时读取cookie   
#### autoHide 
是否自动隐藏 
#### showToolsBoo
是否显示工具按钮  
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

### 文本框
```javascript
pc.input(name, defaultVal = '', fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
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