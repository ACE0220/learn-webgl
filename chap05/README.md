[img1]:./img/img1.png
[img2]:./img/img2.png
[img2]:./img/img2.png
[img3]:./img/img3.png
[img4]:./img/img4.png
[img5]:./img/img5.png
[img6]:./img/img6.png
[img7]:./img/img7.png
[img8]:./img/img8.png
[img9]:./img/img9.png
[img10]:./img/img10.png
[img11]:./img/img11.png
[img12]:./img/img12.png
[img13]:./img/img13.png
[img14]:./img/img14.png
[img15]:./img/img15.png
[img16]:./img/img16.png
[img17]:./img/img17.png
[img18]:./img/img18.png
[img18]:./img/img18.png
[img19]:./img/img19.png
[img20]:./img/img20.png
[img21]:./img/img21.png
[img22]:./img/img22.png
[img23]:./img/img23.png
[img24]:./img/img24.png
[img25]:./img/img25.png
[img26]:./img/img26.png
[img27]:./img/img27.png
[img28]:./img/img28.png
[img29]:./img/img29.png
[img30]:./img/img30.png
[img31]:./img/img31.png
[img32]:./img/img32.png
[img33]:./img/img33.png
[img34]:./img/img34.png
[img35]:./img/img35.png
[img36]:./img/img36.png
[img37]:./img/img37.png
[img38]:./img/img38.png
[img39]:./img/img39.png
[img40]:./img/img40.png
[img41]:./img/img41.png
[img42]:./img/img42.png
[img43]:./img/img43.png
[img44]:./img/img44.png
[img45]:./img/img45.png
[img46]:./img/img46.png
[img47]:./img/img47.png
[img48]:./img/img48.png
[img49]:./img/img49.png
[img50]:./img/img50.png
[img51]:./img/img51.png
[img52]:./img/img52.png
[img53]:./img/img53.png

# 第五章 颜色与纹理

通过前几章，对于绘制二维图形有了基础知识和操作流程上的理解。本章在此基础上，研究一些新的问题

# **本章主要内容**

1. 顶点的其他数据（非坐标数据）传入顶点着色器
2. 发生在顶点着色器和片元着色器之间的从图形到片元的转换，又称为**图元光栅化**
3. 纹理映射到图形或三维对象

## **非坐标数据传入顶点着色器**

在第三章的MutilPoint.js中，绘制了三个单独的点，还用到了顶点的尺寸信息。

