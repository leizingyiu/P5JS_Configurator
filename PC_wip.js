// Created: 2022/02/27 01:20:00
// Last modified: "2022/04/28 18:31:08"

class PC {

    constructor(settings = {
        updateWithCookieBoo: true,
        updateWithUrlBoo: true,
        displayBoo: true,
        autoHideBoo: true,
        showToolsBoo: true,
        text_color: '#000',
        main_color: '#0075ffcc',
        bg_color: 'hsla( 0deg, 100%, 100%, 0.8)',
        ctrler_width: 100,
        font_size: 12,
        line_height: '1.5em',
        checkbox_true_display: '✔',
        input_styling: false,
    }) {
        const defaultSettings = {
            updateWithCookieBoo: true,
            updateWithUrlBoo: true,
            displayBoo: true,
            autoHideBoo: true,
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

        this.settings = settings;

        this.name = 'p5js_Ctrler';
        this.id = this.name;
        this.version = '0.1.0';
        let existedDom = document.querySelectorAll(`[id*=${this.id}]`);
        if (existedDom.length > 0) {
            existedDom = [...existedDom].filter(dom => ['inner', 'header'].every(n => dom.id.indexOf(n) == -1));
            this.id += '_' + existedDom.length;
        }
        this.activeClassName = 'active';

        this.textcolor = this.settings.text_color,
            this.ctrlerwidth = Number(String(this.settings.ctrler_width).replace(/[^\d]/g, '')),
            this.fontsize = typeof this.settings.font_size == 'string' ? this.settings.font_size : this.settings.font_size + 'px',
            this.lineheight = typeof this.settings.line_height == 'string' ? this.settings.line_height : this.settings.line_height + 'px';
        this.bgcolor = this.settings.bg_color,
            this.maincolor = this.settings.main_color,
            this.checkboxtrue = this.settings.checkbox_true_display;

        // 容器声明
        this.ctrlerDivs = {}, this.nameCol = {}, this.ctrlers = {}, this.valueCol = {}, this.groups = {}, this.groupNames = {}, this.objArgs = {}, this.nameColWidth = 0;

        this.#_parentTarget = this.ctrlersContainer;

        //设置外层容器
        this.mainContainer = createDiv();
        this.mainContainer.id(this.id);
        this.mainContainer.elt.setAttribute('p5_Ctrler_by_leizingyiu', 'visit:leizingyiu.net', '');
        this.displayBoo = settings.displayBoo;
        if (this.displayBoo == false) {
            this.mainContainer.elt.style.display = 'none';
        }

        //设置内层容器
        this.ctrlersContainer = createDiv();
        this.ctrlersContainer.id(this.id + '_inner');
        this.ctrlersContainer.parent(this.mainContainer);

        // 初始化控制器和组的parent
        this.#setParentTarget();

        // 设置是否从网址、cookie 加载 
        this.updateWithUrlBoo = this.settings.updateWithUrlBoo;
        this.updateWithCookieBoo = this.settings.updateWithCookieBoo;
        window.addEventListener('blur', () => {
            this.#saveValToCookie();
        });
        window.addEventListener('beforeunload', () => {
            this.#saveValToCookie();
        });

        //设置拖拽标签
        const dragDiv = createDiv();
        const dragP = createP(this.id);
        dragP.style('color:#fff');
        dragDiv.id(this.id + '_header');
        dragDiv.parent(this.mainContainer);
        dragP.parent(dragDiv);
        this.#dragElement(this.mainContainer.elt);

        if (this.settings.showToolsBoo == true) {        // 设置工具按钮容器
            this.toolsDiv = createDiv();
            this.toolsDiv.class('ctrler_tools');

            // 将变量输出成 var 语句
            const varBtn = createButton('var');
            varBtn.mousePressed(_ => {
                this.#variablesStr();
            });

            const toJsonBtn = createButton('toJson');
            toJsonBtn.mousePressed(_ => {
                this.#toJson();
            })

            // 讲变量值固定到 PC 的设置脚本
            const renewBtn = createButton('renew');
            renewBtn.mousePressed(_ => {
                let name = prompt('请填写变量名称', 'pc');
                this.#renew(name);
            });

            // 重制所有数值，清除网址以及cookie中的数值
            const resetBtn = createButton('reset');
            resetBtn.mousePressed(_ => {
                Object.keys(this.ctrlers).map(k => {
                    document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                });
                this.updateWithCookieBoo = false;
                let l = window.location;
                window.location = l.origin + l.pathname;
            });

            // 生成包含当前数值的网址
            const generateUrlBtn = createButton('generaUrl');
            generateUrlBtn.mousePressed(_ => {
                Object.keys(this.ctrlers).map(k => {
                    this.#updateValToUrl(k);
                });
            });

            // 将工具按钮添加到整体容器
            if (this.settings.showToolsBoo == true) {
                [varBtn, toJsonBtn, renewBtn, resetBtn, generateUrlBtn].map(btn => {
                    btn.parent(this.toolsDiv)
                });
                this.toolsDiv.parent(this.ctrlersContainer);
            }
        }

        //获得滚动条尺寸
        this.#_scrollBarWidth = this.#getScrollBarWidth();

        // 美化 
        this.#mainStyle(this.settings);
        this.#scrollBeauty();
        if (this.settings.input_styling == true) { this.#inputKitBeauty() };



    };
    #_parentTarget = this.ctrlersContainer;
    #_scrollBarWidth = 0;
    #altTextStyle = `
        display: block;
        white-space: pre-wrap;
        left: 0;
        --right: 0;
        width: 100%;
        word-break: break-all;
        margin: inherit;
    `;
    #setParentTarget = function (parent) {
        // console.log(parent, this.groups[parent], parent && 'type' in parent && parent.type == 'group');

        if (!parent) {
            this.#_parentTarget = this.ctrlersContainer
        } else if (this.groups[parent]) {
            this.#_parentTarget = this.groups[parent]
        } else if ('type' in parent && parent.type == 'group') {
            this.#_parentTarget = parent;
        }
        // console.log(this.#_parentTarget);
        return this.#_parentTarget;
    };

    #mainStyle = function (settings = this.settings) {
        // 设置 整体样式
        const style = document.createElement('style'); {
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
                    
                        transition:
                        padding var(--transition-time) ease,
                        opacity var(--transition-time) ease ,
                        transform var(--transition-time) ease,
                        height var(--transition-time) ease,
                        max-height var(--transition-time) ease,
                        max-width  var(--transition-time) ease,
                        width var(--transition-time) ease;

                        
                        user-select: none;
                        -webkit-user-select: none; 
                        -webkit-user-select: none; 
                        -moz-user-select: none;
                        -ms-user-select: none;
                    
                    }
                    ` +/** autohide styling */ (settings.autoHideBoo == true ? `  
                    #${this.id}  {
                        opacity:0.4;
                        transform:scale(72%,72%);
                        transform-origin: top left;
                    }
                    #${this.id}:hover,
                    #${this.id}.${this.activeClassName}{
                        opacity:1;
                        transform:scale(100%,100%);
                    }
                    
                    ` : '') +/**header styling */ `
        
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

                        transition:height var(--transition-time) ease,
                        background var(--transition-time) ease,
                        opacity var(--transition-time) ease,
                        left var(--transition-time) ease,
                        right var(--transition-time) ease,
                        transform var(--transition-time) ease;

                    }
                    #${this.id}:hover #${this.id}_header{
                        height:var(--unit-length);
                        background:var(--main-color);
                        opacity:1;
                        transition:height var(--transition-time) ease, background var(--transition-time) ease,opacity var(--transition-time) ease;
                    }
                    #${this.id}  #${this.id}_header p{
                        color:#fff;
                        margin:0;
                    }
                    `+/** inner and toolsDiv */`
                    #${this.id} * {
                        position: relative;
                        vertical-align: middle;
                        transition:opacity 1s ease , transform 1s ease;
                    }

                    #${this.id} div#${this.id + '_inner'} {
                        transition:
                            max-height var(--transition-time) ease,
                            max-width  var(--transition-time) ease,
                            width var(--transition-time) ease;
                        overflow-y:scroll;
                        overflow-x:hidden;
                        max-height:96vh;
                        max-width: var(--container-w);
                    }
                    #${this.id} div.ctrler_tools {
                       display:flex;
                    }
                    #${this.id} div.ctrler_tools *{
                       margin-right:1em;
                    }
                   
                    
                    `+/**ctrler */`
                     #${this.id} div#${this.id + '_inner'} div.ctrler {
                        display: flex;
                        flex-direction: row;
                        margin:0.5em 0 0;
                        --max-width: var(--container-w);
                        --min-width: fit-content;
                        --width: calc(var(--container-w) * 0.5 );
                    }
                    
                    #${this.id}>div:first-child{
                        margin-top: 0em;
                    }

                  
                    #${this.id} .ctrler>* {
                        margin-right: 1em;
                        flex-grow:9;
                        width: fit-content;
                    }
                    
                    #${this.id} div.ctrler * {
                        margin: auto 1em auto 0em;
                        min-width: fit-content;
                    }
                    #${this.id} div.ctrler>*:last-child {
                        margin-right: 0em;
                        flex-grow: 1;
                    }

                    #${this.id} div.ctrler .ctrlerName {
                        overflow:hidden;
                        text-overflow: ellipsis;
                        flex-shrink: 0;
                        flex-grow: 0;
                        --min-width: unset;
                        width:fit-content;
                        min-width:var(--namecol-w);
                    }

                    #${this.id} div.ctrler>div {
                        flex-wrap:wrap;
                    }
                     
                    #${this.id} textarea,#${this.id} input[type='text']{
                        flex-grow:4;
                    }
                    
                    #${this.id} .disable{
                        opacity:0.32;
                    }
                    
                    #${this.id} hr{
                        width:100%;
                        margin: 0.75em 0 0.5em;
                    }
                    
                    `+/**alt txt setting */`
                    #${this.id} div.ctrler[alt] {
                        flex-wrap: wrap;
                    }

                    #${this.id} div.ctrler[alt]:after {
                        content: attr(alt);
                        ${this.#altTextStyle}
                    }
                                        
                    #${this.id} div.ctrler[alt]>*:last-child {
                        flex-grow: 1;
                    }
                
                   
                    
                   
                    
                    `+/** group */`
                    #${this.id} div.group{
                        flex-direction:column!important;
                        transition:height var(--transition-time) ease;
                    }

                    #${this.id} div.group.disable{
                       opacity:0.5;
                    }

                    #${this.id} div.group.hide{
                        height:var(--title-height)!important;
                        overflow:hidden;
                    }

                    #${this.id} div.group.hide .groupTitle>a{
                        transform:translate(0,-50%)  rotate(-90deg);
                    }
                    #${this.id} div.group.hide div{
                        opacity:0;
                    }
                    #${this.id} div.group>div>:first-child:before{
                        content:'└ ';
                        transform:scale(0.8);
                        width:1em;
                        display:inline-block;
                    }

                    #${this.id} .group .groupTitle{
                        display: block;
                        width: 100%;
                        font-size:1.1em;
                        cursor:pointer;
                        margin: 0;
                    }
                    #${this.id} .group .groupTitle a{
                        --padding-size:0.5em;
                        --position-size:calc( 0em - var(--padding-size));
                        padding:var(--padding-size);
                        position:absolute;
                        top:50%;
                        right:var(--position-size);
                        transform:translate(0,-50%) ;
                        line-height: 1em;       height: 1em;        width: 1em;
                        text-decoration: none;
                        text-align: center;    vertical-align: middle;
                        
                        transition:transform var(--transition-time) ease;
                    }
                    #${this.id} div.group div{
                        transition:opacity var(--transition-time) ease;
                    }

                    #${this.id} div.ctrler label>*{
                        margin-right:0.5em;
                    }
                    #${this.id} div.ctrler label{
                        margin-right:0.5em;
                        display: inline-block;
                    }
`;
        };
        style.setAttribute('name', this.id + '_main_style');
        this.mainContainer.elt.appendChild(style);
    };

