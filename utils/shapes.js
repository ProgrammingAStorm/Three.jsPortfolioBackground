import { OctahedronGeometry, TorusGeometry, TorusKnotGeometry } from 'three';
import { MeshStandardMaterial, MeshBasicMaterial, Mesh } from 'three';

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

function getOctaHed(color, radius, detail) {
    if(!detail) {
        detail = 0;
    }

    return new Mesh(
        new OctahedronGeometry(radius, detail),
        new MeshBasicMaterial({ color: color })
    );
}

function getTorus(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    color,
    arc
) {
  return new Mesh (
    new TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        arc
    ),
    new MeshStandardMaterial({
        color: color
    })
  );     
}

function getTorusKnot(
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q,
    color
) {
    return new Mesh(
        new TorusKnotGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        ),
        new MeshStandardMaterial({ color: color })
    )
}

export {
    getOctaHed,
    getTorus,
    getTorusKnot,
    Shape
};