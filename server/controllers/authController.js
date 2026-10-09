import { User } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_REGISTERED',
          message: 'Пользователь с таким адресом электронной почты уже зарегистрирован'
        }
      });
    }

    const user = await User.create({
      email,
      password,
      fullName,
      phone,
      role: 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: user.toSafeJSON()
      },
      message: 'Регистрация успешно завершена'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный адрес электронной почты или пароль'
        }
      });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный адрес электронной почты или пароль'
        }
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: user.toSafeJSON()
      },
      message: 'Успешная авторизация'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeJSON()
    }
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    if (fullName) req.user.fullName = fullName.trim();
    if (phone !== undefined) req.user.phone = phone ? phone.trim() : null;

    await req.user.save();

    res.json({
      success: true,
      data: {
        user: req.user.toSafeJSON()
      },
      message: 'Профиль успешно обновлен'
    });
  } catch (error) {
    next(error);
  }
};