    #updateCtrlerDisplay = function () {

        // Object.keys(this.nameCol).map(name => {
        //     if (this.ctrlers[name].nameAnonymous == false || this.ctrlers[name].hasOwnProperty('rename')) {
        //         this.nameColWidth = Math.max(this.nameColWidth, this.nameCol[name].width);
        //     }
        // });
        // Object.keys(this.ctrlers).map(name => {
        //     this.nameCol[name].size(this.nameColWidth);
        // });

        Object.keys(this.nameCol).map(name => this.nameCol[name].style('max-width: unset;'));

        let nameColWidthArr = Object.keys(this.nameCol).filter(
            name => this.ctrlers[name].nameAnonymous == false && (!this.ctrlers[name].hasOwnProperty('rename'))
        ).map(
            name => this.nameCol[name].elt.clientWidth
        ).sort(
            (a, b) => b - a
        );
        let nameColWidth = nameColWidthArr[0] + 1;
        this.ctrlersContainer.elt.style.setProperty("--namecol-w", nameColWidth + 'px');

        Object.keys(this.nameCol).map(name => this.nameCol[name].style('max-width: var(--namecol-w);'));

        // console.log(nameColWidthArr.join(','), Object.keys(this.ctrlers).pop());
        // [...Object.values(this.ctrlerDivs)].map(div => {
        //     [...div.elt.querySelectorAll('*')].map(d => {
        //         // if (!d.classList.contains('ctrlerName')) { d.style.display = 'flex'; }
        //         d.style.color = this.textcolor;
        //     })
        // });

