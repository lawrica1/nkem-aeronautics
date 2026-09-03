import * as authService from "./auth.service.js";

export async function signup(req, res) {
  res.status(201).json(await authService.signup(req.body));
}

export async function verifyOtp(req, res) {
  res.json(await authService.verifySignupOtp(req.body));
}

export async function resendOtp(req, res) {
  res.json(await authService.resendSignupOtp(req.body));
}

export async function login(req, res) {
  res.json(await authService.login(req.body));
}
