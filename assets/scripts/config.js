// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var config = cc.Class({
    extends: cc.Component,

    properties: {
        colorsCount:5,//количество цветов
        countWidth:9,//количество ячеек в ширину
        countHeight:9,//количество ячеек в высоту
        countTurns:{
            default:30,//количество ходов
        },
        minCountToBlast:2,
        defaultTurns:30,
        ScoreCount:0,
        boxHeight:50,
        boxWidth:50,
        scoreToWin:50000,


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
    },

    start () {
        if(cc.find("area_battle",this.node).getComponent("game").isStart){
            cc.find("area_time/time",this.node).getComponent(cc.Label).string="Turns:\n∞";
            cc.find("area_time/score",this.node).getComponent(cc.Label).string="∞";
        }else{
        cc.find("area_time/time",this.node).getComponent(cc.Label).string="Turns:\n"+this.countTurns;
        cc.find("area_time/score",this.node).getComponent(cc.Label).string=this.ScoreCount;
        }
        this.boxHeight=(cc.find("area_battle",this.node).height-20)/this.countHeight;
        this.boxWidth=(cc.find("area_battle",this.node).width-20)/this.countWidth;
    },

    update (dt) {
        if(cc.find("area_battle",this.node).getComponent("game").isStart){
        }else{
        cc.find("area_time/time",this.node).getComponent(cc.Label).string="Turns:\n"+this.countTurns;
        cc.find("area_time/score",this.node).getComponent(cc.Label).string=this.ScoreCount;
        }
    },
});
