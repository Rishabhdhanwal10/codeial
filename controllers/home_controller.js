const Post = require('../models/post');
const User = require('../models/user');

// populate the user of each post
module.exports.home = async function(req, res){

    // Post.find({})
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate: {
    //         path: 'user'
    //     }
    // })
    // .exec(function(req, posts){

    //     User.find({}, function(err, users){
    //         return res.render('home', {
    //             title: "Codeial | Home",
    //             posts: posts,
    //             all_users: users
    //         });
    //     })
    // })

    try{

        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({});

        return res.render('home', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        });


    }catch(error){
        console.log('Error while fetching posts', error);
    }
    
}


// module.exports.actionName = function(req, res){}