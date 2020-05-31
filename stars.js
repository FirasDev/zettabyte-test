function starzy(starsNumber){
    
    for (var i = 0; i < starsNumber; i++){
        if (i == starsNumber - 1){
            for (var j = 0; j < starsNumber - 1; j++){
                process.stdout.write(`* `);
            }
        }
        process.stdout.write(`*\n`);
    }
}


starzy(8);