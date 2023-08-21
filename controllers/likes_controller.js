const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res){

    try{

        // likes/toggles/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if like is already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if a like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            
            existingLike.remove();
            deleted = true;

        }else{
            // else make a new like

            let newLike = Like.create({
                user: req.user._id,
                onModel: req.query.type,
                likeable: req.query.id
            });

            likeable.likes.push(newLike.id);
            likeable.save();

        }

        return res.status(200).json({
            message: 'Request Successful',
            data: {
                deleted: deleted
            }
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }

}