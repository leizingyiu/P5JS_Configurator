# PC - P5JS Ctrler
At first, I just wrote this thing to download the things I have in <a href='https://openprocessing.org/user/150269/'>openprocessing</a>, and I can also use the <a href='https://github.com/msawired/OPC/'>OPC</a> slider locally.  
  
Try it now: <a href="https://leizingyiu.github.io/PC/index.html">https://leizingyiu.github.io/PC/index.html</a>  
<hr>

## Example
```javascript
 var p c,btnN=0,txt='';
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

##  Initialization
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
Whether to display the setting box, if set false, it will not be displayed   
#### updateWithUrlBoo 
Whether to update the URL search parameter synchronously, and read the URL search during initialization   
#### updateWithCookieBoo 
Whether to update the cookie synchronously, and read the cookie during initialization   
#### autoHide 
Whether to automatically hide 
#### showToolsBoo
Whether to show tool buttons 
<hr>

## Feature
### Slider 
```javascript
pc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

#### Example
```javascript
pc = new PC();
pc.slider('_slider', 20);
pc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
```

<hr>

### Button
```javascript
pc.button(name, btnText, fxn = () => { })
```
#### Example
```javascript
pc = new PC();
pc.button('_button', 'btnText', () => { console.log('button clicked'); });
```
<hr>

### Checkbox
```javascript
pc.pc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

#### Example
```javascript
pc = new PC();
pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```
<hr>

### Select
```javascript
select(name, options = [], fxn = () => { })
```
#### Example
```javascript
pc = new PC();
pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```
<hr>

### Radio
```javascript
pc.radio(name, options = [], fxn = () => { }) 
```
#### Example
```javascript
pc = new PC();
pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```
<hr>

### Color
```javascript
pc.color(name, defaultVal = '#369') 
```
#### Example
```javascript
pc = new PC();
pc.color('_color', '#fff');
```
<hr>

### Text input
```javascript
pc.input(name, defaultVal = '', fxn = () => { }) 
```
#### Example
```javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
```
<hr>

### File input
```javascript
pc.fileinput(name, fxn = () => { }) 
```
#### Example
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

### horizontal line
```javascript
pc.hr()
```
#### Example
```javascript
pc = new PC();
pc.hr();
```
<hr>

## Tool buttons
### var
Generate var statements to keep parameters out of PC use.

### toJson
Generate json . Multiple sets of json parameters can be generated and loaded through load().

#### Example
```javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
pc = new PC();
pc.slider('slider',0);
pc.checkbox('boo',false);
pc.load(preset);
```

### renew
Regenerates new PC and subsequent set statements based on the current parameters

### reset
Reset all parameters, return the parameters to the settings in the code, and clear the parameters in the address bar

### generaUrl
Update the current parameters to the URL to share URLs with parameters