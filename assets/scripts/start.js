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
        cc.find('Canvas/area_battle').getComponent('game').isStart=true;
    },
    callback: function (button) {
        
        cc.director.loadScene("main");
    },

    start () {
    },
    // update (dt) {},
});