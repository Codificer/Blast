// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        blocksPrefab: {
            default:null,
            type: cc.Prefab,  
        },
        arrBox:{
            default:[],
        },
        enabledT:true,//доступность хода (блокировка нажатий на время выполнения удаления блоков)
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

    makeColorN(Node) {
        var selfy = Node;
        //console.log(selfy);
        //console.log("makecolor, colorBox=",selfy.colorBox);
        switch(selfy.colorBox){
            case 1:
                //console.log("blue");
                cc.resources.load("blocks/block_blue",cc.SpriteFrame,null,function(err,SpriteFrame){
                    selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                });
                break;
            case 2:            
                //console.log("red");
                cc.resources.load("blocks/block_red",cc.SpriteFrame,null,function(err,SpriteFrame){
                    selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                });
                break;
            case 3:
                //console.log("yellow");      
                cc.resources.load("blocks/block_yellow",cc.SpriteFrame,null,function(err,SpriteFrame){
                    selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                });
                break;
            case 4:  
                //console.log("green");    
                cc.resources.load("blocks/block_green",cc.SpriteFrame,null,function(err,SpriteFrame){
                    selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                });
                break;
            case 5:
                //console.log("purple");      
                cc.resources.load("blocks/block_purple",cc.SpriteFrame,null,function(err,SpriteFrame){
                    selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                });
                break;
        }
    },

    createNewBox(i,j){//создание нового куба
        var newBox = cc.instantiate(this.blocksPrefab);
        var conf=this.node.parent.getComponent("config");
        this.arrBox[i][j]=newBox;
        this.arrBox[i][j].opacity=0;
        this.node.addChild(this.arrBox[i][j]);
        this.arrBox[i][j].colorBox=Math.floor(Math.random()*(conf.colorsCount))+1;
        this.arrBox[i][j].getComponent("block").colorBox=this.arrBox[i][j].colorBox;
        this.arrBox[i][j].score_points=100*this.arrBox[i][j].colorBox;
        this.arrBox[i][j].coord_x = i;
        this.arrBox[i][j].coord_y = j;        
        //console.log("conf.width ",conf.boxWidth,"arrBox ",this.arrBox[i][j].width);
        this.arrBox[i][j].x=i*conf.boxWidth+conf.boxWidth/2+10;
        this.arrBox[i][j].y=this.node.height;//j*conf.boxHeight+conf.boxHeight/2+10;
        this.makeColorN(this.arrBox[i][j]);
        this.arrBox[i][j].height=conf.boxHeight;
        this.arrBox[i][j].width=conf.boxWidth;  
        this.arrBox[i][j].getComponent("block").moveToLocation(this.arrBox[i][j].x,j*conf.boxHeight+conf.boxHeight/2+10);
    },


    make_battle_arena_new(conf){//заполнение поля с нуля
        for(var i=0;i<conf.countWidth;i++){
            for(var j=0;j<conf.countHeight;j++){
                this.createNewBox(i,j);                
            }
        }        
    },

    find_box_to_blast(i,j,iF,jF){//поиск блоков для удаления
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        //this.enabledT=false;//заблокировали на время проверки - надо ставить перед вызовом функции
        var arrToDel = [this.arrBox[i][j]];
        console.log(selfy,conf,arrToDel,i,j);
        if((i==iF)&&(j==jF)){return 0;}//не изначальный ли это блок?

        if((i-1)>=0){if(selfy.arrBox[i-1][j].colorBox==selfy.arrBox[iF][jF].colorBox){ arrToDel.push(this.find_box_to_blast(i-1,j,iF,jF)); }}//если у элемента слева совпадает цвет - вызываем функцию для проверки повторно
    
        if((i+1)<conf.countWidth){if(selfy.arrBox[i+1][j].colorBox==selfy.arrBox[iF][jF].colorBox){ arrToDel.push(this.find_box_to_blast(i+1,j,iF,jF)); }}//если у элемента справа совпадает цвет - вызываем функцию для проверки повторно
    
        if((j-1)>=0){if(selfy.arrBox[i][j-1].colorBox==selfy.arrBox[iF][jF].colorBox){ arrToDel.push(this.find_box_to_blast(i,j-1,iF,jF)); }}//если у элемента слева совпадает цвет - вызываем функцию для проверки повторно
    
        if((j+1)<conf.countHeight){if(selfy.arrBox[i][j+1].colorBox==selfy.arrBox[iF][jF].colorBox){ arrToDel.push(this.find_box_to_blast(i,j+1,iF,jF)); }}//если у элемента слева совпадает цвет - вызываем функцию для проверки повторно

        console.log(arrToDel);
        return (arrToDel);
    },

    // LIFE-CYCLE CALLBACKS:    
    onLoad () {
        var selfy=this;
        this.arrBox=[];
        var conf=selfy.node.parent.getComponent("config");
        //создание массивов кубов
        for(var i=0;i<conf.countWidth;i++){
            if(!selfy.arrBox[i]){selfy.arrBox[i]=[];}
            for(var j=0;j<conf.countHeight;j++){
                selfy.arrBox[i][j]=null;
            }
        }
        this.make_battle_arena_new(conf);
    },

    start () {

    },

    // update (dt) {},
});
