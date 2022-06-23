function createProgram(gl, vshader_source, fshader_source) {
    // 创建着色器对象
    var vShader = createShader(gl, vshader_source, gl.VERTEX_SHADER);
    var fShader = createShader(gl, fshader_source, gl.FRAGMENT_SHADER);

    // 创建着色器程序
    var program = gl.createProgram();
    if(!program) {
        return null;
    }

    // 着色器程序附加着色器对象
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    // 链接着色器程序
    gl.linkProgram(program);

    // 检查链接状态
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
}

function createShader(gl, shader_cource, type) {
    // 创建着色器
    var shader = gl.createShader(type);
    if(!shader) {
        console.log("Failed to create shader");
        return null;
    }

    // 设置着色器程序,传入的是string
    gl.shaderSource(shader, shader_cource);

    // 编译着色器
    gl.compileShader(shader);

    // 检查编译状态
    var compaileResult = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compaileResult) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}