// 1. 顶点着色器接收顶点的纹理坐标，光栅化后传给片元着色器
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

// 2. 片元着色器根据片元的纹理坐标，从纹理图像抽取纹素颜色，赋给当前片元
var FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    // 3. 设置顶点的纹理坐标(initVertexBuffer())
    var n = initVertexBuffer(gl);

    if(n < 0) return;

    // 4. 浏览器读取纹理图像(initTextures())
    if(!initTextures(gl, n)) {
        return;
    }

}

function initVertexBuffer(gl) {
    // 顶点坐标和纹理坐标
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0, 
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])

    var n = 4;
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    // 纹理坐标分配给a_TexCoord并开启
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    // 创建纹理对象
    var textures = gl.createTexture();
    // 从片元着色器获取u_Sampler变量
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    // 新建图片对象
    var image = new Image();

    // 5. 监听纹理图像加载时间，加载完成，就在WebGL系统中使用纹理(loadTextures())
    image.onload = function() {
        loadTexture(gl, n, textures, u_Sampler, image);
    }
    // 加载图片
    image.src = '../../resources/sky.jpg';
    return true;
}

function loadTexture(gl, n, textures, u_Sampler, image) {
    // 对纹理图像进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 激活纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, textures);
    // 配置纹理对象的参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // 纹理单元传递给片元着色器
    gl.uniform1i(u_Sampler, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}

main();