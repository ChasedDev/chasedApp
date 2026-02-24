import { describe, it, expect } from 'vitest';
import type { Role } from '@chased/shared';

function isRepAdmin(role: Role | null | undefined): boolean { return role === 'rep_admin'; }
function isClient(role: Role | null | undefined): boolean { return role === 'client'; }
function canManageCatalog(role: Role | null | undefined): boolean { return isRepAdmin(role); }
function canViewOwnOrders(role: Role | null | undefined): boolean { return isClient(role); }
function canViewAllOrders(role: Role | null | undefined): boolean { return isRepAdmin(role); }

describe('Role checks', () => {
  it('rep_admin can manage catalog', () => { expect(canManageCatalog('rep_admin')).toBe(true); });
  it('client cannot manage catalog', () => { expect(canManageCatalog('client')).toBe(false); });
  it('null role cannot manage catalog', () => { expect(canManageCatalog(null)).toBe(false); });
  it('client can view own orders', () => { expect(canViewOwnOrders('client')).toBe(true); });
  it('rep_admin can view all orders', () => { expect(canViewAllOrders('rep_admin')).toBe(true); });
  it('client cannot view all orders', () => { expect(canViewAllOrders('client')).toBe(false); });
  it('isRepAdmin returns false for undefined', () => { expect(isRepAdmin(undefined)).toBe(false); });
});
