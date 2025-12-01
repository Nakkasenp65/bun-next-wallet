export type UserData = {
  id: string;
  line_user_id: string;
  line_display_name: string;
  fullname: string;
  occupation: string;
  phone: string;
  ageRange: string;
  line_profile_url: string;
  referralCode: string;
  monthlyPayment: string;
  isLocked: string;
  createdAt: string;
  role: string;
  guideShown: boolean;
  wallet: {
    id: string;
    walletUniqueId: string;
  };
};

export type UserLockStatus = { isLocked: boolean; isNewUser: boolean };

export type CheckOkMobileUser = {
  contract_permissions: {
    refinance: boolean;
    mobile_installment: boolean;
    icloud_pawn: boolean;
  };
};

export interface ContractPermissions {
  refinance: boolean;
  mobile_installment: boolean;
  icloud_pawn: boolean;
}

export interface MainServerUser {
  _id: string;
  line_user_id: string;
  line_display_name: string;
  line_profile_url: string;

  // Personal Info
  fullname: string;
  phone: string;
  birthdate_be: string;
  id_number: string;
  current_address: string;

  // Location
  latitude: number;
  longitude: number;

  // Job & Status
  jobType: string | null; // camelCase in data
  job_type: string; // snake_case in data
  hasContract: boolean;
  hasPayslip: boolean;
  has_payslip: boolean; // Duplicate in data schema

  // Security & Consent
  pin: string;
  kyc: boolean;
  pdpa_accepted: boolean;
  marketing_consent: boolean;

  // Documents & Media
  faceImageUrls: string[];
  idCardBackUrl: string | null;
  idCardFrontUrl: string | null;
  videoVerificationUrl: string | null;

  // OCR Data (Nullable)
  ocr_address: string | null;
  ocr_birthDateRaw: string | null;
  ocr_cardNumber: string | null;
  ocr_expiryDate: string | null;
  ocr_firstnameEN: string | null;
  ocr_firstnameTH: string | null;
  ocr_issueDate: string | null;
  ocr_laserId: string | null;
  ocr_lastnameEN: string | null;
  ocr_lastnameTH: string | null;

  // System / Meta
  chat_url: string;
  contract_permissions: ContractPermissions;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}
