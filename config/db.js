const mongoose=require('mongoose');

const connectDb=()=>{
    mongoose.connect(process.env.db_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
    }).then(()=>{
        console.log('DB connected properly');
    }).catch(err=>{
        console.log('oh No error'+err.message);
    })
}



module.exports=connectDb;