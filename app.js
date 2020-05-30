const express = require('express');
const app = express();

app.use(express.static('public'))
app.get("/", function(req,res){

      res.send("index.html")
})


app.listen(process.env.PORT || 5000, function(){

    console.log(`breathe1 listens on port ${process.env.PORT || 5000}` )
})