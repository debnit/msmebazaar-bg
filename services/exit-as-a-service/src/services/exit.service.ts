import { SessionUser } from '@msmebazaar/types/user';

export class ExitService {
  static async listPrograms(user: SessionUser) {
    const programs = [
      { id: 'prog-1', name: 'Strategic Buyer Program', tier: 'Pro', duration: '3-6 months', summary: 'We identify and negotiate with strategic buyers for your MSME.' },
      { id: 'prog-2', name: 'Investor Buyout Program', tier: 'Free', duration: '2-4 months', summary: 'Connect with investors interested in buyouts or major stakes.' },
    ];
    return { success: true, data: { programs } };
  }

  static async expressInterest(user: SessionUser, programId: string, notes?: string) {
    // Persist interest (omitted here); return success
    return { success: true, message: 'Interest recorded', data: { programId, notes, userId: user.id, createdAt: new Date().toISOString() } };
  }
}
