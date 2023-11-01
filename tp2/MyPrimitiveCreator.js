import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyPrimitiveCreator {
    constructor(app) {
        this.app = app;

        // nurbs related
        this.builder = new MyNurbsBuilder()
    }

    /**
     * 
     * @param {Array} controlPoints 
     * @param {number} orderU 
     * @param {number} orderV 
     * @param {number} samplesU 
     * @param {number} samplesV
     * @param {THREE.material} material
     * @returns {THREE.Mesh} - the created nurb surface
     * note: private method
     */
    #createNurbSurface(controlPoints, orderU, orderV, samplesU, samplesV, activeMaterial) { 

        let surfaceData = this.builder.build(controlPoints,
                      orderU, orderV, samplesU,
                      samplesV, activeMaterial)  

        let mesh = new THREE.Mesh( surfaceData, activeMaterial );
        return mesh
    }

    #transformControlPoints(controlPoints, orderU, orderV) {
        if ((orderU + 1) * (orderV + 1) !== controlPoints.length) {
            throw new Error('Invalid input: The product of orderU + 1 and orderV + 1 must match the number of control points.');
        }

        const resultArray = [];
        let idx = 0
        for (let u = 0; u < orderU + 1; u++) {
            let slice = []
            for (let v = 0; v < orderV + 1; v++) {
                slice.push([controlPoints[idx].xx / 1, controlPoints[idx].yy / 1, controlPoints[idx].zz/ 1, 1 / 1 ])
                idx++
            }
            resultArray.push(slice)
        }

        return resultArray
      }
    
     /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Rectangle
     */
     drawRectangle(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        const width = Math.abs(nodeInfo.xy2[0] - nodeInfo.xy1[0])
        const height = Math.abs(nodeInfo.xy2[1] - nodeInfo.xy1[1])
        const geometry = new THREE.PlaneGeometry( width, height, nodeInfo.parts_x, nodeInfo.parts_y )
        const rectangle = new THREE.Mesh(geometry, activeMaterial)
        //this.app.scene.add(rectangle)
        return rectangle
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Triangle
     */
    drawTriangle(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        let vertices = new Float32Array([
            nodeInfo.xyz1[0], nodeInfo.xyz1[1], nodeInfo.xyz1[2],
            nodeInfo.xyz2[0], nodeInfo.xyz2[1], nodeInfo.xyz2[2],
            nodeInfo.xyz3[0], nodeInfo.xyz3[1], nodeInfo.xyz3[2]
        ]);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const triangle = new THREE.Mesh(geometry, activeMaterial);
        //this.app.scene.add(triangle)
        return triangle
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Box
     */
    drawBox(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        const width = Math.abs(nodeInfo.xyz2[0] - nodeInfo.xyz1[0]);
        const height = Math.abs(nodeInfo.xyz2[1] - nodeInfo.xyz1[1]);
        const depth = Math.abs(nodeInfo.xyz2[2] - nodeInfo.xyz1[2]);
        const geometry = new THREE.BoxGeometry(width, height, depth, nodeInfo.parts_x, nodeInfo.parts_y, nodeInfo.parts_z);
        const box = new THREE.Mesh(geometry, activeMaterial);
        //this.app.scene.add(box)
      return box
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Cylinder
     */
    drawCylinder(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        const geometry = new THREE.CylinderGeometry(
                nodeInfo.top,
                nodeInfo.base,
                nodeInfo.height,
                nodeInfo.slices,
                nodeInfo.stacks,
                !nodeInfo.capsclose,
                nodeInfo.thetastart,
                nodeInfo.thetalength
        )
        const cylinder = new THREE.Mesh(geometry, activeMaterial)
        //this.app.scene.add(cylinder)
        return cylinder

    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Sphere
     */
    drawSphere(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        const geometry = new THREE.SphereGeometry(
            nodeInfo.radius,
            nodeInfo.slices,
            nodeInfo.stacks,
            nodeInfo.phistart,
            nodeInfo.philength,
            nodeInfo.thetastart,
            nodeInfo.thetalength
        )
        const sphere = new THREE.Mesh(geometry, activeMaterial)  
        return sphere
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function draws a primitive of subtype Nurbs
     */
    drawNurbs(node, activeMaterial) {
        let nodeInfo = node.representations[0]
        let controlPoints = this.#transformControlPoints(nodeInfo.controlpoints, nodeInfo.degree_u, nodeInfo.degree_v)
        const mesh = this.#createNurbSurface(controlPoints, nodeInfo.degree_u, nodeInfo.degree_v, nodeInfo.parts_u, nodeInfo.parts_v, activeMaterial);
        //this.app.scene.add(mesh)
        return mesh
    }


}
  
  export default MyPrimitiveCreator;