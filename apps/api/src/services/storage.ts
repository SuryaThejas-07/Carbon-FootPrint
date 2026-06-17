import { Storage } from '@google-cloud/storage';

function getBucketName() {
  return process.env.GOOGLE_CLOUD_BUCKET;
}

export async function uploadWeeklyReport(userId: string, summary: string): Promise<string> {
  const bucketName = getBucketName();
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  if (!bucketName) {
    return `https://storage.googleapis.com/${projectId ?? 'carbonwise'}/reports/weekly-sample.pdf`;
  }

  const storage = new Storage({ projectId: projectId ?? undefined });
  const bucket = storage.bucket(bucketName);
  const objectName = `reports/${userId}/weekly-${Date.now()}.json`;
  const file = bucket.file(objectName);

  await file.save(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summary,
      },
      null,
      2,
    ),
    {
      contentType: 'application/json',
      metadata: {
        cacheControl: 'private, max-age=0',
      },
    },
  );

  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return signedUrl;
}
