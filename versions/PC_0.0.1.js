// Created: 2022/02/27 01:20:00
// Last modified: "2022/04/28 16:30:40"

class PC {
    constructor(settings = {
        updateWithCookieBoo: true,
        updateWithUrlBoo: true,
        displayBoo: true,
        autoHide: true,
        showToolsBoo: true,
        text_color: '#000',
        main_color: '#0075ff',
        bg_color: 'hsla( 0deg, 100%, 100%, 0.8)',
        ctrler_width: 80,
        font_size: 12,
        line_height: '1.5em',
        checkbox_true_display: '✔',
        input_styling: false,
    },target=window) {
        let defaultSettings = {
            updateWithCookieBoo: true,
            updateWithUrlBoo: true,
            displayBoo: true,
            autoHide: true,
            showToolsBoo: true,
            text_color: '#000',
            main_color: '#0075ffcc',
            bg_color: 'hsla( 0deg, 100%, 100%, 0.8)',
            ctrler_width: 100,
            font_size: 12,
            line_height: '1.5em',
            checkbox_true_display: '✔',
            input_styling: false
        };

        Object.keys(defaultSettings).map((k) => {
            if (!(k in settings)) {
                settings[k] = defaultSettings[k];
            }
        });

        this.target=target;
        this.name = 'p5js_Ctrler';
        this.id = this.name;
        this.version = '0.0.1';
        let existedDom = document.querySelectorAll(`[id*=${this.id}]`);
        if (existedDom.length > 0) {
            existedDom = [...existedDom].filter(dom => ['inner', 'header'].every(n => dom.id.indexOf(n) == -1));
            this.id += '_' + existedDom.length;
        }
        this.activeClassName = 'active';

        this.textcolor = settings.text_color,
            this.ctrlerwidth = settings.ctrler_width,
            this.fontsize = typeof settings.font_size == 'string' ? settings.font_size : settings.font_size + 'px',
            this.lineheight = typeof settings.line_height == 'string' ? settings.line_height : settings.line_height + 'px';
        this.bgcolor = settings.bg_color,
            this.maincolor = settings.main_color,
            this.checkboxtrue = settings.checkbox_true_display;

        this.divs = {}, this.nameCol = {}, this.ctrlers = {}, this.valueCol = {}, this.objArgs = {}, this.nameColWidth = 0;

        //设置外层容器
        this.container = this.target.createDiv();
        this.container.id(this.id);
        this.container.elt.setAttribute('p5_Ctrler_by_leizingyiu', 'visit:leizingyiu.net', '');
        this.displayBoo = settings.displayBoo;
        if (this.displayBoo == false) {
            this.container.elt.style.display = 'none';
        }

        //设置内层容器
        this.div = this.target.createDiv();
        this.div.id(this.id + '_inner');
        this.div.parent(this.container);

        // 设置是否从网址、cookie 加载 
        this.updateWithUrlBoo = settings.updateWithUrlBoo;
        this.updateWithCookieBoo = settings.updateWithCookieBoo;
        window.addEventListener('blur', () => {
            this.#saveValToCookie();
        });
        window.addEventListener('beforeunload', () => {
            this.#saveValToCookie();
        });

        //设置拖拽标签
        let dragDiv = this.target.createDiv();
        let dragP = this.target.createP(this.id);
        dragP.style('color:#fff');
        dragDiv.id(this.id + '_header');
        dragDiv.parent(this.container);
        dragP.parent(dragDiv);
        this.#dragElement(this.container.elt);

        // 设置工具按钮容器
        let ctrlDiv = this.target.createDiv();

        // 将变量输出成 var 语句
        let varBtn = this.target.createButton('var');
        varBtn.mousePressed(_ => {
            this.var();
        });

        let toJsonBtn = this.target.createButton('toJson');
        toJsonBtn.mousePressed(_ => {
            this.toJson();
        })

        // 讲变量值固定到 PC 的设置脚本
        let renewBtn = this.target.createButton('renew');
        renewBtn.mousePressed(_ => {
            let name = prompt('请填写变量名称', 'pc');
            this.renew(name);
        });

        // 重制所有数值，清除网址以及cookie中的数值
        let resetBtn = this.target.createButton('reset');
        resetBtn.mousePressed(_ => {
            Object.keys(this.ctrlers).map(k => {
                document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            });
            this.updateWithCookieBoo = false;
            let l = window.location;
            window.location = l.origin + l.pathname;
        });

        // 生成包含当前数值的网址
        let generateUrlBtn = this.target.createButton('generaUrl');
        generateUrlBtn.mousePressed(_ => {
            Object.keys(this.ctrlers).map(k => {
                this.#updateValToUrl(k);
            });
        });

        // 将工具按钮添加到整体容器
        if (settings.showToolsBoo == true) {
            [varBtn, toJsonBtn, renewBtn, resetBtn, generateUrlBtn].map(btn => {
                btn.parent(ctrlDiv)
            });
            ctrlDiv.parent(this.div);
        }


        // 美化 
        this.#mainStyle(settings);
        this.#scrollBeauty();
        if (settings.input_styling == true) { this.#inputKitBeauty() };
    }
    #mainStyle = function (settings = {
        updateWithCookieBoo: true, updateWithUrlBoo: true, displayBoo: true, autoHide: true, showToolsBoo: true, text_color: '#000', main_color: '#0075ff', bg_color: 'hsla( 0deg, 100%, 100%, 0.8)', ctrler_width: 100, font_size: 12, line_height: '1.5em', checkbox_true_display: '✔'
    }) {
        // 设置 整体样式
        let style = document.createElement('style'); {
            style.innerText = `
                    #${this.id} {
                    --border-radius:0.2em;
                    --main-color:${this.maincolor};
                    --unit-length:1em;
                    --transition-time:0.5s;
                    z-index:999;
                    position: absolute;
                    left: var(--unit-length);
                    bottom: var(--unit-length);
                    display: flex;
                    flex-direction: column;
                    padding:var(--unit-length);
                    border-radius: var(--border-radius);
                    background:${this.bgcolor};
                    box-shadow: 0px 0.2em 0px var(--main-color);
                    font-size:${this.fontsize};
                    line-height:${this.lineheight};
                
                    transition:padding var(--transition-time) ease,
                    opacity var(--transition-time) ease ,
                    transform var(--transition-time) ease,
                    height var(--transition-time) ease;
                               
                    user-select: none;
                    -webkit-user-select: none; 
                    -webkit-user-select: none; 
                    -moz-user-select: none;
                    -ms-user-select: none;
                    
                    }
                    ` + (settings.autoHide == true ? `  
                    #${this.id}  {
                    opacity:0.4;
                    transform:scale(72%,72%);
                    transform-origin: top left;
                    }
                    #${this.id}:hover,
                    #${this.id}.${this.activeClassName}{
                        opacity:1;
                        transform:scale(100%,100%);
                    }` : '') + `
        
                    #${this.id}  #${this.id}_header{
                    cursor: move;
                    height:0;
                    overflow:hidden;
                    align-items: center;
                    flex-direction: row;
                    justify-content: space-around;
                    background:var(--main-color);
        
                    border-radius: var(--border-radius) var(--border-radius) 0 0;
                    opacity:0;
        
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    padding: inherit;
                    padding-top: 0.72em;
                    padding-bottom: 0.72em;
        
                    transition:height 0.5s ease,
                     background 0.5s ease,
                     opacity 0.5s ease,
                     left 0.5s ease,
                     right 0.5s ease,
                     transform 0.5s ease;
        
                    }
                    #${this.id}:hover #${this.id}_header{
                    height:var(--unit-length);
                    background:var(--main-color);
                    opacity:1;
                    transition:height 0.5s ease, background 0.5s ease,opacity 0.5s ease;
                    }
                    #${this.id}  #${this.id}_header p{
                    color:#fff;
                    margin:0;
                    }
                    #${this.id} * {
                    position: relative;
                    vertical-align: middle;
                    transition:opacity 1s ease , transform 1s ease;
                    }
                    
                    #${this.id} div#${this.id + '_inner'} {
                        transition:
                        max-height var(--transition-time) ease,
                        max-width  var(--transition-time) ease;
                        overflow-y:scroll;
                        overflow-x:hidden;
                    }
                    #${this.id} div#${this.id + '_inner'}>div {
                    display: flex;
                    flex-direction: row;
                    margin-top: 0.5em;
                    }
        
                    #${this.id}>div:first-child{
                    margin-top: 0em;
                    }
        
                    #${this.id}>div>* {
                    margin-right: 1em;
                    }
                    
                    #${this.id}>div>* * {
                    margin: auto 0.2em;
                    }
                    
                    #${this.id} .disable{
                        opacity:0.32;
                    }
                    #${this.id} hr{
                        width:100%;
                        margin: 0.75em 0 0.5em;
                    }

                    #${this.id} textarea{
                        flex-grow:99;
                    }
`;
        };
        this.container.elt.appendChild(style);
    };

    #updateCtrlerDisplay = function () {
        Object.keys(this.nameCol).map(name => {
            this.nameColWidth = Math.max(this.nameColWidth, this.nameCol[name].width);
        });

        Object.keys(this.ctrlers).map(name => {
            let c = this.ctrlers[name];
            this.nameCol[name].size(this.nameColWidth);
        });

        [...Object.values(this.divs)].map(div => {
            [...div.elt.querySelectorAll('*')].map(d => {
                d.style.color = this.textcolor;
                d.style.display = 'flex';
            })
        })
    }

    #recordArgs = function () {
        let args = [...arguments];
        let name = args.shift();
        this.objArgs[name] = [...args];
    }
    #bindCtrler = function (name) {
        let that = this;
        {
            Object.defineProperty(this.target, name, {
                get: function () {
                    return that.getCtrlerVal(name);
                }
            });
        }

        this.nameCol[name].parent(this.divs[name]);
        this.ctrlers[name].parent(this.divs[name]);
        if (Object.keys(this.valueCol).indexOf(name) != -1) {
            this.valueCol[name].parent(this.divs[name]);
        }
        this.divs[name].parent(this.div);
        ['focus', 'focusin', 'change', 'input'].map(e => {
            this.ctrlers[name].elt.addEventListener(e, () => {
                this.container.elt.classList.add(this.activeClassName);
            });
        });

        ['blur', 'focusout'].map(e => {
            this.ctrlers[name].elt.addEventListener(e, () => {
                this.container.elt.classList.remove(this.activeClassName);
            });
        });

        if (['slider', 'color'].indexOf(this.ctrlers[name].type) != -1) {
            ['input', 'change'].map(ev => {
                this.ctrlers[name].elt.addEventListener(ev, _ => {
                    this.valueCol[name].elt.innerText = this.getCtrlerVal(name);
                });
            });
        }


    }

    #nameAndVal = function (name) {
        this.nameCol[name] = this.target.createSpan(`<span >${name}</span>`);
        this.nameCol[name].style('user-select:none');

        if (['slider', 'color'].indexOf(this.ctrlers[name].type) != -1) {
            this.valueCol[name] = this.target.createSpan(`<span '>${this.getCtrlerVal(name)}</span>`);
            this.valueCol[name].style('user-select:none');
        }
    }

    #initCtrler = function (name) {
        this.divs[name] = this.target.createDiv();
        this.#nameAndVal(name);
        this.#bindCtrler(name);
        this.#updateCtrlerDisplay();

        if (['fileinput'].indexOf(this.ctrlers[name].type) == -1) {
            if (this.updateWithCookieBoo == true) {
                this.#getValFromCookie(name);
            }
            if (this.updateWithUrlBoo == true) {
                this.ctrlers[name].elt.onchange = _ => {
                    this.#updateValToUrl(name);
                };
            }
            this.#getValFromUrl(name);
        }

        this.div.elt.style.setProperty("--container-h", this.container.elt.offsetHeight + 'px')
        this.div.elt.style.setProperty("--container-w", this.container.elt.offsetWidth + 'px')
    }

    slider(name = 'p5js_ctrler_slider', defaultVal = 1, minVal = Math.min(0, defaultVal), maxVal = 2 * Math.max(minVal, defaultVal, 1), precision = Math.max(maxVal, defaultVal, 1) / 10, fxn = () => { }) {
        switch (true) {
            case maxVal < minVal:
                throw (`" slider(${arguments}) " -----
slider(name, defaultVal, minVal, maxVal, precision, fxn = () => { })
maxVal need to bigger than minVal`);
                break;
            case [defaultVal, minVal, maxVal, precision].some(v => typeof v != 'number') == true:
                throw (`" slider(${arguments}) " -----
slider(name, defaultVal, minVal, maxVal, precision, fxn = () => { })
defaultVal, minVal, maxVal, precision need number`);
                break;
        }

        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createSlider(minVal, maxVal, defaultVal, precision);
        this.ctrlers[name].style('width', `${this.ctrlerwidth}px`);
        this.ctrlers[name].type = 'slider';
        this.ctrlers[name].input(fxn);
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    button(name = 'p5js_ctrler_btn', btnText = 'btn', fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createButton(btnText);
        this.ctrlers[name].mousePressed(fxn);
        this.ctrlers[name].type = 'button';
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    checkbox(name = 'p5js_ctrler_checkbox', defaultVal = false, labelText = ['yes', 'no'], fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createCheckbox(name, defaultVal);
        this.ctrlers[name].labelText = {
            'true': labelText[0],
            'false': labelText[1]
        };
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'checkbox';
        this.ctrlers[name].elt.style.display = 'flex';
        this.ctrlers[name].elt.querySelector('label').innerText = labelText[this.ctrlers[name].checked() ? 0 : 1];
        this.ctrlers[name].elt.oninput = _ => {
            this.ctrlers[name].elt.querySelector('label').innerText = labelText[this.ctrlers[name].checked() ? 0 : 1];
        };
        this.ctrlers[name].elt.onchange = _ => {
            this.ctrlers[name].elt.querySelector('label').innerText = labelText[this.ctrlers[name].checked() ? 0 : 1];
        };

        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    select(name = 'p5js_ctrler_select', options = [], fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createSelect(name);
        options.map(o => {
            this.ctrlers[name].option(o);
        });
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'select';
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    radio(name = 'p5js_ctrler_radio', options = [], fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createRadio(name);
        options.map(o => {
            if (o instanceof Array) {
                this.ctrlers[name].option(...o);
            } else {
                this.ctrlers[name].option(o, o);
            }
        });
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'radio';
        // this.ctrlers[name].elt.style.width = '100%';
        this.ctrlers[name].elt.style.display = 'flex';
        this.ctrlers[name].elt.style.whiteSpace = 'nowrap';
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    color(name = 'p5js_ctrler_color', defaultVal = '#369') {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createColorPicker(defaultVal);
        this.ctrlers[name].type = 'color';
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    input(name = 'p5js_ctrler_input', defaultVal = '', fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createInput(defaultVal);
        this.ctrlers[name].type = 'input';
        this.ctrlers[name].input(fxn);
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    textarea(name = "p5js_ctrler_textarea", defaultVal = '', fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createElement('textarea', defaultVal);

        this.ctrlers[name].type = 'textarea';
        this.ctrlers[name].input(fxn);

        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    fileinput(name = "p5js_ctrler_fileinput", fxn = () => { }) {
        this.#recordArgs(...arguments);
        this.ctrlers[name] = this.target.createFileInput(fxn);
        this.ctrlers[name].type = 'fileinput';
        this.#initCtrler(name);
        return this.ctrlers[name];
    }

    hr() {
        let hr = this.target.createElement('hr', '');
        hr.parent(this.div);
    }



    update(name, value) {

        if (value == null ||
            (['select', 'radio'].indexOf(this.ctrlers[name].type) != -1 &&
                (this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == null ||
                    this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == undefined)
            )) {
            // console.log('name: ', name, '\nvalue: ', value, '\n typeof value: ', typeof value, '\nvalue == null :', value == null, '  \n',
            //     'this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == null , undefined :  ',
            //     this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == null,
            //     this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == undefined);
            return;
        }

        switch (this.ctrlers[name].type) {
            case 'checkbox':
                this.ctrlers[name].elt.querySelector('input').checked = (value == 'true') || value != false;
                this.ctrlers[name].elt.querySelector('label').innerText = this.ctrlers[name].labelText[this.ctrlers[name].checked()];
                break;
            case 'select':
                this.ctrlers[name].elt.querySelector(`[value="${value}"]`).selected = true;
            case 'radio':
                this.ctrlers[name].elt.querySelector(`[value="${value}"]`).click();
                break;
            default:
                this.ctrlers[name].elt.value = value;
                break;
        }
        if (name in this.valueCol) {
            this.valueCol[name].elt.innerText = this.getCtrlerVal(name);
        }
    }

    disable(name) {
        this.divs[name].elt.classList.add('disable');
        this.ctrlers[name].elt.setAttribute('disabled', true);
    }

    enable(name) {
        this.divs[name].elt.classList.remove('disable');
        this.ctrlers[name].elt.removeAttribute('disabled');
    }

    range(name, min, max) {
        this.ctrlers[name].elt.setAttribute('min', min);
        this.ctrlers[name].elt.setAttribute('max', max);
        this.update(name, Math.max(Math.min(this.ctrlers[name].elt.value, max), min));
    }

    getCtrlerVal(name) {
        let that = this;
        switch (that.ctrlers[name].type) {
            case 'checkbox':
                return that.ctrlers[name].checked();
                break;
            case 'select':
                return that.ctrlers[name].selected();
                break;
            case 'radio':
                let radioResult = that.ctrlers[name].selected();
                if (radioResult == null) {
                    return null;
                } else {
                    return that.ctrlers[name].selected().value;
                }
                break;
            default:
                return that.ctrlers[name].value();
                break;
        }
    }

    var() {

        let result = 'var ';
        Object.keys(this.ctrlers).map((k, idx, arr) => {
            let v = this.getCtrlerVal(k);
            if (v == '') {
                result += k;
            } else if (typeof this.getCtrlerVal(k) == 'string') {
                result += `${k}="${v}"`;
            } else {
                result += `${k}=${v}`;
            }
            if (idx < arr.length - 1) {
                result += ',';
            }
        });
        result = result.replace(/,/g, ',\n\t') + ';';
        this.#copyStr(result);
        return result;
    }

    toJson() {
        let result = '{';
        Object.keys(this.ctrlers).map((k, idx, arr) => {
            let v = this.getCtrlerVal(k);
            if (v == '') {
                return;
            }
            if (typeof this.getCtrlerVal(k) == 'string') {
                result += `"${k}":"${v}"`;
            } else {
                result += `"${k}":${v}`;
            }
            if (idx < arr.length - 1) {
                result += ',';
            }
        });
        result = result.replace(/,/g, ',\n\t') + '}';
        this.#copyStr(result);
        return result;
    }
    renew(varname) {
        let result = `var ${varname} ; \n${varname}=new PC(${this.displayBoo});\n`;

        Object.keys(this.ctrlers).map((k, idx, arr) => {
            let args = this.objArgs[k];
            if (args) {
                if ('slider,checkbox,color,input'.split(',').indexOf(this.ctrlers[k].type) != -1) {
                    args[0] = this.getCtrlerVal(k);
                }


                args = args.map(a => {
                    if (['number', 'boolean'].indexOf(typeof a) != -1) {
                        return a;
                    } else if (typeof a == 'string') {
                        return `'${a}'`;
                    } else if (a instanceof Array) {
                        return `[${a.map(b => `'${b}'`).join(',')}]`;
                    } else if (typeof a == 'function') {
                        return a.toString();
                    } else {
                        try {
                            let A = this.#yiu_Reflect(window, a);
                            varArray[A] = String(a);
                            return A;
                        } catch (err) {
                            console.error(err);
                            return a;
                        }
                    }
                });
            } else {
                args = [];
            }
            result += `${varname}.${this.ctrlers[k].type}("${k}",${args.join(',')});\n`;
        });


        this.#copyStr(result);
        return result;
    }
    load(keyValObj) {
        Object.keys(keyValObj).map(k => {
            if (k in this.ctrlers) {
                this.update(k, keyValObj[k]);
            }
        })
    };
    #getValFromCookie = function (name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        // let cookie = {};
        document.cookie.split('; ').map(c => {
            let [k, v] = c.split('=');
            if (args.indexOf(k) != -1) {
                if (this.ctrlers[k].type == 'fileinput') {
                    return;
                }
                this.update(k, v);
            }
            // cookie[k] = v;
        });
    };
    #saveValToCookie = function (name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        if (this.updateWithCookieBoo == true) {
            args.map(k => {
                if (this.ctrlers[k].type == 'fileinput') {
                    return;
                }
                document.cookie = `${k}=${this.getCtrlerVal(k)}; `;
            });
        }
    };
    #getValFromUrl = function (name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        let url = new URL(document.location.href);
        args.map(n => {
            if (this.ctrlers[n].type == 'fileinput') {
                return;
            }
            if (url && url.searchParams.has(n)) {
                let v = url.searchParams.get(n);
                this.update(n, v);
            }
        });
    };
    #updateValToUrl = function (name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        let url = new URL(window.location.href);
        args.map(n => {
            if (this.ctrlers[n].type == 'fileinput') {
                return;
            }
            if (url && url.searchParams.has(n)) {
                url.searchParams.set(n, this.getCtrlerVal(n));
            } else {
                url.searchParams.append(n, this.getCtrlerVal(n));
            }
        });
        history.pushState('', '', url.toString());
    }
    #yiu_Reflect = function (obj, vari) {
        return Object.keys(obj).filter(k => Object.is(obj[k], vari)).toString();
    };

    #copyStr = function (str) {
        var a = document.createElement("textarea");
        a.value = str;
        document.body.appendChild(a);
        a.select();
        document.execCommand("Copy");
        a.style.display = "none";
        window.alert(str + "内容已复制到剪贴板");
    };



    #dragElement = (elmnt) => {
        /*// base on https://c.runoob.com/codedemo/5370/ */
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let stickAttrName = 'stick';
        let that = {};

        that.hideBoo = false;
        that.hideX = window.innerWidth;
        that.hideY = window.innerHeight;
        that.l = 0, that.t = 0, that.w = 0, that.h = 0;

        that.updated = true;

        that.elementDrag = function (e) {

            e = e || window.event;
            that.l = elmnt.offsetLeft,
                that.t = elmnt.offsetTop,
                that.w = elmnt.offsetWidth,
                that.h = elmnt.offsetHeight;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = Math.max(0, Math.min((that.t - pos2), window.innerHeight - that.h)) + "px";
            elmnt.style.left = Math.max(0, Math.min((that.l - pos1), window.innerWidth - that.w)) + "px";
            elmnt.style.bottom = 'unset';
            elmnt.style.right = 'unset';

            if (that.l + that.w < window.innerWidth && that.l > 0 && that.t + that.h < window.innerHeight && that.t > 0) {
                elmnt.removeAttribute(stickAttrName);
            }

        }

        that.attrAddVal = function (attr, val, replaceReg = val) {
            if (!(val instanceof Array)) {
                val = [val];
            }
            if (arguments.length <= 2) {
                replaceReg = new RegExp(val.map(v => '(' + v + ')').join('|'));
            }
            let oV = elmnt.getAttribute(attr);
            oV = oV == null ? [] : oV.split(' ');
            oV = oV.concat(val);
            oV = [...new Set(oV)];
            elmnt.setAttribute(attr, oV.join(' '));
        };

        that.attrRemoveVal = function (attr, val) {
            if (!val instanceof Array) {
                val = [val];
            }
            let oV = elmnt.getAttribute(attr);
            if (oV == null) {
                return;
            } else {
                oV = oV.split(' ');
            }
            oV = oV.filter(v => val.indexOf(v) == -1);
            oV = [...new Set(oV)];
            elmnt.setAttribute(attr, oV.join(' '));
            if (elmnt.getAttribute(attr) == '') {
                elmnt.removeAttribute(attr);
            }
        };

        that.updateStatus = () => {
            let before = elmnt.getAttribute(stickAttrName);
            console.log(this.target);
            
            switch (true) {
                case that.l + that.w < this.target.windowWidth / 2 && that.t + that.h < this.target.windowHeight / 2:
                    elmnt.style.transformOrigin = 'top left';
                    break;
                case that.l + that.w < this.target.windowWidth / 2 && that.t + that.h > this.target.windowHeight / 2:
                    elmnt.style.transformOrigin = 'bottom left';
                    break;
                case that.l + that.w > this.target.windowWidth / 2 && that.t + that.h < this.target.windowHeight / 2:
                    elmnt.style.transformOrigin = 'top right';
                    break;
                case that.l + that.w > this.target.windowWidth / 2 && that.t + that.h > this.target.windowHeight / 2:
                    elmnt.style.transformOrigin = 'bottom right';
                    break;
                default:
                    elmnt.style.transformOrigin = 'center center';
            };

            if (that.l + that.w >= window.innerWidth) {
                that.attrAddVal(stickAttrName, 'right');
                that.attrRemoveVal(stickAttrName, ['left']);
                elmnt.style.right = 0,
                    elmnt.style.left = 'unset';
            } else if (that.l == 0) {
                that.attrAddVal(stickAttrName, 'left');
                that.attrRemoveVal(stickAttrName, ['right']);
                elmnt.style.right = 'unset',
                    elmnt.style.left = 0;
            } else {
                that.attrRemoveVal(stickAttrName, ['right', 'left']);
            }
            if (that.t + that.h >= window.innerHeight) {
                that.attrAddVal(stickAttrName, 'bottom');
                that.attrRemoveVal(stickAttrName, ['top']);
                elmnt.style.top = 'unset',
                    elmnt.style.bottom = 0;
            } else if (that.t == 0) {
                that.attrAddVal(stickAttrName, 'top');
                that.attrRemoveVal(stickAttrName, ['bottom']);
                elmnt.style.top = 0,
                    elmnt.style.bottom = 'unset';
            } else {
                that.attrRemoveVal(stickAttrName, ['top', 'bottom']);
            }
            let after = elmnt.getAttribute(stickAttrName);
            return !(before == after);
        };
        that.closeDragElement = function () {
            that.updateStatus();
            document.onmouseup = null;
            document.onmousemove = null;
        }
        that.dragMouseDown = function (e) {
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = that.closeDragElement;
            document.onmousemove = that.elementDrag;
        }

        if (document.getElementById(elmnt.id + "_header")) {
            document.getElementById(elmnt.id + "_header").onmousedown = that.dragMouseDown;
        } else {
            elmnt.onmousedown = that.dragMouseDown;
        }

        let style = document.createElement('style');
        style.setAttribute('styleFor', 'dragElement');
        style.innerText = `
        #${this.id}[${stickAttrName}*=top] #${this.id}_header {
            top: 100%;
            bottom:unset;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
          }

          #${this.id}[${stickAttrName}*=top]:hover #${this.id}_header{
            height:1em;
            background:var(--main-color);
            opacity:1;
            transition:height 0.5s ease, background 0.5s ease,opacity 0.5s ease;
         }

        #${this.id}[${stickAttrName}]{
            transform:scale(100%,100%)!important;
        }
        
        #${this.id}[${stickAttrName}*=top],
        #${this.id}[${stickAttrName}*=bottom]
        {
            padding:0 var(--unit-length)!important;
        }
     
        #${this.id}[${stickAttrName}*=left],
        #${this.id}[${stickAttrName}*=right]
        {
            padding: var(--unit-length) 0;
        }


        #${this.id}[${stickAttrName}*=top]:hover,
        #${this.id}[${stickAttrName}*=bottom]:hover,
        #${this.id}[${stickAttrName}*=left]:hover,
        #${this.id}[${stickAttrName}*=right]:hover,
        #${this.id}[${stickAttrName}]:hover{
            padding:var(--unit-length) var(--unit-length)!important;
        }
        
        #${this.id}[${stickAttrName}]:hover #${this.id}_inner{
            max-height: var(--container-h);
            max-width: var(--container-w);
        }
           
        #${this.id}[${stickAttrName}*=top] #${this.id}_inner,
        #${this.id}[${stickAttrName}*=bottom] #${this.id}_inner
        {
            max-height:0;
            max-width: var(--container-w)!important;
        }
     
        #${this.id}[${stickAttrName}*=left] #${this.id}_inner
        {
            max-width:0;
        }
        #${this.id}[${stickAttrName}*=right] #${this.id}_inner
        {
            max-width:0;
        }
        
        #${this.id}[${stickAttrName}] #${this.id}_header{
            height:var(--unit-length)!important;
            opacity:1;
            padding-left:var(--unit-length) ;
            padding-right:var(--unit-length) ;
        }

        #${this.id}[${stickAttrName}*=top] #${this.id}_header{
            border-radius: 0 0  var(--border-radius) var(--border-radius);
        }
        
        #${this.id}[${stickAttrName}*=bottom] #${this.id}_header
        {
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
     
        
        #${this.id}[${stickAttrName}*=left] #${this.id}_header{
            border-radius:0  var(--border-radius) var(--border-radius) 0 ;
        }
        #${this.id}[${stickAttrName}*=right] #${this.id}_header
        {
            left:unset;
            right:0;
            border-radius: var(--border-radius) 0 0 var(--border-radius) ;
          
        }
        
        #${this.id}[${stickAttrName}*=left]{
            left:0;
            right:unset;
        }
        #${this.id}[${stickAttrName}*=right]{
            left:unset;
            right:0;
        }
        #${this.id}[${stickAttrName}*=top]{
            top:0;
            bottom:unset;
        }
        #${this.id}[${stickAttrName}*=bottom]{
            top:unset;
            bottom:0;
        }
        `;
        this.container.elt.appendChild(style);
    }

    #scrollBeauty = () => {
        let style = document.createElement('style');
        style.innerText = `
       [id*=${this.id.replace(/\d*$/g, '')}] ::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }

        [id*=${this.id.replace(/\d*$/g, '')}]::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.08);
        }

        [id*=${this.id.replace(/\d*$/g, '')}] *:hover::-webkit-scrollbar-thumb,
        [id*=${this.id.replace(/\d*$/g, '')}]:hover::-webkit-scrollbar-thumb  {
            background: rgba(0, 0, 0, 0.32);
        }

        [id*=${this.id.replace(/\d*$/g, '')}]::-webkit-scrollbar-track {
            border-radius: 0;
            background: rgba(0, 0, 0, 0);
        }

        [id*=${this.id.replace(/\d*$/g, '')}] *,
        [id*=${this.id.replace(/\d*$/g, '')}] {
            scrollbar-color: rgba(0, 0, 0, 0.02) rgba(0, 0, 0, 0);
            scrollbar-width: thin;
        }

        [id*=${this.id.replace(/\d*$/g, '')}] *:hover,
        [id*=${this.id.replace(/\d*$/g, '')}]:hover {
            scrollbar-color: rgba(0, 0, 0, 0.08) rgba(0, 0, 0, 0);
            scrollbar-width: thin;
        }`;

        style.name = this.id + '_style_beauty';
        if (document.querySelectorAll(style.name).length == 0) {
            document.body.appendChild(style);
        }

    }

    #inputKitBeauty = function (styleInnerCSSText) {

        let style = document.createElement('style');
        if (arguments.length == 0) {
            style.innerHTML = `
        [id*=${this.name}] input {
            --input-unit-length: 1em;
            --input-main-color: #06f;
            --input-gray-color: #ccc;
        }

        [id*=${this.name}]  input:checked,
        [id*=${this.name}]    input:focus,
        [id*=${this.name}]    input:active {
            outline: 1px solid var(--input-main-color)  
        }

        [id*=${this.name}]   input[type=range],
        [id*=${this.name}]   input[type="radio"],
        [id*=${this.name}]   input[type="checkbox"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 1px solid var(--input-gray-color)
        }

        [id*=${this.name}]   input[type=range] {
            width: 100%;
            background: var(--input-main-color);
            background-size: 75% 100%;
            height: calc(var(--input-unit-length) * 0.2);
            border-radius: calc(var(--input-unit-length) * 0.2);
            outline-width: 0;
        }

        [id*=${this.name}]  input[type=range]::-webkit-slider-thumb {
            height: var(--input-unit-length);
            width: var(--input-unit-length);
            background: #fff;
            border-radius: 50%;
            /* border: solid 1px #ddd; */
            z-index: 999;
        }

        [id*=${this.name}]  input[type="radio"] {
            display: inline-block;
            width: var(--input-unit-length);
            height: var(--input-unit-length);
            padding: calc(var(--input-unit-length) / 6);
            background-clip: content-box;
            border-radius: 50%;
        }

        [id*=${this.name}]   input[type="radio"]:checked {
            background-color: var(--input-main-color);
        }

        [id*=${this.name}]   input[type="checkbox"] {
            display: inline-block;
            width: var(--input-unit-length);
            height: var(--input-unit-length);
            padding: calc(var(--input-unit-length) / 12);
            background-clip: content-box;
            /* border: 1px solid #bbbbbb; */
            background-color: #e7e6e7;
            border-radius: 0px;
        }

        [id*=${this.name}]   input[type="checkbox"]:checked {
            background-color: var(--input-main-color);
            padding: 0;
            border-radius: 0%;
        }

        [id*=${this.name}]   input[type='checkbox']:checked::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: var(--input-unit-length);
            height: var(--input-unit-length);
            content: '${this.checkboxtrue ? this.checkboxtrue : '✔'}';
            color: #fff;
            font-size: var(--input-unit-length);
            font-weight: 500;
            /* background-color: green; */
            border-radius: 2px;
        }
        
        [id*=${this.name}] input[type="file"]{
            outline:none;
        }
        [id*=${this.name}] input[type="file"]::-webkit-file-upload-button  {
            font-size:calc( var(--input-unit-length) *0.64); 
            background: var(--input-main-color);
            border: 0;
            padding:calc( var(--input-unit-length) /4) ;
            cursor: pointer;
            color: #fff;
            border-radius: .2em;
        }
        [id*=${this.name}] input[type="file"]::-ms-browse   {
            font-size:calc( var(--input-unit-length) *0.64);
            background: var(--input-main-color);
            border: 0;
            padding:calc( var(--input-unit-length) /4) ;
            cursor: pointer;
            color: #fff;
            border-radius: .2em;
        }
          
      
        
          `;
        } else {
            style.innerHTML = '';
        }
        if (!document.querySelector(`[name=${this.name}]`)) {
            document.body.appendChild(style);
            style.setAttribute('name', this.name);

        }
    }
}

export {PC};