```
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0; // 顶点的尺寸信息
    }
`;
```

回顾第三章的缓冲区对象的相关知识，将顶点坐标传入着色器需要以下几步：

1. 创建缓冲区对象 gl.createBuffer()
2. 将缓冲区对象绑定到target gl.bindBuffer()
3. 顶点坐标数据写入缓冲区对象 gl.bufferData()
4. 将缓冲区对象分配给对应的attribute变量 gl.vertexAttribPointer()
5. 开启attribute变量 gl.enableVertexAttribArray()

如果我们需要把多个顶点相关数据通过缓冲区对象传入顶点着色器，只需要**重复以上步骤**即可

**示例代码MultiAttributeSize.js**

通过示例程序MultiAttributeSize.js，按照之前的习惯，也是新的重点部分会予以注释解释，没有变化的部分代码，如果看不懂则需要复习前面几章的知识去进行巩固。

上一节我们说重复步骤去将多个数据传入attribute变量。

在练习的时候为了组织代码，将传入坐标输入和尺寸数据的代码混合起来了，如下面代码所示，最终报错了，提示缓冲大小不足。也就是说，传入坐标数据时，必须要完整的走完传入顶点坐标的步骤2～5，再进行传入顶点大小数据的步骤2～5

```
.....
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); // 步骤2
gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer); // 步骤2
gl.bufferData(); // 步骤3
gl.bufferData(); // 步骤3
gl.vertexAttribPointer(); // 步骤4
gl.vertexAttribPointer(); // 步骤4
.....
```

[示例代码：MultiAttributeSize.js](./src/MultiAttributeSize.js)

**创建多个缓冲区对象**

在示例代码37~38中，我们定义了顶点位置数组vertices和顶点大小数组sizes

![img1]

并且创建了两个缓冲区对象，vBuffer和sBuffer

![img2]

通过重复步骤2～5，两个缓冲区对象分配给不同的attribute变量

![img3]

以上步骤的流程图如下所示

![img4]

经过以上操作，WebGL系统准备就绪，当执行gl.drawArrays()，存储在缓冲区对象中的数据将按照缓冲区中的顺序依次传给对应的attribute变量。

然后在着色器中，将两个attribute变量赋值给gl_Position和gl_PointSize。

最终效果如下图所示

![img5]

通过理解这个练习，就可以向顶点着色器传入多份逐顶点的数据信息，如尺寸，颜色，纹理坐标，点所在的平面法向量等。


**gl.vertexAttribPointer()的步进和偏移参数**

使用多个缓冲区对象向着色器传递多种数据，适合数据量不大的情况。

当程序中具有成千上万个顶点，考虑一下MultiAttributeSize.js里面有1000个顶点时，代码的组织情况。

解决方案是WebGL允许我们把顶点坐标和尺寸数据打包到同一个缓冲区对象，并通过某种机制分别访问缓冲区对象中不同种类的数据。

可以将这些数据按照如下方式**交错组织（interleaving）**

```
// 每一行的数据，x, y, size
var verticesSizes = new Float32Array([
    0.0, 0.5, 10.0,
    -0.5, -0.5, 20.0,
    0.5, -0.5, 30.0
])
```

可见，坐标数据和尺寸数据交叉存储在一个数据中，写入缓冲区对象后，WebGL需要有差别的从缓冲区中获取某种特定数据，这个时候gl.vertexAttribPointer()函数中的第5个参数stride，第6个参数offset派上用场

**示例代码MultiAttributeSize_Interleaved.js**

先上示例代码

[示例代码：MultiAttributeSize_Interleaved.js](./src/MultiAttributeSize_Interleaved.js)

最终效果还是一样

![img5]

对比上一个示例代码，修改部分以注释进行标记

![img6]

将重点放在gl.vertexAttribPointer()的第5个和第6个参数

先回顾一下函数规范
![img7]

参数stride表示，在缓冲区对象中，两个相邻顶点之间的距离，即**步进参数**

参数offset表示，当前考虑的数据项距离每个顶点首个元素的距离，即**偏移参数**

在前面的示例代码中，缓冲区只含有顶点的坐标，所以设置为0。

在本例中，缓冲区有多种数据，就要通过stride指定每个顶点数据的大小，offset指定考虑数据项与每个顶点首个元素的距离。

通过下图理解stride和offset是怎么搭配使用的

![img8]

搭配代码就可以理解了

```
// 代码51行
// 每个顶点的数据大小是FSIZE * 3，偏移量是0，取每个顶点的分量1，分量2，分配给a_Position
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

