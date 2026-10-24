import {resolveDeployment} from '../src/config/deployment.ts';import assert from 'node:assert/strict';
assert.deepEqual(resolveDeployment({}),{origin:'http://127.0.0.1:4400',indexable:false});
assert.deepEqual(resolveDeployment({VERCEL:'1',VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'ula-test.vercel.app'}),{origin:'https://ula-test.vercel.app',indexable:true});
assert.deepEqual(resolveDeployment({VERCEL_ENV:'preview',VERCEL_PROJECT_PRODUCTION_URL:'ula-test.vercel.app',VERCEL_URL:'ula-preview.vercel.app'}),{origin:'https://ula-test.vercel.app',indexable:false});
assert.equal(resolveDeployment({SITE_URL:'https://travel.example',VERCEL_PROJECT_PRODUCTION_URL:'ula-test.vercel.app'}).origin,'https://travel.example');
for(const SITE_URL of ['https://user:pass@example.com','http://example.com','https://example.com/path','https://example.com/?secret=1','https://example.com/#x','javascript:alert(1)'])assert.throws(()=>resolveDeployment({SITE_URL}));
assert.throws(()=>resolveDeployment({VERCEL:'1'}));assert.throws(()=>resolveDeployment({VERCEL:'1',SITE_URL:'http://localhost:4400'}));
console.log('Deployment origin, indexing and invalid-origin safeguards pass.');
