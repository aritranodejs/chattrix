// Import ES6 modules
import { Validator } from 'node-input-validator';

// Common Response
import { response } from '../../../../config/response.js';

// nanoid - Unique Token
import { customAlphabet } from 'nanoid';
const generateUniqueCode = customAlphabet('0123456789', 4);

// Mailer
import { transporter, emailTemplatePath, mailOption } from '../../../../config/mailer.js';
import ejs from 'ejs';

// Model
import { Op } from 'sequelize';
import { User } from '../../../../models/User.js';

const forgotPassword = async (req, res) => {
  try {
    const validator = new Validator(req.body, {
      email: 'required|email'
    });
    const matched = await validator.check();
    if (!matched) {
      return response(res, validator.errors, 'validation', 422);
    }

    let errors = {};
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: { [Op.eq]: email }
      }
    });
    if (!user) {
      errors['email'] = {
        message: 'The email doesn\'t exists.',
        rule: 'same'
      };
    }

    if (Object.keys(errors).length) {
      return response(res, errors, 'validation', 422);
    }

    user.passwordToken = generateUniqueCode();
    user.passwordTokenExpired = new Date(Date.now() + 15 * 60 * 1000); // Expired in 15 minutes
    await user.save();

    // FrontEnd BaseUrl
    const baseUrl = process.env.SITE_URL || 'https://bcuz.us';

    // Mail
    const subject = 'Reset Password Link.';
    const content = `<div>
      <p><a href="${baseUrl}/reset-password/${user.passwordToken}">Click here</a> to reset your password.</p>
      <p>Alternatively, you can use the bellow code to reset the password.</p>
      <p>Code: ${user.passwordToken}</p>
      <p>N.B.: This link/code will expired after 1 hour.</p>
    </div>`;
    const emailContent = await ejs.renderFile(emailTemplatePath, {
      user: user?.name,
      title: subject,
      content: content
    });
    const mailOptions = {
      ...mailOption,
      to: user?.email,
      subject: subject,
      html: emailContent
    };
    await transporter.sendMail(mailOptions);

    return response(res, user, 'User reset password mail has been sent.', 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
}

// Export as a named export
export {
  forgotPassword
};