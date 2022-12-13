import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';
import config from './config';

class Mail {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.passwordEmail,
      },
    });
  }

  sendMail(to, subject, message) {
    const mailOptions = {
      from: config.email,
      to,
      subject,
      html: message,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return error;
      } else {
        return 'E-mail enviado com sucesso!';
      }
    });
  }
}

export const MESSAGES = {
  PASSWORD_RECOVER: {
    subject: 'Troque sua senha',
    body: (params) =>
      `<html><body><h3>Olá ${params.name}</h3><p>para trocar a senha, por favor <a href='${params.link}'>click aqui</a></p></body></html>`,
  },
};
export default new Mail();
