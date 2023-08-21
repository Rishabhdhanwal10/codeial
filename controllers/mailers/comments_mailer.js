const nodemailer = require('../../config/nodemailer');

exports.newComment = (comment) => {
    console.log('inside newComment mailer');
    console.log(comment);

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from: 'rdhanwal2000@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message Sent', info);
    })
    console.log("Comment Published");
}