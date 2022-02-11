varying vec2 vUv;
uniform float time;


// // Signed distance function for 2D circle
//   float circle(vec2 uv, vec2 pos, float rad) {
//     float d = length(pos - uv) - rad;
//     return step(d, 0.0);
//   }

void main()
{
    // float c = circle(vec2(0.5), gl_PointCoord.xy, 0.5);
    // if (c == 0.0) discard;

    vec3 color1 = vec3(0.988, 0.6, 0.6);
    vec3 color2 = vec3(0.988, 0.83, 0.6);
    vec3 color3 = vec3(0.95, 0.64, 0.353);

    float gradMovementY = 0.2 * sin(time);
    float gradMovementX = 0.25 * sin(time);

    vec3 mix1 = mix(color1, color3, vUv.x /2.0 );
    vec3 mix2 = mix(color3, color1, vUv.x);

    vec3 mix3 = mix(color2, color3, vUv.x);
    vec3 mix4 = mix(color3, color2, vUv.x);

    // vec3 color = mix(
    //     mix(mix1, mix2, vUv.x + gradMovementX),
    //     mix(mix3, mix4, vUv.x + gradMovementX),
    //     vUv.y + gradMovementY
    // );

    vec3 color = mix(
        mix(color1, color2, vUv.x + gradMovementX),
        mix(color1, color3, vUv.x + gradMovementX),
        vUv.y + gradMovementY
    );


    gl_FragColor = vec4(color, 1.0);
}

    // gl_FragColor = vec4(0.95, vUv.x/1.7 + 0.2, vUv.y/1.8 + 0.2, 1.0);
    // gl_FragColor = vec4(
    //     (vUv.x / 100.0)* 3.8 + 0.95,
    //     (vUv.y / 100.0)* 23.0 + 0.6, 
    //     (vUv.y * vUv.x / 100.0)* 23.0 + 0.353,
    //     0.4);