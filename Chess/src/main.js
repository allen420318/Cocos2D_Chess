var MainLayer = cc.Layer.extend({
    bg:null,
    sprite:null,
    title:null,
    px:null,
    py:null,
    selected:null,
    red:0,
    black:0,
    royalR:null,
    royalB:null,
    redwin:null,
    blackwin:null,
    chessback:new Array(32),
    chessrects:new Array(32),
    allselect:false,
    chess:[{num:0,val:7},{num:1,val:6},{num:2,val:6},{num:3,val:5},{num:4,val:5},{num:5,val:4},
           {num:6,val:4},{num:7,val:3},{num:8,val:3},{num:9,val:2},{num:10,val:2},{num:11,val:1},
           {num:12,val:1},{num:13,val:1},{num:14,val:1},{num:15,val:1},{num:17,val:7},{num:18,val:6},
           {num:19,val:6},{num:20,val:5},{num:21,val:5},{num:22,val:4},{num:23,val:4},{num:24,val:3},
           {num:25,val:3},{num:26,val:2},{num:27,val:2},{num:28,val:1},{num:29,val:1},{num:30,val:1},
           {num:31,val:1},{num:32,val:1}],
    ctor:function () {

        this._super();

        //背景
        this.bg = new cc.Sprite(res.chessboard_png);
        this.bg.x = cc.winSize.width /2;
        this.bg.y = cc.winSize.height /2;
        this.addChild(this.bg);

        //初始化場景
        this.initLayout();

        //偵側滑鼠點擊
        this.setUpmymouse(this);

        return true;
    },

    initLayout: function(){

        //棋子陣列打亂
        this.chess = shuffle(this.chess);

        //棋子布署
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.chess_plist, res.chess_png);

        for (var i = 0; i<this.chessback.length ;i++){
            this.chessback[i] = {img:new cc.Sprite("#chess_33.png"),num:33,val:8,select:false,back:true};

            this.px = i % 8;
            this.py = parseInt(i / 8);

            this.chessback[i].img.x = cc.winSize.width  / 12.5 + this.px * 115;
            this.chessback[i].img.y = cc.winSize.height / 3.8 + this.py * 100;

            this.chessrects[i] = new cc.Rect(
                this.chessback[i].img.x - this.chessback[i].img.width/2,
                this.chessback[i].img.y - this.chessback[i].img.height/2,
                this.chessback[i].img.width,
                this.chessback[i].img.height
            );

            this.addChild(this.chessback[i].img);

        }

        //暗棋遊戲
        this.title = new cc.LabelTTF("暗棋遊戲","",48);
        this.title.x = cc.winSize.width / 2;
        this.title.y = cc.winSize.height * 14.7 / 16;
        this.addChild(this.title);

        //紅棋獲勝
        this.redwin = new cc.LabelTTF("紅棋獲勝","",44);
        this.redwin.x = cc.winSize.width / 2;
        this.redwin.y = cc.winSize.height * 1.3 / 16;
        this.addChild(this.redwin);
        this.redwin.setVisible(false);

        this.royalR = new cc.Sprite(res.royal_png);
        this.royalR.x = cc.winSize.width * 0.7 / 2;
        this.royalR.y = cc.winSize.height * 1.3 / 16;
        this.addChild(this.royalR);
        this.royalR.setVisible(false);

        //黑棋獲勝
        this.blackwin = new cc.LabelTTF("黑棋獲勝","",44);
        this.blackwin.x = cc.winSize.width / 2;
        this.blackwin.y = cc.winSize.height * 1.3 / 16;
        this.addChild(this.blackwin);
        this.blackwin.setVisible(false);

        this.royalB = new cc.Sprite(res.royal_png);
        this.royalB.x = cc.winSize.width * 0.7 / 2;
        this.royalB.y = cc.winSize.height * 1.3 / 16;
        this.addChild(this.royalB);
        this.royalB.setVisible(false);

    },

    // initGame() {
    //     this.red = 0;
    //     this.black = 0;
    //     this.allselect = false;
    //     this.redwin.setVisible(false);
    //     this.blackwin.setVisible(false);
    //     this.royalR.setVisible(false);
    //     this.royalB.setVisible(false);
    //     this.chess = [{num:0,val:7},{num:1,val:6},{num:2,val:6},{num:3,val:5},{num:4,val:5},{num:5,val:4},
    //         {num:6,val:4},{num:7,val:3},{num:8,val:3},{num:9,val:2},{num:10,val:2},{num:11,val:1},
    //         {num:12,val:1},{num:13,val:1},{num:14,val:1},{num:15,val:1},{num:17,val:7},{num:18,val:6},
    //         {num:19,val:6},{num:20,val:5},{num:21,val:5},{num:22,val:4},{num:23,val:4},{num:24,val:3},
    //         {num:25,val:3},{num:26,val:2},{num:27,val:2},{num:28,val:1},{num:29,val:1},{num:30,val:1},
    //         {num:31,val:1},{num:32,val:1}];
    //
    //     this.chess = shuffle(this.chess);
    //
    //     for (var i = 0; i<this.chessback.length ;i++){
    //         this.chessback[i] = {img:new cc.Sprite("#chess_33.png"),num:33,val:8,select:false,back:true};
    //
    //         this.px = i % 8;
    //         this.py = parseInt(i / 8);
    //
    //         this.chessback[i].img.x = cc.winSize.width  / 12.5 + this.px * 115;
    //         this.chessback[i].img.y = cc.winSize.height / 3.8 + this.py * 100;
    //
    //         this.chessrects[i] = new cc.Rect(
    //             this.chessback[i].img.x - this.chessback[i].img.width/2,
    //             this.chessback[i].img.y - this.chessback[i].img.height/2,
    //             this.chessback[i].img.width,
    //             this.chessback[i].img.height
    //         );
    //
    //         this.addChild(this.chessback[i].img);
    //     }
    //
    //     for (var i = 0;i<this.chess.length;i++){
    //         cc.log(this.chess[i].num.toString());
    //     }
    //     cc.log("-----------------------------------");
    //     for (var i = 0;i<this.chessback.length;i++){
    //         cc.log(this.chessback[i].num.toString());
    //     }
    //
    // },

    setUpmymouse: function(layer){
        if ('mouse' in cc.sys.capabilities){
            var mouseListener = {
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var x = event.getLocationX();
                    var y = event.getLocationY();
                    // console.log(x + " x " + y);
                    var point = new cc.Point(x, y);

                    if(layer.red >= 16 || layer.black >= 16) {
                        location.reload()
                        // layer.initGame();
                        // return;
                    }


                    for (var i = 0; i < layer.chessrects.length; i++) {
                        if (cc.rectContainsPoint(layer.chessrects[i], point)) {

                            //翻棋
                            if(layer.allselect == false && layer.chessback[i].select == false && layer.chessback[i].back == true) {

                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chess[i].num + ".png");
                                layer.chessback[i].back = false;
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;

                            //選擇棋子
                            }else if(layer.allselect == false && layer.chessback[i].select == false && layer.chessback[i].back == false &&
                            layer.chessback[i].val != 0) {

                                // console.log(layer.chessback[i].val);
                                layer.selected = new cc.Sprite(res.select_png);
                                layer.selected.x = layer.chessback[i].img.x;
                                layer.selected.y = layer.chessback[i].img.y;
                                layer.addChild(layer.selected);
                                layer.selected.setVisible(true);
                                layer.chessback[i].select = true;
                                layer.allselect = true;

                            }

                            //帥右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num <= 0  && layer.chessback[i].num > 15 &&
                                    layer.chessback[i].num < 33 && layer.chessback[i].val != 1 && layer.allselect == true &&
                                    layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //帥左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num <= 0  && layer.chessback[i].num > 15 &&
                                layer.chessback[i].num < 33 && layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //帥上移
                            else if (i - 8 >= 0 &&layer.chessback[i - 8].num <= 0  && layer.chessback[i].num > 15 &&
                                layer.chessback[i].num < 33 && layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //帥下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num <= 0  && layer.chessback[i].num > 15 &&
                                layer.chessback[i].num < 33 && layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            // 仕相俥媽右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 0  && layer.chessback[i - 1].num < 9  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i - 1].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //仕相俥媽左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 0  && layer.chessback[i + 1].num < 9  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i + 1].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //仕相俥媽上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 0  && layer.chessback[i - 8].num < 9 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i - 8].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //仕相俥媽下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 0  && layer.chessback[i + 8].num < 9  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i + 8].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 1-1-1(|||)
                            else if (i - 2 >= 0 && layer.chessback[i - 2].num > 8  && layer.chessback[i - 2].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 2].num,val:layer.chessback[i - 2].val});
                                layer.chess.splice(i - 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 2].val = layer.chess[i - 2].val;
                                layer.chessback[i - 2].num = layer.chess[i - 2].num;

                                layer.chessback[i - 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 1-1-2(|||)
                            else if (i - 2 >= 0 && layer.chessback[i - 2].num > 8  && layer.chessback[i - 2].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 2].num,val:layer.chessback[i - 2].val});
                                layer.chess.splice(i - 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 2].val = layer.chess[i - 2].val;
                                layer.chessback[i - 2].num = layer.chess[i - 2].num;

                                layer.chessback[i - 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 2-1-1(||O|)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 8  && layer.chessback[i - 3].num < 11  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 2-1-2(||O|)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 8  && layer.chessback[i - 3].num < 11  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 2-2-1(|O||)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 8  && layer.chessback[i - 3].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 2-2-2(|O||)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 8  && layer.chessback[i - 3].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-1-1(||OO|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-1-2(||OO|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-2-1(|O|O|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-2-2(|O|O|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-3-1(|OO||)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 3-3-2(|OO||)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 8  && layer.chessback[i - 4].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-1-1(||OOO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-1-2(||OOO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-2-1(|O|OO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-2-2(|O|OO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-3-1(|OO|O|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-3-2(|OO|O|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-4-1(|OOO||)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 4-4-2(|OOO||)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 8  && layer.chessback[i - 5].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-1-1(||OOOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 5].num >= 0 && layer.chessback[i - 5].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-1-2(||OOOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 5].num > 17 && layer.chessback[i - 5].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-2-1(|O|OOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-2-2(|O|OOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-3-1(|OO|OO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-3-2(|OO|OO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-4-1(|OOO|O|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-4-2(|OOO|O|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-5-1(|OOOO||)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 5-5-2(|OOOO||)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 8  && layer.chessback[i - 6].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-1-1(||OOOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 6].num >= 0 && layer.chessback[i - 6].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-1-2(||OOOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 6].num > 17 && layer.chessback[i - 6].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-2-1(|O|OOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 5].num >= 0 && layer.chessback[i - 5].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-2-2(|O|OOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 5].num > 17 && layer.chessback[i - 5].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-3-1(|OO|OOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-3-2(|OO|OOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-4-1(|OOO|OO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-4-2(|OOO|OO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-5-1(|OOOO|O|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-5-2(|OOOO|O|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-6-1(|OOOOO||)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右飛
                            //Status 6-6-2(|OOOOO||)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 8  && layer.chessback[i - 7].num < 11  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 1-1-1(|||)
                            else if (i + 2 <= 31 && layer.chessback[i + 2].num > 8  && layer.chessback[i + 2].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 2].num,val:layer.chessback[i + 2].val});
                                layer.chess.splice(i + 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 2].val = layer.chess[i + 2].val;
                                layer.chessback[i + 2].num = layer.chess[i + 2].num;

                                layer.chessback[i + 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 1-1-2(|||)
                            else if (i + 2 <= 31 && layer.chessback[i + 2].num > 8  && layer.chessback[i + 2].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 2].num,val:layer.chessback[i + 2].val});
                                layer.chess.splice(i + 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 2].val = layer.chess[i + 2].val;
                                layer.chessback[i + 2].num = layer.chess[i + 2].num;

                                layer.chessback[i + 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 2-1-1(||O|)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 8  && layer.chessback[i + 3].num < 11  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 2-1-2(||O|)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 8  && layer.chessback[i + 3].num < 11  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 2-2-1(|O||)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 8  && layer.chessback[i + 3].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 2-2-2(|O||)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 8  && layer.chessback[i + 3].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-1-1(||OO|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-1-2(||OO|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-2-1(|O|O|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-2-2(|O|O|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-3-1(|OO||)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 3-3-2(|OO||)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 8  && layer.chessback[i + 4].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-1-1(||OOO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-1-2(||OOO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-2-1(|O|OO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i - 5].val;
                                layer.chessback[i + 5].num = layer.chess[i - 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-2-2(|O|OO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-3-1(|OO|O|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-3-2(|OO|O|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-4-1(|OOO||)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 4-4-2(|OOO||)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 8  && layer.chessback[i + 5].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-1-1(||OOOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 5].num >= 0 && layer.chessback[i + 5].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-1-2(||OOOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 5].num > 17 && layer.chessback[i + 5].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-2-1(|O|OOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-2-2(|O|OOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-3-1(|OO|OO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-3-2(|OO|OO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-4-1(|OOO|O|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-4-2(|OOO|O|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-5-1(|OOOO||)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 5-5-2(|OOOO||)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 8  && layer.chessback[i + 6].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-1-1(||OOOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 6].num >= 0 && layer.chessback[i + 6].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-1-2(||OOOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 6].num > 17 && layer.chessback[i + 6].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-2-1(|O|OOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 5].num >= 0 && layer.chessback[i + 5].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-2-2(|O|OOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 5].num > 17 && layer.chessback[i + 5].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-3-1(|OO|OOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-3-2(|OO|OOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-4-1(|OOO|OO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-4-2(|OOO|OO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-5-1(|OOOO|O|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-5-2(|OOOO|O|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-6-1(|OOOOO||)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左飛
                            //Status 6-6-2(|OOOOO||)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 8  && layer.chessback[i + 7].num < 11  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 1-1-1(|||)
                            else if (i - 16 >= 0  && layer.chessback[i - 16].num > 8  && layer.chessback[i - 16].num < 11  &&
                                layer.chessback[i - 8].num >= 0 && layer.chessback[i - 8].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 16].num,val:layer.chessback[i - 16].val});
                                layer.chess.splice(i - 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 16].val = layer.chess[i - 16].val;
                                layer.chessback[i - 16].num = layer.chess[i - 16].num;

                                layer.chessback[i - 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 1-1-2(|||)
                            else if (i - 16 >= 0  && layer.chessback[i - 16].num > 8  && layer.chessback[i - 16].num < 11  &&
                                layer.chessback[i - 8].num > 17 && layer.chessback[i - 8].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 16].num,val:layer.chessback[i - 16].val});
                                layer.chess.splice(i - 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 16].val = layer.chess[i - 16].val;
                                layer.chessback[i - 16].num = layer.chess[i - 16].num;

                                layer.chessback[i - 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 2-1-1(||O|)
                            else if (i - 24 >= 0  && layer.chessback[i - 24].num > 8  && layer.chessback[i - 24].num < 11  &&
                                layer.chessback[i - 16].num >= 0 && layer.chessback[i - 16].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 2-1-2(||O|)
                            else if (i - 24 >= 0  && layer.chessback[i - 24].num > 8  && layer.chessback[i - 24].num < 11  &&
                                layer.chessback[i - 16].num > 17 && layer.chessback[i - 16].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 2-2-1(|O||)
                            else if (i - 24 >= 0  && layer.chessback[i - 24].num > 8  && layer.chessback[i - 24].num < 11  &&
                                layer.chessback[i - 8].num >= 0 && layer.chessback[i - 8].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上飛
                            //Status 2-2-2(|O||)
                            else if (i - 24 >= 0  && layer.chessback[i - 24].num > 8  && layer.chessback[i - 24].num < 11  &&
                                layer.chessback[i - 8].num > 17 && layer.chessback[i - 8].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 1-1-1(|||)
                            else if (i + 16 <= 31  && layer.chessback[i + 16].num > 8  && layer.chessback[i + 16].num < 11  &&
                                layer.chessback[i + 8].num >= 0 && layer.chessback[i + 8].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 16].num,val:layer.chessback[i + 16].val});
                                layer.chess.splice(i + 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 16].val = layer.chess[i + 16].val;
                                layer.chessback[i + 16].num = layer.chess[i + 16].num;

                                layer.chessback[i + 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 1-1-2(|||)
                            else if (i + 16 <= 31  && layer.chessback[i + 16].num > 8  && layer.chessback[i + 16].num < 11  &&
                                layer.chessback[i + 8].num > 17 && layer.chessback[i + 8].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 16].num,val:layer.chessback[i + 16].val});
                                layer.chess.splice(i + 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 16].val = layer.chess[i + 16].val;
                                layer.chessback[i + 16].num = layer.chess[i + 16].num;

                                layer.chessback[i + 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 2-1-1(||O|)
                            else if (i + 24 <= 31  && layer.chessback[i + 24].num > 8  && layer.chessback[i + 24].num < 11  &&
                                layer.chessback[i + 16].num >= 0 && layer.chessback[i + 16].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 2-1-2(||O|)
                            else if (i + 24 <= 31  && layer.chessback[i + 24].num > 8  && layer.chessback[i + 24].num < 11  &&
                                layer.chessback[i + 16].num > 17 && layer.chessback[i + 16].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 2-2-1(|O||)
                            else if (i + 24 <= 31  && layer.chessback[i + 24].num > 8  && layer.chessback[i + 24].num < 11  &&
                                layer.chessback[i + 8].num >= 0 && layer.chessback[i + 8].num < 17 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下飛
                            //Status 2-2-2(|O||)
                            else if (i + 24 <= 31  && layer.chessback[i + 24].num > 8  && layer.chessback[i + 24].num < 11  &&
                                layer.chessback[i + 8].num > 17 && layer.chessback[i + 8].num <= 33 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 8  && layer.chessback[i - 1].num < 11  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 8  && layer.chessback[i + 1].num < 11  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 8  && layer.chessback[i - 8].num < 11 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //炮下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 8  && layer.chessback[i + 8].num < 11  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 10  && layer.chessback[i - 1].num < 16  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                /*layer.chessback[i].val >= 7 &&*/ layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            // 兵右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 10  && layer.chessback[i - 1].num < 16  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 10  && layer.chessback[i + 1].num < 16  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 10  && layer.chessback[i + 1].num < 16  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 10  && layer.chessback[i - 8].num < 16 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 10  && layer.chessback[i - 8].num < 16 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 10  && layer.chessback[i + 8].num < 16  &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //兵下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 10  && layer.chessback[i + 8].num < 16 &&
                                layer.chessback[i].num > 15 && layer.chessback[i].num < 33 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否紅棋贏
                                if (layer.chessback[i].num > 16) {
                                    layer.red += 1;
                                    cc.log("red:" + layer.red);
                                    if (layer.red >= 16) {
                                        layer.redwin.setVisible(true);
                                        layer.royalR.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //將右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 16 && layer.chessback[i - 1].num < 18 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //將左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 16 && layer.chessback[i + 1].num < 18 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //將上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 16 && layer.chessback[i - 8].num < 18 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //將下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 16 && layer.chessback[i + 8].num < 18 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val != 1 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //士象車馬右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num < 26 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i - 1].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //士象車馬左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num < 26 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i + 1].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //士象車馬上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 17 && layer.chessback[i - 8].num < 26 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i - 8].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //士象車馬下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 17 && layer.chessback[i + 8].num < 26 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i + 8].val >= layer.chessback[i].val && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 1-1-1(|||)
                            else if (i - 2 >= 0 && layer.chessback[i - 2].num > 25  && layer.chessback[i - 2].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 2].num,val:layer.chessback[i - 2].val});
                                layer.chess.splice(i - 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 2].val = layer.chess[i - 2].val;
                                layer.chessback[i - 2].num = layer.chess[i - 2].num;

                                layer.chessback[i - 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 1-1-2(|||)
                            else if (i - 2 >= 0 && layer.chessback[i - 2].num > 25  && layer.chessback[i - 2].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 2].num,val:layer.chessback[i - 2].val});
                                layer.chess.splice(i - 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 2].val = layer.chess[i - 2].val;
                                layer.chessback[i - 2].num = layer.chess[i - 2].num;

                                layer.chessback[i - 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 2-1-1(||O|)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 25  && layer.chessback[i - 3].num < 28  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 2-1-2(||O|)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 25  && layer.chessback[i - 3].num < 28  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 2-2-1(|O||)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 25  && layer.chessback[i - 3].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 2-2-2(|O||)
                            else if (i - 3 >= 0 && layer.chessback[i - 3].num > 25  && layer.chessback[i - 3].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 3].num,val:layer.chessback[i - 3].val});
                                layer.chess.splice(i - 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 3].val = layer.chess[i - 3].val;
                                layer.chessback[i - 3].num = layer.chess[i - 3].num;

                                layer.chessback[i - 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-1-1(||OO|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-1-1(||OO|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-2-1(|O|O|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-2-2(|O|O|)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-3-1(|OO||)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 3-3-1(|OO||)
                            else if (i - 4 >= 0 && layer.chessback[i - 4].num > 25  && layer.chessback[i - 4].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 4].num,val:layer.chessback[i - 4].val});
                                layer.chess.splice(i - 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 4].val = layer.chess[i - 4].val;
                                layer.chessback[i - 4].num = layer.chess[i - 4].num;

                                layer.chessback[i - 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-1-1(||OOO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-1-2(||OOO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-2-1(|O|OO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-2-2(|O|OO|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-3-1(|OO|O|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-3-2(|OO|O|)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-4-1(|OOO||)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 4-4-1(|OOO||)
                            else if (i - 5 >= 0 && layer.chessback[i - 5].num > 25  && layer.chessback[i - 5].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 5].num,val:layer.chessback[i - 5].val});
                                layer.chess.splice(i - 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 5].val = layer.chess[i - 5].val;
                                layer.chessback[i - 5].num = layer.chess[i - 5].num;

                                layer.chessback[i - 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-1-1(||OOOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 5].num >= 0 && layer.chessback[i - 5].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-1-2(||OOOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 5].num > 17 && layer.chessback[i - 5].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-2-1(|O|OOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-2-2(|O|OOO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-3-1(|OO|OO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-3-2(|OO|OO|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-4-1(|OOO|O|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-4-2(|OOO|O|)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-5-1(|OOOO||)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 5-5-2(|OOOO||)
                            else if (i - 6 >= 0 && layer.chessback[i - 6].num > 25  && layer.chessback[i - 6].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 6].num,val:layer.chessback[i - 6].val});
                                layer.chess.splice(i - 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 6].val = layer.chess[i - 6].val;
                                layer.chessback[i - 6].num = layer.chess[i - 6].num;

                                layer.chessback[i - 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-1-1(||OOOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 6].num >= 0 && layer.chessback[i - 6].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-1-2(||OOOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 6].num > 17 && layer.chessback[i - 6].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-2-1(|O|OOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 5].num >= 0 && layer.chessback[i - 5].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-2-2(|O|OOOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 5].num > 17 && layer.chessback[i - 5].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-3-1(|OO|OOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 4].num >= 0 && layer.chessback[i - 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-3-2(|OO|OOO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 4].num > 17 && layer.chessback[i - 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-4-1(|OOO|OO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 3].num >= 0 && layer.chessback[i - 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-4-2(|OOO|OO|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 3].num > 17 && layer.chessback[i - 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-5-1(|OOOO|O|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 2].num >= 0 && layer.chessback[i - 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-5-2(|OOOO|O|)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 2].num > 17 && layer.chessback[i - 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-6-1(|OOOOO||)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 1].num >= 0 && layer.chessback[i - 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右飛
                            //Status 6-6-2(|OOOOO||)
                            else if (i - 7 >= 0 && layer.chessback[i - 7].num > 25  && layer.chessback[i - 7].num < 28  &&
                                layer.chessback[i - 1].num > 17 && layer.chessback[i - 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 7].num,val:layer.chessback[i - 7].val});
                                layer.chess.splice(i - 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 7].val = layer.chess[i - 7].val;
                                layer.chessback[i - 7].num = layer.chess[i - 7].num;

                                layer.chessback[i - 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 1-1-1(|||)
                            else if (i + 2 <= 31 && layer.chessback[i + 2].num > 25  && layer.chessback[i + 2].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 2].num,val:layer.chessback[i + 2].val});
                                layer.chess.splice(i + 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 2].val = layer.chess[i + 2].val;
                                layer.chessback[i + 2].num = layer.chess[i + 2].num;

                                layer.chessback[i + 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 1-1-2(|||)
                            else if (i + 2 <= 31 && layer.chessback[i + 2].num > 25  && layer.chessback[i + 2].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 2].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 2].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 2].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 2].num,val:layer.chessback[i + 2].val});
                                layer.chess.splice(i + 2,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 2].val = layer.chess[i + 2].val;
                                layer.chessback[i + 2].num = layer.chess[i + 2].num;

                                layer.chessback[i + 2].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 2-1-1(||O|)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 25  && layer.chessback[i + 3].num < 28  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 2-1-2(||O|)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 25  && layer.chessback[i + 3].num < 28  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 2-2-1(|O||)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 25  && layer.chessback[i + 3].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 2-2-2(|O||)
                            else if (i + 3 <= 31 && layer.chessback[i + 3].num > 25  && layer.chessback[i + 3].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 3].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 3].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 3].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 3].num,val:layer.chessback[i + 3].val});
                                layer.chess.splice(i + 3,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 3].val = layer.chess[i + 3].val;
                                layer.chessback[i + 3].num = layer.chess[i + 3].num;

                                layer.chessback[i + 3].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-1-1(||OO|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-1-2(||OO|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-2-1(|O|O|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-2-2(|O|O|)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-3-1(|OO||)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 3-3-2(|OO||)
                            else if (i + 4 <= 31 && layer.chessback[i + 4].num > 25  && layer.chessback[i + 4].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 4].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 4].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 4].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 4].num,val:layer.chessback[i + 4].val});
                                layer.chess.splice(i + 4,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 4].val = layer.chess[i + 4].val;
                                layer.chessback[i + 4].num = layer.chess[i + 4].num;

                                layer.chessback[i + 4].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-1-1(||OOO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-1-2(||OOO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-2-1(|O|OO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-2-2(|O|OO|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-3-1(|OO|O|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-3-2(|OO|O|)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-4-1(|OOO||)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 4-4-2(|OOO||)
                            else if (i + 5 <= 31 && layer.chessback[i + 5].num > 25  && layer.chessback[i + 5].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 5].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 5].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 5].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 5].num,val:layer.chessback[i + 5].val});
                                layer.chess.splice(i + 5,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 5].val = layer.chess[i + 5].val;
                                layer.chessback[i + 5].num = layer.chess[i + 5].num;

                                layer.chessback[i + 5].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-1-1(||OOOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 5].num >= 0 && layer.chessback[i + 5].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-1-2(||OOOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 5].num > 17 && layer.chessback[i + 5].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-2-1(|O|OOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-2-2(|O|OOO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-3-1(|OO|OO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-3-2(|OO|OO|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-4-1(|OOO|O|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-4-2(|OOO|O|)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-5-1(|OOOO||)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 5-5-2(|OOOO||)
                            else if (i + 6 <= 31 && layer.chessback[i + 6].num > 25  && layer.chessback[i + 6].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 6].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 6].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 6].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 6].num,val:layer.chessback[i + 6].val});
                                layer.chess.splice(i + 6,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 6].val = layer.chess[i + 6].val;
                                layer.chessback[i + 6].num = layer.chess[i + 6].num;

                                layer.chessback[i + 6].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-1-1(||OOOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 6].num >= 0 && layer.chessback[i + 6].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-1-2(||OOOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 6].num > 17 && layer.chessback[i + 6].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-2-1(|O|OOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 5].num >= 0 && layer.chessback[i + 5].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-2-2(|O|OOOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 5].num > 17 && layer.chessback[i + 5].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-3-1(|OO|OOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 4].num >= 0 && layer.chessback[i + 4].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-3-2(|OO|OOO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 4].num > 17 && layer.chessback[i + 4].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-4-1(|OOO|OO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 3].num >= 0 && layer.chessback[i + 3].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-4-2(|OOO|OO|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 3].num > 17 && layer.chessback[i + 3].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-5-1(|OOOO|O|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 2].num >= 0 && layer.chessback[i + 2].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-5-2(|OOOO|O|)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 2].num > 17 && layer.chessback[i + 2].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-6-1(|OOOOO||)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 1].num >= 0 && layer.chessback[i + 1].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左飛
                            //Status 6-6-2(|OOOOO||)
                            else if (i + 7 <= 31 && layer.chessback[i + 7].num > 25  && layer.chessback[i + 7].num < 28  &&
                                layer.chessback[i + 1].num > 17 && layer.chessback[i + 1].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 7].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 7].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 7].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 7].num,val:layer.chessback[i + 7].val});
                                layer.chess.splice(i + 7,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 7].val = layer.chess[i + 7].val;
                                layer.chessback[i + 7].num = layer.chess[i + 7].num;

                                layer.chessback[i + 7].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 1-1-1(|||)
                            else if (i - 16 >= 0 && layer.chessback[i - 16].num > 25  && layer.chessback[i - 16].num < 28  &&
                                layer.chessback[i - 8].num >= 0 && layer.chessback[i - 8].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 16].num,val:layer.chessback[i - 16].val});
                                layer.chess.splice(i - 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 16].val = layer.chess[i - 16].val;
                                layer.chessback[i - 16].num = layer.chess[i - 16].num;

                                layer.chessback[i - 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 1-1-2(|||)
                            else if (i - 16 >= 0 && layer.chessback[i - 16].num > 25  && layer.chessback[i - 16].num < 28  &&
                                layer.chessback[i - 8].num > 17 && layer.chessback[i - 8].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 16].num,val:layer.chessback[i - 16].val});
                                layer.chess.splice(i - 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 16].val = layer.chess[i - 16].val;
                                layer.chessback[i - 16].num = layer.chess[i - 16].num;

                                layer.chessback[i - 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 2-1-1(||O|)
                            else if (i - 24 >= 0 && layer.chessback[i - 24].num > 25  && layer.chessback[i - 24].num < 28  &&
                                layer.chessback[i - 16].num >= 0 && layer.chessback[i - 16].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 2-1-2(||O|)
                            else if (i - 24 >= 0 && layer.chessback[i - 24].num > 25  && layer.chessback[i - 24].num < 28  &&
                                layer.chessback[i - 16].num > 17 && layer.chessback[i - 16].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 2-2-1(|O||)
                            else if (i - 24 >= 0 && layer.chessback[i - 24].num > 25  && layer.chessback[i - 24].num < 28  &&
                                layer.chessback[i - 8].num >= 0 && layer.chessback[i - 8].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上飛
                            //Status 2-2-2(|O||)
                            else if (i - 24 >= 0 && layer.chessback[i - 24].num > 25  && layer.chessback[i - 24].num < 28  &&
                                layer.chessback[i - 8].num > 17 && layer.chessback[i - 8].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i - 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 24].num,val:layer.chessback[i - 24].val});
                                layer.chess.splice(i - 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 24].val = layer.chess[i - 24].val;
                                layer.chessback[i - 24].num = layer.chess[i - 24].num;

                                layer.chessback[i - 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 1-1-1(|||)
                            else if (i + 16 <= 31 && layer.chessback[i + 16].num > 25  && layer.chessback[i + 16].num < 28  &&
                                layer.chessback[i + 8].num >= 0 && layer.chessback[i + 8].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 16].num,val:layer.chessback[i + 16].val});
                                layer.chess.splice(i + 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 16].val = layer.chess[i + 16].val;
                                layer.chessback[i + 16].num = layer.chess[i + 16].num;

                                layer.chessback[i + 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 1-1-2(|||)
                            else if (i + 16 <= 31 && layer.chessback[i + 16].num > 25  && layer.chessback[i + 16].num < 28  &&
                                layer.chessback[i + 8].num > 17 && layer.chessback[i + 8].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 16].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 16].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 16].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 16].num,val:layer.chessback[i + 16].val});
                                layer.chess.splice(i + 16,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 16].val = layer.chess[i + 16].val;
                                layer.chessback[i + 16].num = layer.chess[i + 16].num;

                                layer.chessback[i + 16].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 2-1-1(||O|)
                            else if (i + 24 <= 31 && layer.chessback[i + 24].num > 25  && layer.chessback[i + 24].num < 28  &&
                                layer.chessback[i + 16].num >= 0 && layer.chessback[i + 16].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 2-1-2(||O|)
                            else if (i + 24 <= 31 && layer.chessback[i + 24].num > 25  && layer.chessback[i + 24].num < 28  &&
                                layer.chessback[i + 16].num > 17 && layer.chessback[i + 16].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 2-2-1(|O||)
                            else if (i + 24 <= 31 && layer.chessback[i + 24].num > 25  && layer.chessback[i + 24].num < 28  &&
                                layer.chessback[i + 8].num >= 0 && layer.chessback[i + 8].num < 17 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下飛
                            //Status 2-2-2(|O||)
                            else if (i + 24 <= 31 && layer.chessback[i + 24].num > 25  && layer.chessback[i + 24].num < 28  &&
                                layer.chessback[i + 8].num > 17 && layer.chessback[i + 8].num <= 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 16 && layer.allselect == true &&
                                layer.chessback[i + 24].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 24].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 24].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 24].num,val:layer.chessback[i + 24].val});
                                layer.chess.splice(i + 24,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 24].val = layer.chess[i + 24].val;
                                layer.chessback[i + 24].num = layer.chess[i + 24].num;

                                layer.chessback[i + 24].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 25  && layer.chessback[i - 1].num < 28  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 25  && layer.chessback[i + 1].num < 28  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 25  && layer.chessback[i - 8].num < 28 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //包下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 25  && layer.chessback[i + 8].num < 28  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 0 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 27  && layer.chessback[i - 1].num < 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                /*layer.chessback[i].val >= 7 &&*/ layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒右移
                            else if (i - 1 >= 0 && layer.chessback[i - 1].num > 27  && layer.chessback[i - 1].num < 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i - 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 1].num,val:layer.chessback[i - 1].val});
                                layer.chess.splice(i - 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 1].val = layer.chess[i - 1].val;
                                layer.chessback[i - 1].num = layer.chess[i - 1].num;

                                layer.chessback[i - 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 27  && layer.chessback[i + 1].num < 33  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒左移
                            else if (i + 1 <= 31 && layer.chessback[i + 1].num > 27  && layer.chessback[i + 1].num < 33  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i + 1].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 1].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 1].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 1].num,val:layer.chessback[i + 1].val});
                                layer.chess.splice(i + 1,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 1].val = layer.chess[i + 1].val;
                                layer.chessback[i + 1].num = layer.chess[i + 1].num;

                                layer.chessback[i + 1].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 27  && layer.chessback[i - 8].num < 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒上移
                            else if (i - 8 >= 0 && layer.chessback[i - 8].num > 27  && layer.chessback[i - 8].num < 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i - 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i - 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i - 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i - 8].num,val:layer.chessback[i - 8].val});
                                layer.chess.splice(i - 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i - 8].val = layer.chess[i - 8].val;
                                layer.chessback[i - 8].num = layer.chess[i - 8].num;

                                layer.chessback[i - 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 27  && layer.chessback[i + 8].num < 33  &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val <= 1 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //卒下移
                            else if (i + 8 <= 31 && layer.chessback[i + 8].num > 27  && layer.chessback[i + 8].num < 33 &&
                                layer.chessback[i].num >= 0 && layer.chessback[i].num < 17 &&
                                layer.chessback[i].val >= 7 && layer.allselect == true &&
                                layer.chessback[i + 8].select == true && layer.chessback[i].back == false) {

                                //判斷是否黑棋贏
                                if (layer.chessback[i].num < 16) {
                                    layer.black += 1;
                                    cc.log("black:" + layer.black);
                                    if (layer.black >= 16) {
                                        layer.blackwin.setVisible(true);
                                        layer.royalB.setVisible(true);
                                    }
                                }

                                layer.chessback[i + 8].img.setSpriteFrame("chess_16.png");
                                layer.chessback[i].img.setSpriteFrame("chess_" + layer.chessback[i + 8].num + ".png");
                                layer.chess.splice(i,1,{num:layer.chessback[i + 8].num,val:layer.chessback[i + 8].val});
                                layer.chess.splice(i + 8,1,{num:16,val:0});
                                layer.chessback[i].val = layer.chess[i].val;
                                layer.chessback[i].num = layer.chess[i].num;
                                layer.chessback[i + 8].val = layer.chess[i + 8].val;
                                layer.chessback[i + 8].num = layer.chess[i + 8].num;

                                layer.chessback[i + 8].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);

                            }

                            //取消選取
                            else {
                                layer.chessback[i].select = false;
                                layer.allselect = false;
                                layer.selected.setVisible(false);
                            }
                            break;
                        }

                    }

                },
            };
            cc.eventManager.addListener(mouseListener,this);
        }
    },
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

function shuffle(a){
    var i,j,x;

    for (i=a.length; i; i--){
        j = parseInt(Math.random()*i);  // 0-9
        x = a[i-1];
        a[i-1] = a[j];
        a[j] = x;
    }
    return a;
}
