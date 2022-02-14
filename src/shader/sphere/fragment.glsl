varying vec2 vUv;
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vRadius;

#define NUM_OCTAVES 5

float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}

float noise(vec3 p){
    vec3 a=floor(p);
    vec3 d=p-a;
    d=d*d*(3.-2.*d);
    
    vec4 b=a.xxyy+vec4(0.,1.,0.,1.);
    vec4 k1=perm(b.xyxy);
    vec4 k2=perm(k1.xyxy+b.zzww);
    
    vec4 c=k2+a.zzzz;
    vec4 k3=perm(c);
    vec4 k4=perm(c+1.);
    
    vec4 o1=fract(k3*(1./41.));
    vec4 o2=fract(k4*(1./41.));
    
    vec4 o3=o2*d.z+o1*(1.-d.z);
    vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
    
    return o4.y*d.y+o4.x*(1.-d.y);
}

float fbm(vec3 x){
    float v=0.;
    float a=.5;
    vec3 shift=vec3(100);
    for(int i=0;i<NUM_OCTAVES;++i){
        v+=a*noise(x);
        x=x*2.+shift;
        a*=.5;
    }
    return v;
}

void main()
{
    vec3 color1=vec3(.988,.6,.6);
    vec3 color2=vec3(.988,.83,.6);
    vec3 color3=vec3(.95,.64,.353);
    

    float gradMovementY = 0.2 * sin(time);
    float gradMovementX = 0.25 * sin(time);

    vec3 color4 = mix(
        mix(color1, color2, vNormal.x * 0.5 + gradMovementX),
        mix(color1, color3, vNormal.x + gradMovementX),
        vNormal.y + gradMovementY
    );

    
    // float mixer1 = smoothstep(0.6, 1.2, vRadius);
    // float mixer2 = smoothstep(1.1, 1.6, vRadius);

    float mixer1 = smoothstep(0.8, 1.3, vRadius);
    float mixer2 = smoothstep(1.2, 1.6, vRadius);
    
    vec3 color = mix(color2, color4, mixer1);
    color = mix(color, color3, mixer2);
    
    gl_FragColor=vec4(color,1.);
} 


    //  float mixVal1 = smoothstep(0.33, 0.66, halfR);
    // float mixVal2 = smoothstep(0.66, 1.0, vRadius);
    // float mixVal3 = smoothstep(0.0, 1.5, vRadius);
    
    //THESE VALUS ARE A GOOD BALANCE OF ALL 3
    // float mixVal2=step(0.9, vRadius);
    // float mixVal3=step(1.1,vRadius);
