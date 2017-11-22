var express = require('express');
var app = express();

app.use(express.static('public'))
app.get("/", function(req,res){

      res.send("index.html")
})


app.listen(process.env.PORT || 3000, function(){

    console.log('breathe1 listens on port 3000 or ' + process.env.PORT)
})