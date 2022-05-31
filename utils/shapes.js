import { OctahedronGeometry, TorusGeometry, TorusKnotGeometry } from 'three';
import { MeshPhongMaterial, MeshToonMaterial, MeshPhysicalMaterial, Mesh } from 'three';

class Shape {
    constructor(shape, initialRot, animRot, pos) {
        this.shape = shape;
        
        if(!initialRot) {
            this.initialRot = {
                x: 0,
                y: 0,
                z: 0
            };
        }
        this.initialRot = initialRot;

        if(!animRot) {
            this.animRot = {
                x: 0,
                y: 0,
                z: 0
            };
        }
        this.animRot = animRot;

        if(!pos) {
            this.pos = {
                x: 0,
                y: 0,
                z: 0
            }
        }
        this.pos = pos;
    }
}

function getOctaHed(material, radius, detail) {
    if(!detail) {
        detail = 0;
    }

    if(!material) {
        material = {};
    }

    return new Mesh(
        new OctahedronGeometry(radius, detail),
        new MeshPhongMaterial(material)
    );
}

function getTorus(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    material,
    arc
) {
    if(!material) {
        material = {};
    }

  return new Mesh (
    new TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        arc
    ),
    new MeshPhysicalMaterial(material)
  );     
}

function getTorusKnot(
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q,
    material
) {

    if(!material) {
        material = {};
    }

    return new Mesh(
        new TorusKnotGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        ),
        new MeshToonMaterial(material)
    )
}

export {
    getOctaHed,
    getTorus,
    getTorusKnot,
    Shape
};