        Object.keys(this.ctrlers).map(name => this.ctrlers[name].elt.style.setProperty('flex-grow', '0'));
        let ctrlersDisplayWidths = Object.values(this.ctrlers).map(v => v.elt.clientWidth + v.elt.offsetLeft).sort((a, b) => b - a);
        let ctrlersDisplayWidth = ctrlersDisplayWidths[0];
        this.#_scrollBarWidth = this.#getScrollBarWidth();
        let container_w = Math.min(this.ctrlerwidth, ctrlersDisplayWidth) + this.#_scrollBarWidth;
        if (this.settings.showToolsBoo == true) { container_w = Math.max(this.toolsDiv.elt.clientWidth, container_w); }
        this.ctrlersContainer.elt.style.setProperty("--container-w", container_w + 2 + 'px');
        Object.keys(this.ctrlers).map(name => this.ctrlers[name].elt.style.removeProperty('flex-grow'));

        let container_h = this.ctrlersContainer.elt.clientHeight;
        if (this.settings.showToolsBoo == true) { container_h = this.toolsDiv.elt.clientHeight + container_h; }
        this.ctrlersContainer.elt.style.setProperty("--container-h", container_h + 'px');


        // this.ctrlersContainer.elt.style.setProperty("--container-w",     this.ctrlersContainer.elt.clientWidth + 'px');
        // this.ctrlersContainer.elt.style.setProperty("--container-w", Math.max(this.ctrlerwidth, Math.max(ctrlersDisplayWidth, this.settings.showToolsBoo == true ? this.toolsDiv.elt.clientWidth : 0)) + this.#_scrollBarWidth + 'px');

