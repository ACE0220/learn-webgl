var vertext_shader_source = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

var fragment_shader_source = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, vertext_shader_source, fragment_shader_source)) {
        console.log('Failed to Create shaders');
        return;
    }

    var n = initvertextBuffer(gl);
    if(n < 0) {
        console.log('Failed to create buffer object');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 这是基于示例代码修改图形绘制类型
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

    // 这是示例代码
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initvertextBuffer(gl) {
    
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    
    var n = 3;
    
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

// start 
main();
