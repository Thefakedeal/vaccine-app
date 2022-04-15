const app = require("./app");
const cron = require("node-cron");
const db = require("./client");
const { addDays, formatDistance } = require("date-fns");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;

cron.schedule("0 0 0 * * *", async () => {
  try {
   sendMail(1)
   sendMail(3)
   sendMail(7)
  } catch (err) {
    console.log(err);
  }
});


app.listen(PORT, () => {
  console.log(`App Initialized @ http://localhost:${PORT}`);
});


async function sendMail(days=1){
   
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.PASS,
        },
      });
  
      const bookings = await db.vaccine.findMany({
        where: {
          dueDate: {
            equals: addDays(new Date(), days),
          },
        },
        include: {
          child: true,
          parent: true,
          vaccine: true,
        },
      });
      for (const booking of bookings) {
        const mailOptions = {
          from: process.env.MAIL_USER,
          to: booking.parent.email,
          subject: `Your vaccine remainder`,
          html: `You set remainder for vaccine of <strong> ${booking.vaccine.name} </strong> </br>
              for your child <strong> ${booking.child.name} </strong> which is in <strong> ${formatDistance(
            booking.dueDate,
            new Date(), {addSuffix: true}
          )}. </strong> </br>
              Thank You.  
              `,
        };
       
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
}