// 代码57行
// 每个顶点的数据大小是FSIZE * 3，偏移量是FSIZE * 2，即跳过两个分量, 每个顶点只取1个分量3，分配给a_PointSize
gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, falst, FSIZE * 3, FSIZE * 2)
```

整个流程如下图所示

![img9]

**修改颜色(varying变量) - 示例代码MultiAttributeColor.js**

根据前面小节的学习和练习，可以在原来的基础上，加上不同顶点绘制不同颜色的功能。

在之前的练习中，我们都是采用一个uniform变量来将颜色传入片元着色器，但这不是“可变的”，引入一种新的**varying变量**向片元着色器传入数据。

varying变量的作用是从顶点着色器向片元着色器传输数据。

[示例代码：MultiAttributeColor.js](./src/MultiAttributeColor.js)

代码说明

修改着色器
![img10]
处理原来的数据，基于上一个练习增加rbg格式的颜色数据
![img11]
新增将颜色数据写入缓冲区分配给a_Color，最后启用
![img12]

整个代码的重点难点，在于gl.vertexAttribPointer()，其中步进参数和偏移参数，只要会计算，其余部分都是按照原有流程走即可

配合代码理解顶点着色器和片元着色器的交流过程，在WebGL系统中，顶点着色器和皮元着色器中有类型和命名都相同的varying变量，在顶点着色器中赋给该变量的值会被自动的传入片元着色器

![img13]

示例代码的最终效果
![img14]

实验：将gl.drawArrays()函数的第一个参数gl.POINTS，修改为gl.TRIANGLES，将会得到一个颜色自然过渡的三角形

[示例代码 ColoredTriangle.js](./src/ColoredTriangle.js)

最终效果

![img15]

# **彩色三角形ColoredTriangle.js**

上一节最后的实验代码，当我们将绘制点，修改为绘制三角形的时候，只改变一个参数，运行结果变成了一个颜色平滑过渡的三角形。

**几何形状的装配和光栅化**

在前面的练习中，我们都是通过给gl_FragColor赋值，绘制出一个红色三角形

当程序向gl_Position给出三个顶点的坐标，是通过什么流程去确定三个三角形的顶点，如何确认哪些像素属于三角形的内部像素并且需要着色，谁负责调用片元着色器，片元着色器如何处理每个片元。

先大致浏览处理流程
![img16]

实际上，在顶点着色器和片元着色器之间，有这样两个步骤

1. **图形装配过程** : 将鼓励的顶点坐标装配成几何图形，几何图形的类别由gl.drawArrays()的第一个参数决定

2. **光栅化过程** : 将装配好的几何图形转化为片元

![img17]

通过上图，gl_Position实际上是**几何图形装配**阶段的输入数据，又称为**图元装配过程**，被装配出的基本图形又称为**图元**

**图形装配与光栅化的过程**：

**PS：下面知识的理解，如果有看过games101的齐次坐标的相关知识，会更容易理解**

gl.drawArrays()的参数n为3，顶点着色器将被执行3次

1. 执行顶点着色器，缓冲区对象第一个坐标(0.0, 0.5)被传递给attribute变量a_Position，一旦一个顶点坐标被赋值给gl_Position，它就进入了图形装配区域，并暂时存储在那里。前面的练习中，一直都是显式地给a_Position赋值x分量和y分量，z分量和w分量是默认值。所以进入图形装配的坐标实际上是(0.0, 0.5, 0.0, 1.0)

2. 第二个顶点坐标(-0.5, -0.5, 0.0, 1.0)按照步骤1的方式进行处理

3. 第三个顶点坐标(0.5, -0.5, 0.0, 1.0)按照步骤1方式进行处理

4. 开始装配图形，使用传入的点坐标，根据gl.drawArrays()的第一个参数信息(gl.POINTS || gl.TRIANGLES || ...)来决定如何装配。

5. 将图形转化为片元，这个过程称为**光栅化**，光栅化完成后，得到组成三角形的所有片元。
![img18]

**调用片元着色器**

光栅化结束之后，程序开始逐片元调用片元着色器，每调用一次就处理一个片元，对于每个片元，片元着色器计算出该片元的颜色，并写入颜色缓冲区，直到最后一个片元被处理完成，浏览器显示效果。

**实验程序HelloTriangle_FragCoord.js**

实验程序：尝试根据片元位置确定片元颜色，通过这种方式证明每个片元着色器都对片元执行了一次。光栅化生成的片元都带有坐标信息，调用片元着色器也会把坐标信息穿进去，可以通过片元着色器的内置变量来访问片元坐标

访问片元着色器内置变量
![img19]

[示例代码：HelloTriangle_FragCoord.js](./src/HelloTriangle_FragCoord.js)

在实验程序中，修改了gl_FragColor的计算，例如一个点在(200, 200)处，gl_FragCoord返回x = 200, y = 200，用200/400 = 0.5，即可将坐标压缩到[0, 1]的区间。

通过gl.drawingBufferWidth和gl.drawingBufferHeight获取到颜色缓冲区的宽高，将两个值分别传给u_Width, u_Height。

gl.FragCoord.x / u_Width 和 gl.FragCoord.y / u_Height，都控制在[0,1]区间内，而rgb格式中，每个分量也是[0,1]范围，所以书中所说的像素颜色通过像素的位置决定，显示一个渐变的效果，其实就是通过位置映射到颜色的一个思路

另外一处关键代码就是gl.drawingBufferWidth和gl.drawingBufferHeight这两个参数

![img20]
![img21]

最终效果

![img22]

**varying变量的作用和内插过程**

通过前面的学习，了解了图元装配和光栅化，再逐片元调用片元着色器这个流程。

回到ColoredTriangle.js的代码中，我们通过varying变量v_Color，它的值被传给片元着色器中同名，同类型变量v_Color。

顶点着色器中v_Color在传给片元着色器v_Color之前，经过了一个**内插过程**，所以片元着色器和顶点着色器中的v_Color变量实际上不是一回事，这也是将这种变量称为varying变量的原因。

准确来说，在varying变量中为3个不同顶点赋予不同颜色，三角形表面上的片元都是WebGL系统利用这三个顶点的颜色内插出来的

![img23]

例如顶点A颜色(1.0, 0.0, 0.0)红色, 顶点B颜色(0.0, 0.0, 1.0)蓝色，WebGL会自动计算线段上的所有片元的颜色，并赋值给片元着色器的v_Color变量。

从下图可见，在插值过程中，内插颜色从红色，逐渐变化成蓝色，R值从1.0逐步降至0.0，B值从0.0逐步升至1.0，这个过程，就称为**内插过程**

![img24]

如果需要更详细的了解这个过程，可以通过图形学的相关书籍，或games101系列视频。（个人还是更加推荐games101作为入门，相关的书籍在入门后再补充）

## **在矩形表面贴上图像**

在前面的练习中，一直使用的是单色，或平滑颜色渐变去填充三角形内部，但是这种方式在复杂情况下仍然不足，例如在实际开发中，特别是游戏开发，涉及到墙壁，人物，地面等，通过颜色和位置来模拟，非常繁琐。

在图形学中，**纹理映射**可以解决这个问题。

要理解起来也不难，其实就是将一张图片映射（贴）到几何图形的表面，“图片”也可以理解为一段有指定作用的数据

这张图片，可以称为**纹理图像**或**纹理**，组成这张图片的像素，称为**纹素**，每个纹素的颜色都是用RGB或者RGBA格式编码。

webgl进行纹理映射的步骤

1. 准备好纹理图像
2. 为几何图形配置纹理映射方式
3. 加载纹理图像，对其进行一些配置
4. 在片元着色器中将相应的纹素从纹理中抽取出来，将纹素的颜色赋给片元

运行示例代码TextureQuad.js的效果
![img25]

**纹理坐标**

纹理坐标是纹理图像上的坐标，通过坐标可以获取纹素颜色，WebGL系统中的纹理坐标是二维的，使用的是st坐标系统。

st系统坐标轴取值范围都是[0,1]，与图像大小无关

![img26]

**将纹理图像贴到几何图形**

通过定义纹理坐标和几何形体顶点坐标的映射关系来进行贴图
![img27]

**示例代码TexturedQuad.js**

先放出示例代码，运行查看效果。

[示例代码TexturedQuad.js](./src/TexturedQuad.js)

纹理映射的过程需要顶点着色器和片元着色器相互配合。

在顶点着色器中为每个顶点指定纹理坐标，在片元着色器中根据每个片元的纹理坐标从图像中抽取纹素颜色。

示例代码中的主要分为5个部分

1. 顶点着色器接收顶点的纹理坐标，光栅化后传给片元着色器
2. 片元着色器根据片元的纹理坐标，从纹理图像抽取纹素颜色，赋给当前片元
3. 设置顶点的纹理坐标(initVertexBuffer())
4. 浏览器读取纹理图像(initTextures())
5. 监听纹理图像加载时间，加载完成，就在WebGL系统中使用纹理(loadTextures())

接下来**先从第3部分**开始说起，图像加载完成之后才会执行着色器程序，最后将第1，2部分

**第三部分：设置纹理坐标 initVertexBuffer()**

在initVertexBuffer()中提供了顶点和纹理坐标，如果忘记缓冲区对象的相关知识，建议复习第三章。

```
// 顶点坐标和纹理坐标
var verticesTexCoords = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0, 
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
])
```

```
// 纹理坐标分配给a_TextCoord并开启
var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
gl.enableVertexAttribArray(a_TexCoord);
```


**第四部分：配置和加载纹理 initTextures()**

函数负责配置和加载纹理

```
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
```

这段代码创建了纹理对象，获取u_Sampler变量，最后创建Image对象，并注册onload事件响应函数loadTexture().

gl.createTexture()方法可以创建纹理对象，创建成功后，上下文中存在8个管理纹理图像的纹理单元，gl.TEXTURE0~gl.TEXTURE7，每个都与gl.TEXTURE_2D相关联，稍后会解释。

函数规范

![img28]

![img29]

同理gl.deleteTexture()来删除一个纹理对象，下图是函数规范

![img30]

由于图像加载过程是异步，所以需要监听加载完成事件，运行loadTexture()方法。

**第五部分：为WebGL配置纹理 loadTexture()**

```
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
    
    ......

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}
```

loadTexture()函数接收5个参数，使用纹理对象的方式与使用缓冲区的方式也很相似

1. gl : 绘图上下文
2. n : 顶点个数
3. texture 之前创建的纹理对象
4. u_Sampler uniform变量位置
5. image 图像，要注意，webgl系统不允许跨域使用纹理图像


**gl.pixelStorei() y轴反转**

gl.pixelStorei()函数对纹理图像进行y轴反转，因为webgl纹理坐标的t轴与图片的坐标系统是相反的

![img31]

gl.pixelStorei()函数规范

![img32]

**gl.activeTexture() 激活纹理单元**

webgl通过**纹理单元**的机制同时使用多个纹理，每个纹理都有一个单元编号，就算只有一张纹理图像也要制定一个纹理单元

默认情况下，webgl支持8个纹理单元，编号从 gl.TEXTURE0 ~ gl.TEXTURE7，在使用纹理单元之前要先激活

![img33]

函数规范

![img34]


**gl.bindTexture() 绑定纹理对象**

在对纹理对象操作之前，需要绑定纹理对象，告知webgl系统使用的是哪种类型的纹理。

webgl系统支持的两种纹理类型
![img35]

函数规范
![img36]

此方法完成两个任务

1. 开启纹理对象
2. 将纹理对象绑定到纹理单元

此时的系统内部状态
![img37]

**gl.texParameteri() 配置纹理对象的参数**

此函数用于设置纹理图像映射到图形上的具体方式：包括根据纹理获取纹素颜色，按哪种方式重复填充纹理等。

函数规范
![img38]

pname参数用于指定纹理参数，有4种类型

1. 放大方法 gl.TEXTURE_MAG_FILTER : 纹理绘制范围比纹理本身更大，32 x 32的空间，16 x 16的纹理图像
2. 缩小方法 gl.TEXTURE_MIN_FILTER : 纹理绘制范围比纹理本身更小，32 x 32的纹理图像，16 x 16的空间
3. 水平填充方法 gl.TEXTURE_WRAP_S : 对纹理图像的左侧或右侧区域进行填充
4. 垂直填充方法 gl.TEXTURE_WRAP_T : 对纹理图像的上方和下方的区域进行填充

![img39]

可以赋给gl.TEXTURE_MAG_FILTER和gl.TEXTURE_MIN_FILTER的非金字塔类型的常量

![img40]

可以赋给gl.TEXTURE_WRAP_S和gl.TEXTURE_WRAP_T的常量

![img41]

gl.TEXTURE_MIN_FILTER参数的默认值，是MIPMAP的纹理类型，实际上是原始图像的一系列不同分辨率的版本，games101中纹理映射相关知识有讲解到基础原理，这里不再赘述。书中较少用mipmap，所以修改为gl.LINEAR。

**将纹理图像分配给纹理对象 gl.texImage2D()**

函数规范
![img42]

调用了gl.texImage2D()函数后，内部状态如下图所示

![img44]

level是为mipmap准备的，书中没有涉及，传入0

internalformat，jpg、bmp格式的纹理图像传入gl.RGB，其他格式的传入gl.RGBA，下表是可传入的格式

![img43]

gl.texImage2D()方法存储在webgl系统的纹理对象中，必须通过internalformat参数告知系统纹理图像的格式类型，format参数和internalformat一样

type参数数据格式

![img45]

**gl.uniform1i() 将纹理单元传递给片元着色器**

将纹理图像传入webgl系统后，必须将其传入片元着色器并映射到图形表面，使用uniform变量来表示纹理，纹理图像不会随着片元变化

```
var FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;
`
```

