import * as THREE from 'three';

class MyAnimation {
    constructor(route) {
        this.route = route;
        this.positionClip = null;
        this.rotationClip = null;
        this.animationMaxDuration = this.route.length - 1; // unit in seconds
        this.MAX_STEERING = Math.PI / 8;
        this.initAnimation();
    }

    initAnimation() {
        const numKeyframes = this.route.length; // Get the length of this.route
        const keyframeIndices = Array.from({ length: numKeyframes }, (_, i) => i);
        
        const keyframeValues = [];
        for (let i = 0; i < numKeyframes; i++) {
            keyframeValues.push(...this.route[i]);
        }

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            keyframeIndices,
            keyframeValues,
            THREE.InterpolateSmooth // Interpolation type
        );

        // Generate quaternion keyframes based on computed angles
        const quaternionKeyframeValues = [];
        const quaternionKeyWheels = [0, 0, 0, 0]; // initial rotation should be zero for wheels
        let angle = 3* Math.PI / 2;
        for (let i = 0; i < numKeyframes; i++) {
            const yAxis = new THREE.Vector3(0, 1, 0);

            if (i > 0 && i < numKeyframes - 1) {
                const prevVector = this.route[i - 1];
                const currentVector = this.route[i];
                const nextVector = this.route[i + 1];

                const prevToCurrent = currentVector.clone().sub(prevVector).normalize();
                const currentToNext = nextVector.clone().sub(currentVector).normalize();

                const crossProduct = new THREE.Vector3().crossVectors(prevToCurrent, currentToNext);
                const turnDirection = Math.sign(crossProduct.y);
    
                const iterationAngle = prevToCurrent.angleTo(currentToNext);
                const steeringAngle = Math.min(iterationAngle, this.MAX_STEERING) * turnDirection;
                angle = angle + (iterationAngle * turnDirection);

                const quaternionWheels = new THREE.Quaternion().setFromAxisAngle(yAxis, steeringAngle);
                quaternionKeyWheels.push(quaternionWheels.x, quaternionWheels.y, quaternionWheels.z, quaternionWheels.w);
            }

            const quaternion = new THREE.Quaternion().setFromAxisAngle(yAxis, angle);
            //console.log(quaternion)
            quaternionKeyframeValues.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
        quaternionKeyWheels.push(0,0,0,0);


        console.log(quaternionKeyframeValues)
        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            keyframeIndices,
            quaternionKeyframeValues
        );
        
        console.log(quaternionKeyWheels)
        const quaterionWheelsKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            keyframeIndices,
            quaternionKeyWheels
        );

        this.positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF]);
        this.rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF]);
        this.steeringClip = new THREE.AnimationClip('steeringAnimation', this.animationMaxDuration, [quaterionWheelsKF])
    }

    getPositionClip() {
        return this.positionClip;
    }

    getRotationClip() {
        return this.rotationClip;
    }

    getWheelSteeringClip() {
        return this.steeringClip;
    }

}


export { MyAnimation };
