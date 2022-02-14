varying vec2 vUv;
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vRadius;

void main()
{

    vec3 color1 = vec3(0.988, 0.6, 0.6);
    vec3 color2 = vec3(0.988, 0.83, 0.6);
    vec3 color3 = vec3(0.95, 0.64, 0.353);

    // float gradMovementY = 0.2 * sin(time);
    // float gradMovementX = 0.25 * sin(time);

    // vec3 color = mix(
    //     mix(color1, color2, vUv.x + gradMovementX),
    //     mix(color1, color3, vUv.x + gradMovementX),
    //     vUv.y + gradMovementY
    // );

    float halfR = vRadius/2.0;

    float mixVal1 = smoothstep(0.0, 0.7, halfR);
    float mixVal2 = smoothstep(0.5, 1.5, vRadius);


    vec3 color = mix(color3, color2, mixVal1);
    color = mix(color, color1, mixVal2);

    gl_FragColor = vec4(color, 1.0);
}
