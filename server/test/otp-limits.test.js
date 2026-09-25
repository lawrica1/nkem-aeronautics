import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/config/prisma.js";
import { limitOtpSend } from "../src/modules/auth/otp.service.js";
import { hashOtp } from "../src/modules/auth/otp.service.js";
import { verifySignupOtp } from "../src/modules/auth/auth.service.js";

mock.timers.enable({ apis: ["Date"] });
const minutes = (n) => mock.timers.tick(n * 60_000);

test("a second code to the same number within a minute is refused", () => {
  limitOtpSend("sms", "+237 670 000 001");
  assert.throws(() => limitOtpSend("sms", "237670000001"), (e) => e.status === 429);
});

test("more than 5 codes per hour to one number is refused, even spaced out", () => {
  for (let i = 0; i < 5; i++) {
    limitOtpSend("sms", "+237670000002");
    minutes(2);
  }
  assert.throws(() => limitOtpSend("sms", "+237670000002"), (e) => e.status === 429 && /Too many codes/.test(e.message));
  minutes(60);
  assert.doesNotThrow(() => limitOtpSend("sms", "+237670000002"));
});

test("different numbers have independent budgets", () => {
  limitOtpSend("sms", "+237670000003");
  assert.doesNotThrow(() => limitOtpSend("sms", "+237670000004"));
});

test("the 5th wrong OTP guess burns the code; the right code then no longer works", async () => {
  const pending = { id: "u1", isVerified: false, otpChannel: "sms", otpContact: "+237670000005", otpHash: await hashOtp("123456"), otpExpiresAt: new Date(Date.now() + 600_000) };
  Object.defineProperty(prisma, "user", {
    configurable: true,
    value: {
      findFirst: async () => (pending.otpHash ? pending : { ...pending, otpHash: null }),
      update: async ({ data }) => Object.assign(pending, data),
    },
  });

  const guess = (otp) => verifySignupOtp({ channel: "sms", contact: "+237670000005", otp });
  for (let i = 0; i < 4; i++) await assert.rejects(guess("000000"), (e) => e.status === 400);
  await assert.rejects(guess("000000"), (e) => e.status === 429);
  assert.equal(pending.otpHash, null);
  await assert.rejects(guess("123456"), /No pending verification/);
});
