// Created: 2022/02/27 01:20:00
// Last modified: "2022/04/07 12:35:30"

class PC {
    constructor(settings = {
        updateWithCookieBoo: true,
        updateWithUrlBoo: true,
        displayBoo: true,
        autoHide: true,
        showToolsBoo: true,
        textcolor: '#000',
        ctrlerWidth: 80,
        fontsize: 12,
        divPos: [20, windowHeight - 40],
        pos: [10, 10],
        posDirection: -1
    }) {
        let defaultSettings = {
            updateWithCookieBoo: false,
            updateWithUrlBoo: true,
            displayBoo: true,
            autoHide: true,
            showToolsBoo: true,
            textcolor: '#000',
            ctrlerWidth: 80,
            fontsize: 12,
            divPos: [20, windowHeight - 40],
            pos: [10, 10],
            posDirection: -1
        };

        Object.keys(defaultSettings).map((k) => {
            if (!(k in settings)) {
                settings[k] = defaultSettings[k];
            }
        });

        this.id = 'P5JS_Ctrler';
        let existedDom = document.querySelectorAll(`[id*=${this.id}]`);
        if (existedDom.length > 0) {
            existedDom = [...existedDom].filter(dom => ['inner', 'header'].every(n => dom.id.indexOf(n) == -1));
            this.id += '_' + existedDom.length;
        }
        this.activeClassName = 'active';

        this.textcolor = settings.textcolor, this.ctrlerWidth = settings.ctrlerWidth, this.fontsize = settings.fontsize, this.lineHeight = settings.lineHeight;

        this.divPos = settings.divPos, this.pos = settings.pos, this.posDir = settings.posDirection;

        this.divs = {}, this.nameCol = {}, this.ctrlers = {}, this.valueCol = {}, this.objArgs = {};

        this.nameColWidth = 0, this.num = 0;

        //设置外层容器
        this.container = createDiv();
        this.container.id(this.id);
        this.container.elt.setAttribute('P5_Ctrler_by_leizingyiu', 'visit:leizingyiu.net', '');
        this.displayBoo = settings.displayBoo;
        if (this.displayBoo == false) {
            this.container.elt.style.display = 'none';
        }

        this.div = createDiv();
        this.div.id(this.id + '_inner');
        this.div.parent(this.container);

        // 设置是否从网址、cookie 加载 
        this.updateWithUrlBoo = settings.updateWithUrlBoo;
        this.updateWithCookieBoo = settings.updateWithCookieBoo;
        window.addEventListener('blur', () => {
            this.saveValToCookie();
        });
        window.addEventListener('beforeunload', () => {
            this.saveValToCookie();
        });


        // 设置 整体样式
        let style = document.createElement('style'); {
            style.innerText = `
            #${this.id} {
                --border-radius:0.2em;
                --blue-color:#0075ffff;
                --light-blue-color:##0075ff96;
            z-index:999;
            position: absolute;
            left: 1em;
            bottom: 1em;
            display: flex;
            flex-direction: column;
            padding:1em;
            border-radius: var(--border-radius);
            background: hsla( 0deg, 100%, 100%, 1);
            box-shadow: 0px 0.2em 0px var(--blue-color);
            font-size:${this.fontsize}px;
            line-height:1.5em;}
            ` + (settings.autoHide == true ? `  
            #${this.id}  {
            opacity:0.4;
            // transform:translate(0,90%);
            transform:scale(72%,72%);
            transform-origin: top left;
            transition:opacity 1s ease , transform 1s ease;
            
            }
            #${this.id}:hover,
            #${this.id}.${this.activeClassName}{
                opacity:1;
                // transform:translate(0,0%);
                transform:scale(100%,100%);

            }` : '') + `

            #${this.id}  #${this.id}_header{
                cursor: move;
                height:0em;
                overflow:hidden;
                align-items: center;
                flex-direction: row;
                justify-content: space-around;
                background:var(--blue-color);

                border-radius: var(--border-radius) var(--border-radius) 0 0;
                opacity:0;

                position: absolute;
                bottom: 100%;
                left: 0;
                padding: inherit;
                padding-top: 0.72em;
                padding-bottom: 0.72em;

                transition:height 0.5s ease, background 0.5s ease,opacity 0.5s ease;

            }
            #${this.id}:hover #${this.id}_header{
               height:1em;
               background:var(--blue-color);
               opacity:1;
               transition:height 0.5s ease, background 0.5s ease,opacity 0.5s ease;
            }
            #${this.id}  #${this.id}_header p{
                color:#fff;
                background:var(--light-blue-color);
margin:0;
            }
            #${this.id} * {
            position: relative;
            vertical-align: middle;
            transition:opacity 1s ease , transform 1s ease;
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

            `;
        };

        this.dragEvent = {};
        document.body.appendChild(style);
        let dragDiv = createDiv();
        let dragP = createP(this.id);
        dragP.style('color:#fff');
        dragDiv.id(this.id + '_header');
        dragDiv.parent(this.container);
        dragP.parent(dragDiv);
        this.dragElement(this.container.elt);

        // 设置工具按钮容器
        let ctrlDiv = createDiv();

        // 将变量输出成 var 语句
        let varBtn = createButton('var');
        varBtn.mousePressed(_ => {
            this.var();
        });

        let toJsonBtn = createButton('toJson');
        toJsonBtn.mousePressed(_ => {
            this.toJson();
        })

        // 讲变量值固定到 PC 的设置脚本
        let renewBtn = createButton('renew');
        renewBtn.mousePressed(_ => {
            let name = prompt('请填写变量名称', 'pc');
            this.renew(name);
        });

        // 重制所有数值，清除网址以及cookie中的数值
        let resetBtn = createButton('reset');
        resetBtn.mousePressed(_ => {
            Object.keys(this.ctrlers).map(k => {
                document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            });
            this.updateWithCookieBoo = false;
            let l = window.location;
            window.location = l.origin + l.pathname;
        });

        // 生成包含当前数值的网址
        let generateUrlBtn = createButton('generaUrl');
        generateUrlBtn.mousePressed(_ => {
            Object.keys(this.ctrlers).map(k => {
                this.updateValToUrl(k);
            });
        });

        // 将工具按钮添加到整体容器
        if (settings.showToolsBoo == true) {
            [varBtn, toJsonBtn, renewBtn, resetBtn, generateUrlBtn].map(btn => {
                btn.parent(ctrlDiv)
            });
            ctrlDiv.parent(this.div);
        }


    }

