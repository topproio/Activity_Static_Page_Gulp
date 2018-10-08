setTimeout(()=>{
    console.log(1)
},1000)
fn()
function fn(){
    console.log(1);
    console.log(2)
}

let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo);
console.log(bar);
console.log(baz);