const express = require('express');
const app = express();
const Post = require("./api/models/posts");
const postsData = new Post();
const multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads');
    },
    filename : function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getExtension(file.mimetype)}`);
    }
});
var upload = multer({storage : storage});

const getExtension = (mimeType) => {
    switch(mimeType) {
        case "image/png":
            return ".png";
        case "image/jpeg":
            return ".jpeg";
    }
}

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

app.use('/uploads', express.static('uploads'));

const posts = [{
    "id": "1581461442206",
    "title": "This is a New Blog Post",
    "content": "This is the content! ",
    "post_image": "uploads/post-image-1581461442199.jpg",
    "added_date": "1581461442206"
}]

app.get('/api/posts', (req, res) => {
    res.status(200).send(postsData.get());
});

app.get('/api/posts/:post_id', (req, res) => {
    const post_id = req.params.post_id;
    const found_post = postsData.getIndividualBlog(post_id);
    if (found_post) {
        res.status(200).send(found_post);
    } else {
        res.status(404).send("Not found");
    }
})

app.post("/api/posts", upload.single("post-image"), (req, res) => {
    const newPost = {
        "id" : Date.now(),
        "title" : req.body.title,
        "post_image" : req.file.path,
        "added_date" : Date.now(),
        "content" : req.body.content
    }
    postsData.add(newPost);
    res.status(201).send(newPost);
})

app.listen(8000, ()=>console.log("Listening on localhost"))