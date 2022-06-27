var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main(){
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_TexCoord;
    // 定义两个sampler2D类型的uniform变量
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    void main() {
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        vec4 color2 = texture2D(u_Sampler2, v_TexCoord);
        gl_FragColor = color1 * color2;
    }
`;

function main(){
    var canvas = document.getElementById('canvas');
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVertexBuffer(gl);
    if(n < 0) return;

    if(!initTexture(gl, n)) return;
}

function initVertexBuffer(gl){
    var vertices_texCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ])

    var n = 4;

    var vBuffer = gl.createBuffer();
    var tBuffer = gl.createBuffer();

    if(!vBuffer || !tBuffer) return -1;

    var FSIZE = vertices_texCoords.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_texCoords, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_texCoords, gl.STATIC_DRAW);
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;

}

function initTexture(gl, n) {
    // 书中原有操作流程
    /*
    var texture1 = gl.createTexture();
    var texture2 = gl.createTexture();

    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');

    var image1 = new Image();
    var image2 = new Image();

    image1.onload = function() {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 0);
    }
    image2.onload = function() {
        loadTexture(gl, n, texture2, u_Sampler2, image2, 1);
    }

    image1.src = '../../resources/redflower.jpg';
    image2.src = '../../resources/circle.gif';
    */

    // 通过函数封装的方式，省点代码
    var success1 = createTextures(gl, n, 'u_Sampler1', '../../resources/redflower.jpg',0, loadTexture);
    var success2 = createTextures(gl, n, 'u_Sampler2', '../../resources/circle.gif',1, loadTexture);

    if(success1 && success2) return true;
}

// 封装方式，顺便练习一下函数封装
function createTextures(gl, n, uiform_name, image_src, tex_unit_number, callback) {
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, uiform_name);
    var image = new Image();
    image.onload = function() {
        callback(gl, n, texture, u_Sampler, image, tex_unit_number);
    }
    image.src = image_src;
    return true;
}

var g_texUnit1 = false, g_texUnit2 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    if(texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit1 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit2 = true;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, texUnit);
    if(g_texUnit1 && g_texUnit2) gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

main();