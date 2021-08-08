// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        colorBox:1,
        score_points:100,
        coord_x: -1,
        coord_y: -1,
    },

    moveToLocation(x,y){//перемещение кубика с стартовой точки до координат
        var selfy=this;
        //var moveAct=cc.moveTo(1,cc.v2(x,y));
        //selfy.node.runAction(moveAct);
        let t=cc.tween;
        t(selfy.node)
            .parallel(
                t().to((y+10)/500,{opacity:255}),
                t().to(2,{position:cc.v2(x,y)})
            )
            .start();
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getComponent(cc.Sprite).node.on('mousedown',function(){//щелчок по кубику
            
            var selfy=this;
            //console.log(selfy);
            var conf=selfy.node.parent.parent.getComponent("config");
            var Game=this.node.parent.getComponent("game");
            //console.log(Game);
            if(selfy.node.parent.getComponent("game").enabledT)//можно ли среагировать
            {
                console.log("удаляем блоки тут");
                //console.log("x",selfy.node.x,"y",selfy.node.y);
                var x=(selfy.node.x-10-conf.boxWidth/2)/conf.boxWidth;
                var y=(selfy.node.y-10-conf.boxHeight/2)/conf.boxHeight;
                console.log(x,y);
                console.log(Game.find_box_to_blast(x,y,x,y));
            }
        },this);
    },

    start () {
    },
    
});
