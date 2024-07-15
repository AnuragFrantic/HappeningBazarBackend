const { createTransport } = require("nodemailer");

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: 'gmail',
    auth: {
        user: 'anuragpandey21193@gmail.com',
        pass: 'shgf rmpl jfrd bkma',
    },

});


const send_email = (to, subject, text) => {
    const mailOptions = {
        from: 'anuragpandey21193@gmail.com',
        to: to,
        subject: `${subject}`,
        text: `${text}`,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    send_email
}