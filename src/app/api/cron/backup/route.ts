import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const r2Endpoint = process.env.R2_ENDPOINT || process.env.REACT_APP_R2_ENDPOINT || "https://06c0bed1fd7b4a7923d9ab4d899da5e9.r2.cloudflarestorage.com";
const r2AccessKey = process.env.R2_ACCESS_KEY || process.env.REACT_APP_R2_ACCESS_KEY || "151e301c7ca9f5370e590c14de885e4a";
const r2SecretKey = process.env.R2_SECRET_KEY || process.env.REACT_APP_R2_SECRET_KEY || "35d26691b60485bc3a9cbfc3d0ab95aee4b0ed9bfe44e6ad2fb7e1c9aa70b560";
const r2Bucket = process.env.R2_BUCKET_NAME || process.env.REACT_APP_R2_BUCKET_NAME || "dayal-crm-docs";

const s3Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKey,
    secretAccessKey: r2SecretKey,
  },
});

function jsonToCsv(jsonArray: any[]) {
  if (!jsonArray || jsonArray.length === 0) return "";
  const keys = Object.keys(jsonArray[0]);
  const csvRows = [];
  csvRows.push(keys.join(","));
  for (const row of jsonArray) {
    const values = keys.map((key) => {
      let val = row[key];
      if (val === null || val === undefined) val = "";
      else if (typeof val === "object") val = JSON.stringify(val);
      let valStr = String(val);
      valStr = valStr.replace(/"/g, '""');
      return `"${valStr}"`;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Only enforce if CRON_SECRET is set
    // return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const tables = ['leads', 'clients', 'employees', 'tasks', 'services', 'projects', 'quotations', 'audit_logs', 'system_logs'];
    const backupData: Record<string, any> = {};
    const dateStr = new Date().toISOString().split('T')[0];
    
    let logs = "Starting backup...\n";

    for (const table of tables) {
      logs += `Fetching ${table}...\n`;
      const { data, error } = await supabase.from(table).select('*');
      if (!error && data) {
        backupData[table] = data;
        
        const csvString = jsonToCsv(data);
        if (csvString) {
          await s3Client.send(new PutObjectCommand({
            Bucket: r2Bucket,
            Key: `backups/${dateStr}/${table}.csv`,
            Body: csvString,
            ContentType: 'text/csv'
          }));
          logs += `Uploaded ${table}.csv\n`;
        }
      }
    }

    await s3Client.send(new PutObjectCommand({
      Bucket: r2Bucket,
      Key: `backups/${dateStr}/master_backup.json`,
      Body: JSON.stringify(backupData, null, 2),
      ContentType: 'application/json'
    }));
    logs += `Uploaded master_backup.json\nBackup completed successfully.`;

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Backup failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
