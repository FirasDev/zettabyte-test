var arr = [0,1,2];

const input = [3,-1,4,-2]

function insert(array){

    if (input.length % 2 == 0){
        arr.splice.apply(arr, [0, 0].concat(input));
    }else{
        arr.splice.apply(arr, [arr.length, 0].concat(input));
    }
}

insert(input);

console.log(arr);