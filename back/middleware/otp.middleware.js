const speakeasy = require('speakeasy');

exports.verifyOTP = (req, res, next) => {
  const { otp } = req.body;
  const otpSecret = req.user.otpSecret;
  const verified = speakeasy.totp.verify({
    secret: otpSecret,
    encoding: 'base32',
    token: otp
  });

  if (!verified) return res.status(403).json({ message: 'OTP verification failed' });
  next();
};
