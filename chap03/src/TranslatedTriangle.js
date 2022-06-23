var VSHAER_SHOURCE = `
    attribute vec4 a_Position;
    uniform vec4 u_Translation;
    void main() {
        // gl_Position = 默认位置 + 平移距离
        gl_Position = a_Position + u_Translation;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHAER_SHOURCE, FSHADER_SOURCE)){
        return;
    }

    var n = initVertexBuffer(gl);

    if(n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // 到这里为止按照默认位置绘制了一个红色三角形


    // 这里注册点击函数，触发平移，平移函数位于63行
    var btn = document.getElementById("trigger_button");
    btn.onmousedown = function() {
        translate(gl, n);
    }
}

function initVertexBuffer(gl) {

    var n = 3;

    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    var vextexBuffer = gl.createBuffer();
    if(!vextexBuffer) {
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vextexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

// 平移函数
function translate(gl, n) {
    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, 0.5, 0.5, 0.0, 0.0);

    // 所处位置已经更新，需要清除再重新绘制
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

main();