const app = require("./app");
const cron = require("node-cron");
const db = require("./client");
const { addDays, formatDistance } = require("date-fns");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;

cron.schedule("0 0 0 * * *", async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const bookings = await db.vaccine.findMany({
      where: {
        dueDate: {
          equals: addDays(new Date(), 7),
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
        from: process.env.USER,
        to: booking.parent.email,
        subject: `Your vaccine remainder`,
        html: `You set remainder for vaccine of <strong> ${booking.vaccine.name} </strong> </br>
            for your child <strong> ${booking.child.name} </strong> which is in <strong> ${formatDistance(
          booking.dueDate,
          new Date(),{addSuffix: true}
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
  } catch (err) {
    console.log(err);
  }
});


cron.schedule("0 0 0 * * *", async () => {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
  
      const bookings = await db.vaccine.findMany({
        where: {
          dueDate: {
            equals: addDays(new Date(), 3),
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
          from: process.env.USER,
          to: booking.parent.email,
          subject: `Your vaccine remainder`,
          html: `You set remainder for vaccine of <strong> ${booking.vaccine.name} </strong> </br>
              for your child <strong> ${booking.child.name} </strong> which is in <strong> ${formatDistance(
            booking.dueDate,
            new Date(),{addSuffix: true}
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
    } catch (err) {
      console.log(err);
    }
  });


  cron.schedule("0 0 0 * * *", async () => {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
  
      const bookings = await db.vaccine.findMany({
        where: {
          dueDate: {
            equals: addDays(new Date(), 1),
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
          from: process.env.USER,
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
    } catch (err) {
      console.log(err);
    }
  });
app.listen(PORT, () => {
  console.log(`App Initialized @ http://localhost:${PORT}`);
});
