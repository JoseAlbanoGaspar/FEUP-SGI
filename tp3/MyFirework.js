import * as THREE from 'three'

class MyFirework {

    constructor(app) {
        this.app = app

        this.done     = false 
        this.dest     = [] 
        
        this.vertices = []
        this.colors   = []
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 1,
            color: this.colors,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 200
        this.speed = 40

        this.launch() 

    }

    /**
     * compute particle launch
     */

     launch() {
        let x = THREE.MathUtils.randFloat(750, 800);
        let y = THREE.MathUtils.randFloat(20, 150);
        let z = THREE.MathUtils.randFloat(-120, 120);
    
        let from = new THREE.Vector3(x, -10, z);
        this.dest.push(x, y, z);
    
        let color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.5);
        this.colors.push(...color);
    
        let vertices = from;
    
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices.toArray()), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
        this.points = new THREE.Points(this.geometry, this.material);
        this.app.scene.add(this.points);
    }
    

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(pos) {
        this.app.scene.remove( this.points );  
        this.dest     = []; 
        this.colors   = []; 
        
        for( var i = 0; i < 80; i++ )
        {
            var color = new THREE.Color()
            color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.5 )
            this.colors.push( ...color )
            
            var from = [ 
                THREE.MathUtils.randFloat( pos[0] - 30, pos[0] + 30 ), 
                THREE.MathUtils.randFloat( pos[1] - 30, pos[1] + 30 ), 
                THREE.MathUtils.randFloat( pos[2] - 30, pos[2] + 30 )
            ]
           
            var to = [
                THREE.MathUtils.randFloat( pos[0] - 50, pos[0] + 50 ), 
                THREE.MathUtils.randFloat( pos[1] - 50, pos[1] + 50 ), 
                THREE.MathUtils.randFloat( pos[2] - 50, pos[2] + 50 )
            ]
            this.vertices.push( ...from );
            this.dest.push( ...to ); 
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
        this.points = new THREE.Points(this.geometry, this.material);
        this.app.scene.add( this.points );
        
    }
    
    /**
     * cleanup
     */
    reset() {
        this.app.scene.remove( this.points )  
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i] += ( this.dest[i] - vertices[i] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    let pos = [vertices[0], vertices[1], vertices[2]]
                    this.explode(pos) 
                    return 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.02 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}

export { MyFirework }