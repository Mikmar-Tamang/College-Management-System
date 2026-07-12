export type RegisterForm = {
    admin_name:string;
    email: string;
    password: string;
    // confirmPassword: string;
    phone_number: string;
    collegeName: string;
    collegeAddress: string;
    collegeCode: string;
    collegeEmail: string;
    collegePhoneNumber: string;
    // checkTermsAndPrivacy: boolean;
}

export type LoginForm = {
    collegeEmail:string;
    password:string;
}

export type ForgotPasswordForm = {
    email: string;
}

export type VerifyResetCodeForm = {
    code: string;
}

export type ResetPasswordForm = {
    password: string;
    confirmPassword: string;
}