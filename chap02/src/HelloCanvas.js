function main() {
    // 回忆一开始说的，制作二维图形的的几个步骤
    // 获取canvas元素和上下文
    // WebGL绘图函数

    // 步骤1，获取canvas元素
    var canvas = document.getElementById("canvas");
    if(!canvas) {
        console.log("Can't find canvas element");
        return;
    }

    // 步骤1 获取上下文
    var gl = getWebGLContext(canvas);
    if(!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    // 步骤2
    // 存储背景色到上下文中，可以根据书中提供的各种颜色，修改下面的rgba数据进行修改测试
    // 并且这个背景色会常驻在WebGL系统中
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 使用背景色清空绘图区域
    // 传递的gl.COLOR_BUFFER_BIT参数是告诉webgl清空颜色缓冲区
    // 除了颜色缓冲区，还有深度缓冲区和模板缓冲区等，后面会说
    gl.clear(gl.COLOR_BUFFER_BIT);
}

main();