    updateCtrlerDisplay() {
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

    recordArgs() {
        let args = [...arguments];
        let name = args.shift();
        this.objArgs[name] = [...args];
    }
    bindCtrler(name) {
        let that = this; {
            Object.defineProperty(window, name, {
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
                // console.log(e);
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

    nameAndVal(name) {
        this.nameCol[name] = createSpan(`<span >${name}</span>`);
        this.nameCol[name].style('user-select:none');

        if (['slider', 'color'].indexOf(this.ctrlers[name].type) != -1) {
            this.valueCol[name] = createSpan(`<span '>${this.getCtrlerVal(name)}</span>`);
            this.valueCol[name].style('user-select:none');
        }
    }

    initCtrler(name) {


        this.num += 1;
        this.divs[name] = createDiv();
        this.nameAndVal(name);
        this.bindCtrler(name);
        this.updateCtrlerDisplay();

        if (['file'].indexOf(this.ctrlers[name].type) == -1) {
            if (this.updateWithCookieBoo == true) {
                this.getValFromCookie(name);
            }
            if (this.updateWithUrlBoo == true) {
                this.ctrlers[name].elt.onchange = _ => {
                    this.updateValToUrl(name);
                };
            }
            this.getValFromUrl(name);
        }
    }
    getValFromUrl(name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        let url = new URL(document.location.href);
        args.map(n => {
            if (url && url.searchParams.has(n)) {
                let v = url.searchParams.get(n);
                this.update(n, v);
            }
        });
    }
    updateValToUrl(name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        let url = new URL(window.location.href);
        args.map(n => {
            if (url && url.searchParams.has(n)) {
                url.searchParams.set(n, this.getCtrlerVal(n));
            } else {
                url.searchParams.append(n, this.getCtrlerVal(n));
            }
        });
        history.pushState('', '', url.toString());
    }


    slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { }) {
        if (defaultVal == 0) {
            minVal = 0,
                maxVal = 10,
                precision = 1;
        }
        this.recordArgs(...arguments);
        this.ctrlers[name] = createSlider(minVal, maxVal, defaultVal, precision);
        this.ctrlers[name].style('width', `${this.ctrlerWidth}px`);
        this.ctrlers[name].type = 'slider';
        this.ctrlers[name].input(fxn);
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    button(name, btnText, fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createButton(btnText);
        this.ctrlers[name].mousePressed(fxn);
        this.ctrlers[name].type = 'button';
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createCheckbox(name, defaultVal);
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

        this.initCtrler(name);
        return this.ctrlers[name];
    }

    select(name, options = [], fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createSelect(name);
        options.map(o => {
            this.ctrlers[name].option(o);
        });
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'select';
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    radio(name, options = [], fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createRadio(name);
        options.map(o => {
            this.ctrlers[name].option(o);
        });
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'radio';
        // this.ctrlers[name].elt.style.width = '100%';
        this.ctrlers[name].elt.style.display = 'flex';
        this.ctrlers[name].elt.style.whiteSpace = 'nowrap';
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    color(name, defaultVal = '#369') {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createColorPicker(defaultVal);
        this.ctrlers[name].type = 'color';
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    input(name, defaultVal = '', fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createInput(defaultVal);
        this.ctrlers[name].type = 'input';
        this.ctrlers[name].input(fxn);
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    fileinput(name, fxn = () => { }) {
        this.recordArgs(...arguments);
        this.ctrlers[name] = createFileInput(fxn);
        this.ctrlers[name].type = 'file';
        this.initCtrler(name);
        return this.ctrlers[name];
    }

    hr() {
        let hr = createElement('hr', '');
        hr.parent(this.div);
    }

    myReflect(obj, vari) {
        return Object.keys(obj).filter(k => Object.is(obj[k], vari)).toString();
    }

    copyStr(str) {
        var a = document.createElement("textarea");
        a.value = str;
        document.body.appendChild(a);
        a.select();
        document.execCommand("Copy");
        a.style.display = "none";
        window.alert(str + "内容已复制到剪贴板");
    };

    update(name, value) {

        if (value == null ||
            (['select', 'radio'].indexOf(this.ctrlers[name].type) != -1 && (this.ctrlers[name].elt.querySelector(`[value="${value}"]`) == null ||
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
        // console.log(this);

        let result = 'var ';
        Object.keys(this.ctrlers).map((k, idx, arr) => {
            let v = this.getCtrlerVal(k);
            // console.log('k:', k, ' v : ', v, ' : ', typeof v);
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
        // console.log(result);
        this.copyStr(result);
        return result;
    }

    toJson() {
        let result = '{';
        Object.keys(this.ctrlers).map((k, idx, arr) => {
            let v = this.getCtrlerVal(k);
            // console.log('k:', k, ' v : ', v, ' : ', typeof v);
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
        // console.log(result);
        this.copyStr(result);
        return result;
    }
    renew(varname) {
        let result = `var ${varname} ; \n${varname}=new PC(${this.displayBoo});\n`;
        // let varArray = {};
        // console.log(this.objArgs);

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
                            let A = this.myReflect(window, a);
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

        // let varString = 'const ' + Object.keys(varArray).map(v => `${v}=${varArray[v]}`).join(',\n') + ';\n'
        // result = varString + result;
        this.copyStr(result);
        return result;
    }

    getValFromCookie(name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        let cookie = {};
        document.cookie.split('; ').map(c => {
            let [k, v] = c.split('=');
            if (args.indexOf(k) != -1) {
                this.update(k, v);
            }
            cookie[k] = v;
        });
    }
    saveValToCookie(name) {
        let args = [];
        if (arguments.length == 0) {
            args = Object.keys(this.ctrlers);
        } else {
            args = [...arguments];
        }

        if (this.updateWithCookieBoo == true) {
            args.map(k => {
                document.cookie = `${k}=${this.getCtrlerVal(k)}; `;
            });
        }
    }

    load(keyValObj) {
        Object.keys(keyValObj).map(k => {
            if (k in this.ctrlers) {
                this.update(k, keyValObj[k]);
            }
        })
    }

    dragElement(elmnt) {
        /*//https://c.runoob.com/codedemo/5370/ */
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let dragFuncObj = {};
        dragFuncObj.hideBoo = false;
        dragFuncObj.hideX = window.innerWidth;
        dragFuncObj.hideY = window.innerHeight;

        dragFuncObj.elementDrag = function (e) {
            e = e || window.event;
            let l = elmnt.offsetLeft,
                t = elmnt.offsetTop,
                w = elmnt.offsetWidth,
                h = elmnt.offsetHeight;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = Math.max(0, Math.min((t - pos2), window.innerHeight - h)) + "px";
            elmnt.style.left = Math.max(0, Math.min((l - pos1), window.innerWidth - w)) + "px";
            elmnt.style.bottom = 'unset';
            elmnt.style.right = 'unset';
            switch (true) {
                case l + w < windowWidth / 2 && t + h < windowHeight / 2:
                    elmnt.style.transformOrigin = 'top left';
                    break;
                case l + w < windowWidth / 2 && t + h > windowHeight / 2:
                    elmnt.style.transformOrigin = 'bottom left';
                    break;
                case l + w > windowWidth / 2 && t + h < windowHeight / 2:
                    elmnt.style.transformOrigin = 'top right';
                    break;
                case l + w > windowWidth / 2 && t + h > windowHeight / 2:
                    elmnt.style.transformOrigin = 'bottom right';
                    break;
                default:
                    elmnt.style.transformOrigin = 'center center';
            }
        }

        dragFuncObj.closeDragElement = function () {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
        dragFuncObj.dragMouseDown = function (e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = dragFuncObj.closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = dragFuncObj.elementDrag;
        }

        if (document.getElementById(elmnt.id + "_header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "_header").onmousedown = dragFuncObj.dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragFuncObj.dragMouseDown;
        }

    }
}
