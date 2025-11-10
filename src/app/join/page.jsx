"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FormGroup from "@/components/molecules/FormGroup";
import Modal from "@/components/molecules/Modal";
import { PATHNAME } from "@/constants";

const JoinPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    nickname: false,
    password: false,
    passwordConfirmation: false,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    title: "",
    content: "",
    buttonText: "확인",
    onConfirm: null,
  });
  const { signup } = useAuth();

  const resetForm = () => {
    setEmail("");
    setNickname("");
    setPassword("");
    setPasswordConfirmation("");
    setTouched({
      email: false,
      nickname: false,
      password: false,
      passwordConfirmation: false,
    });
    setHasSubmitted(false);
  };

  const openModal = ({ title, content, buttonText = "확인", onConfirm }) => {
    setModalState({
      open: true,
      title,
      content,
      buttonText,
      onConfirm: onConfirm || null,
    });
  };

  const closeModal = () => {
    setModalState((prev) => {
      if (prev.onConfirm) {
        prev.onConfirm();
      }
      return {
        open: false,
        title: "",
        content: "",
        buttonText: "확인",
        onConfirm: null,
      };
    });
  };

  const emailRegex =
    // eslint-disable-next-line no-control-regex
    /^[\w!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const getEmailError = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "이메일을 입력해주세요.";
    if (!emailRegex.test(trimmed)) return "유효한 이메일 주소를 입력해주세요.";
    return "";
  };

  const getNicknameError = (value) => {
    if (!value.trim()) return "닉네임을 입력해주세요.";
    return "";
  };

  const getPasswordError = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "비밀번호를 입력해주세요.";
    if (trimmed.length < 8) return "비밀번호는 8자 이상 입력해주세요.";
    return "";
  };

  const getPasswordConfirmationError = (confirmation, original) => {
    const trimmedConfirmation = confirmation.trim();
    const trimmedOriginal = original.trim();
    if (!trimmedConfirmation) return "비밀번호를 확인해주세요.";
    if (trimmedOriginal !== trimmedConfirmation)
      return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const emailErrorMessage = getEmailError(email);
  const nicknameErrorMessage = getNicknameError(nickname);
  const passwordErrorMessage = getPasswordError(password);
  const passwordConfirmationErrorMessage = getPasswordConfirmationError(
    passwordConfirmation,
    password
  );

  const isFormInvalid = Boolean(
    emailErrorMessage ||
      nicknameErrorMessage ||
      passwordErrorMessage ||
      passwordConfirmationErrorMessage
  );

  const displayErrors = {
    email: hasSubmitted || touched.email ? emailErrorMessage : "",
    nickname: hasSubmitted || touched.nickname ? nicknameErrorMessage : "",
    password: hasSubmitted || touched.password ? passwordErrorMessage : "",
    passwordConfirmation:
      hasSubmitted || touched.passwordConfirmation
        ? passwordConfirmationErrorMessage
        : "",
  };

  const handleJoin = async function (e) {
    e.preventDefault();

    setHasSubmitted(true);
    setTouched({
      email: true,
      nickname: true,
      password: true,
      passwordConfirmation: true,
    });

    if (isFormInvalid) return;

    try {
      const response = await signup(
        email,
        nickname,
        password,
        passwordConfirmation
      );
      if (response.success === false) {
        openModal({
          title: "회원가입 실패",
          content: response.message || "회원가입에 실패했습니다.",
        });
        return;
      }

      openModal({
        title: "회원가입 성공",
        content: "회원가입에 성공하였습니다.",
        buttonText: "로그인하기",
        onConfirm: () => {
          resetForm();
          router.push(PATHNAME.LOGIN);
        },
      });
    } catch (error) {
      openModal({
        title: "회원가입 실패",
        content:
          error?.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const handleEmailChange = function (e) {
    setEmail(e.target.value);
  };
  const handleNicknameChange = function (e) {
    setNickname(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmationChange = function (e) {
    setPasswordConfirmation(e.target.value);
  };

  const handleEmailBlur = function () {
    setTouched((prev) => ({ ...prev, email: true }));
  };

  const handleNicknameBlur = function () {
    setTouched((prev) => ({ ...prev, nickname: true }));
  };

  const handlePasswordBlur = function () {
    setTouched((prev) => ({ ...prev, password: true }));
  };

  const handlePasswordConfirmationBlur = function () {
    setTouched((prev) => ({ ...prev, passwordConfirmation: true }));
  };

  return (
    <div className="bg-black min-h-screen px-lg flex justify-center">
      <div className="border-gray-200">
        <Link href={PATHNAME.HOME}>
          <img
            src="/images/favorite.svg"
            className="flex justify-center h-lg px-[95px] mt-[151px] mb-lg "
          />
        </Link>
        <form onSubmit={handleJoin} className="text-white" noValidate>
          <FormGroup
            label="이메일"
            id="email"
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={displayErrors.email}
          />

          <FormGroup
            label="닉네임"
            id="nickname"
            type="nickname"
            required
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={handleNicknameChange}
            onBlur={handleNicknameBlur}
            error={displayErrors.nickname}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="8자 이상 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={displayErrors.password}
            showPasswordToggle={true}
          />

          <FormGroup
            label="비밀번호 확인"
            id="passwordConfirmation"
            type="password"
            required
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            onBlur={handlePasswordConfirmationBlur}
            error={displayErrors.passwordConfirmation}
            showPasswordToggle={true}
          />
          <div className="text-noto-xs pb-md">
            <button
              type="submit"
              disabled={isFormInvalid}
              className={`w-[520px] h-lg text-noto-xs flex justify-center items-center flex-shrink-0 transition-colors ${
                isFormInvalid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-main text-black cursor-pointer"
              }`}
            >
              가입하기
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-4 text-white text-noto-2xs">
          <p>이미 최애의포토 회원이신가요?</p>
          <Link
            className="text-main underline underline-offset-4"
            href={PATHNAME.LOGIN}
          >
            로그인하기
          </Link>
        </div>
      </div>
      {modalState.open && (
        <Modal
          title={modalState.title}
          content={modalState.content}
          buttonText={modalState.buttonText}
          onClose={closeModal}
          onButtonClick={closeModal}
        />
      )}
    </div>
  );
};

export default JoinPage;
