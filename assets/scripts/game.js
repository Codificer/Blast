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
        isStart:false,
        enabledT:true,//доступность хода (блокировка нажатий на время выполнения удаления блоков)
        arrToDel:[],//массив для удаления боксов
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
            case 6://bomb
            //console.log("bomb");      
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
        //this.arrBox[i][j].getComponent("block").colorBox=this.arrBox[i][j].colorBox;
        this.arrBox[i][j].score_points=100*this.arrBox[i][j].colorBox;
        this.arrBox[i][j].coord_x = i;
        this.arrBox[i][j].coord_y = j;        
        //console.log("conf.width ",conf.boxWidth,"arrBox ",this.arrBox[i][j].width);
        this.arrBox[i][j].x=i*conf.boxWidth+conf.boxWidth/2+10;
        this.arrBox[i][j].y=this.node.height;//j*conf.boxHeight+conf.boxHeight/2+10;
        this.makeColorN(this.arrBox[i][j]);
        this.arrBox[i][j].height=conf.boxHeight;
        this.arrBox[i][j].width=conf.boxWidth;  
        },


    make_battle_arena_new(conf){//заполнение поля с нуля
        var conf=this.node.parent.getComponent("config");
        for(var i=0;i<conf.countWidth;i++){
            for(var j=0;j<conf.countHeight;j++){
                this.createNewBox(i,j);    
                this.arrBox[i][j].getComponent("block").moveToLocation(this.arrBox[i][j].x,j*conf.boxHeight+conf.boxHeight/2+10);//передвижение элемента            
            }
        }        
    },

    checkToDel(i,j){
        //console.log(i,j,this.arrToDel);
        for(var k=0;k<this.arrToDel.length;k++)
        {
            if((this.arrToDel[k].i==i)&&(this.arrToDel[k].j==j)){
                return 1;
            }
        }
        return 0;
    },

    find_box_to_blast(i,j,iF,jF,count){//поиск блоков для удаления
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");

        //this.enabledT=false;//заблокировали на время проверки - надо ставить перед вызовом функции
        count++;//порядковый номер итерации. Можно оставить. можно удалить (не забыть удалить в вызовах функций)    
        if(count>conf.boxHeight*conf.boxWidth){console.log("recurtion");return 0;}
        //console.log("итерация ",count, "координаты ",i,j,"координаты предыдущего", iF,jF);

        var currBox=this.arrBox[i][j];

        //if((i==iF)&&(j==jF)){return 0;}//не изначальный ли это блок?        
        if(this.checkToDel(i,j)){return 0;}
        selfy.arrToDel.push({i,j});

        if((i-1)>=0){//проверка границ
            if((selfy.arrBox[i-1][j].colorBox==currBox.colorBox)&&(((i-1)!=iF)||(j!=jF))){//если у элемента слева совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
                //console.log("итерация ",count, "координаты ",i,j, "идем в блок слева");
                this.find_box_to_blast(i-1,j,i,j,count); 
                //console.log("итерация ",count, "координаты ",i,j, "вернулись из блока слева");
                }
            }
    
        if((i+1)<conf.countWidth){
            if((selfy.arrBox[i+1][j].colorBox==currBox.colorBox)&&(((i+1)!=iF)||(j!=jF)))//если у элемента справа совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            { 
                //console.log("итерация ",count, "координаты ",i,j, "идем в блок справа");
                this.find_box_to_blast(i+1,j,i,j,count); 
                //console.log("итерация ",count, "координаты ",i,j, "вернулись из блока справа");
            }
        }
    
        if((j-1)>=0){
            if((selfy.arrBox[i][j-1].colorBox==currBox.colorBox)&&(((i)!=iF)||((j-1)!=jF)))
            { //если у элемента снизу совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
                //console.log("итерация ",count, "координаты ",i,j, "идем в блок снизу");
                this.find_box_to_blast(i,j-1,i,j,count); 
                //console.log("итерация ",count, "координаты ",i,j, "вернулись из блока снизу");
            }
        }
    
        if((j+1)<conf.countHeight){
            if((selfy.arrBox[i][j+1].colorBox==currBox.colorBox)&&(((i)!=iF)||((j+1)!=jF)))
            {//если у элемента сверху совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
                //console.log("итерация ",count, "координаты ",i,j, "идем в блок сверху"); 
                this.find_box_to_blast(i,j+1,i,j,count);
                //console.log("итерация ",count, "координаты ",i,j, "вернулись из блока сверху"); 
                }
            }

        //console.log("массив на удаление:", selfy.arrToDel);
        return (selfy.arrToDel);
    },

    first_find_box_to_blast(i,j){//поиск блоков для удаления
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        //this.enabledT=false;//заблокировали на время проверки - надо ставить перед вызовом функции
        //console.log("итерация ",0, "координаты ",i,j);

        selfy.arrToDel = [{i,j}];  

        if((i-1)>=0){//проверка границ
            if(selfy.arrBox[i-1][j].colorBox==selfy.arrBox[i][j].colorBox){
                //console.log("итерация ",0, "координаты ",i,j, "идем в блок слева");
                this.find_box_to_blast(i-1,j,i,j,0); 
                //console.log("итерация ",0, "координаты ",i,j, "вернулись из блока сверху"); 

            }
        }//если у элемента слева совпадает цвет - вызываем функцию для проверки повторно
    
        if((i+1)<conf.countWidth){//проверка границ
            if(selfy.arrBox[i+1][j].colorBox==selfy.arrBox[i][j].colorBox){
                //console.log("итерация ",0, "координаты ",i,j, "идем в блок справа");
                this.find_box_to_blast(i+1,j,i,j,0); 
                //console.log("итерация ",0, "координаты ",i,j, "вернулись из блока справа"); 
            }
        }//если у элемента справа совпадает цвет - вызываем функцию для проверки повторно
    
        if((j-1)>=0){
            if(selfy.arrBox[i][j-1].colorBox==selfy.arrBox[i][j].colorBox){ 
                //console.log("итерация ",0, "координаты ",i,j, "идем в блок снизу");
                this.find_box_to_blast(i,j-1,i,j,0); 
                //console.log("итерация ",0, "координаты ",i,j, "вернулись из блока снизу"); 
            }
        }//если у элемента снизу совпадает цвет - вызываем функцию для проверки повторно
    
        if((j+1)<conf.countHeight){//проверка границ
            if(selfy.arrBox[i][j+1].colorBox==selfy.arrBox[i][j].colorBox){ 
                //console.log("итерация ",0, "координаты ",i,j, "идем в блок сверху");
                this.find_box_to_blast(i,j+1,i,j,0); 
                //console.log("итерация ",0, "координаты ",i,j, "вернулись из блока сверху"); 
            }
        }//если у элемента сверху совпадает цвет - вызываем функцию для проверки повторно

        //console.log("массив на удаление:", selfy.arrToDel);
        if(selfy.arrToDel.length<=conf.minCountToBlast-1){
            selfy.arrToDel=[];
            //this.enabledT=true;
            return 0;}
        else{return (selfy.arrToDel);}
    },

    afterBlastMove(){//функция сдвига блоков после взрыва
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");

        //сдвигаем индексы у имеющихся
        var n=-1;
        for(var i=0;i<selfy.arrToDel.length;i++){//сперва изменим координаты у столбцов
            var k=selfy.arrToDel[i];
            if(n<k.i){
                n=k.i;
                //console.log("столбец ", n);
                for(var j=k.j;j<selfy.arrBox[k.i].length;j++){
                    selfy.arrBox[k.i][j].coord_y=j;
                }

            }
            //console.log("создаем новый куб в столбце", k.i, "строке", selfy.arrBox[k.i].length);
            selfy.createNewBox(k.i,selfy.arrBox[k.i].length);
        }

        //делем MoveTo
        var k=-1;
        //console.log(selfy.arrToDel);
        for(var i=0;i<selfy.arrToDel.length;i++){
            if(k<selfy.arrToDel[i].i){
                k=selfy.arrToDel[i].i;
                for(var j=selfy.arrToDel[i].j;j<conf.countHeight;j++){
                    selfy.arrBox[k][j].getComponent("block").moveToLocation(this.arrBox[k][j].x,j*conf.boxHeight+conf.boxHeight/2+10);
                }
            }
        }
    },

    makeBlast(x,y){//взрыв
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        selfy.enabledT = false;
        var wereDel=false;
        var scorePoints=selfy.arrBox[x][y].score_points;

        selfy.arrToDel.sort(function(a,b){//сортируем массив удаления по возрастанию
                if(a.i<b.i){return -1;}
                else{if(a.i==b.i){
                    if(a.j<b.j){
                        return -1;
                    }}                    
                    else{return 1;}}
        });
        
        //console.log("начнем удаление",selfy.arrToDel);

        for(var i=selfy.arrToDel.length-1;i>=0;i--)//удаляем ноды из масива
        {
            var m=selfy.arrToDel[i].i;
            var n=selfy.arrToDel[i].j;
            var a=selfy.arrBox[m][n];
            selfy.arrBox[m].splice(n,1);
            a.destroy();
            wereDel=true;
        }

        if(wereDel){//если удаляли            
            selfy.afterBlastMove();//добавляем новые кубики и двигаем их
            scorePoints*=Math.floor(Math.pow(1.5,selfy.arrToDel.length-1));//расчет очков
            conf.ScoreCount+=scorePoints;//прибавить счет
                var a=conf;
            if(conf.ScoreCount>=conf.scoreToWin){
                selfy.makeWin();
                return 0;
            }
            conf.countTurns--;//убавить ходы
            if(conf.countTurns==0){
                selfy.makeLose();
                return 0;
            }
        }

        setTimeout(function(){ selfy.enabledT = true; }, 1000);//задержка, чтобы нельзя было удалить бокс до сдвига клеток
        //this.enabledT=true;
    },

    makeWin(){//выигрыш
        cc.find("Canvas/shadow").x=0;
        cc.find("Canvas/gameWin").y=0;
        this.enabledT = false;
    },
    makeLose(){//проигрыш
        cc.find("Canvas/shadow").x=0;
        cc.find("Canvas/gameOver").y=0;
        this.enabledT = false;
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
