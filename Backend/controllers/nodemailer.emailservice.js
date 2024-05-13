const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "f201114@cfd.nu.edu.pk",
            pass: 'bbsb bnqm buon bgxi'
    }
    });

    await transporter.sendMail({
        from: '"CultureConnect.pk" <f201114@cfd.nu.edu.pk>',
        to: email,
        subject: 'Your Verification Code from CultureConnect',
        text: `Your verification code is: ${verificationCode}`
    });
};



const report_confirm_email = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "f201114@cfd.nu.edu.pk",
            pass: 'bbsb bnqm buon bgxi'
    }
    });

    await transporter.sendMail({
        from: '"CultureConnect.pk" <f201114@cfd.nu.edu.pk>',
        to: email,
        subject: 'Confirmation of Report',
        text: "Hi we have received you report we will check it as soon as possible and will update you regarding your query"
    });
};



const email_to_reported_id_user= async (email, name, date, posttype, postcategory) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "f201114@cfd.nu.edu.pk",
            pass: 'bbsb bnqm buon bgxi'
    }
    });

    await transporter.sendMail({
        from: '"CultureConnect.pk" <f201114@cfd.nu.edu.pk>',
        to: email,
        subject: 'Voilation of Content Policy',
        text:  `Hi ${name}  you post of ${posttype} that you created on ${date} have invalid content which comes under the category of ${postcategory}. So  you post have been deleted.
        Kindly be careful for the future posts. This may cause the deletion of you account from CultureConnect`
    });
};


const update_of_reported_post = async (reporter_email,  Name,  posttype, date, reporttitle,  query_answer) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "f201114@cfd.nu.edu.pk",
            pass: 'bbsb bnqm buon bgxi'
    }
    });

    await transporter.sendMail({
        from: '"CultureConnect.pk" <f201114@cfd.nu.edu.pk>',
        to: reporter_email,
        subject: 'Update Regarding Your Report',
        text:  `Hi ${Name}, your report status on the post of ${posttype} with title ${reporttitle}, on the date ${date} have been updated 
        here is the action we have take against your report
        ${query_answer}

        This query have been closed.
        `
    });
};



const PaymentConfirmation = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "f201114@cfd.nu.edu.pk",
            pass: 'bbsb bnqm buon bgxi'
    }
    });

    const email = "uzmanzahid6655@gmail.com"

    await transporter.sendMail({
        from: '"CultureConnect.pk" <f201114@cfd.nu.edu.pk>',
        to: email,
        subject: 'Update Regarding Your Report',
        text:  `Hi UserXYZ, Your payment for the learning putpose with native has been confirm. You can now caht with NativeXYZ.
        `
    });
};

module.exports = { sendVerificationEmail,
report_confirm_email, email_to_reported_id_user, update_of_reported_post, PaymentConfirmation };