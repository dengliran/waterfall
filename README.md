# 基于jQuery的瀑布流插件
![demo](https://raw.githubusercontent.com/dengliran/waterfall/master/screenshot/waterfaa_demo.gif)  

### 使用方法
****
### 1. HTML结构
每个图片版块都是通过自定义waterfall-item里面的元素样式实现的，间距、圆角或者阴影。
```
<div class="waterfall-container">
  <div class="waterfall-item">
    <!-- 版块内自定义内容 -->
    <div class=""><img src=""></div>
  </div>
  <div class="waterfall-item">
    <!-- 版块内自定义内容 -->
    <div class=""><img src=""></div>
  </div>
  ....
</div>
```
### 2. 初始化
引入 `jquery.js` 库和 `jquery-waterfall.js` 。
```
$('.waterfall-container').waterfall();
```

### 配置
***
```
$('.waterfall-container').waterfall({
    itemsClass: '.waterfall-item', // 重命名.waterfall-item节点，默认值：'.waterfall-item'。
    itemsAnimate: true // 在窗口大小发生变化.waterfall-item重新编排时，是否使用动画。
});
```
