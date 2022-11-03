import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

//Define GameObjects
var player;
var platforms;

//Define Systems
var cursors;

//Velocity
var xVelocity = 0;
var speedCap = 400;
var speedMultiplier = 5;
var deceleration = 0.1;

//Initialize Tilemap
var tilemap = new Array(10);
for (var i = 0; i < tilemap.length; i++) {
  tilemap[i] = new Array(10);
}

//Level Editor
tilemap[0] = [0,0,0,0,0,0,0,0,0,0];
tilemap[1] = [0,0,0,0,0,0,0,0,0,0];
tilemap[2] = [0,0,0,0,0,0,0,0,1,0];
tilemap[3] = [0,0,0,0,0,0,0,0,0,0];
tilemap[4] = [0,0,0,0,0,1,0,0,0,0];
tilemap[5] = [0,0,0,0,0,0,0,0,0,0];
tilemap[6] = [0,0,1,0,0,0,0,0,0,0];
tilemap[7] = [0,0,0,0,0,0,0,0,0,0];
tilemap[8] = [0,0,0,0,1,0,0,0,0,0];
tilemap[9] = [1,1,1,1,1,1,1,1,1,1];

class GameWindow extends Component {
  state = {
    initialize: true,
    game: {
      width: 600,
      height: 600,
      type: Phaser.AUTO,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1100 },
            debug: false
        }
    },
      scene: {
        preload: function() {
          this.load.image('player', 'assets/Player.png');
          this.load.image('tile', 'assets/Tile.png');
        },
        init: function() {
          this.cameras.main.setBackgroundColor('#000000');
          
        },
        create: function() {
          
          //Player
          player = this.physics.add.sprite(100, 450, 'player');
          player.setCollideWorldBounds(true);

          //Render Tilemap
          platforms = this.physics.add.staticGroup();

          for (let yIndex = 0; yIndex < tilemap.length; yIndex++) {
            for (let xIndex = 0; xIndex < tilemap[yIndex].length; xIndex++) {
              
              if(tilemap[yIndex][xIndex] === 1)
              platforms.create(30+(60*xIndex), 30+(60*yIndex), 'tile');
    
              }
          }

          //Physics
          this.physics.add.collider(player, platforms);

          //Input
          cursors = this.input.keyboard.createCursorKeys();
        },
        update: function() {
          //Player
          if (cursors.left.isDown)
          {
            if(xVelocity > 0)
				    xVelocity *= 0.9;
			      xVelocity -= speedMultiplier;

			      if (xVelocity < -speedCap)
				    xVelocity = -speedCap;
          }
          else if (cursors.right.isDown)
          {
            if (xVelocity < 0)
				    xVelocity *= 0.9;

			      xVelocity += speedMultiplier;

			      if(xVelocity > speedCap)
				    xVelocity = speedCap;
          }
          else
          {
            xVelocity = xVelocity - xVelocity * deceleration;
          }

          if (cursors.up.isDown && player.body.touching.down)
          {
            player.setVelocityY(-600);
          }
          
          player.setVelocityX(xVelocity);
        }
      }
    }
  }

  render() {
    const { initialize, game } = this.state
    return (
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

export default GameWindow;