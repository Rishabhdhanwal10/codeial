const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('./mailers/comments_mailer');
const queue = require('../config/kue');

module.exports.create = async function(req, res){

    try{
        
        const post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('Error in sending to the queue', err);
                    return;
                }

                console.log('job enqueued', job.id);
            })

            res.redirect('/');

        }

    }catch(error){
        console.log('Error while creating comment', error);
    }

}


module.exports.destroy = async function(req, res){

    try{

        const comment = await Comment.findById(req.params.id);
        if(comment && comment.user == req.user.id){

            let postId = comment.post; 
            comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id} })

            res.redirect('back');

        }else{
            res.redirect('back');
        }

    }catch(error){
        console.log('Error while deleting comment', error);
    }

}