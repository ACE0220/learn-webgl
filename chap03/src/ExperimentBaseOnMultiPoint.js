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

    var n = initvertextBuffer(gl);
    if(n < 0) {
        console.log("Failed to set the positions of the vertices");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, 1); 参数2为0，从第一个点开始绘制，参数3为1，只绘制一个点 
    // gl.drawArrays(gl.POINTS, 1, 1); 参数2为1，从第二个点开始绘制，参数3为1，只绘制一个点 
    // gl.drawArrays(gl.POINTS, 1, 2); 参数2为1，从第二个点开始绘制，参数3为2，绘制第二、三个点
    // gl.drawArrays(gl.LINES, 0, n);
    // 自行修改参数去看测试效果，还可以尝试着故意超出参数取值范围去进行测试，看看有什么效果
    gl.drawArrays(gl.POINTS, 0, n);
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