varying vec2 vUv;
uniform float time;

void main()
{
    vec3 color1 = vec3(0.988, 0.6, 0.6);
    vec3 color2 = vec3(0.988, 0.83, 0.6);
    vec3 color3 = vec3(0.95, 0.64, 0.353);

    // gl_FragColor = vec4(0.95, vUv.x/1.7 + 0.2, vUv.y/1.8 + 0.2, 1.0);
    // gl_FragColor = vec4(
    //     (vUv.x / 100.0)* 3.8 + 0.95,
    //     (vUv.y / 100.0)* 23.0 + 0.6, 
    //     (vUv.y * vUv.x / 100.0)* 23.0 + 0.353,
    //     0.4);

    float gradMovementY = 0.1 * sin(time);
    float gradMovementX = 0.25 * sin(time);

    vec3 color = mix(
        mix(color1, color2, vUv.x + gradMovementX),
        mix(color1, color3, vUv.x + gradMovementX),
        vUv.y + gradMovementY
    );
    gl_FragColor = vec4(color, 1.0);
}