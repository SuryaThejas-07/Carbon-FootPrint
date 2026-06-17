import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadWeeklyReport } from './storage';

vi.mock('@google-cloud/storage', () => {
  const saveMock = vi.fn();
  const getSignedUrlMock = vi.fn().mockResolvedValue(['https://signed-url.com/report.json']);
  const fileMock = vi.fn().mockReturnValue({
    save: saveMock,
    getSignedUrl: getSignedUrlMock,
  });
  const bucketMock = vi.fn().mockReturnValue({
    file: fileMock,
  });
  return {
    Storage: vi.fn().mockImplementation(() => ({
      bucket: bucketMock,
    })),
  };
});

import { Storage } from '@google-cloud/storage';

describe('Storage Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should return a fallback signed URL if GOOGLE_CLOUD_BUCKET is not defined', async () => {
    delete process.env.GOOGLE_CLOUD_BUCKET;
    process.env.GOOGLE_CLOUD_PROJECT = 'my-project';

    const url = await uploadWeeklyReport('user-1', 'My summary');
    expect(url).toBe('https://storage.googleapis.com/my-project/reports/weekly-sample.pdf');
    expect(Storage).not.toHaveBeenCalled();
  });

  it('should upload report to bucket and return signed URL if GOOGLE_CLOUD_BUCKET is set', async () => {
    process.env.GOOGLE_CLOUD_BUCKET = 'my-bucket';
    process.env.GOOGLE_CLOUD_PROJECT = 'my-project';

    const url = await uploadWeeklyReport('user-1', 'My summary');
    expect(url).toBe('https://signed-url.com/report.json');
    expect(Storage).toHaveBeenCalledWith({ projectId: 'my-project' });
    
    const storageInstance = vi.mocked(Storage).mock.results[0].value;
    expect(storageInstance.bucket).toHaveBeenCalledWith('my-bucket');
  });
});
