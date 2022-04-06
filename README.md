english: <a href="https://github.com/leizingyiu/oPC/blob/main/README_en.md">https://github.com/leizingyiu/oPC/blob/main/README_en.md</a>  
# oPC - offline Processing Configurator
最初只是为了把自己在 <a href='https://openprocessing.org/user/150269/'>openprocessing</a> 的东西，下载回来在本地也能用 <a href='https://github.com/msawired/OPC/'>OPC</a> 的滑块，就写了这个东西。

<hr>

## 示例
```javascript
 var opc,btnN=0,txt='';
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
```
<hr>

##  初始化
``` javascript
  opc = new oPC({
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
opc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

#### 示例
```javascript
opc = new oPC();
opc.slider('_slider', 20);
opc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
```

<hr>

### 按钮
```javascript
opc.button(name, btnText, fxn = () => { })
```
#### 示例
```javascript
opc = new oPC();
opc.button('_button', 'btnText', () => { console.log('button clicked'); });
```
<hr>

### 多选器
```javascript
opc.opc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

#### 示例
```javascript
opc = new oPC();
opc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```
<hr>

### 下拉菜单
```javascript
select(name, options = [], fxn = () => { })
```
#### 示例
```javascript
opc = new oPC();
opc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```
<hr>

### 单选器
```javascript
opc.radio(name, options = [], fxn = () => { }) 
```
#### 示例
```javascript
opc = new oPC();
opc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```
<hr>

### 拾色器
```javascript
opc.color(name, defaultVal = '#369') 
```
#### 示例
```javascript
opc = new oPC();
opc.color('_color', '#fff');
```
<hr>

### 文本框
```javascript
opc.input(name, defaultVal = '', fxn = () => { }) 
```
#### 示例
```javascript
opc = new oPC();
opc.input('txtInput', 'sth wanner say');
```
<hr>

### 文件选择器
```javascript
opc.fileinput(name, fxn = () => { }) 
```
#### 示例
```javascript
opc = new oPC();
opc.fileinput('loadTxt', (e) => {
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
opc.hr()
```
#### 示例
```javascript
opc = new oPC();
opc.hr();
```
<hr>

## 工具按钮
### var
生成 var 语句，让参数脱离 oPC 使用。

### toJson
生成 json 。 可生成多套 json 参数，并通过 load() 加载。

#### 示例
```javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
opc = new oPC();
opc.slider('slider',0);
opc.checkbox('boo',false);
opc.load(preset);
```

### renew
根据当前参数，重新生成 new oPC 以及后续设置语句

### reset
重置所有参数，将参数回归到代码中的设置，并且清理地址栏中的参数

### generaUrl
将当前参数更新到网址中，以便分享带参数的网址