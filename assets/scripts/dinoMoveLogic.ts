import {  _decorator, Component, Node, director, Vec3, view, ProgressBar, tween, Prefab, instantiate, 
    Tween, Rect, UITransform, Intersection2D, NodePool , Vec2} from 'cc';

import { hurdle } from './hurdle';
const { ccclass, property } = _decorator;

@ccclass('dinoMoveLogic')
export class dinoMoveLogic extends Component {


    @property({ type: Node })
    dinoImg: Node | null = null;

    @property({ type: Prefab })
    nodePrefab: Prefab | null = null;

    private isFirsttime: boolean = false;
    private isAnimating: boolean = false;
    private startGame: boolean = false;
    private gameOver: boolean = false;
    private hurdlesMoveSpeed: number = 15;
    private lastHurdle : number = 0 ; 








    private nodePool1: NodePool | null = null;
   

    onLoad() 
    {
        this.node.on(Node.EventType.MOUSE_DOWN, this.jumpDino, this);

        let dinoX = this.dinoImg.position.x ; 
        
        this.dinoImg.setPosition( new Vec3( dinoX , 0 , 0 ) )
        let surfaceY = this.dinoImg.parent.position.y  ;
        // Pre-instantiate nodes and add them to the pool
        this.nodePool1 = new NodePool();
        for (let i = 0; i < 7; ++i) 
        {
            let newNode = instantiate(this.nodePrefab);
            this.nodePool1.put(newNode); 
            newNode.getComponent(hurdle).sethurdle();
            
            let widthX = (this.node.getComponent(UITransform).width + newNode.getComponent(UITransform).width)/2 ; 
            let randomRange = Math.random() * 300; 
            // console.log( widthX , " random " , randomRange ) ;   
            if( this.lastHurdle == 0 )
            {
                newNode.setPosition(new Vec3( widthX * (i+1) + randomRange  , surfaceY , 0)) ; 
                // console.log( widthX , " random " , randomRange , " new node  " , newNode.position.x ) ;   
            }   
            else
            {
                newNode.setPosition(new Vec3( this.lastHurdle + widthX + randomRange  , surfaceY , 0));
                // console.log( widthX , " elserandom " , randomRange , " new node  " , this.lastHurdle + widthX + randomRange   ) ;   
            }      
            // newNode.setPosition(new Vec3( 400 * (i+1), surfaceY , 0));
            this.lastHurdle = newNode.position.x ; 
            // console.log( this.lastHurdle , "new pos ===> "  , newNode.position.x )
        }
    }

    start() {
        
    }





    update(deltaTime: number) {
        this.moveSurface();
        if (this.startGame) {
            this.moveHurdle();
        }
    }

    

    restartGame()
    {
        console.log( "restart game " ) ; 
        director.loadScene("mainScene");
        Tween.stopAll();  
        
    }

    moveHurdle(){
        this.node.children.forEach((hurdleNode , i)=>{
            if(hurdleNode.name == 'cactus'){
                console.log("Moving cactus");
                hurdleNode.setPosition(new Vec3(hurdleNode.getPosition().x-=this.hurdlesMoveSpeed, hurdleNode.position.y,1))

                let canvasX : number  = -this.node.position.x;
                console.log( "canvaX " ,  canvasX ) ;
                let hurdleNodeY = hurdleNode.position.y ; 
                console.log(  "  hurdlenode after  " , hurdleNode.getPosition() ) ;  
                if( hurdleNode.position.x + hurdleNode.getComponent(UITransform).width / 2 <= canvasX  )
                {   
                    console.log( " outside scrreen " )  ;
                    let widthX = (this.node.getComponent(UITransform).width + hurdleNode.getComponent(UITransform).width)/2 ; 
                    let randomRange = Math.random() * 200; 
                    let newPos = new Vec3( this.lastHurdle , hurdleNodeY , 0) ; 
                    // this.lastHurdle  = this.lastHurdle +  widthX  + randomRange ; 
                    hurdleNode.setPosition(newPos);
                } 
                // // // // Collision detection using collider components
                if (this.dinoImg && hurdleNode) 
                {
                    const dinoCollider = this.dinoImg.getChildByName('collider').getComponent(UITransform).getBoundingBoxToWorld();
                    const hurdleCollider = hurdleNode.getComponent(UITransform).getBoundingBoxToWorld();
                    if (Intersection2D.rectRect(dinoCollider , hurdleCollider) ) {
                        console.log(" collision detected!");
                        this.startGame = false;
                        this.gameOver = true;
                        Tween.stopAll();
                        return;
                    }
                }

            }
        })


    }

    moveSurface() {
        console.log(  "move surface 1 "  );
        if( ! this.nodePool1.size() ) return  ; 
        
        // console.log(  "move surface " ,  this.nodePool1.size() );
        
        const hurdleNode = this.nodePool1.get();
        // console.log(  "  hurdlenode before  " , hurdleNode.getPosition() ) ;  
        
        this.node.addChild(hurdleNode);
        
    }




    jumpDino() {
        console.log("button clicked ")
        if (this.isAnimating || this.gameOver || !this.dinoImg) {
            return;
        }
    
        console.log("jump jump");
        this.isAnimating = true;
        let x = this.dinoImg.position.x;
        let y = this.dinoImg.position.y;
        let newPos = new Vec3(x, y + 550, 0);
        tween(this.dinoImg.position)
            .to(0.5, newPos, {
                easing: 'cubicInOut', // Specify easing function
                onUpdate: (target: Vec3, ratio: number) => {
                    if (this.dinoImg) {
                        this.dinoImg.position = target;
                    }
                }
            })
            .to(0.4, new Vec3(x, y, 0), { // Tween back to original position
                easing: 'cubicInOut', // Specify easing function
                onUpdate: (target: Vec3, ratio: number) => {
                    if (this.dinoImg) {
                        this.dinoImg.position = target;
                    }
                },
                onComplete: () => { // Execute onComplete callback when tween completes
                    this.isAnimating = false;
                    if (!this.isFirsttime) {
                        this.startGame = true;
                    }
                }
            })
            .start();
    }
    
    
}
































































