import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { getOctaHed, getTorus, getTorusKnot, Shape } from './utils/shapes';
import { initRender, initCore, initTori, initStars, initSpaceStuff, initAmbientLight } from './utils/init';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(50, 10, 25); //5, 5, 5 //50, 10, 25 //30, 10, 25
let selector;

const backgroundTexture = new THREE.TextureLoader().load('assets/textures/space-background.jpg')
scene.background = backgroundTexture;

let renderer;

let core;

let stars;

let spaceStuff;

let tori;

await init();
//GENERAL//
//get texture, shine, reflextion, shine, and maybe alpha maps

//add some more randomly generated things in space around

//look into fixed camera path on scroll

//make sure to clean up and finalize codebase ESPECIALLY the nomenclature! very cringe

//find a way to make load time faster, at the very least have the page wait for the canvas to render before everything else renders
//maybe have a loading bar for the scene while its rendering

//fog or dust or something to show light rays 
//^^maybe just look into god rays or something^^

//STARS//
//fix outer star light pathing
//clone light to have same params as core

//CORE//
//tweak light intensity and decay

//SPACESTUFF//
//fix spacestuff spawning coords
//add lighting
//emissive map
//emissive color
//normal map

//KNOTS//
//try using the spacestuff num gen method to randomize knot rotations
//make init function
//material
//emissive map
//emissive color
//normal map
//copy core maps

//CLUSTERS
//maybe make different clusters different colors or materials
//mess with tori segment geometry
//make the tori init async

//LAST-MINUTE MAYBES//
//async animate
//if time and energy remain, fix shadows
//implement settings in browser to allow for tweaking if graphics are too much
//look into adding tori and stars to the core to try and a do a dramatic scenic draging affect of the core moving around as the page is scrolled
//add long galactic arms to the knots
//light trails on the stars



const torusKnots = [
  {
    shape: getTorusKnot(2500, 50, 300, 20, 11, 10, 0x3333ff),
    x: 0,
    y: 0,
    z: 0,
    xRot: 0.001,
    yRot: -0.001,
    zRot: 0.005
  },
  {
    shape: getTorusKnot(2500, 50, 300, 20, 11, 10, 0x3333ff),
    x: 1.57,
    y: 0,
    z: 0,
    xRot: -0.001,
    yRot: 0.001,
    zRot: -0.005
  }
]
torusKnots.forEach(shape => {
  shape.shape.castShadow = true;
  shape.shape.receiveShadow = true;

  rotateShape(shape.shape, shape.x, shape.y, shape.z)
  scene.add(shape.shape)
})

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

async function init() {
  const renderJob = initRender(document.querySelector('#bg'))
  .then(shape => {
    renderer = shape;
    console.log("renderer done")
  });

  let coreReady = false;
  const coreJob = initCore().then(shape => {    
    core = shape;
    scene.add(core.shape);
    console.log("core done")
    coreReady = true;
  });

  let toriReady = false;
  const toriJob = initTori().then(torus => {
    tori = torus;
    toriReady = true;

    tori.innerCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });
    tori.middleCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });
    tori.outerCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    }); 
    tori.exoCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });

    console.log("tori done")
  })

  /*const toriPopJob = new Promise(() => {
    while(!toriReady) {
      continue;
    }

    const innerJob = new Promise(() => {
      tori.innerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    const middleJob = new Promise(() => {
      tori.middleCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    const outerJob = new Promise(() => {
      tori.outerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      }); 
    });

    const exoJob = new Promise(() => {
      tori.exoCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    await innerJob;
    await middleJob;
    await outerJob;
    await exoJob;
  });*/

  
  const starJob = initStars().then(shape => {
    while(!coreReady) {
      continue;
    }

    stars = shape;
    stars.forEach(star => {
      core.shape.add(star.shape.shape);
      scene.add(star.lightShine)
    });

    console.log("stars done")
  });

  const stuffJob = initSpaceStuff(25000).then(stuff => {
    spaceStuff = stuff;

    spaceStuff.forEach(stuff => {
      scene.add(stuff.thing);
    });

    console.log("stuff done")
  })

  const ambientJob = initAmbientLight().then(ambient =>{
    scene.add(ambient);
    console.log("ambient done")
  })

  await renderJob;
  await coreJob;
  await toriJob;
  //await toriPopJob;
  await starJob;
  await stuffJob;
  await ambientJob;
}

function animate() {
  requestAnimationFrame(animate);

  //core
  if(false) {
    rotateShape(core.shape, 0.1, 0.01, 0.01);
  }

  //clusters
  if(false) {
    tori.innerCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.middleCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.outerCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.exoCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }

  //knots
  if(true) {
    torusKnots.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }

  //stars
  if(false) {
    stars.forEach(shape => {
      transformLight(shape.lightShine, shape.shape.shape)
  
      rotateShape(
        shape.shape.shape,
        shape.shape.animRot.x,
        shape.shape.animRot.y,
        shape.shape.animRot.z
      );
    });
  }

  //spacestuff
  if(false) {
    spaceStuff.forEach(stuff => {
      rotateShape(
        stuff.thing,
        stuff.x,
        stuff.y,
        stuff.z
      );
    })
  }
  
  controls.update();
  
  renderer.render(scene, camera);
}

function rotateShape(shape, x, y, z) {
  shape.rotation.x += x;
  shape.rotation.y += y;
  shape.rotation.z += z;
}

function transformLight(light, follow) {
  light.position.set(follow.position.x, follow.position.y, follow.position.z)
}

function getRnd(min, max, modifier) {
  let rand = (Math.floor(Math.random() * (max - min + 1) ) + min) * modifier;

  return rand;
}

animate();

/*document.querySelector('#asd').addEventListener('click', event => {
  event.preventDefault();

  if(!selector) {
    return;
  }

  console.log(tori.exoCluster[selector].shape)

  

  tori.exoCluster[selector].shape.setRotationFromEuler(new THREE.Euler(
    parseFloat(document.querySelector('#x').value),
    parseFloat(document.querySelector('#y').value),
    parseFloat(document.querySelector('#z').value)
  ))


  console.log(tori.exoCluster[selector].shape)
})

document.querySelector('#dsa').addEventListener('click', event => {
  event.preventDefault()

  if(!selector) {
    return;
  }

  console.log(tori.exoCluster[selector].shape)

})

document.querySelector('#change').addEventListener('click', event => {
  event.preventDefault()

  if(!document.querySelector('#select').value) {
    return
  }

  selector = parseInt(document.querySelector('#select').value)
})*/