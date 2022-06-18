function main() {
    var canvas = document.getElementById("canvas");
    if(!canvas) {
        console.log("Failed to retrieve the canvas element");
        return false;
    }

    // 通过元素获取绘图上下文，
    var ctx = canvas.getContext("2d");

    // 设置填充颜色为蓝色，使用的rgba格式
    ctx.fillStyle = 'rgba(0,0,225,1.0)';
    // 用这个颜色填充矩形
    // 前两个参数指定xy，后两个指定宽高
    ctx.fillRect(120, 10, 150, 150);
}