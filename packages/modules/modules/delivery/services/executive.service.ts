import { compare } from "bcryptjs";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { AppError } from "@/modules/shared/errors/app-error";
import type {
  CreateExecutiveDto,
  DeliveryExecutiveStatus,
  ExecutiveAssignmentStatusDto,
  ExecutiveDto,
  UpdateExecutiveDto,
} from "../dto/executive.dto";
import {
  createExecutiveSessionToken,
  verifyExecutiveSessionToken,
} from "../lib/executive-session";
import {
  createExecutive,
  getExecutiveAuthRecordByPhone,
  getExecutiveById,
  getExecutiveDeliveries,
  listExecutives,
  softDeleteExecutive,
  toExecutiveDto,
  updateExecutive,
  updateExecutiveAssignmentStatus,
} from "../repository/executive.repository";

// ---------------------------------------------------------------------------
// Seller-facing roster management (session seller = creator/actor)
// ---------------------------------------------------------------------------

export async function createExecutiveService(
  dto: CreateExecutiveDto,
): Promise<ExecutiveDto> {
  const seller = await getCurrentSellerOrThrow();
  return createExecutive(dto, seller.id);
}

export async function listExecutivesService(options?: {
  status?: DeliveryExecutiveStatus;
  onlyAvailable?: boolean;
}): Promise<{ executives: ExecutiveDto[] }> {
  await getCurrentSellerOrThrow();
  const executives = await listExecutives(options);
  return { executives };
}

export async function updateExecutiveService(
  id: string,
  dto: UpdateExecutiveDto,
): Promise<ExecutiveDto> {
  await getCurrentSellerOrThrow();
  return updateExecutive(id, dto);
}

export async function deleteExecutiveService(id: string): Promise<ExecutiveDto> {
  await getCurrentSellerOrThrow();
  return softDeleteExecutive(id);
}

/** 401 for executive credential / session failures (AppError is abstract,
 *  and the shared UnauthorizedError has a fixed seller-oriented message). */
export class ExecutiveAuthError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
    this.name = "ExecutiveAuthError";
  }
}

// ---------------------------------------------------------------------------
// Executive-facing auth + deliveries (executive session cookie, no seller)
// ---------------------------------------------------------------------------

export interface ExecutiveLoginResult {
  executive: ExecutiveDto;
  token: string;
}

/**
 * Verify an executive's phone + password credentials. Failure modes are
 * deliberately indistinguishable for unknown phones and wrong passwords
 * (one generic 401); the only distinct message is "password not set",
 * which the account holder needs in order to act on it. Only ACTIVE
 * executives may log in.
 */
export async function verifyExecutiveCredentials(
  phone: string,
  password: string,
): Promise<ExecutiveDto> {
  const record = await getExecutiveAuthRecordByPhone(phone);

  if (!record || record.status !== "ACTIVE") {
    throw new ExecutiveAuthError("Invalid phone number or password");
  }
  if (!record.passwordHash) {
    throw new ExecutiveAuthError(
      "Password not set for this account. Please contact your administrator.",
    );
  }

  const matches = await compare(password, record.passwordHash);
  if (!matches) {
    throw new ExecutiveAuthError("Invalid phone number or password");
  }

  return toExecutiveDto(record);
}

export async function loginExecutiveService(
  phone: string,
  password: string,
): Promise<ExecutiveLoginResult> {
  const executive = await verifyExecutiveCredentials(phone, password);
  const token = await createExecutiveSessionToken(executive.id);
  return { executive, token };
}

/**
 * Resolve the executive behind a session cookie value, or throw a 401.
 * Used by every /api/delivery-executive/* data route.
 */
export async function requireExecutiveSession(
  token: string | undefined | null,
): Promise<ExecutiveDto> {
  const payload = await verifyExecutiveSessionToken(token);
  if (!payload) {
    throw new ExecutiveAuthError("Executive session is missing or expired");
  }
  const executive = await getExecutiveById(payload.executiveId);
  if (!executive || executive.status !== "ACTIVE") {
    throw new ExecutiveAuthError("Executive session is missing or expired");
  }
  return executive;
}

export async function getExecutiveDeliveriesService(executiveId: string) {
  const deliveries = await getExecutiveDeliveries(executiveId);
  return { deliveries };
}

export async function updateExecutiveAssignmentStatusService(
  executiveId: string,
  assignmentId: string,
  dto: ExecutiveAssignmentStatusDto,
) {
  return updateExecutiveAssignmentStatus(
    executiveId,
    assignmentId,
    dto.status,
    dto.note,
  );
}
