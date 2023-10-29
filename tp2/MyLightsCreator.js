import * as THREE from 'three'

class MyLightsCreator {

    constructor(app) {
        this.app = app;    
    }

    createPointLight(node) {
        let castshadow = node.castshadow
        const pointLight = new THREE.PointLight(node.color, node.intensity, node.distance, node.decay)
        pointLight.position.set(node.position[0], node.position[1], node.position[2])
        pointLight.castShadow = node.castshadow
        this.app.scene.add(pointLight)

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );
        return pointLight
    }

    createSpotLight(node) {
        let castshadow = node.castshadow

        const spotLight = new THREE.SpotLight(node.color, node.intensity, node.distance, node.angle, node.penumbra, node.decay)
        spotLight.position.set(node.position[0], node.position[1], node.position[2])

        let target = new THREE.Object3D()
        target.position.set(node.target)

        spotLight.target = target
        this.app.scene.add(spotLight)

        const sphereSize = 1;
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, sphereSize );
        this.app.scene.add( spotLightHelper );

        return spotLight
    }

    createDirectionalLight(node) {
        let castshadow = node.castshadow

        const directionalLight = new THREE.DirectionalLight(node.color, node.intensity)
        directionalLight.position.set(node.position[0], node.position[1], node.position[2])
        this.app.scene.add(directionalLight)

        const sphereSize = 1;
        const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, sphereSize );
        this.app.scene.add( directionalLightHelper );
        return directionalLight
    }

}

export default MyLightsCreator;