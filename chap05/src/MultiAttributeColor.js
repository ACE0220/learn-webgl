var VSHADER_SOURCE = `
    
    attribute vec4 a_Position;
    attribute float a_PointSize;
    attribute vec4 a_Color;
    varying vec4 v_Color; // 定义一个varying变量
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color; // 接收来自顶点着色器的varying变量
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVertexBuffer(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffer(gl) {
    // 每一行的数据表示
    // x, y, point size, rgb
    var vertices_sizes_colors = new Float32Array([
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0
    ])

    var n = 3;

    var vBuffer = gl.createBuffer();
    var cBuffer = gl.createBuffer();
    var sBuffer = gl.createBuffer();
    
    if(!vBuffer || !cBuffer || !sBuffer) return -1;

    var FSIZE = vertices_sizes_colors.BYTES_PER_ELEMENT;

    /**
     * 从61～78行，都在重复步骤2～5
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_sizes_colors, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_sizes_colors, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    // 这里在原来基础上增加将颜色数据写入缓冲区分配给a_Color，最后启用
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_sizes_colors, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;

}

main();
