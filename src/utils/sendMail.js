import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import createHttpError from 'http-errors';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
  // optionally warn, but don't crash on import
  // console.warn('SMTP env vars are missing');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

export const sendEmail = async ({ to, subject, templateName, templateData }) => {
  try {
    const templatePath = path.resolve(`src/templates/${templateName}.html`);
    const htmlRaw = await readFile(templatePath, 'utf8');
    const template = Handlebars.compile(htmlRaw);
    const html = template(templateData);

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });

    return info;
  } catch (err) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
