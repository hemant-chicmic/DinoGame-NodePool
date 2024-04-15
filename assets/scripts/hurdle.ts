import { _decorator, Component, Node, randomRangeInt, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hurdle')
export class hurdle extends Component {

    node: any;
    

    sethurdle(hurdleImage : SpriteFrame){
        this.node.getComponent(Sprite).spriteFrame = hurdleImage;
    }
}

