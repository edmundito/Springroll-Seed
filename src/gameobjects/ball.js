import Phaser from 'phaser';
import { GAMEPLAY } from '../constants';


export class Ball extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ball');
        this.velY = 0; 

        this.hitSound = scene.sound.add('bounce');

        // listen for state changes on SFX volume
        this.sfxChangeBound = this.onSFXVolumeChange.bind(this);

        const sfxState =  this.scene.app.state.sfxVolume;

        sfxState.subscribe(this.sfxChangeBound);
        this.hitSound.volume = sfxState.value;
    }

    preUpdate(time, delta)
    {
        this.velY += GAMEPLAY.GRAVITY;
        this.y += this.velY;

        const bounds = this.getBounds();
        if(bounds.bottom >= GAMEPLAY.HEIGHT)
        {
            this.y = (GAMEPLAY.HEIGHT - bounds.height / 2) - 1;
            this.velY *= -1;

            this.hitSound.play();
        }

        super.update(time, delta);
    }

    destroy()
    {
        this.scene.app.state.sfxVolume.unsubscribe(this.sfxChangeBound);
        super.destroy();
    }

    onSFXVolumeChange(current)
    {
        this.hitSound.volume = current;
    }
}