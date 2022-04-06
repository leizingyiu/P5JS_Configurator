# oPC - offline Processing Configurator
At first, I just wrote this thing to download the things I have in <a href='https://openprocessing.org/user/150269/'>openprocessing</a>, and I can also use the <a href='https://github.com/msawired/OPC/'>OPC</a> slider locally.

<hr>

## Example
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

##  Initialization
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
opc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

#### Example
```javascript
opc = new oPC();
opc.slider('_slider', 20);
opc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
```

<hr>

### Button
```javascript
opc.button(name, btnText, fxn = () => { })
```
#### Example
```javascript
opc = new oPC();
opc.button('_button', 'btnText', () => { console.log('button clicked'); });
```
<hr>

### Checkbox
```javascript
opc.opc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

#### Example
```javascript
opc = new oPC();
opc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```
<hr>

### Select
```javascript
select(name, options = [], fxn = () => { })
```
#### Example
```javascript
opc = new oPC();
opc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```
<hr>

### Radio
```javascript
opc.radio(name, options = [], fxn = () => { }) 
```
#### Example
```javascript
opc = new oPC();
opc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```
<hr>

### Color
```javascript
opc.color(name, defaultVal = '#369') 
```
#### Example
```javascript
opc = new oPC();
opc.color('_color', '#fff');
```
<hr>

### Text input
```javascript
opc.input(name, defaultVal = '', fxn = () => { }) 
```
#### Example
```javascript
opc = new oPC();
opc.input('txtInput', 'sth wanner say');
```
<hr>

### File input
```javascript
opc.fileinput(name, fxn = () => { }) 
```
#### Example
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

### horizontal line
```javascript
opc.hr()
```
#### Example
```javascript
opc = new oPC();
opc.hr();
```
<hr>

## Tool buttons
### var
Generate var statements to keep parameters out of oPC use.

### toJson
Generate json . Multiple sets of json parameters can be generated and loaded through load().

#### Example
```javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
opc = new oPC();
opc.slider('slider',0);
opc.checkbox('boo',false);
opc.load(preset);
```

### renew
Regenerates new oPC and subsequent set statements based on the current parameters

### reset
Reset all parameters, return the parameters to the settings in the code, and clear the parameters in the address bar

### generaUrl
Update the current parameters to the URL to share URLs with parameters