在代码中我们用了一种专用于纹理对象的数据类型sampler2D

![img46]

在示例代码中我们用的是gl.TEXTURE_2D，所以传入的是sampler2D类型，示例代码中唯一的的纹理对象被绑定在gl.TEXTURE0上，所以gl.uniform1i的第二个参数是0

**从顶点着色器向片元着色器传输纹理坐标**

顶点之间的片元纹理坐标会在光栅化的过程内插出来，剩余的工作就是片元着色器从纹理图像抽取出纹素的颜色，绘制到当前的片元上

**在片元着色器获取纹理像素颜色 texture2D()**


texture2D函数是GLSL ES内置函数，只需要传入两个参数-纹理单元编号和纹理坐标，就可以获取到纹理上的像素颜色

函数规范
![img47]

纹理放大和缩小方法的参数决定webgl系统将以何种方式查处片元，函数返回值如下图所示，最终这个返回值被赋值到gl_FragColor，完成插值。
![img48]

**实验程序TextureQuad_Repeat.js**

实验程序主要修改两个地方

1. 修改纹理坐标数据

```
// 实验代码部分1
var vertices_texCoords = new Float32Array([
    -0.5, 0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
    0.5, 0.5, 1.7, 1.7,
    0.5, -0.5, 1.7, -0.2,
])
```

