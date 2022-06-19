var vextex_shader_source = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 5.0;
    }
`;

var fragment_shader_source = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    
    }
`

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!gl) {
        console.log("Failed to get context");
        return;
    }

    if(!initShaders(gl, vextex_shader_source, fragment_shader_source)) {
        console.log("Failed to creat program");
        return;
    }

    // 设置顶点
    // initvertextBuffer 返回顶点数量
    var n = initvertextBuffer(gl);
    if(n < 0) {
        console.log("Failed to set the positions of the vertices");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 只调用一次drawArrays就绘制了三个点
    // 在comprehensive_exercises.js中，第三个参数为1
    // 这次的示例代码因为上下文绑定了缓冲区对象，可以通过initvertextBuffer返回的顶点数量
    // 通知gl.drawArrays一次性绘制三个点
    gl.drawArrays(gl.POINTS, 0, n);
}

/**
 * 
 * @param {*} gl 上下文
 * @returns n 顶点数量，如果创建缓冲区对象失败返回-1
 */
function initvertextBuffer(gl) {
    // 顶点
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    // 顶点数量
    var n = 3;
    // 创建缓冲区对象，创建失败返回-1
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    // 缓冲区对象绑定到上下文
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 缓冲区对象分配给a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}


// start
main();