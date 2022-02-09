varying vec2 vUv;

void main()
{
    const color1 = vec4(0.988, 0.6, 0.6, 1.0)
    const color2 = vec4(0.0, 0.0, 1.0, 1.0)
    const color3 = vec4(1.0, 0.0, 1.0, 1.0)

    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}