// 点击列表。切换样式
$(".main_list nav").on("touchend",function(){
    let ind = $(this).index();
    $(this).addClass("list_style").siblings().removeClass("list_style");
})