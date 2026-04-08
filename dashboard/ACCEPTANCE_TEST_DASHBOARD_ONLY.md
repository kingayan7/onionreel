# OnionReel — Dashboard-only Acceptance Test (P18-S9)

Goal: prove a user can generate and export a reel pack **without chat**.

## Preconditions
- Dashboard is running: http://127.0.0.1:5059
- Project exists: `maxcontrax-reel-v1`
- OPENAI_API_KEY is set on the machine (for Sora clips)

## Test Steps (Operator)
1) Requests tab
- Set projectId: `maxcontrax-reel-v1`
- Choose Pack Type: `Ad Pack (30/15/6)`
- Click **Generate Pack**

2) Jobs execution
- Click **Run Full Chain**
- Observe Jobs tab transitions queued→running→done

3) QC Gate
- In Workflow panel: set QC score (e.g. 90) and check **QC PASS** → click **Set QC**

4) Export Center
- Click **Build Final Pack.zip**
- Download the zip and verify it contains MP4 + JSON manifest(s)

5) Library
- Go to Library tab
- Search for `final_pack` and verify it appears
- Click **Pin Latest**

## Pass/Fail
PASS if:
- Final MP4 renders exist
- export_pack.json + qc_report.json exist
- final_pack.zip downloads
- pinned latest is set and retrievable

## Troubleshooting
- If jobs stuck in RUNNING: call `POST /api/jobs/reset_stuck` then rerun chain.
- If export blocked: ensure QC PASS is set.
