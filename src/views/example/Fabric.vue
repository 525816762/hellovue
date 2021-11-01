<template>
    <div>
        <div style="margin: 20px 0">
            <Button type="primary" @click="drawPoint">点</Button>
            <Button type="primary" @click="drawRect">矩形</Button>
            <Button type="primary" @click="drawCricle">圆形</Button>
            <Button type="primary" @click="drawTriangle">三角形</Button>
            <Button type="primary" @click="drawPath">路径绘图</Button>
            <Button type="primary" @click="drawGroup">绘制组合图</Button>
            <Button type="primary" @click="removeDraw">删除首个图形</Button>
            <Button type="primary" @click="drawImg">添加图片</Button>
        </div>
        <canvas id="canvas" width="1000px" height="400px"></canvas>
        <img id="img" src="/icon.png" alt="picture" />
    </div>
</template>

<script>
import { fabric } from 'fabric'
export default {
    name: 'Fabric',
    data() {
        return {
            url: [
                'https://blog.csdn.net/qq_43759079/article/details/115356559',
                'https://juejin.cn/post/6844903764910931976#heading-5',
                'https://juejin.cn/post/6993801903121367048'
            ],
            canvas: undefined
        }
    },
    mounted() {
        this.initCanvas()
    },
    methods: {
        // 声明画布
        initCanvas() {
            fabric.Object.prototype.getAngleInRadians = function () {
                return (this.get('angle') / 180) * Math.PI
            }
            // 扩展toObject()附加name属性
            fabric.Object.prototype.toObject = (function (toObject) {
                return function () {
                    return fabric.util.object.extend(toObject.call(this), {
                        name: this.name
                    })
                }
            })(fabric.Object.prototype.toObject)

            this.canvas = new fabric.Canvas('canvas', {
                backgroundColor: 'rgb(100,100,200)'
            })
            console.log(this.canvas.toObject())

            console.log(JSON.stringify(this.canvas))

            this.canvas.on('mouse:down', options => {
                console.log('options', options)
                console.log(options.e.offsetX, options.e.offsetY)
                console.log(options.target.type)
            })
            this.canvas.selection = false // 禁止全选，可单个选中
        },
        // 点
        drawPoint() {
            // 创建类
            const Point = fabric.util.createClass({
                initialize: function (x, y, color) {
                    this.x = x || 0
                    this.y = y || 0
                    this.color = color || '#000'
                },
                toString: function () {
                    return '(' + this.x + ',' + this.y + ') color: ' + this.color
                }
            })
            const point = new Point(100, 200, 'red')
            this.canvas.add(point)
        },
        // 矩形
        drawRect() {
            // 绘制矩形
            const rect = new fabric.Rect({
                left: 100, // 距离画布左侧距离，单位像素
                top: 100, // 距离上侧距离
                fill: 'white', // 填充颜色
                width: 100, // 方形宽度
                height: 100, // 方形高度
                angle: 10,
                stroke: 'red' // 边框颜色
            })
            rect.on('modified', e => {
                console.log('triangle modified', e)
            })
            rect.name = 'rect1'
            console.log(rect.getAngleInRadians())
            console.log(rect.toObject())
            console.log(JSON.stringify(rect))
            // 添加图形至画布
            this.canvas.add(rect)
        },
        // 圆形
        drawCricle() {
            // 绘制图形
            const cricle = new fabric.Circle({
                left: 250, // 距离画布左侧距离，单位像素
                top: 100, // 距离上侧距离
                fill: 'red', // 填充颜色
                radius: 50 // 半径
            })
            // 添加图形至画布
            this.canvas.add(cricle)
        },
        // 三角形
        drawTriangle() {
            // 绘制三角形
            const triangle = new fabric.Triangle({
                left: 400, // 距离画布左侧距离，单位像素
                top: 100, // 距离上侧距离
                fill: 'red', // 填充颜色
                width: 100, // 宽度
                height: 100 // 高度
            })
            triangle.set('selectable', false) // 禁止选中
            // 添加图形至画布
            this.canvas.add(triangle)
        },
        // 路径绘图
        drawPath() {
            const path = new fabric.Path('M 0 0 L 200 100 L 170 200 L 50 150 z')
            // M 代表“移动”命令, M 0 0 代表把画笔移动到（0,0）点坐标
            // L 代表“线”，L 200 100 的意思是使用钢笔画一条线，从当前坐标画到（200,100）坐标
            // z 代表让图形闭合路径
            path.set({
                left: 550, // 距离画布左侧距离，单位像素
                top: 100, // 距离上侧距离
                fill: 'red' // 填充颜色
            })
            this.canvas.add(path)
        },
        // 组合图
        drawGroup() {
            // 绘制组合图
            const cricle = new fabric.Circle({
                fill: 'red', // 填充颜色
                radius: 50, // 半径
                originX: 'center', // 调整中心点的X轴坐标
                originY: 'center' // 调整中心点的Y轴坐标
            })
            // 绘制文本
            const text = new fabric.Text('Hello World', {
                fontSize: 15,
                originX: 'center', // 调整中心点的X轴坐标
                originY: 'center', // 调整中心点的Y轴坐标
                // left: 10,
                top: 60
            })
            // 组合
            const group = new fabric.Group([cricle, text], {
                left: 250, // 距离画布左侧距离，单位像素
                top: 250 // 距离上侧距离
                // angle: -10 // 旋转角度
            })

            group.item(1).set({
                text: 'hello',
                fill: 'white'
            })

            // 添加图形至画布
            this.canvas.add(group)
        },
        // 删除对象
        removeDraw() {
            // const obj = this.canvas.item(0) //canvas上添加的第一个对象
            console.log('objects', this.canvas.getObjects()) // 获取canvas上所有的对象
            // this.canvas.remove(obj)
        },
        // 添加图片
        drawImg() {
            // 通过图像元素
            const img = new fabric.Image(document.getElementById('img'), {
                left: 750,
                top: 150,
                opacity: 0.5
            })
            this.canvas.add(img)

            // 通过url
            fabric.Image.fromURL(
                'https://img0.baidu.com/it/u=3437217665,1564280326&fm=26&fmt=auto',
                img => {
                    img.left = 100
                    img.top = 100
                    img.scale(0.5).set('flipY', true)
                    this.canvas.add(img)
                }
            )
        }
    }
}
</script>

<style></style>
