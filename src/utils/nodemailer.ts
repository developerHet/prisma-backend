import nodemailer from "nodemailer";

export const sendResetTokenMail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.log(error);
  }
};
