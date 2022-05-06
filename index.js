const express=require('express');
const path=require('path');
const methodOverride=require('method-override');

const app=express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/styles')));

const Entry=require('./models/dataschema');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Entries',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Mongo Connection open');
    })
    .catch(err=>{
        console.log(err);
    });


app.get('/home', (req, res)=>{
    res.render('home.ejs');
});

app.post('/home', async(req, res)=>{
    let ans={val: true}
    if(await Entry.findOne({email: req.body.email})||await  Entry.findOne({email: req.body.mob}) ){
        ans.val=false;
    }
    else{
        const entry= await Entry(req.body);
        await entry.save();
    }
    res.render('message.ejs', {ans});
});
app.get('/register', (req, res)=>{
    res.render('register.ejs');
});

app.listen(3000, ()=>{
    console.log('server started');
});