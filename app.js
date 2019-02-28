
var bodyParser  = require("body-parser"),
methodOverride  = require("method-override"),
expressSanitizer =require("express-sanitizer"),
mongoose        = require("mongoose"),
express         = require("express"),
mongoose        = require("mongoose"),
app             = express();



//App Config
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
mongoose.set("useFindAndModify", false);
app.use(methodOverride("_method"));



//at first we need too create our "schema" and "model"
//Schema and Model Config

var blogSchema = new mongoose.Schema({
   title : String,
   image : String,
   body : String,
   created : {type : Date , default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//Its a temperory code fore TEST MONGO DB
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1539108544422-02f9a862a96a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body : "HELOO This is a Blog Post!!",

// });


//RESTFULL ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req,res){
    //add Index functionality so we need retrive all of the blogs from the DB
    Blog.find({},function(err, blogs){ //Passing the data from the DB
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs,blogs}); //sending it through under the name blogs 
        }
    });
});


//NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
   // wee need 2 create the new blog, so we have two steps:
   //create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err,newBlog){
       if(err){
           res.render("new");
       } else {
           //then , redirect to the index
           res.redirect("/blogs");
       }
   });
   
});


//SHOW ROUTE

app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog : foundBlog});
            
       }
   });
});


//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog : foundBlog});
       }
   });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
         if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
   });
});


//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
   //redirect somewhere
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNING!!!");
});