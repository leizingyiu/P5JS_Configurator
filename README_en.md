# PC - p5js Ctrler
A plugin that can manipulate code variables in real time while p5js is running.
  
Take a look: <https://leizingyiu.github.io/p5js_Ctrler/index.html>  
  
Try it now: <https://openprocessing.org/sketch/1537105> 
  
## Catalog
[Example](#example)  
[Initialization](#initialization)  
[Feature](#feature)  
[Tool buttons](#tool-buttons)  
[Citations and thanks](#citations-and-thanks)
  

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
    // Whether to display the setting box, 
    // if set false, it will not be displayed   

    updateWithUrlBoo: true,
    // Whether to update the URL search parameter synchronously, 
    // and read the URL search during initialization   

    updateWithCookieBoo: true,
    // Whether to update the cookie synchronously, 
    // and read the cookie during initialization   

    autoHide: true,
    // Whether to automatically hide 

    showToolsBoo: true,
    // Whether to show tool buttons 

  });
```

<hr>

## Feature
### Slider 
```javascript
pc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

##### example
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
##### example
```javascript
pc = new PC();
pc.button('_button', 'btnText', () => { console.log('button clicked'); });
```
<hr>

### Checkbox
```javascript
pc.pc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

##### example
```javascript
pc = new PC();
pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```
<hr>

### Select
```javascript
select(name, options = [], fxn = () => { })
```
##### example
```javascript
pc = new PC();
pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```
<hr>

### Radio
```javascript
pc.radio(name, options = [], fxn = () => { }) 
```
##### example
```javascript
pc = new PC();
pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```
<hr>

### Color
```javascript
pc.color(name, defaultVal = '#369') 
```
##### example
```javascript
pc = new PC();
pc.color('_color', '#fff');
```
<hr>

### Text input
```javascript
pc.input(name, defaultVal = '', fxn = () => { }) 
```
##### example
```javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
```
<hr>

### File input
```javascript
pc.fileinput(name, fxn = () => { }) 
```
##### example
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
##### example
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

##### example
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

## Citations and thanks
This project was originally just for the purpose of downloading the things that I have in <a href='https://openprocessing.org/user/150269/'>openprocessing</a> and using it locally <a href='https:/ Slider for /github.com/msawred/OPC/'>OPC</a>.  
It can be said that this project was based on OPC references at the time and extended. Thanks to OPC author <a href='https://github.com/msawired'>Sinan Ascioglu</a>.  
When the sketch is downloaded from openprocessing, just declare the variable OPC at the beginning and initialize your own p5js_Ctrler in preload, and you can continue to use the slider. As in the comments section below:  
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

The drag and drop function refers to the case of runoob.com: <https://c.runoob.com/codedemo/5370/>

For the part that converts name into variable name, refer to the OPC source code: <https://github.com/msawired/OPC/blob/61287403522196ea6c0354a3e3850bc4c853d0b9/opc.js>
  
Thanks to the friends of Youshe for helping with the copywriting
Thanks to the group owners and friends of processing.love for their technical help
  
If you find any problems, please correct them in time, thank you!

<hr>

// 本英文说明是机翻，如果有词不达意的地方，请务必指正，谢谢！  
// This English description is translated by machine. If there is anything wrong with the words, please correct me, thank you!