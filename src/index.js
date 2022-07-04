import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as INIT from './utils/init';

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x000e4d, 0.00045);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 12500);

camera.position.set(5, 5, 5);

let objTextures;

let renderer;

let core;

let tori;

let octahedra;

let sphere

let torusKnots;

let stars;

let spaceStuff;

let composer;

let controls;

init().then(() => {
  controls = new OrbitControls(camera, renderer.domElement);

  animate();
});

async function init() {
  console.log('renderer started')
  const renderJob = INIT.initRender(document.querySelector('#bg')).then(shape => {
    renderer = shape;
    console.log("renderer done")
  });

  console.log('textures started')
  await INIT.initTextures().then(textures => {
    objTextures = textures;
    console.log('textures done')
  })

  console.log('core started')
  INIT.initCore( objTextures.crystalTex, objTextures.crystalNormMap ).then(async shape => {    
    core = shape;
    scene.add(core.shape);

    setInterval(() => {
      core.rotation = {
        x: THREE.MathUtils.randFloatSpread(0.1),
        y: THREE.MathUtils.randFloatSpread(0.1),
        z: THREE.MathUtils.randFloatSpread(0.1)
      };
    }, 10000)

    console.log("core done")

    await renderJob;

    INIT.initComposer(
      renderer, 
      [      
        await INIT.initRenderPass(scene, camera),
  
        await INIT.initEffectPass(camera, ...[
  
          await INIT.initGodRays(camera, core.shape, {
            resolutionScale: 1,
            density: 10,
            decay: 0.98,
            weight: 0.1125,
            samples: 196,
            exposure: 1,
          }),
  
          await INIT.initSmaaEffect(),
        ]),
      ]
    ).then(cmpsr => {
      composer = cmpsr;
    })

    console.log('stars started')
    INIT.initStars( objTextures.crystalTex, objTextures.crystalNormMap ).then(shape => {
      stars = shape;
      stars.forEach(star => {
        core.shape.add(star.shape);
        //scene.add(star.lightShine)
      });
      console.log("stars done")
    });
  });

  console.log('tori started')
  INIT.initTori( objTextures.metalTex, objTextures.metalNormMap ).then(torus => {
    tori = torus;
    console.log("tori done")
    populateTori()
    .then(() => {
      console.log('tori population done')
    });
  })

  console.log('octahedra started')
  INIT.initOctahedra(10).then(shapes => {
    octahedra = shapes;

    octahedra.forEach(shape => {
      scene.add(shape.obj.item);
    });

    console.log('octahedra done')
  });

  console.log('sphere started')
  INIT.initSphere().then(shape => {
    sphere = shape;
    scene.add(sphere);
    console.log('sphere done')
  });

  console.log('knots started')
  INIT.initKnots().then(knots => {
    torusKnots = knots;

    torusKnots.forEach(knot => {
      rotateShape(knot.shape, knot.x, knot.y, knot.z);

      scene.add(knot.shape);
    });

    console.log('knots done')
  });

  console.log('stuff started'); 
  INIT.initSpaceStuff( 100, objTextures.crystalTex, objTextures.crystalNormMap ).then(stuff => {
    spaceStuff = stuff;

    spaceStuff.forEach(stuff => {
      scene.add(stuff.thingObj);
    });

    console.log("stuff done")
  });

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(window.devicePixelRatio);
  
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize( window.innerWidth, window.innerHeight )
  })
  

  async function populateTori() { 
    console.log('tori population started')

    new Promise(() => {  
      tori.innerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });
  
    new Promise(() => {  
      tori.middleCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });
  
    new Promise(() => {  
      tori.outerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      }); 
    });
  
    new Promise(() => {
      tori.exoCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });
  }
}

function animate() {
  requestAnimationFrame(animate);

  //core
  if(true) {
    rotateShape(core.shape, core.rotation.x, core.rotation.y, core.rotation.z);
  }
  //clusters
  if(true) {
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
  //octahedra
  if(true) {
    octahedra.forEach(octahedron => {
      rotateShape(
        octahedron.shape.item,
        octahedron.shape.x,
        octahedron.shape.y,
        octahedron.shape.z
      );
      rotateShape(
        octahedron.obj.item,
        octahedron.obj.x,
        octahedron.obj.y,
        octahedron.obj.z
      );
    });
  }
  //knots
  if(true) {
    torusKnots.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }
  //stars
  if(true) {
    stars.forEach(shape => {  
      rotateShape(
        shape.shape,
        shape.animRot.x,
        shape.animRot.y,
        shape.animRot.z
      );
    });
  }
  //spacestuff
  if(true) {
    spaceStuff.forEach(stuff => {
      rotateShape(
        stuff.thing,
        stuff.x,
        stuff.y,
        stuff.z
      );

      rotateShape(
        stuff.thingObj,
        stuff.xOrb,
        stuff.yOrb,
        stuff.zOrb
      )
    })
  }
  
  controls.update();
  
  composer.render();
}

function rotateShape(shape, x, y, z) {
  shape.rotation.x += x;
  shape.rotation.y += y;
  shape.rotation.z += z;
}

$(window).on('scroll', event => {
  const scroll = window.scrollY;

  console.log(scroll);

  let position;
  let rotation;

  if(scroll >= 5437) {
    rotation = new THREE.Euler(
      -0.7853981633974483,
      0.6154797086703869,
      0.5235987755982986,
      'xyz'
    );

    position = new THREE.Vector3(
      6917.3803934305015,
      6917.380393430506,
      6917.380393430507
    );

    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    return;
  } else if(scroll >= 4829) {
    rotation = new THREE.Euler(
      -1.031900014799546,
      1.4617990205489242,
      1.0292747245748644,
      'xyz'
    );

    position = new THREE.Vector3(
      2191.7768586469165,
      205.8559954417409,
      123.08754819076995
    );

    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    return;
  } else if(scroll >= 2796) {
    rotation = new THREE.Euler(        
      -0.2194942422491031,
      1.3474417727133254,
      0.21420924657246523,
      'xyz'
    );

    position = new THREE.Vector3(
      354.40128244301525,
      -154.38657656648041,
      462.4732573328189
    );

    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    return;
  } else if (scroll >= 1463) {
    rotation = new THREE.Euler(
      -0.3684865315583907,
      0.5604241052789496,
      0.202430777790732,
      'xyz'
    );

    position = new THREE.Vector3(
      75.73805476348565,
      32.347722016340484,
      43.166902526485494
    );
    
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);

    return;
  } else if (scroll < 1463) {
    camera.position.set(5, 5, 5);
    camera.rotation.set(0, 0, 0);

    return;
  }
});