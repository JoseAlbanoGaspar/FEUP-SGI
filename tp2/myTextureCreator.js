import * as THREE from 'three'

class MyTextureCreator {

    constructor(app) {
        this.app = app;    
    }

    /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     * 
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
    // * @param {*} size if size not null inscribe the value in the mipmap. null by default
    // * @param {*} color a color to be used for demo
     */
    #loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }
    /**
     * 
     * @param {*} param 
     * @returns parameter translation to 3js
     * This function is used to compute the min and maxFilters on default mipmaps
     */
    #getFilter(param) {
        switch (param) {
            case 'NearestFilter':
                return THREE.NearestFilter;
            case 'LinearFilter':
                return THREE.LinearFilter;
            case 'NearestMipmapNearestFilter':
                return THREE.NearestMipmapNearestFilter;
            case 'LinearMipmapNearestFilter':
                return THREE.LinearMipmapNearestFilter;
            case 'NearestMipmapLinearFilter':
                return THREE.NearestMipmapLinearFilter;
            case 'LinearMipmapLinearFilter':
                return THREE.LinearMipmapLinearFilter;
            default:
                return THREE.LinearFilter;
        }
    }

    /**
     * 
     * @param {*} texture 
     * @returns Video texture
     */
    buildVideoTexture(texture){
        const id = texture.id
        let videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.id = id;
        videoElement.auto = true;
        videoElement.muted = true;
        const source = document.createElement('source');
        source.src = texture.filepath;
        source.type = 'video/mp4';
        videoElement.appendChild(source);
        document.body.appendChild(videoElement);
        
        const video = document.getElementById(id)
        return new THREE.VideoTexture( video ) 
    }

    /**
     * 
     * @param {*} texture 
     * @returns texture
     */
    buildTexture(texture){
        return new THREE.TextureLoader().load(texture.filepath)
    }

    /**
     * 
     * @param {*} texture 
     * @param {*} textureMaterial 
     * 
     * builds custom mipmaps instead of default
     */
    buildMipMaps(texture, textureMaterial){
        textureMaterial.generateMipmaps = false
        let mipmaps = [
            texture?.mipmap0, texture?.mipmap1, texture?.mipmap2, texture?.mipmap3,
            texture?.mipmap4, texture?.mipmap5, texture?.mipmap6, texture?.mipmap7,
        ]

        for (let level = 0; level < 8; level++ ){
            if(mipmaps[level]) { // add mipmaps
                this.#loadMipmap(textureMaterial, level, mipmaps[level])  
            }
            else break;
        }
    }
    /**
     * 
     * @param {*} texture 
     * @param {*} textureMaterial
     * Build default mipmaps 
     */
    buildDefaultMipMaps(texture, textureMaterial){
        textureMaterial.minFilter = this.#getFilter(texture.minfilter)
        textureMaterial.magFilter = this.#getFilter(texture.magfilter)
    }

    /**
     * 
     * @param {*} texture 
     * @param {*} materialObject 
     * @param {*} material 
     * Adds bump texture to a materialObject
     */
    buildBumpTexture(texture, materialObject, material){
        const bumpTexture = texture.filepath
        const bumpTextMat = new THREE.TextureLoader().load(bumpTexture)
        materialObject.bumpMap = bumpTextMat
        materialObject.bumpScale = material.bumpscale
    }
}

export default MyTextureCreator;