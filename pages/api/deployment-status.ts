import type { NextApiRequest, NextApiResponse } from 'next';

const AMBASSADOR_PATH = '/tscacademy/ambassador';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const deployedSha = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const deployedRef = process.env.VERCEL_GIT_COMMIT_REF || null;
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || null;
  const isVercel = Boolean(process.env.VERCEL);
  const expectedCommitPrefix = (process.env.EXPECTED_DEPLOY_COMMIT_PREFIX || '').trim() || null;
  const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim() || null;
  const host = publicSiteUrl ? new URL(publicSiteUrl).host : req.headers.host || null;

  const ambassadorDeployed = expectedCommitPrefix
    ? Boolean(deployedSha?.startsWith(expectedCommitPrefix))
    : null;

  const payload = {
    ok: true,
    host,
    expectedCommitPrefix,
    deployedSha,
    deployedRef,
    deploymentId,
    isVercel,
    ambassadorPath: AMBASSADOR_PATH,
    ambassadorDeployed,
    hint: !isVercel
      ? 'Running locally — production check must hit deployed URL.'
      : !expectedCommitPrefix
        ? 'Set EXPECTED_DEPLOY_COMMIT_PREFIX to compare deployed commit.'
        : !deployedSha?.startsWith(expectedCommitPrefix)
          ? 'Production is behind expected commit. Redeploy from Vercel or enable deploy hook workflow.'
          : 'Deployment matches expected commit prefix.',
  };

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(payload);
}
