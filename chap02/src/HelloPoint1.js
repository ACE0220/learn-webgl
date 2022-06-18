// 顶点着色器程序，后面GLSL ES章节会详细说
var vertex_shader_source = `
        void main()
        {
            gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
            gl_PointSize = 10.0;
        }
    `;

// 片元着色器程序，后面GLSL ES章节会详细说
var fragment_shader_source = `
        void main(){
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }
`;

function main() {
    var canvas = document.getElementById("canvas");

    var gl = getWebGLContext(canvas);

    // 初始化着色器
    if(!initShaders(gl, vertex_shader_source, fragment_shader_source)) {
        return;
    }

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
    
}

main();