        //  console.log(ctrlersDisplayWidths, ctrlersDisplayWidth, this.#_scrollBarWidth, container_w, this.settings.showToolsBoo == true ? this.toolsDiv.elt.clientWidth : 0);

    };

    #recordArgs = function () {
        let args = [...arguments];
        let name = args.shift();
        this.objArgs[name] = [...args];
    };
    #bindCtrler = function (name, parent = this.#_parentTarget) {
        let that = this;
        {
            Object.defineProperty(window, name, {
                get: function () {
                    return that.getCtrlerVal(name);
                },
                set(newValue) {
                    that.update(name, newValue);
                    that.#updateValueCol(name);
                }
            });
        }

        this.nameCol[name].parent(this.ctrlerDivs[name]);
        this.ctrlers[name].parent(this.ctrlerDivs[name]);

        if (Object.keys(this.valueCol).indexOf(name) != -1) {
            this.valueCol[name].parent(this.ctrlerDivs[name]);
        }

        // console.log('\n\nbindctrler: ', parent, arguments);
        this.ctrlerDivs[name].parent(parent);

        ['focus', 'focusin', 'change', 'input'].map(e => {
            this.ctrlers[name].elt.addEventListener(e, () => {
                that.mainContainer.elt.classList.add(that.activeClassName);
            });
        });

        ['blur', 'focusout'].map(e => {
            this.ctrlers[name].elt.addEventListener(e, () => {
                that.mainContainer.elt.classList.remove(that.activeClassName);
            });
        });

        if (['slider', 'color'].indexOf(this.ctrlers[name].type) != -1) {
            ['input', 'change'].map(ev => {
                this.ctrlers[name].elt.addEventListener(ev, _ => {
                    that.#updateValueCol(name);
                });
            });
        }


    };
    #updateValueCol(name) {
        this.valueCol[name].elt.innerText = this.getCtrlerVal(name);
        let originMinW = this.valueCol[name].elt.style.getPropertyValue('min-width');
        originMinW = originMinW.match(/\d*/) ? Number(originMinW.match(/\d*/)) : 0;
        let minW = Math.max(originMinW, this.valueCol[name].elt.clientWidth);
        if (originMinW != minW) {
            this.valueCol[name].elt.style.setProperty('min-width', minW + 'px');
        }
    }
    #nameAndVal = function (name) {

        this.nameCol[name] = createSpan(`${name}`);
        this.nameCol[name].class('ctrlerName');
        this.nameCol[name].style('user-select:none');

        if (['slider', 'color'].indexOf(this.ctrlers[name].type) != -1) {
            this.valueCol[name] = createSpan(`${this.getCtrlerVal(name)}`);
            this.valueCol[name].style('user-select:none');
        }

        Object.keys(this.groups).map(groupname => this.#groupHeightUpdate(groupname))
    };
    #checkCtrlerName(name) {
        
        let illegalNameBoo=!name||Boolean(name)==false||typeof name=='undefined'||name===false||name==null||typeof name =='string'&&!name[0].match(/[a-zA-Z_$]/);
        // console.log(typeof name =='string' ,typeof name =='string'&&!name[0].match(/[a-zA-Z_$]/));
        if (name in this.ctrlers) {
            throw (`"${name}" :A ctrler with this name already exists`);
            return false;
        }else if(illegalNameBoo){
            let beforeName=name;
            name=this.#randomName();
            console.log(`name ${beforeName} is not legal, it has beem renamed to ${name}`);
            return  name;
        }
        return true;
    };
    #initCtrler = function (name, parent = this.#_parentTarget) {
       
        this.ctrlers[name].name=name;
        this.ctrlerDivs[name] = createDiv();
        this.ctrlerDivs[name].class('ctrler');
        this.#nameAndVal(name);
        this.#bindCtrler(name, parent);
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



        let that = this;

        this.ctrlers[name].update = function (val) {
            that.update(name, val);
            return that.ctrlers[name];
        };

        ['disable', 'enable'].map(fn => {
            that.ctrlers[name][fn] = function () {
                that[fn](name);
                return that.ctrlers[name];
            };
        });

        this.ctrlers[name].range = function (min, max) {
            that.range(name, min, max);
            return that.ctrlers[name];
        };
        this.ctrlers[name].precision = function (precisionNum) {
            that.precision(name, precisionNum);
            return that.ctrlers[name];
        };

        this.ctrlers[name].displayName = function (displayname) {
            that.displayName(name, displayname);
            return that.ctrlers[name];
        };

        this.ctrlers[name].getCtrlerVal = function () {
            let value = that.getCtrlerVal(name);
            return value;
        };

        this.ctrlers[name].var = function (varName) {
            that.var(name, varName);
            // console.log(varName, typeof varName, eval(varName), window[varName]);
            return that.ctrlers[name];
        };


        this.ctrlers[name].alt = function (altText) {
            that.alt(name, altText);
            return that.ctrlers[name];
        }
    };

    slider(name, defaultVal = 1, minVal = Math.min(0, defaultVal), maxVal = 2 * Math.max(minVal, defaultVal, 1), precision = Math.max(maxVal, defaultVal, 1) / 10, fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }

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
        this.ctrlers[name] = createSlider(minVal, maxVal, defaultVal, precision);
        this.ctrlers[name].type = 'slider';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.ctrlers[name].input(fxn);
        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    button(name = 'p5js_ctrler_btn', btnText = 'btn', fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }


        this.#recordArgs(...arguments);
        this.ctrlers[name] = createButton(btnText);
        this.ctrlers[name].mousePressed(fxn);
        this.ctrlers[name].type = 'button';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    checkbox(name = 'p5js_ctrler_checkbox', defaultVal = false, labelText = ['yes', 'no'], fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }


        this.#recordArgs(...arguments);
        this.ctrlers[name] = createCheckbox(name, defaultVal);
        this.ctrlers[name].labelText = {
            'true': labelText[0],
            'false': labelText[1]
        };
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'checkbox';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

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
    };

    select(name = 'p5js_ctrler_select', options = [], fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }


        this.#recordArgs(...arguments);
        this.ctrlers[name] = createSelect(name);
        options.map(o => {
            this.ctrlers[name].option(o);
        });
        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'select';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    radio(name = 'p5js_ctrler_radio', options = [], fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }


        this.#recordArgs(...arguments);
        this.ctrlers[name] = createRadio(name);

        options.map(o => {
            if (o instanceof Array) {
                this.ctrlers[name].option(...o);
            } else {
                this.ctrlers[name].option(o);
            }
        });


        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].type = 'radio';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.ctrlers[name].elt.style.display = 'flex';
        this.ctrlers[name].elt.style.whiteSpace = 'nowrap';
        this.#initCtrler(name);
        this.#radioBeautify(name);

        return this.ctrlers[name];
    };


    #radioBeautify(name) {

        // TODO 
        const inputs = [...this.ctrlers[name].elt.querySelectorAll('[type="radio"]')].filter(i => i.parentElement != 'label');
        inputs.map(i => {
            const p = i.parentElement;
            if (p.localName == 'label') {
                return;
            }
            const labels = p.querySelectorAll('label');
            [...labels].map(l => {
                if (l.innerText == i.value) {
                    p.removeChild(i);
                    const span = document.createElement('spen');
                    span.innerText = l.innerText;
                    l.innerText = '';
                    l.appendChild(i);
                    l.appendChild(span);
                }
            });
        });

        const div = this.ctrlers[name].elt;
        const lArr = [...div.querySelectorAll('[type="radio"]')].map((i, idx) => i.parentElement);
        const sizeSortArr = lArr.map(l => l.clientWidth).sort((a, b) => b - a);

        div.style.setProperty('min-width', 'unset');
        let dw = div.clientWidth, lwMin = 0, row = 0;


        while (dw > 0 && sizeSortArr.length > 0) {
            lwMin = sizeSortArr.shift();
            dw = dw - lwMin;
            row++;
        }

        row = dw <= 10 ? row - 1 : row;

        if (row >= 2) {
            lArr.map(l => div.removeChild(l));

            [...new Array(row)].map((i, idx) => {
                let p = document.createElement('p');
                p.style.cssText = `    display: flex;    flex-direction: column;margin:0`;
                div.appendChild(p);
                div.style.cssText += `flex-wrap: nowrap;`;
                for (let j = 0, jj = Math.ceil(lArr.length / row); j < jj; j++) {
                    if (lArr[j * row + idx]) {
                        p.appendChild(lArr[j * row + idx]);
                    }
                }
            });
            this.#updateCtrlerDisplay();
        }
        div.style.removeProperty('min-width');


    };
    color(name = 'p5js_ctrler_color', defaultVal = '#369', fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }

        this.#recordArgs(...arguments);
        this.ctrlers[name] = createColorPicker(defaultVal);
        this.ctrlers[name].type = 'color';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.ctrlers[name].input(fxn);
        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    input(name = 'p5js_ctrler_input', defaultVal = '', fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }

        this.#recordArgs(...arguments);
        this.ctrlers[name] = createInput(defaultVal);
        this.ctrlers[name].type = 'input';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.ctrlers[name].input(fxn);
        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    textarea(name = "p5js_ctrler_textarea", defaultVal = '', fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }


        this.#recordArgs(...arguments);
        this.ctrlers[name] = createElement('textarea', defaultVal);

        this.ctrlers[name].type = 'textarea';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.ctrlers[name].changed(fxn);
        this.ctrlers[name].input((e) => { this.#updateTextareaHeight(e.path[0]) });
        this.#initCtrler(name);
        this.#updateTextareaHeight(this.ctrlers[name].elt);
        return this.ctrlers[name];
    };
    #updateTextareaHeight = (textareaElt) => {
        const taStyle = getComputedStyle(textareaElt, null);

        const div = document.createElement('div');
        div.innerText = textareaElt.value;
        div.innerText = div.innerText.match(/[\n\r]$/) ? div.innerText + '_' : div.innerText;

        let divStyleText = '';
        let styleAttrsArr = ["font-size", "color", "height", "max-height", "margin", "margin-right", "flex-grow", "position", "vertical-align", "transition", "writing-mode", "font-family", "text-rendering", "color", "letter-spacing", "word-spacing", "line-height", "text-transform", "text-indent", "text-shadow", "display", "text-align", "appearance", "-webkit-rtl-ordering", "resize", "cursor", "white-space", "overflow-wrap", "background-color", "column-count", "margin", "border-width", "border-style", "border-color", "border-image", "padding"];

        [...new Set(styleAttrsArr)].map(s => {
            if (s.indexOf('height') != -1) { return }
            divStyleText += (s == 'overflow-wrap' ? 'word-break' : s) + ':' + taStyle.getPropertyValue(s) + ';';
        });

        div.style.cssText = divStyleText;
        div.style.width = textareaElt.clientWidth + 'px';
        div.style.position = 'absolute';
        div.style.top = 0, div.style.left = 0;

        document.body.appendChild(div);
        textareaElt.style.height = 'max(' + div.clientHeight + 'px , 2.5em )';
        textareaElt.style.maxHeight = '80vh';

        document.body.removeChild(div);
    };

    fileinput(name = "p5js_ctrler_fileinput", fxn = () => { }) {
        let nameCheckingResult=this.#checkCtrlerName(name), nameAnonymous = false;
        if (arguments.length == 0||this.#checkCtrlerName(name)!==true) {
            name =nameCheckingResult;
            nameAnonymous = true;
        }
        this.#recordArgs(...arguments);
        this.ctrlers[name] = createFileInput(fxn);
        this.ctrlers[name].type = 'fileinput';
        this.ctrlers[name].nameAnonymous = nameAnonymous;

        this.#initCtrler(name);
        return this.ctrlers[name];
    };

    hr(borderStyle='-',borderWidth='1px') {
        const hr = createElement('hr', '');
        let styleDict={
            '': 'none', ' ': 'none', '.': 'dotted', '-': 'dashed', '_': 'solid', '=': 'double', 'v': 'groove', 'V': 'groove', 'A': 'ridge', '^': 'ridge', '<': 'inset', '>': 'outset', '[': 'inset', ']': 'outset'
        }, style;
        if(Object.keys(styleDict).indexOf(borderStyle)!=-1){style=styleDict[borderStyle];}else if(Object.values(styleDict).indexOf(borderStyle)!=-1){style=borderStyle;};
        if(typeof borderWidth=='number'){borderWidth=borderWidth+'px';
        }else if(!borderWidth.match(/\d{1,}(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)/)){
        console.log(`hr(borderStyle='-',borderWidth='1px'): borderWidth require a number or a css length; already set it to default value '1px' `);
        borderWidth='1px';
        }
        hr.style('border-style',style);hr.style('border-width',borderWidth);
        hr.parent(this.ctrlersContainer);
        return this;
    };



    group(name = "p5js_ctrler_group") {
        if (arguments.length == 0) {
            name += this.#randomName();
        }

        this.#recordArgs(...arguments);
        this.groups[name] = createDiv();
        this.groups[name].type = 'group';
        this.#initGroup(name);

        // this.#setParentTarget(this.groups[name]);

        // console.log(this.#_parentTarget)

        return this.groups[name];
    };
    #checkGroupName(name) {
        if (name in this.groups) {
            throw (`"${name}" :A group with this name already exists`);
            return false;
        }
        return true;
    };
    #initGroup = function (groupName) {
        let that = this;

        {
            Object.defineProperty(window, groupName, {
                get: function () {
                    return that.groups[groupName];
                },
            });
        }


        let groupFoldFn = (e) => {
            this.groups[groupName].elt.classList.toggle("hide");
        };
        this.groups[groupName].class('group');
        this.groups[groupName].attribute('groupname', groupName);
        this.groups[groupName].parent(this.ctrlersContainer);

        this.groupNames[groupName] = createP();
        this.groupNames[groupName].class('groupTitle');
        this.groupNames[groupName].mouseClicked(groupFoldFn);

        this.groupNames[groupName].parent(this.groups[groupName]);

        let nameSpan = createSpan(`${groupName}`);
        nameSpan.class('groupTitleName');
        nameSpan.parent(this.groupNames[groupName]);

        let switchBtn = createA('javascript:void 0;', '\<');
        switchBtn.parent(this.groupNames[groupName]);

        this.groups[groupName].ctrlersList=[];

        this.groups[groupName].elt.style.setProperty('--title-height', this.groupNames[groupName].elt.clientHeight + 'px');

        ['slider', 'button', 'checkbox', 'select', 'radio', 'color', 'input', 'textarea', 'fileinput', 'hr'].map(fn => {
            this.groups[groupName][fn] = this.#groupCtrlerFn(groupName, fn);
            
        });
        this.groups[groupName].displayName = function (displayname) {
            that.displayName(groupName, displayname);
            return that.groups[groupName];
        };

        this.groups[groupName].disable=function(){
            that.groups[groupName].elt.classList.add('hide');
            that.groups[groupName].elt.classList.add('disable');
            that.groupNames[groupName].mouseClicked(()=>{});
            // console.log(that.groups[groupName].ctrlersList);
            that.groups[groupName].ctrlersList.map(ctrlerName=>that.ctrlers[ctrlerName].disable());
        };
        this.groups[groupName].enable=function(){
            that.groups[groupName].elt.classList.remove('hide');
            that.groups[groupName].elt.classList.remove('disable');
            that.groupNames[groupName].mouseClicked(groupFoldFn);
            that.groups[groupName].ctrlersList.map(ctrlerName=>that.ctrlers[ctrlerName].enable());
        };
    };
    #groupCtrlerFn = function (groupName, fn) {
        let that = this;
        return function () {
            let args = [...arguments];

            that.#setParentTarget(that.groups[groupName]);
            // console.log('\n\ngroupFn: ', that, name, fn, that.#_parentTarget);

            let ctrlerResult = that[fn](...args);
            that.#setParentTarget();

            // console.log(that.groups[name], that.groups[name].elt.clientHeight);
            // that.groups[name].elt.style.height = 'unset';
            // that.groups[name].elt.style.height = String(that.groups[name].elt.clientHeight) + 'px';

            that.#groupHeightUpdate(groupName);

            this.ctrlersList.push(ctrlerResult.name);
            // console.log('name',groupName,'\nthis',this,'\nthat',that,
            // '\nthat.groups',that.groups,'\nthat.groups[name]',that.groups[groupName],
            // '\nthat.groups[name].ctrlersList',that.groups[groupName].ctrlersList,
            // '\nthis.ctrlersList',  this.ctrlersList,
            // '\nfnResult',ctrlerResult,
            // '\nfnResult.name',ctrlerResult.name,
            // );

            return this;
        }
    };
    #groupHeightUpdate(name) {

        this.groups[name].elt.style.height = 'unset';
        this.groups[name].elt.style.height = String(this.groups[name].elt.clientHeight) + 'px';

    };
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
            console.log(`can not fint the value ${value} option or selection in the ctrler[${name}]`);
            return false;
        }

        switch (this.ctrlers[name].type) {
            case 'checkbox':
                let boo = (Boolean(value) == true) && value != "false" && value != this.ctrlers[name].labelText.false;
                try {
                    // console.log(boo);
                    this.ctrlers[name].checked(boo);
                } catch (err) {
                    this.ctrlers[name].elt.querySelector('input').checked = boo;
                    this.ctrlers[name].elt.querySelector('label').innerText = this.ctrlers[name].labelText[this.ctrlers[name].checked()];
                    console.log(`updating ${name} error, and clicked it`);
                }
                break;
            case 'select':
                this.ctrlers[name].elt.querySelector(`[value="${value}"]`).selected = true;
            case 'radio':
                try {
                    let before = this.ctrlers[name].value();
                    this.ctrlers[name].selected(value);
                    let after = this.ctrlers[name].value();
                    if (before == after) { throw ('the selected does not work.'); }
                } catch (err) {
                    this.ctrlers[name].elt.querySelector(`[value="${value}"]`).click();
                    console.log(`updating ${name} error, and clicked it`);
                };
                break;
            default:
                this.ctrlers[name].elt.value = value;
                break;
        }

        if (name in this.valueCol) {
            this.valueCol[name].elt.innerText = this.getCtrlerVal(name);
        }

        return this;
    };

    disable(name) {
        this.ctrlerDivs[name].elt.classList.add('disable');
        this.ctrlers[name].elt.setAttribute('disabled', true);
        return this;
    };

    enable(name) {
        this.ctrlerDivs[name].elt.classList.remove('disable');
        this.ctrlers[name].elt.removeAttribute('disabled');
        return this;
    };

    range(name, min, max) {
        this.ctrlers[name].elt.setAttribute('min', min);
        this.ctrlers[name].elt.setAttribute('max', max);
        this.update(name, Math.max(Math.min(this.ctrlers[name].elt.value, max), min));
        return this;
    };
    precision(name, precisionNum) {
        switch (true) {
            case this.ctrlers[name].type != 'slider':
                throw ('precision(name, precisionNum): requires a slider name');
                break;
            case !isFinite(Number(precisionNum)) || Number(precisionNum) == 0:
                throw ('precision(name, precisionNum): requires a non-zero number');
                break;
        }
        this.ctrlers[name].elt.step = precisionNum;
        return this;
    };

    // TODO 增加一个初始化参数，允许适应显示名称的宽度
    displayName(name, displayname) {
        if (name in this.ctrlers || name in this.groups) {
            if (name in this.groups) {
                this.groupNames[name].elt.querySelector('.groupTitleName').innerText = displayname;
                this.groups[name].rename = displayname;

            } else if (name in this.ctrlers) {
                this.nameCol[name].elt.innerText = displayname;
                this.ctrlers[name].rename = displayname;

                let groupname = this.ctrlerDivs[name].parent().getAttribute('groupname');
                if (groupname) {
                    this.#groupHeightUpdate(groupname);
                }

            }
        }
        this.#updateCtrlerDisplay();
        return this;
    };


    alt(name, altText) {
        switch (true) {
            case !name in this.ctrlerDivs:
                throw (`alt(name, altText): cant find a ctrler named ${name}`);
                break;
            case !altText || altText == '':
                throw ('alt(name, altText): altText requires a string');
                break;
        }
        this.ctrlerDivs[name].elt.setAttribute('alt', altText);

        {   // 让 伪元素的文本也能换行
            // https://jsfiddle.net/XkNxs/
            // https://stackoverflow.com/questions/17047694/add-line-break-to-after-or-before-pseudo-element-content
            this.ctrlerDivs[name].elt.setAttribute('altname', name);

            const altStyle = document.createElement('style');
            altStyle.innerText = ` #${this.id} div.ctrler[altname=${name}]::after {
                content: "${altText}";
                ${this.#altTextStyle}
            }`;
            this.#setDomName(altStyle, this.id + `_alt_text_for_${name}`);

            if (document.querySelectorAll(`style[name=${altStyle.name}]`).length == 0) {
                document.body.appendChild(altStyle);
            }
        }

        this.#updateCtrlerDisplay();
        return this;
    };

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
                let input = that.ctrlers[name].elt.querySelectorAll('input');
                let t = [...input].filter(i => i.checked);
                let radioResult = t.length ? t[0].value : null;
                return radioResult;
                break;
            default:
                return that.ctrlers[name].value();
                break;
        }
    };
    var(name, varName) {
        if (!name) { throw (`var(name, varName): "${name}" : name requires a string`) }
        if (!(name in this.ctrlers)) { throw (`var(name, varName): "${name}" : name not in ctrlers`) }
        if (!varName) { throw (`var(name, varName): "${varName}" : varName need a string`) }

        let that = this;
        Object.defineProperty(window, varName, {
            get() { return that.getCtrlerVal(name); },
            set(newValue) {
                that.update(name, newValue);
            },
        });
        return window[varName];
    };
    #variablesStr() {

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
                result += ' ,, ';
            }
        });
        result = result.replace(/\n/g, '\\n').replace(/,,/g, ',\n\t') + ';';
        this.#copyStr(result);
        return result;
    };

    #toJson() {
        let result = '';
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
                result += ',,';
            }
        });
        result = 'let pc=new PC();\n...\nlet preset={' + result.replace(/\n/g, '\\n').replace(/,,/g, ',\n\t') + '};\npc.load(preset);';
        this.#copyStr(result);
        return result;
    };
    #renew(varname) {
        let result = `var ${varname} ; \n${varname}=new PC(${JSON.stringify(this.settings, ' ', 2)});\n`;

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
    };
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
                if (this.ctrlers[k].type == 'fileinput' || this.ctrlers[k].elt.getAttribute('disable') == true) {
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
                if (this.ctrlers[k].type == 'fileinput' || this.ctrlers[k].elt.getAttribute('disable') == true) {
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
            if (this.ctrlers[n].type == 'fileinput' || this.ctrlers[n].elt.getAttribute('disable') == true) {
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
            if (this.ctrlers[n].type == 'fileinput' || this.ctrlers[n].elt.getAttribute('disable') == true) {
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
        const a = document.createElement("textarea");
        a.value = str;
        document.body.appendChild(a);
        a.select();
        document.execCommand("Copy");
        a.style.display = "none";
        window.alert(str + "内容已复制到剪贴板");
    };
    #setDomName = function (domElm, name) {
        domElm.name = name;
        domElm.setAttribute('name', name);
    };
    #randomName() {
        return 'p5js_ctrler_' + String(Math.random()).replace(/\./g, '');
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
            switch (true) {
                case that.l + that.w < windowWidth / 2 && that.t + that.h < windowHeight / 2:
                    elmnt.style.transformOrigin = 'top left';
                    break;
                case that.l + that.w < windowWidth / 2 && that.t + that.h > windowHeight / 2:
                    elmnt.style.transformOrigin = 'bottom left';
                    break;
                case that.l + that.w > windowWidth / 2 && that.t + that.h < windowHeight / 2:
                    elmnt.style.transformOrigin = 'top right';
                    break;
                case that.l + that.w > windowWidth / 2 && that.t + that.h > windowHeight / 2:
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

        const style = document.createElement('style');
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
            transition:height var(--transition-time) ease, background var(--transition-time) ease,opacity var(--transition-time) ease;
         }

        #${this.id}[${stickAttrName}]{
            transform:scale(100%,100%)!important;
        }
        
        `+ (this.settings.autoHideBoo == true ? `
        
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
        
        #${this.id}[${stickAttrName}*=top] #${this.id}_inner,
        #${this.id}[${stickAttrName}*=bottom] #${this.id}_inner
        {
            max-height:0;
            max-width: var(--container-w)!important;
        }
     
        #${this.id}[${stickAttrName}*=left] #${this.id}_inner,
        #${this.id}[${stickAttrName}*=right] #${this.id}_inner
        {
            max-width:0;
            max-height: var(--container-h);
        }
       
        
        #${this.id}[${stickAttrName}]:hover #${this.id}_inner{
            max-height: var(--container-h);
            max-width: var(--container-w);
        }
           

        `: `
        #${this.id}[${stickAttrName}*=top],
        #${this.id}[${stickAttrName}*=bottom],
        #${this.id}[${stickAttrName}*=left],
        #${this.id}[${stickAttrName}*=right],
        #${this.id}[${stickAttrName}]{
            padding:var(--unit-length) var(--unit-length)!important;
        }
        
        #${this.id}[${stickAttrName}] #${this.id}_inner{
            max-height: var(--container-h);
            max-width: var(--container-w);
        }
        
        `) + `
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
        this.mainContainer.elt.appendChild(style);
    };

    #scrollBeauty = () => {
        const style = document.createElement('style');
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
        if (document.querySelectorAll(`style[name=${style.name}]`).length == 0) {
            document.body.appendChild(style);
        }

        this.#_scrollBarWidth = this.#getScrollBarWidth();

        const styleOfScrollbarWidth = document.createElement('style');
        this.#setDomName(styleOfScrollbarWidth, this.id + '_style_of_scrollbar_width');

        styleOfScrollbarWidth.innerText = `
        [id*=${this.id.replace(/\d*$/g, '')}]{
           --scrollbar-width:${this.#_scrollBarWidth};
        }


        #${this.id} div#${this.id + '_inner'} {
            overflow-y:hidden!important;
        }
        
        #${this.id} div#${this.id + '_inner'}:hover {
            overflow-y:scroll;
        }
        
        #${this.id} div#${this.id + '_inner'}>* {
            padding-right:var(--scrollbar-width);
        }

        #${this.id} div#${this.id + '_inner'}:hover>* {
            padding-right:0;
        }
        
        `;

        if (document.querySelectorAll(`style[name=${styleOfScrollbarWidth.name}]`).length == 0) {
            document.body.appendChild(styleOfScrollbarWidth);
        }
    };
    #getScrollBarWidth() {

        // https://blog.csdn.net/fukaiit/article/details/100069537
        const targetDom = this.mainContainer.elt;
        const scroll = document.createElement("div");
        const scrollIn = document.createElement("div");
        scroll.appendChild(scrollIn);
        scroll.style.width = "100px";
        scroll.style.height = "50px";
        scroll.style.overflow = "scroll";
        scroll.style.marginLeft = "-100000px";
        targetDom.appendChild(scroll);
        const scrollInWidth = scrollIn.offsetWidth;
        const scrollWidth = scroll.offsetWidth;
        targetDom.removeChild(scroll);

        return scrollWidth - scrollInWidth;
    };

    #inputKitBeauty = function (styleInnerCSSText) {

        const style = document.createElement('style');
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
    };

    title(title) {
        this.mainContainer.elt.querySelector(`#${this.id + '_header'} p`).innerText = title;
        return this;
    }

    stick(position) { //stick to a side; position allow a string  one of  top / right / bottom / left
        let oppositeSide;
        switch (position) {
            case 'top':
                oppositeSide = 'bottom';
                break;
            case 'bottom':
                oppositeSide = 'top';
                break;
            case 'left':
                oppositeSide = 'right';
                break;
            case 'right':
                oppositeSide = 'left'
                break;
            default:
                position = 'top';
                oppositeSide = 'bottom';
        }
        this.mainContainer.elt.style.setProperty(position, '0');
        this.mainContainer.elt.style.setProperty(oppositeSide, 'unset');
        this.mainContainer.elt.setAttribute('stick', position);
    }
}
