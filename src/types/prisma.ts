export enum MissionType {
  ONBOARDING = 'ONBOARDING',
  ACCUMULATION = 'ACCUMULATION',
  STREAK = 'STREAK',
  REFERRAL = 'REFERRAL',
  DELETE = 'DELETE',
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Choice {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  HALF_MONTH = 'HALF_MONTH',
  MONTHLY = 'MONTHLY',
}

export enum NotificationType {
  WALLET = 'WALLET',
  REWARD = 'REWARD',
  SYSTEM = 'SYSTEM',
}

export enum TransactionType {
  OUTCOME = 'OUTCOME',
  INCOME = 'INCOME',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  REWARD = 'REWARD',
  TRANSFER = 'TRANSFER',
  REDEEMED = 'REDEEMED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum UserMissionStatus {
  ENROLLED = 'ENROLLED',
  AWAITING_CLAIM = 'AWAITING_CLAIM',
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  CLAIM_EXPIRED = 'CLAIM_EXPIRED',
}

export enum VoucherStatus {
  ISSUED = 'ISSUED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  line_user_id: string;
  line_display_name?: string | null;
  fullname?: string | null;
  phone?: string | null;
  pin?: string | null;
  occupation?: string | null;
  ageRange?: string | null;
  line_profile_url?: string | null;
  monthlyPayment?: number | null;
  chat_url?: string | null;
  isLocked?: boolean | null;
  referralCode: string;
  referToCode?: string | null;
  email?: string | null;
  firstTime: boolean;
  role: Role;
  currentSavingStreak: number;
  longestSavingStreak: number;
  lastSavingActivity?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  goal?: Goal | null;
  wallet?: Wallet | null;
  notifications?: Notification[];
  userMissions?: UserMission[];
  vouchers?: Voucher[];
  madeReferrals?: Referral[];
  referralRecord?: Referral | null;
}

export interface Wallet {
  id: string;
  balance: number;
  bonusBalance: number;
  walletUniqueId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  sentTransaction?: Transaction[];
  receieveTransaction?: Transaction[];
}

export interface Transaction {
  id: string;
  name?: string | null;
  amount?: number | null;
  type?: TransactionType | null;
  status: TransactionStatus;
  from?: string | null;
  fromWalletId?: string | null;
  toWalletId?: string | null;
  to?: string | null;
  description?: string | null;
  slipImageUrl?: string | null;
  bank?: string | null;
  verified: boolean;
  verifiedAmount?: number | null;
  externalSource?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  fromWallet?: Wallet | null;
  toWallet?: Wallet | null;
  notifications?: Notification[];
}

export interface Goal {
  id: string;
  status: GoalStatus;
  planId: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  plan?: Plan;
  user?: User;
  product?: Product;
  voucher?: Voucher | null;
}

export interface Mission {
  id: string;
  title?: string | null;
  description?: string | null;
  type: MissionType;
  rewardAmount?: number | null;
  webExpiresAt?: Date | null;
  durationDays?: number | null;
  completeProgress?: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  enrolledBy?: UserMission[];
}

export interface UserMission {
  id: string;
  currentProgress: number;
  completeProgress: number;
  status: UserMissionStatus;
  enrolledAt: Date;
  userExpiresAt: Date;
  completedAt?: Date | null;
  claimExpiresAt?: Date | null;
  claimedAt?: Date | null;
  userId: string;
  missionId?: string | null;

  // Relations
  user?: User;
  mission?: Mission | null;
}

export interface Broadcast {
  id: string;
  title: string;
  body?: string | null;
  status: string;
  sentAt?: Date | null;
  sentToUserCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  body?: string | null;
  imageUrl?: string | null;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  transactionId?: string | null;
  createdAt: Date;

  // Relations
  user?: User;
  transaction?: Transaction | null;
}

export interface Plan {
  id: string;
  name: Choice;
  displayName: string;
  
  // Relations
  goals?: Goal[];
}

export interface Product {
  id: string;
  uniqueId?: string | null;
  brand?: string | null;
  model?: string | null;
  capacity?: string | null;
  color?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  downPaymentAmount?: number | null;
  downPaymentPercent?: number | null;
  installment6Months?: number | null;
  installment10Months?: number | null;
  condition?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  targetedByGoals?: Goal[];
  vouchers?: Voucher[];
}

export interface Brand {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SlipDecoded {
  id: string;
  decodedContent: string;
  createdAt: Date;
}

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  status: VoucherStatus;
  issuedAt: Date;
  expiresAt: Date;
  redeemedAt?: Date | null;
  userId: string;
  goalId: string;
  productId: string;

  // Relations
  user?: User;
  goal?: Goal;
  product?: Product;
}

export interface Referral {
  id: string;
  rewardGiven: boolean;
  createdAt: Date;
  referrerId: string;
  newcomerId: string;

  // Relations
  referrer?: User;
  newcomer?: User;
}
