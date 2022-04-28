var Examples = Examples || {};
var __preload, __setup, __draw;

Examples.balls = function () {
    __preload = () => {
        pc = (typeof pc != 'undefined' && pc instanceof PC) ? pc : new PC({
            ctrler_width: 400,
            autoHideBoo: true,
            line_height: '1em'
        }).title('Balls');

        pc.hr();

        pc.slider('balls_number', 4, 1, 48, 1).alt('number of balls');

        pc.hr();

        pc.slider('mouse_gravity', 1, -10, 10, 1);
        pc.precision('mouse_gravity', 0.01);

        pc.slider('balls_resistance', 0.1, 100, 200, 0.01);
        pc.range('balls_resistance', 0.01, 0.3);

        pc.hr();

        let ballSizeConfig = pc.group('bsc');
        ballSizeConfig.displayName('ball size config');
        ballSizeConfig.slider('balls_base_size', 100, 10, 200, 1);
        ballSizeConfig.slider('balls_resize_seed', 0, -100, 100, 0.1);
        ballSizeConfig.slider('balls_enlarge', 1, 1, 2, 0.01);
        ballSizeConfig.slider('balls_resize_speed', 1, 0.01, 4, 0.01);

        pc.hr();

        pc.group('style config')
            .color('bgc', '#fff')
            .color('ball_fill', '#333')
            .color('ball_stroke', '#000')
            .slider('ball_strokeWeight', 0, 0, 256, 0.1)
            .slider('restyle_speed', 0.01, 0.01, 1, 0.01)
            .radio('draw_on_top', ['stroke', 'fill']);
    };

    __setup = () => {
        cnv = createCanvas(windowWidth, windowHeight);
        center = createVector(width / 2, height / 2);
        mouseV = createVector(mouseX, mouseY);
        pBgcolor = bgc;

        // pc.mainContainer.position(null, 0);
        // pc.mainContainer.elt.style.bottom = '0';
        // pc.mainContainer.elt.setAttribute('stick', 'bottom');
        pc.stick('bottom');

    };
    __draw = () => {
        const bgcolor = lerpColor(color(pBgcolor), color(bgc), restyle_speed);
        background(bgcolor);
        pBgcolor = bgcolor;

        mouseV.set(mouseX, mouseY);
        drawBalls(balls_number, balls_resize_seed, balls_base_size, balls_enlarge, balls_resistance, mouse_gravity, ball_fill, ball_stroke, ball_strokeWeight, restyle_speed);


    };


    function Ball(idx, size = 50) {
        this.r = size;
        this.id = idx;
        this.baseSize = size;
        this.mass = this.r;

        this.destroy = false;

        this.pos = createVector(map(Math.random(), 0, 1, this.r, width - this.r),
            map(Math.random(), 0, 1, this.r, height - this.r));
        this.vel = createVector(Math.random(), Math.random());
        this.acl = createVector();


        this.fill = color(bgc);
        this.stroke = color(bgc);
        this.strokeWeight = 0;



        this.resizeSpeed = 1;
        this.resizing = (newSize) => {
            this.resizeSpeed = balls_resize_speed;
            this.r = Math.abs(this.r - newSize) > this.resizeSpeed + 1 ? ((this.r - newSize) > 0 ? this.r - this.resizeSpeed : this.r + this.resizeSpeed) : this.r;

        };

        this.renewSizeFromSeed = (seed, baseSize, enlarge) => {
            this.baseSize = baseSize;
            let newSize = (noise(this.id * seed + this.id + seed) * enlarge + enlarge / 2) * this.baseSize;
            this.resizing(newSize);
        };

        this.fading = () => {
            this.resizeSpeed = balls_resize_speed * noise(this.id + frameCount / 1000);
            this.renewSizeFromSeed = () => { };
            this.r = this.r - this.resizeSpeed;
            this.strokeWeight = Math.max(this.strokeWeight - this.strokeWeight / this.r, 0);
            if (this.r < this.resizeSpeed) {
                this.destroy = true;
            }
        }
        this.colliding = (other) => {
            //https://openprocessing.org/sketch/848306
            const d = this.pos.copy().dist(other.pos);
            const c = this.r + other.r;
            const dist = this.pos.dist(other.pos)
            // const c = (this.r / 2 + other.r / 2)
            if (this.pos.dist(other.pos) < c) {
                //ref: https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
                const delta = p5.Vector.sub(this.pos, other.pos)
                const d = this.pos.dist(other.pos)
                const mtd = delta.copy().mult((c - d) / d)
                const im1 = 1 / this.mass
                const im2 = 1 / other.mass

                this.pos.add(mtd.copy().mult(im1 / (im1 + im2)))
                other.pos.sub(mtd.copy().mult(im2 / (im1 + im2)))

                const v = this.vel.copy().sub(other.vel)
                const vn = v.dot(mtd.copy().normalize())

                const im = (-(1 + 0.85) * vn) / (im1 + im2);
                const impulse = mtd.copy().normalize().mult(im)

                this.vel.add(impulse.copy().mult(im1))
                other.vel.sub(impulse.copy().mult(im2))
            }
        }

        this.detectEdge = () => {
            this.vel.x = this.pos.x < this.r * 2 || this.pos.x > width - this.r * 2 ? -this.vel.x : this.vel.x;
            this.vel.y = this.pos.y < this.r * 2 || this.pos.y > height - this.r * 2 ? -this.vel.y : this.vel.y;
            this.pos.x = this.pos.x < this.r ? this.r : (this.pos.x > width - this.r ? width - this.r : this.pos.x);
            this.pos.y = this.pos.y < this.r ? this.r : (this.pos.y > height - this.r ? height - this.r : this.pos.y);
        };
        this.mouseGravity = (mouseGravity) => {
            if (mouseGravity > 0) {
                this.acl.add(p5.Vector.sub(mouseV, this.pos))
                this.acl.div(10000);
                this.acl.mult(mouseGravity);
                this.vel.add(this.acl)
                this.vel.mult(0.98)
                this.pos.add(this.vel)
            } else if (mouseGravity < 0) {
                this.acl.add(p5.Vector.sub(this.pos, mouseV).normalize());
                this.acl.div(mouseV.dist(this.pos) / Math.abs(mouseGravity));
                this.acl.mult(-mouseGravity);
                this.vel.add(this.acl)
            }
        };

        this.move = (resistance) => {
            this.vel.mult(1 - resistance)
            this.pos.add(this.vel);
        };

        this.reStyleSpeed = 0.01;
        this.reStyle = (f, s, sw, reStyleSpeed) => {
            this.reStyleSpeed = reStyleSpeed;
            this.fill = lerpColor(this.fill, color(f), this.reStyleSpeed);
            this.stroke = lerpColor(this.stroke, color(s), this.reStyleSpeed);
            this.strokeWeight = map(this.reStyleSpeed, 0, Math.abs(this.strokeWeight - sw), this.strokeWeight, sw);
        };
        this.drawFill = () => {
            push();
            noStroke();
            fill(this.fill);
            circle(this.pos.x, this.pos.y, this.r * 2);
            pop();
        };
        this.drawStroke = () => {
            if (this.strokeWeight < 1) {
                return;
            }
            push();
            noFill();
            stroke(this.stroke);
            strokeWeight(this.strokeWeight);
            circle(this.pos.x, this.pos.y, this.r * 2);
            pop();
        };
        this.show = (f, s, sw, reStyleSpeed = 0.01) => {
            this.reStyle(f, s, sw, reStyleSpeed);
            push();
            if (draw_on_top == 'fill') {
                stroke(this.stroke);
                strokeWeight(this.strokeWeight);
                circle(this.pos.x, this.pos.y, this.r * 2);
                noStroke();
                fill(this.fill);
                circle(this.pos.x, this.pos.y, this.r * 2);
            } else {
                fill(this.fill);
                circle(this.pos.x, this.pos.y, this.r * 2);
                noFill();
                stroke(this.stroke);
                strokeWeight(this.strokeWeight);
                circle(this.pos.x, this.pos.y, this.r * 2);
            }
            pop();
        };

        this.update = (resistance, mouseGravity) => {
            this.mouseGravity(mouseGravity);
            this.move(resistance);
            this.detectEdge();
        };
        this.draw = (f, s, sw, reStyleSpeed = 0.01) => {
            this.show(f, s, sw, reStyleSpeed);
        };
    }

    function Balls() {
        this.ballsArr = [];
        this._balls = 0;
        const that = this;
        Object.defineProperty(this, 'balls', {
            get: () => {
                return that._balls;
            },
            set: (newValue) => {
                that._balls = newValue;
                if (that.ballsArr.length < that._balls) {
                    for (let i = 0; i < that._balls - that.ballsArr.length; i++) {
                        that.ballsArr.push(new Ball(i));
                    }
                } else if (that.ballsArr.length > that._balls) {
                    // that.ballsArr.length = that._balls;
                    that.ballsArr.filter((b, idx) => idx >= that._balls).map(b => b.fading());
                }
            }
        });
        this.refresh = () => {
            this.ballsArr = this.ballsArr.filter(b => b.destroy == false);
        }
        this.collisionDetect = () => {
            this.ballsArr.filter(b => b instanceof Ball).map((b, idx, arr) => {
                arr.slice(idx + 1).map(o => {
                    b.colliding(o);
                });
            });
        };
        this.resize = (seed, baseSize, enlarge) => {
            this.ballsArr.filter(b => b instanceof Ball).map(b => {
                b.renewSizeFromSeed(seed, baseSize, enlarge);
            });
        };
        this.update = (resistance, mouseGravity) => {
            this.ballsArr.filter(b => b instanceof Ball).map(b => {
                b.update(resistance, mouseGravity);
            });
        };
        this.draw = (f, s, sw, reStyleSpeed = 0.01) => {
            this.ballsArr.filter(b => b instanceof Ball).map(b => {
                b.reStyle(f, s, sw, reStyleSpeed);
            });
            if (draw_on_top == 'fill') {
                this.ballsArr.filter(b => b instanceof Ball).map(b => {
                    b.drawStroke();
                    return b;
                }).map(b => {
                    b.drawFill();
                    return b;
                });
            } else {
                this.ballsArr.filter(b => b instanceof Ball).map(b => {
                    b.drawFill();
                    return b;
                }).map(b => {
                    b.drawStroke();
                    return b;
                });
            }
            // this.ballsArr.filter(b => b instanceof Ball).map(b => {
            //     b.draw(f, s, sw, reStyleSpeed);
            // });
        };
    };

    var drawBalls = (ballsNumber, ballsResizeSeed,
        ballBaseSize, ballsEnlarge,
        ballsResistance, mouseGravity,
        ballsFill, ballsStroke, ballsStrokeWeight,
        ballsReStyleSpeed) => {
        ballsObj = typeof ballsObj == 'undefined' ? new Balls() : ballsObj;
        ballsObj.balls = ballsNumber;
        ballsObj.refresh();
        ballsObj.collisionDetect();
        ballsObj.resize(ballsResizeSeed, ballBaseSize, ballsEnlarge);
        ballsObj.update(ballsResistance, mouseGravity);
        ballsObj.draw(ballsFill, ballsStroke, ballsStrokeWeight, ballsReStyleSpeed);
    }



};
