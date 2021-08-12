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
    callback: function (button) {
        var selfy=button;
        var conf=selfy.node.parent.getComponent("config");
        if(!cc.find("Canvas/area_battle").getComponent("game").gameOn){
            cc.find("Canvas/area_battle").removeAllChildren();
        conf.ScoreCount=0;
        conf.countTurns=conf.defaultTurns;
        cc.find("Canvas/shadow").x=1000;
        cc.find("Canvas/gameEnd").y=500;
        cc.find("Canvas/area_battle").getComponent("game").make_battle_arena_new();
        cc.find("Canvas/area_battle").getComponent("game").gameOn=true;
        cc.find("Canvas/area_battle").getComponent("game").enabledT=cc.find("Canvas/area_battle").getComponent("game").gameOn;
        selfy.node.y=500;
        }
    },

    start () {
    },
    // update (dt) {},
});