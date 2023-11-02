import * as THREE from 'three'

class MyLightsCreator {

    constructor(app) {
        this.app = app;    
    }

    createPointLight(node) {
        const pointLight = new THREE.PointLight(node.color, node.intensity, node.distance, node.decay)
        pointLight.position.set(node.position[0], node.position[1], node.position[2])
        
        // shadows
        pointLight.castShadow = node.castshadow
        pointLight.receiveShadow = node.receiveShadow
        //this.app.scene.add(pointLight)

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        //this.app.scene.add( pointLightHelper );
        return pointLight
    }

    createSpotLight(node) {
        const spotLight = new THREE.SpotLight(node.color, node.intensity, node.distance, THREE.MathUtils.degToRad(node.angle), node.penumbra, node.decay)
        spotLight.position.set(node.position[0], node.position[1], node.position[2])
        
        // shadows
        spotLight.castShadow = node.castShadow
        spotLight.receiveShadow = node.receiveShadow

        let target = new THREE.Object3D()       
        target.position.set(node.target[0], node.target[1], node.target[2])

        spotLight.target = target
        //this.app.scene.add(spotLight)

        const sphereSize = 1;
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, sphereSize );
        //this.app.scene.add( spotLightHelper );

        return spotLight
    }

    createDirectionalLight(node) {
        const directionalLight = new THREE.DirectionalLight(node.color, node.intensity)
        directionalLight.position.set(node.position[0], node.position[1], node.position[2])

        // shadows
        directionalLight.castShadow = node.castShadow
        directionalLight.receiveShadow = node.receiveShadow

        //this.app.scene.add(directionalLight)

        const sphereSize = 1;
        const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, sphereSize );
        //this.app.scene.add( directionalLightHelper );
        return directionalLight
    }

}

export default MyLightsCreator;