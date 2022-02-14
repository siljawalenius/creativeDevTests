varying vec2 vUv;
uniform float time;

void main()
{
    vec3 color1 = vec3(0.988, 0.6, 0.6);
    vec3 color2 = vec3(0.988, 0.83, 0.6);
    vec3 color3 = vec3(0.95, 0.64, 0.353);

    float gradMovementY = 0.2 * sin(time);
    float gradMovementX = 0.25 * sin(time);

    vec3 color = mix(
        mix(color1, color2, vUv.x + gradMovementX),
        mix(color1, color3, vUv.x + gradMovementX),
        vUv.y + gradMovementY
    );


    gl_FragColor = vec4(color, 1.0);
}
