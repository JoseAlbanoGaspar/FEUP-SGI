import * as THREE from 'three'

class MyLightsCreator {

    constructor(app) {
        this.app = app;    
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * 
     * This function creates a Point Light
     */
    createPointLight(node) {
        console.log(node)
        const pointLight = new THREE.PointLight(node.color, node.intensity, node.distance, node.decay)
        pointLight.position.set(node.position[0], node.position[1], node.position[2])
        
        // shadows
        pointLight.castShadow = node.castshadow
        pointLight.receiveShadow = node.castshadow
        pointLight.shadow.mapSize.width = node.shadowmapsize ?? 512
        pointLight.shadow.mapSize.height = node.shadowmapsize ?? 512

        //const helper = new THREE.PointLightHelper(pointLight, 5)
        //this.app.scene.add(helper)

        return pointLight
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * 
     * This function creates a Spot Light
     */
    createSpotLight(node) {
        const spotLight = new THREE.SpotLight(node.color, node.intensity, node.distance, THREE.MathUtils.degToRad(node.angle), node.penumbra, node.decay)
        spotLight.position.set(node.position[0], node.position[1], node.position[2])
        console.log(node)
        // shadows
        spotLight.castShadow = node.castshadow
        spotLight.receiveShadow = node.castshadow
        spotLight.shadow.mapSize.width = node.shadowmapsize ?? 512
        spotLight.shadow.mapSize.height = node.shadowmapsize ?? 512


        let target = new THREE.Object3D()       
        target.position.set(node.target[0], node.target[1], node.target[2])

        spotLight.target = target
        console.log(spotLight)

        const helper = new THREE.SpotLightHelper(spotLight, 1)
        this.app.scene.add(helper)

        return spotLight
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * 
     * This function creates a Directional Light 
     */
    createDirectionalLight(node) {
        console.log(node)
        const directionalLight = new THREE.DirectionalLight(node.color, node.intensity)
        directionalLight.position.set(node.position[0], node.position[1], node.position[2])

        // shadows
        directionalLight.castShadow = node.castshadow
        directionalLight.receiveShadow = node.castshadow
        directionalLight.shadow.mapSize.width = node.shadowmapsize ?? 512
        directionalLight.shadow.mapSize.height = node.shadowmapsize ?? 512

        //const helper = new THREE.DirectionalLightHelper(directionalLight, 5)
        //this.app.scene.add(helper)

        return directionalLight
    }

}

export default MyLightsCreator;