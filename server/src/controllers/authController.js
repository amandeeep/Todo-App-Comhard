import authService from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken }, 201);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken });
  } catch (error) { next(error); }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logout(req.userId, refreshToken);
    res.clearCookie('refreshToken', { path: '/' });
    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const tokens = await authService.refresh(refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);
    sendSuccess(res, { accessToken: tokens.accessToken });
  } catch (error) { next(error); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.forgotPassword(req.body.email);
    const response = { message: 'If that email exists, a reset link has been sent' };
    if (process.env.NODE_ENV === 'development' && resetToken) response.resetToken = resetToken;
    sendSuccess(res, response);
  } catch (error) { next(error); }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, { message: 'Password reset successful' });
  } catch (error) { next(error); }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.userId, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, { message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.userId);
    sendSuccess(res, { user });
  } catch (error) { next(error); }
};
