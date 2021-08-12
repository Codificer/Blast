//there will be restart code for button
cc.Class({
    extends: cc.Component,

    properties: {
        button:cc.Button,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('click', this.callback, this);
    },
    callback: function (button) {//перемешивание
        var selfy=button;
        var conf=selfy.node.parent.getComponent("config");

        
        conf.countWidth=+cc.find("Canvas/N_count").getComponent(cc.EditBox).string;
        conf.countHeight=+cc.find("Canvas/M_count").getComponent(cc.EditBox).string;
        conf.colorsCount=+cc.find("Canvas/C_count").getComponent(cc.EditBox).string;
        if(conf.colorsCount>5){conf.colorsCount=5;cc.find("Canvas/C_count").getComponent(cc.EditBox).string="5";}
        conf.minCountToBlast=+cc.find("Canvas/K_count").getComponent(cc.EditBox).string;
        conf.scoreToWin=+cc.find("Canvas/X_count").getComponent(cc.EditBox).string;
        conf.defaultTurns=+cc.find("Canvas/Y_count").getComponent(cc.EditBox).string;
        conf.bombCount=+cc.find("Canvas/Bomb_count").getComponent(cc.EditBox).string;
        conf.bombRadius=+cc.find("Canvas/BR_count").getComponent(cc.EditBox).string;
        
        conf.boxHeight=(cc.find("Canvas/area_battle").height-20)/conf.countHeight;
        conf.boxWidth=(cc.find("Canvas/area_battle").width-20)/conf.countWidth;
        
        cc.find("Canvas/area_battle").removeAllChildren();
        conf.ScoreCount=0;
        conf.countTurns=conf.defaultTurns;
        cc.find("Canvas/shadow").x=1000;
        cc.find("Canvas/gameEnd").y=500;        
        cc.find("Canvas/start_new").y=500;
        cc.find("Canvas/area_battle").getComponent("game").make_battle_arena_new();
        cc.find("Canvas/area_battle").getComponent("game").gameOn=true;
        cc.find("Canvas/area_battle").getComponent("game").enabledT=cc.find("Canvas/area_battle").getComponent("game").gameOn;
    },

    start () {
    },
    // update (dt) {},
});

