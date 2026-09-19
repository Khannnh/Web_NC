let arr1 :any[] = [0,'hello']
let arr2 : unknown[] = [1,'hello']
arr1.push(true) // vẫn có thể push kiểu bool vào vì nó vốn là kiểu nào cx 
arr2.push(true) 

let item1 = arr1[0].toFixed(2)
// let item2 = arr2[0].toFixed(2)