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
        gameOn:true,//показывает, что игра еще идет
        arrToDel:[],//массив для удаления боксов
        arrToCheck:[],//массив для проверки ходов
        bombClick:{
            default:{},
            i:-1,
            j:-1,
        },
        willBomb:false,
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
            case 6:
            //console.log("bomb");      
            cc.resources.load("blocks/bomb",cc.SpriteFrame,null,function(err,SpriteFrame){
                selfy.getComponent(cc.Sprite).spriteFrame=SpriteFrame;
                var anim=selfy.getComponent(cc.Animation);
                anim.play('bomb');
            });
            break;

        }
    },

    createNewBox(i,j,colorBox){//создание нового куба
        var newBox = cc.instantiate(this.blocksPrefab);
        var conf=this.node.parent.getComponent("config");
        if(colorBox==6){
            this.arrBox[i].splice(j,0,newBox);
        }else{
            this.arrBox[i][j]=newBox;
        }        
        this.node.addChild(this.arrBox[i][j]);
        this.arrBox[i][j].colorBox=colorBox;
        this.arrBox[i][j].coord_x = i;
        this.arrBox[i][j].coord_y = j;        
        this.arrBox[i][j].zIndex=conf.countHeight-j;
        this.arrBox[i][j].x=i*conf.boxWidth+conf.boxWidth/2+10;
        if(colorBox==6){
            this.arrBox[i][j].y=this.bombClick.j*conf.boxHeight+conf.boxHeight/2+10;
        }else{
            this.arrBox[i][j].y=this.node.height;
        };
        this.makeColorN(this.arrBox[i][j]);
        this.arrBox[i][j].height=conf.boxHeight;
        this.arrBox[i][j].width=conf.boxWidth;  
        },


    make_battle_arena_new(){//заполнение поля с нуля
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");

        selfy.arrBox=[];
        for(var i=0;i<conf.countWidth;i++){
            if(!selfy.arrBox[i]){selfy.arrBox[i]=[];}
            for(var j=0;j<conf.countHeight;j++){
                selfy.arrBox[i][j]=null;
            }
        }
        var conf=selfy.node.parent.getComponent("config");
        for(var i=0;i<conf.countWidth;i++){
            for(var j=0;j<conf.countHeight;j++){
                var color=Math.floor(Math.random()*(conf.colorsCount))+1
                selfy.createNewBox(i,j,color);    
                selfy.arrBox[i][j].getComponent("block").moveToLocation(selfy.arrBox[i][j].x,j*conf.boxHeight+conf.boxHeight/2+10);//передвижение элемента            
            }
        }    
        if(!selfy.checkHaveTurns()){
            selfy.mix_battle_area(1);
        }    
    },

    mix_battle_area(count){//перемешивание арену
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");

        selfy.makeEndOFGame(0);

        if(count>conf.maxMixTurn){
            selfy.makeLose();
            return 0;
        }

        var oldArr=selfy.arrBox;
        var newArr=[];

        for(var i=0;i<conf.countWidth;i++)
        {
            newArr[i]=[];
        }

        var x,y;
        for(var i=0;i<conf.countWidth;i++)
        {
            for( var j=0;j<conf.countHeight;j++)
            {
                x=Math.floor(Math.random()*(oldArr.length));
                y=Math.floor(Math.random()*(oldArr[x].length));
                newArr[i].push(oldArr[x][y]);
                oldArr[x].splice(y,1);
                if(oldArr[x].length==0){
                    oldArr.splice(x,1);
                }
            }
        }
        for(var i=0;i<conf.countWidth;i++)
        {
            this.arrBox.push([]);
            for( var j=0;j<conf.countHeight;j++)
            {
                this.arrBox[i].push(newArr[i][j]);
                this.arrBox[i][j].coord_x=i;
                this.arrBox[i][j].coord_y=j;
                this.arrBox[i][j].getComponent("block").moveToLocation(i*conf.boxWidth+conf.boxWidth/2+10,j*conf.boxHeight+conf.boxHeight/2+10);//передвижение элемента   

            }
        }
        
        if(!selfy.checkHaveTurns()){
            selfy.mix_battle_area(count+1);
        }
    },

    checkSimpleTurns(i,j,iF,jF,count){
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        count++;
        if(count>=conf.minCountToBlast){
            return count;
        }

        if(selfy.arrBox[i][j].colorBox==6){
            count=conf.minCountToBlast;
            return count;
        }

        if((i-1)>=0){//проверка границ
            if((selfy.arrBox[i-1][j].colorBox==selfy.arrBox[i][j].colorBox)&&(((i-1)!=iF)||(j!=jF)))//если у элемента слева совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            {
                count=selfy.checkSimpleTurns(i-1,j,i,j,count); 
            }
        }
    
        if((i+1)<conf.countWidth){
            if((selfy.arrBox[i+1][j].colorBox==selfy.arrBox[i][j].colorBox)&&(((i+1)!=iF)||(j!=jF)))//если у элемента справа совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            { 
                count=selfy.checkSimpleTurns(i+1,j,i,j,count); 
            }
        }
    
        if((j-1)>=0){
            if((selfy.arrBox[i][j-1].colorBox==selfy.arrBox[i][j].colorBox)&&(((i)!=iF)||((j-1)!=jF)))//если у элемента снизу совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            { 
                count=selfy.checkSimpleTurns(i,j-1,i,j,count); 
            }
        }
    
        if((j+1)<conf.countHeight){
            if((selfy.arrBox[i][j+1].colorBox==selfy.arrBox[i][j].colorBox)&&(((i)!=iF)||((j+1)!=jF)))//если у элемента сверху совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            {
                count=selfy.checkSimpleTurns(i,j+1,i,j,count);
            }
        }
        return count;
    },

    checkHaveTurns(){//проверяем наличие ходов
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        var arr=selfy.arrBox;

        for(var i=0;i<arr.length;i++){
            for(var j=0;j<arr[i].length;j++){
                if(selfy.checkSimpleTurns(i,j,i,j,0)>=conf.minCountToBlast){
                    return 1;
                }
            }
        }


        return 0;

    },

    checkToDel(i,j){//проверка, уже в архиве на удаление или нет
        for(var k=0;k<this.arrToDel.length;k++)
        {
            if((this.arrToDel[k].i==i)&&(this.arrToDel[k].j==j)){
                return 1;
            }
        }
        return 0;
    },

    simple_blast(i,j,iF,jF,count){//поиск блоков для удаления
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");

        if(count>conf.boxHeight*conf.boxWidth){console.log("recurtion");return 0;}

        var currBox=selfy.arrBox[i][j];

        if(selfy.checkToDel(i,j)){return 0;}
        count++;
        selfy.arrToDel.push({i,j});

        if((i-1)>=0){//проверка границ
            if((selfy.arrBox[i-1][j].colorBox==currBox.colorBox)&&(((i-1)!=iF)||(j!=jF)))//если у элемента слева совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            {
                this.simple_blast(i-1,j,i,j,count); 
            }
        }
    
        if((i+1)<conf.countWidth){
            if((selfy.arrBox[i+1][j].colorBox==currBox.colorBox)&&(((i+1)!=iF)||(j!=jF)))//если у элемента справа совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            { 
                this.simple_blast(i+1,j,i,j,count); 
            }
        }
    
        if((j-1)>=0){
            if((selfy.arrBox[i][j-1].colorBox==currBox.colorBox)&&(((i)!=iF)||((j-1)!=jF)))//если у элемента снизу совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            { 
                this.simple_blast(i,j-1,i,j,count); 
            }
        }
    
        if((j+1)<conf.countHeight){
            if((selfy.arrBox[i][j+1].colorBox==currBox.colorBox)&&(((i)!=iF)||((j+1)!=jF)))//если у элемента сверху совпадает цвет И новые координаты не равны предыдущему- вызываем функцию для проверки повторно
            {
                this.simple_blast(i,j+1,i,j,count);
            }
        }
        
    },

    bomb_blast(i,j){
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        var arr=selfy.arrBox;
        var toDel=selfy.arrToDel;
        toDel.push({i:i,j:j});
        for (var x=i-conf.bombRadius;x<=i+conf.bombRadius;x++)
        {
            for(var y=j-conf.bombRadius;y<=j+conf.bombRadius;y++)
            {
                if((x<conf.countWidth)&&(x>-1)&&(y>-1)&&(y<conf.countHeight)){
                    if(!this.checkToDel(x,y)){
                        toDel.push({i:x,j:y});
                        if(arr[x][y].colorBox==6){
                            selfy.bomb_blast(x,y);
                        }
                    }  
                }
            }
        }

    },

    find_box_to_blast(i,j){//поиск блоков для удаления
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        
        selfy.arrToDel = []; 

        switch(selfy.arrBox[i][j].colorBox){
            case 6:
                //взрыв бомбы
                selfy.bomb_blast(i,j);
                break;
            default://обычное удаление
                selfy.simple_blast(i,j,i,j,0);
                break;
        }
        if((selfy.arrToDel.length<conf.minCountToBlast)&&(selfy.arrBox[i][j].colorBox!=6))
        {
            selfy.arrToDel=[];
            return 0;
        }
        else{return 1;}
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
                for(var j=k.j;j<selfy.arrBox[k.i].length;j++){
                    selfy.arrBox[k.i][j].coord_y=j;
                    selfy.arrBox[k.i][j].zIndex=conf.countHeight-j;
                }

            }
            var color;
            if(selfy.willBomb&&(selfy.bombClick.i==k.i))
            {
                color=6;
                selfy.createNewBox(k.i,k.j,color);
                selfy.willBomb=false;
            }else{
                color=Math.floor(Math.random()*(conf.colorsCount))+1;
                selfy.createNewBox(k.i,selfy.arrBox[k.i].length,color);
            }
        }

        //делем MoveTo
        var k=-1;
        for(var i=0;i<selfy.arrToDel.length;i++){
            if(k<selfy.arrToDel[i].i){
                k=selfy.arrToDel[i].i;
                for(var j=selfy.arrToDel[i].j;j<conf.countHeight;j++){
                    selfy.arrBox[k][j].getComponent("block").moveToLocation(this.arrBox[k][j].x,j*conf.boxHeight+conf.boxHeight/2+10);
                }
            }
        }
    },

    getScore(a){        //очки в зависимости от цвета
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");        
        return 100*a;
        
    },


    makeBlast(x,y){//взрыв
        var selfy=this;
        var conf=selfy.node.parent.getComponent("config");
        selfy.enabledT = false;
        var wereDel=false;
        var scorePoints=selfy.getScore(selfy.arrBox[x][y].colorBox);
        var scorePointsBomb=0;
        var bombColor= (selfy.arrBox[x][y].colorBox==6);
        
        selfy.find_box_to_blast(x,y);

        selfy.arrToDel.sort(function(a,b){//сортируем массив удаления по возрастанию
                if(a.i<b.i){return -1;}
                else{if(a.i==b.i){
                    if(a.j<b.j){
                        return -1;
                    }}                    
                    else{return 1;}}
        });
        if((selfy.arrBox[x][y].colorBox!=6)&&(selfy.arrToDel.length>=conf.bombCount))
        {//добавим бомбу
            selfy.willBomb=true;
            selfy.bombClick={i:x,j:y};
        }
        else
        {
            selfy.willBomb=false;
        }

        for(var i=selfy.arrToDel.length-1;i>=0;i--)//удаляем ноды из масива
        {
            var m=selfy.arrToDel[i].i;
            var n=selfy.arrToDel[i].j;
            var a=selfy.arrBox[m][n];
            selfy.arrBox[m].splice(n,1);
            scorePointsBomb+=selfy.getScore(a.colorBox);
            selfy.destroyFire(a);
            wereDel=true;
        }

        if(wereDel){//если удаляли
                     
            selfy.afterBlastMove();//добавляем новые кубики и двигаем их
            
            scorePoints*=Math.floor(Math.pow(1.5,selfy.arrToDel.length-1));//расчет очков
            if(bombColor)
            {                
                conf.ScoreCount+=scorePointsBomb;//прибавить счет                
            }
            else{
                conf.ScoreCount+=scorePoints;//прибавить счет
            }
            var a=conf;

            if(conf.ScoreCount>=conf.scoreToWin){
                selfy.makeEndOFGame(1);
                return 0;
            }
            conf.countTurns--;//убавить ходы
            if(conf.countTurns==0){
                selfy.makeEndOFGame(-1);
                return 0;
            }
        }
        if(!selfy.checkHaveTurns()){
            selfy.mix_battle_area(1);
        }
        setTimeout(function(){ selfy.enabledT = selfy.gameOn; }, 700);//задержка, чтобы нельзя было удалить бокс до сдвига клеток
    },

    makeEndOFGame(type){//выигрыш

        var selfy=this;
        cc.find("Canvas/shadow").x=0;
        cc.find("Canvas/gameEnd").y=0;
        cc.find("Canvas/start_new").y=-150;
        switch(type){
            case -1://makeLose
                cc.find("Canvas/gameEnd").getComponent(cc.RichText).string="<outline color=black width=4>GAME\nOVER</outline>";
                selfy.gameOn=false;
                selfy.enabledT = selfy.gameOn;
                break;
            case 1://makeWin
                cc.find("Canvas/gameEnd").getComponent(cc.RichText).string="<outline color=black width=4>you\nWIN!!!</outline>";
                selfy.gameOn=false;
                selfy.enabledT = selfy.gameOn;
                break;
            case 0://makeMix
                cc.find("Canvas/gameEnd").getComponent(cc.RichText).string="<outline color=black width=4>NO TURNS</outline>";
                cc.find("Canvas/start_new").y=500;
                selfy.enabledT = selfy.gameOn;
                setTimeout(function(){ selfy.enabledT = selfy.gameOn; 
                    cc.find("Canvas/shadow").x=1000;
                    cc.find("Canvas/gameEnd").y=500;}
                , 1000);
                break;

        };
    },

    destroyFire(a){//анимация огня на уничтожение клетки с последующим удалением Node
        var conf=this.node.parent.getComponent("config");
        var anim=a.getComponent(cc.Animation);
        a.zIndex=10;
        if(a.colorBox==6){
            cc.tween(a)
            .to(0.3,{scaleX:1+conf.bombRadius*2,scaleY:1+conf.bombRadius*2})
            .start();
            anim.play('blast');
        }
        else{
            anim.play('fire');
        }
    },
    // LIFE-CYCLE CALLBACKS:    
    onLoad () {
        //создание массивов кубов
        this.make_battle_arena_new();
    },

    start () {

    },
    // update (dt) {},
});
