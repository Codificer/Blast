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
        let t=cc.tween;
        t(selfy.node)
            .parallel(
                t().to((y+10)/500,{opacity:255}),
                t().to(1,{position:cc.v2(x,y)})
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
            
            if((selfy.node.parent.getComponent("game").enabledT)&&(! selfy.node.parent.getComponent("game").isStart))//можно ли среагировать
            {
                //console.log("x",selfy.node.x,"y",selfy.node.y);
                var x=(selfy.node.x-10-conf.boxWidth/2)/conf.boxWidth;
                var y=(selfy.node.y-10-conf.boxHeight/2)/conf.boxHeight;
                //удаляем блоки тут
                //console.log("mouse down",x,y);
                Game.first_find_box_to_blast(x,y);
                Game.makeBlast(x,y);
            }
        },this);
    },

    start () {
    },
    
});
