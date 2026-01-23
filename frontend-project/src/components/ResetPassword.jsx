import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "../api/services";
import { Lock, Key } from "lucide-react";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "", 
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!formData.token || !formData.email) {
      setError(t("auth.errors.invalidResetLink"));
    }
  }, [formData.token, formData.email, t]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const getPasswordStrengthText = () => {
    const texts = [
      t("auth.passwordStrength.veryWeak"),
      t("auth.passwordStrength.weak"),
      t("auth.passwordStrength.normal"),
      t("auth.passwordStrength.strong"),
      t("auth.passwordStrength.veryStrong"),
    ];
    const colors = [
      "text-rose-400",
      "text-orange-400",
      "text-yellow-400",
      "text-lime-400",
      "text-emerald-400",
    ];
    return {
      text: texts[passwordStrength - 1] || "",
      color: colors[passwordStrength - 1] || "",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.password_confirmation) {
      setError(t("auth.errors.passwordsDontMatch"));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.errors.passwordMinLength"));
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(formData);

      if (response.data.success === true) {
        setMessage(t("auth.messages.passwordResetSuccess"));

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "passwordReset",
              email: formData.email,
            },
          });
        }, 3000);
      } else {
        setError(
          response.data.message || t("auth.messages.passwordResetError"),
        );
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        if (validationErrors?.token) {
          setError(t("auth.errors.tokenInvalid"));
        } else if (validationErrors?.email) {
          setError(t("auth.errors.emailInvalid"));
        } else {
          setError(t("auth.errors.invalidData"));
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t("auth.messages.passwordResetError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t("auth.resetPasswordTitle")}
          </h1>
          <p className="text-gray-400 text-sm">{formData.email}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    {t("auth.newPassword")} *
                  </label>
                  {formData.password && (
                    <span
                      className={`text-sm font-medium ${getPasswordStrengthText().color}`}
                    >
                      {getPasswordStrengthText().text}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setPasswordStrength(
                        calculatePasswordStrength(e.target.value),
                      );
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder={t("auth.newPasswordPlaceholder")}
                    minLength="6"
                    disabled={loading}
                  />
                </div>
                {formData.password && (
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength === 0
                          ? "bg-gray-400"
                          : passwordStrength === 1
                            ? "bg-rose-500"
                            : passwordStrength === 2
                              ? "bg-orange-500"
                              : passwordStrength === 3
                                ? "bg-yellow-500"
                                : passwordStrength === 4
                                  ? "bg-lime-500"
                                  : "bg-emerald-500"
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-300"
                >
                  {t("auth.confirmNewPassword")} *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirmation: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder={t("auth.confirmNewPasswordPlaceholder")}
                    minLength="6"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-rose-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L6.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-rose-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">
                      {message}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t("auth.messages.redirectingToLogin")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.token || !formData.email}
              className="w-full py-4 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("common.saving")}
                </div>
              ) : (
                t("auth.resetPasswordButton")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
