const mailtoadmin = (data) => {
    return `<table style="max-width: 500px;width: 100%;table-layout: fixed;border-collapse: collapse;border: 1px solid gray;">
    <tbody>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Name :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.name}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Email : </th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.email}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Mobile :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">+91-${data?.mobile}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Created On</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.date}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Role</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.role}</th>
        </tr>
    </tbody>
</table>`
}

const mailtouser = (data) => {
    return `<p> Dear ${data.name} ,</p>
    <p>Thank you for choosing us. We are received your account details. As soon as we verify your details we will inform you.</p>
    `
}
const verified_user = (data) => {
    return `<p> Dear ${data.name} ,</p>
    <p>Thank you for choosing us. Your account has been verified. Your account details are  below :</p>
    <table style="max-width: 500px;width: 100%;table-layout: fixed;border-collapse: collapse;border: 1px solid gray;">
    <tbody>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Name :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.name}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Name :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.business_name}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Email : </th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.email}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Mobile :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">+91-${data?.contact.mobile}</th>
        </tr>
        <tr>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">Password :</th>
            <th style="text-align: left;border: 1px solid gray;padding: 5px;">${data?.core_password}</th>
        </tr>
       
    </tbody>
</table>
    `
}

module.exports = {
    mailtoadmin, mailtouser
}