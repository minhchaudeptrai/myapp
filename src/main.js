import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
const gui = new dat.GUI()
const world= {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50,}}


gui.add(world.plane, 'width', 1, 500).onChange(Resize)
gui.add(world.plane, 'height', 1, 500).onChange(Resize)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(Resize)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(Resize)

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const light = new THREE.DirectionalLight(0xffffff,0.8)
const Backlight = new THREE.DirectionalLight(0xffffff,0.8)
const controls = new OrbitControls(camera, renderer.domElement)
const planegeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planematerial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide, 
    flatShading: true,
    vertexColors: true
})
const planemesh = new THREE.Mesh( planegeometry, planematerial)
const colors=[]
const randomValues=[]
const mouse={x: undefined,y: undefined,}
let frame =0


renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
renderer.render(scene,camera)
camera.position.z=80
light.position.set(0,1.5,2)
Backlight.position.set(0,0,-0.5)
document.body.appendChild(renderer.domElement)
scene.add(Backlight)
scene.add(light)
scene.add(planemesh)
for(let i=0; i<planemesh.geometry.attributes.position.count; i++){
    colors.push(0,0.19,0.4)}
planemesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
addEventListener('mousemove', (event) =>{
mouse.x= (event.clientX/ innerWidth) * 2 - 1
mouse.y= -(event.clientY / innerHeight) * 2 + 1})
planemesh.geometry.attributes.position.randomValues = randomValues
planemesh.geometry.attributes.position.originalPosition = planemesh.geometry.attributes.position.array


//CHANGE ARRAY FUNCTION
function Change_array(){
    const {array}=planemesh.geometry.attributes.position
    for(let i =0; i<array.length; i++){

        if (i%3===0){

            const x = array[i]
            const y = array[i+1]
            const z = array[i+2]
            array[i+2]= z + (Math.random()-0.5)*7 
            array[i]= x + (Math.random()-0.5)*3
            array[i+1]= y + (Math.random()-0.5)*3
        
        }
        randomValues.push((Math.random()-0.5)*Math.PI*2)
    }}
// RESHAPE FUNCTION
function Resize(){
    planemesh.geometry.dispose()
    planemesh.geometry=new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
    const colors=[]
    for(let i=0; i<planemesh.geometry.attributes.position.count; i++){
    colors.push(0,0.19,0.4)}
    planemesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    Change_array()
    const position = planemesh.geometry.attributes.position
    position.randomValues = randomValues
    position.originalPosition = position.array
}

// ANIMATE FUNCTION, HOVER FUNCTION, AND COLOR CHANGE FUNCTION
function animate(){
    const intersects = raycaster.intersectObject(planemesh)
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    raycaster.setFromCamera(mouse,camera)
    const{array, originalPosition, randomValues}=planemesh.geometry.attributes.position

    frame+=0.01

    for(let i=0; i<array.length; i+=3){

        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i])*0.05
        array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1])*0.05
        array[i+2] = originalPosition[i+2] + Math.sin(frame + randomValues[i+2])*0.005
    }
    planemesh.geometry.attributes.position.needsUpdate=true   
    if (intersects.length>0){
        const {color} = intersects[0].object.geometry.attributes
        
        intersects[0].object.geometry.attributes.color.needsUpdate = true
        //X
        color.setX(intersects[0].face.a, 0.1)
        color.setX(intersects[0].face.b, 0.1)
        color.setX(intersects[0].face.c, 0.1)

        //Y
        color.setY(intersects[0].face.a, 0.5)
        color.setY(intersects[0].face.b, 0.5)
        color.setY(intersects[0].face.c, 0.5)

        //Z
        color.setZ(intersects[0].face.a, 1)
        color.setZ(intersects[0].face.b, 1)
        color.setZ(intersects[0].face.c, 1)
    const initialColor={
        r: 0,
        g: 0.19,
        b: 0.4 }
    const hoverColor={
            r: 0.1,
            g: 0.5,
            b: 1}
        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
        
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setX(intersects[0].face.c, hoverColor.r)

                
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setY(intersects[0].face.c, hoverColor.g)

                
                color.setZ(intersects[0].face.a, hoverColor.b)
                color.setZ(intersects[0].face.b, hoverColor.b)
                color.setZ(intersects[0].face.c, hoverColor.b)
                color.needsUpdate = true
    }})

}}
Change_array()
animate()
Resize()