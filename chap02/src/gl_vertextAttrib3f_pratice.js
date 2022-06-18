// 顶点着色器
var vertex_shader_source = `
    // 新增的代码
    attribute vec4 a_Position; 
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

// 片元着色器
var fragment_shader_source = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, vertex_shader_source, fragment_shader_source)) {
        console.log("Init shaders fail");
        return;
    }

    // 新增的代码
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get a_Position')
        return;
    }
    // 新增的代码
    // 回想一下x,y,z在canvas坐标系中最大值和最小值，可以尝试一下x，y大于1，小于-1的情形
    var position = new Float32Array([0.5, 0.5, 0.0, 1.0]);
    gl.vertexAttrib4fv(a_Position, position);

    // 同族函数，可以复制粘贴上去看看效果
    /**
     * gl.vertexAttrib1f(a_Position, 0.5);
     * gl.vertexAttrib2f(a_Position, 0.5, 0.5);
     * gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0);
     * gl.vertextttrib4f(a_Position, 0.5,0.5,0.0,1.0);
     * 
     * var position = new Float32Array([0.5, 0.5, 0.0, 1.0]);
     * gl.vertexAttrib4fv(a_Position, position);
     * 
     */

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}

main();