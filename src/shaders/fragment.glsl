precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(uColor, 1.0);

    textureColor.rgb *= vElevation * 1.8 + 0.8;

    gl_FragColor = textureColor;
}