2. 修改纹理参数

```
// 实验代码部分2
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
```

这两段修改均在实验代码中有注释标明

[示例代码：TextureQuad_Repeat.js](./src/TexturedQuad_Repeat.js)

最终效果根据是否运行试验代码部分2而不同

注释实验部分2

![img49]

运行试验部分2

![img50]

## **使用多幅纹理**

webgl可以同时处理多幅纹理，纹理单元为此而设计，需要多幅纹理图像的时候，需要对每一幅纹理图像都进行一次纹理映射的操作，也是类似于多个缓冲区的操作流程。

**示例代码 MultiTexture.js**

主要修改的位置，打开代码参考

[示例代码 MultiTexture.js](./src/MultiTexture.js)

1. 片元着色器定义了两个uniform变量u_Sampler, 片元着色器的main函数中，从两个纹理分别去除纹素颜色，存储到color1，color2，最后通过颜色矢量的分量乘法进行计算赋值给gl_FragColor

![img51]

2. initTexture()创建了两个纹理对象，基于函数封装的思想，同时也提供了封装函数，两种方式都可用，自行注释测试。

3. 修改了loadTexture()函数，增加了状态判断，因为无法预测哪个纹理图像先被加载完成，当两个纹理图像都完成加载后，才开始绘制，重叠着绘制出两层纹理。

最终效果

![img52]

## **总结**

1. 从点到面，绘制三个不同大小、颜色的顶点，到绘制颜色平滑过渡的三角形，从中学到多个缓冲区对象的操作流程。
2. 学习到光栅化的过程，以及顶点着色器和片元着色器的交互
3. 从单纹理图像到多纹理图像的操作流程。

## **预告**

下一章：OpenGL ES着色器语言(GLSL ES)























































