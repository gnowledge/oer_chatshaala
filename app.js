//jshint esversion:6
const express = require('express');
const app = express();
const ejs = require("ejs");
const parser = require('body-parser');
const secrets=require('./secrets.js');
const func=require('./functions.js');
const md5 = require('md5');
const session = require('express-session');
const https=require("https");

const home = '/home';
const feedback = '/feedback';
const about = '/about';
const FAQ = '/FAQ';
const Terms = '/Terms';
const privacy = '/privacy';
const blog = '/blog';
const logout = '/logout';
const project = '/project';
const profile='/profile';
const activity='/activity';
const notifications='/notifications';
const badges='/badges';
const messages='/messages';
const pref='/preferences';

app.set('views','./public/views');
app.set('view engine', 'ejs');
app.use(parser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(session({
    secret:secrets.string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60*1000
    }
}));

//Starting local server
app.listen(3000, function (req, res) {
  console.log('Server Started on localhost:3000');
});


//Routing
app.get('/register', function (req, res) {
  let user=req.session.user;
  if(user){
    res.redirect('/home');
  }else{
  res.render('register.ejs', {
    status: ''
  });
}
});

app.post('/register', function (req, res) {
  let user=req.session.user;
  if(user){
    res.redirect('/home');
    return;
  }else{
  if (req.body.hasOwnProperty('signup')) {
    if(req.body.pass1.length <10){
      res.render('register.ejs',{status:'Password should be atleast 10 characters long'});
    }
    else{
    var new_user=new func.getUser(req.body.email, md5(req.body.pass1), req.body.name, req.body.username1, req.body.identity);
    func.addNewUser(req,res,new_user.name,new_user.email,new_user.password,new_user.userName,new_user.identity);
    }
  } else if (req.body.hasOwnProperty('login')) {
    var curr_user = func.resetCurrUser();
    curr_user.userName = req.body.username2;
    curr_user.password = md5(req.body.pass2);
    func.verifyUser(req,res,curr_user.userName,curr_user.password);
  } else if (req.body.hasOwnProperty('forgot')) {
    res.send('forgot password page');
  } else {
    res.send('Error Occured');
  }
}
});

app.get('/home', function (req, res) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let curr_user=req.session.user;
  if (curr_user) {
    res.render('home.ejs', {
      home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  } else {
    res.redirect('/register');
  }
});

app.get("/feedback", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render('feedback.ejs', {
      curr_user:curr_user,home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  } else {
    res.render('feedback.ejs', {
      curr_user:curr_user,home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  }
});


app.get("/about", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render('about.ejs',{ curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  } else {
    res.render('about.ejs',{ curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  }
});
app.get("/blog", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("blog.ejs", {curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  } else {
    res.render("blog.ejs", {curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  }
});
app.get("/project", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("project.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  } else {
    res.render("project.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  }
});
app.get("/FAQ", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("FAQ.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  } else {

    res.render("FAQ.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  }
});
app.get("/Terms", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("Terms.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  } else {
    res.render("Terms.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
  }
});
 app.get("/privacy", function (req, res) {
   let curr_user=req.session.user;
   if (curr_user) {
     res.render("privacy.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
   } else {
    res.render("privacy.ejs", { curr_user:curr_user,home: home , about: about , blog: blog , project: project ,FAQ: FAQ , profile:profile, Terms: Terms , privacy: privacy , feedback: feedback, logout: logout});
   }
});

app.post("/feedback", function (req, res) {

  var type = req.body.options;
  var topic = req.body.topic;
  var desc = req.body.desc;
  var rate = req.body.ratings;
  // console.log(req.body);
  res.send(type + " " + topic + " " + desc + " " + rate);
  //res.send(req.body.topic+" "+req.body.desc+" "+res.body.options);
});


app.get("/profile", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("profile.ejs", {  curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get("/activity", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("activity.ejs", { curr_user:curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get("/notifications", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("notification.ejs", {  curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get("/messages", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("messages.ejs", { curr_user:curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get("/badges", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("badges.ejs", { curr_user:curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get("/preferences", function (req, res) {
  let curr_user=req.session.user;
  if (curr_user) {
    res.render("preferences.ejs", {  curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile:profile,activity:activity,notification:notifications,message:messages,badge:badges,pref:pref});
  } else {
    res.redirect('/register');
  }
});

app.get('/logout', function (req, res) {
  let user=req.session.user;
  if(user){
    req.session.cookie.maxAge=-1;
    req.session.destroy();
    req.session=null;
    res.redirect('/');
  }
  res.redirect('/');
});

//NEWLY_ADDED
app.get("/", function (req, res) {
  let curr_user=req.session.user;
  // res.render("groups.ejs",{
  //   home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  func.fetchGroups(req, res, home, about, blog, project, feedback, logout, profile,curr_user);
});



app.get("/group/:topic/:id", function (req, res) {
  let curr_user=req.session.user;
  var id= req.params.topic;
  func.fetch_Group(req, res, home, about, blog, project, feedback, logout, profile,id,curr_user);
      // res.render("group",{Head:post.title,Para:post.content});
});


app.get("/post/:url1/:url2/:url3/:url4", function (req, res) {

  let curr_user=req.session.user;
  var url= secrets.url+ req.params.url1+"/"+ req.params.url2+ "/"+req.params.url3+"/"+ req.params.url4+".json";
  console.log(url);

  // res.render("groups.ejs",{
  //   home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
 func.fetchPosts(req, res, home, about, blog, project, feedback, logout, profile,url,curr_user);
});


app.get("/group/:topic/:id/:offset", function (req, res) {
  let curr_user = req.session.user;
  var id = req.params.topic;
  var i=req.params.offset;
  console.log("ioj");
  var body3='';
  var url2 = secrets.url + 'groups/' + id + '/members' + '.json'+"?offset="+i+"&order=&desc=&filter=";
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      res.json(body3);
  });     
      console.log(body3);
           
      });

    });


app.get("/group/:name/post/load/:offset", function (req, res) {
 
  let curr_user = req.session.user;
  var id = req.params.name;
  var i=req.params.offset;
  
   var body3='';
   var url2 = secrets.url + 'groups/' + id + '/posts' + '.json?'+'before_post_id='+i;
   console.log(url2);
  
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      res.json(body3);
  });     
     // console.log(body3);
           
      });

    });

