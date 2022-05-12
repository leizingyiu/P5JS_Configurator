english : <a href='./README_en.md'>README_en.md</a>
  
# PC - p5js Ctrler - Variable controller for p5js
A plugin that can manipulate code variables in real time while p5js is running.
    
<#links_en#>
  
## content  
- [example](#example)
- [initialize](#initialize)
- [different usage styles](#different usage styles)
- [controller function](#controller function)
  - Slider [slider](#slider)
  - button [button](#button)
  - Multiselector [checkbox](#checkbox)
  - Dropdown menu [select](#select)
  - radio [radio](#radio)
  - Color Picker [color](#color)
  - input box [input](#input)
  - Text box [textarea](#textarea)
  - file selector [fileinput](#fileinput)
  - Horizontal line [hr](#hr)
- [Group function](#Group function)
- [operation function](#operation function)
  - update [update](#update)
  - enable and disable [enable](#enable) [disable](#disable)
  - Adjust <small>(slider controller)</small> range [range](#range)
  - Adjust <small>(slider controller)</small> precision [precision](#precision)
  - Get the value of the controller [getCtrlerVal](#getCtrlerVal)
  - Change display name [displayName](#displayName)
  - declare a variable, pointing to the controller [var](#var)
  - Add description text [alt](#alt)
  - Change controller title [title](#title)
- [toolbutton](#toolbutton)
- [quote & thanks](#quote & thanks)
  
  

## example


The following are some of the most basic functions, you can copy the following code into your sketch to try

````javascript

let pc, btnN = 0, txt = '', preset;

function preload() {
    pc = new PC({
        displayBoo: true, updateWithUrlBoo: true,
        updateWithCookieBoo: true, autoHideBoo: true
    });

    preset = {
        'rect_p': 48, 'rect_stroke_weight': '10',
        'rect_stroke_color': '#000', '_color': '#ffaa00'
    };

    pc.slider('rect_p', 20, 0, 400, 1);

    pc.slider('rect_w', 40, 0, 400, 1,
        (e) => { console.log(e); });

    pc.button('random_rect_p', 'random it !',
        () => {
            rect_p = Math.random() * Math.min(width, height);
        });

    pc.checkbox('rect_stroke_boo', false, ['stroke', 'noStroke'],
        () => { console.log('box clicked'); });

    pc.select('rect_stroke_weight', ['10', '20', '40'],);

    pc.radio('rect_stroke_color', ['#000', '#369', '#fff'], () => {
        rect_stroke_boo = true;
    });

    pc.color('_color', '#fff');

    pc.input('txtInput', 'this is a p5js_ctrler demo');

    pc.fileinput('loadTxt', (e) => {
        console.log(e.data);
        let l = loadStrings(e.data, (arr) => {
            txt = arr.join('\n');
            console.log(txt);
        });
    });

    pc.load(preset);
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(_color);

    if (rect_stroke_boo == false) {
        noStroke();
    } else {
        strokeWeight(rect_stroke_weight);
        stroke(rect_stroke_color);
    }
    rectMode(CORNER);
    rect(rect_p, rect_p, rect_w, rect_w);

    noStroke();
    textAlign(LEFT, TOP);
    text(txtInput, 0, 0);
    text(txt, width / 2, height / 2, width / 2, height * 2);
}

````


## Initialize


During initialization, specific parameters can be set or left blank, and the program will automatically use the following default parameters.
``` javascript
  pc = new PC({
    displayBoo: true, //whether to display the setting box, if set to false, it will not be displayed

    updateWithUrlBoo: true, //Whether to update the URL search parameter synchronously, and read the URL search during initialization, if set to false, it will not be written or read

    updateWithCookieBoo: true, //Whether the cookie is updated synchronously, and the cookie is read during initialization, if false is set, it will not be written or read

    autoHideBoo: true, //Whether it is automatically hidden, if set to false, it will not be automatically hidden

    showToolsBoo: true, //Whether to display the tool buttons, if set to false, the top tool button will not be realized

    text_color: '#000', //text color

    main_color: '#0075ffcc', //Highlight color

    bg_color: 'hsla(0deg,100%,100%,0.8)', //background color
    
    ctrler_width: 100, //Controller width in px
    
    font_size: 12, //font size in px
    
    line_height: '1.5em', //Line height, same as set in css

    checkbox_true_display: '✔' //Display character when the checkbox is true
  });
````

p5js_ctrler depends on p5js, please initialize it in preload or setup.

## Different usage styles

  
This plugin can be used in the following styles:

### imperative
````javascript
pc=new PC();
pc.slider('_slider', 20, 0, 100, 1);
pc.update('_slider',50);
pc.displayName('_slider','a slider for _slider');
````

### Declarative

````javascript
pc=new PC();
const sld=pc.slider('_slider', 20, 0, 100, 1);
sld.update(50);
sld.displayName('a slider for _slider');
````

### chain
````javascript
pc=new PC();
pc.slider('_slider', 20, 0, 100, 1)
  .update(50)
  .displayName('a slider for _slider');
````

Among them, the methods that can be called declaratively or chained by [controller](#controller function) are:
- Assignment: [update](#update)
- Enable and disable: [enable](#enable) [disable](#disable)
- Modify slider range: [range](#adjust(slidercontroller)range)
- Modify the slider precision: [precision](#Get the value of the controller)
- Modify name: [displayName](#Change display name)
- Get the value of the controller: [getCtrlerVal](#Get the value of the controller)
- Declare a variable, referencing the value of the controller: [var](#declare variable)
- Add description text: [alt](#Add description text)

The methods that can be called by the [marshalling](#marshalling function) declarator or chained are:
- New controller and horizontal line: [slider](#slider), [button](#button), [checkbox](#checkbox), [select](#select), [radio](#radio), [color ](#color), [input](#input), [textarea](#textarea), [fileinput](#fileinput), [hr](#hr)
- Modify controller name: [displayName](#change display name)
- Enable and disable: [enable](#enable) [disable](#disable)
## Controller function

  
When using the following controllers, you can refer to the listed parameters for use;
You can also directly write no parameters, define the display name ([displayName](#displayName)) in the subsequent process, and define the variable that points to the value of the controller, and use the variable to manipulate the controller ([var](#var)).
When no parameter is written, a variable named "p5js_ctrler" plus a string of random numbers is defined by default.
When a blank name is required and subsequent parameters are filled in, the name parameter can be replaced by null or false.

### Slider
#### slider
When using the slider, if you do not fill in the minimum value, maximum value, and precision (minVal, maxVal, precision), you can use [range](#range) [precision](#precision) to set it in the subsequent process.
````javascript
pc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 20);
pc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
````



### button
#### button
````javascript
pc.button(name, btnText, fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.button('_button', 'btnText', () => { console.log('button clicked'); });
````


### Multiselector
#### checkbox
````javascript
pc.pc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
````

#### Example
````javascript
pc = new PC();
pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
````


### Drop-down menu
#### select
````javascript
select(name, options = [], fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
````


### Radio selector
#### radio
````javascript
pc.radio(name, options = [], fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
````


### Color Picker
####color
````javascript
pc.color(name, defaultVal = '#369')
````
#### Example
````javascript
pc = new PC();
pc.color('_color', '#fff');
````


### Input box
#### input
````javascript
pc.input(name, defaultVal = '', fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
````


### text box
#### textarea
````javascript
pc.textarea(name, defaultVal = '', fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.textarea('textArea', 'a long long long long sentence');
````


### file selector
#### fileinput
````javascript
pc.fileinput(name, fxn = () => { })
````
#### Example
````javascript
pc = new PC();
pc.fileinput('loadTxt', (e) => {
    console.log(e.data);
    let l = loadStrings(e.data, (arr) => {
        txt = arr.join('\n');
        console.log(txt);
    });
});
````


### Horizontal line
#### hr
````javascript
pc.hr(borderStyle, borderWidth)
````

The borderStyle is the style of the horizontal line, and the parameters corresponding to the line refer to the following table
| parameter | style | parameter | style |
| --- | :----- | :-- | :---- |
| '' | 'none' | ' ' | 'none' |
| '.' | 'dotted' | '-' | 'dashed' |
| '_' | 'solid' | '=' | 'double' |
| 'v' | 'groove' | 'V' | 'groove' |
| 'A' | 'ridge' | '^' | 'ridge' |
| '<' | 'inset' | '[' | 'inset' |
| '>' | 'outset' | ']' | 'outset' |

borderWidth is the thickness of the horizontal line, you can fill in the length of the css, such as '0.1em', '1px', '0.2vh'...
#### Example
````javascript
pc = new PC();
pc.hr(borderStyle='-',borderWidth='1px');
````

## marshalling function

### group
````javascript
 pc.group('groupName');
````

#### Example
````javascript
pc = new PC();
grp = pc.group();
grp.displayName('Group name');
grp.slider('grpSlider', 1);
grp.select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C']);
grp.radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);

/*--or--*/
 pc.group()
    .displayName('Group name');
    .slider('grpSlider', 1)
    .select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C'])
    .radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);
````


## Operation function


The controller function returns the controller itself. The following operation functions can be chained after the controller.
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.update('_slider', 10);
pc.range('_slider',-100,100);
pc.precision('_slider',0.01);
pc.displayName('_slider','slider');
pc.alt('_slider', 'this is a slider');

/* Chained function form */
pc.slider('_slider', 0, -20, 20, 1)
  .update(10)
  .range(-100,100)
  .precision(0.01)
  .displayName('slider')
  .alt('This is a slider');

/* Or write one line */
pc.slider('_slider', 0, -20, 20, 1).update(10).range(-100,100).precision(0.01).displayName('slider').alt('This is a slider ');

````

### renew
####update
````javascript
pc.update('variable', value);

/*___or___*/
variable=value;
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.update('_slider', 10);

/*--or--*/
_slider = 10;
````


### Enable and disable
#### enable
#### disable
````javascript
pc.enable(name);
pc.disable(name);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.disable('_slider');
pc.enable('_slider');
````

You can control whether other controllers are available in the callback function in the controller, for example:
````javascript
pc=new PC();

pc.slider('_slider');
pc.radio('_radio',['yes','no'],(e)=>{
  let v = e.target.value;
  switch (v) {
    case 'no':
      pc.disable('_slider');
      break;
    case 'yes':
      pc.enable('_slider');
      break;
  }
})
````
These two methods are also valid for groups. When a group is disabled, all the controllers in the group will be disabled, and the group will be collapsed;
When the group is enabled, all the controllers in the group will be enabled, and the group will be expanded. For example:
````javascript
pc=new PC();

pc.group('the_group')
  .slider('_slider')
  .input('_input');

pc.radio('_radio',['en_group','dis_group'],(e)=>{
  let v = e.target.value;
  switch (v) {
    case 'no':
      pc.disable('the_group');
      break;
    case 'yes':
      pc.enable('the_group');
      break;
  }
});

````



### Adjust (slider controller) range
#### range
````javascript
pc.range(name, min, max);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.range('_slider', -100, 100);
````

### Adjust (slider controller) precision
#### precision
````javascript
pc.precision(name, precisionNum);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.precision('_slider', 0.1);
````

### Get the value of the controller
#### getCtrlerVal
````javascript
pc.getCtrlerVal(name);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
let val=pc.getCtrlerVal('_slider');

/*__or__*/
let val=_slider;
````

### Change display name
#### displayName
````javascript
pc.displayName(name,displayname);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.displayName('_slider','slider');
````

### declare variables, pointing to the controller
####var
````javascript
pc.var(name, variableName);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.var('_slider', 'sld');
sld=10;
console.log(sld);
````
This feature can be used with "anonymous" controllers such as
````javascript
pc=new PC();
theSlider=pc.slider().displayName('slider's display name');

...

theSlider.var('variableOfSlider');
````

### Add description text
#### alt
````javascript
pc.alt(name, altText);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.alt('_slider', 'this is a slider');
````

### Change controller title
#### title
````javascript
pc.title(titlename);
````

#### Example
````javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.title('theCtrlerName');
````


## tool button


### [var]
Generates var statements so that parameters can be used outside of this plugin.

### [ toJson ]
Generate json . Multiple sets of json parameters can be generated and loaded through load().

#### Example
````javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
pc = new PC();
pc.slider('slider',0);
pc.checkbox('boo',false);
pc.load(preset);
````

### [ renew ]
Regenerates new PC and subsequent set statements based on the current parameters

### [ reset ]
Reset all parameters, return the parameters to the settings in the code, and clear the parameters in the address bar

### [ generaUrl ]
Update the current parameters to the URL to share URLs with parameters

 
<#thanks#>